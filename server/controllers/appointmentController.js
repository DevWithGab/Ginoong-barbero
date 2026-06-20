const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const Barber = require('../models/Barber');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const { customerInfo, serviceId, barberId, dateTime, notes } = req.body;

  // Validate required fields
  if (!customerInfo || !serviceId || !dateTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if service exists
  const service = await Service.findById(serviceId);
  if (!service || service.status !== 'Active') {
    res.status(404);
    throw new Error('Service not found or inactive');
  }

  // Check if barber exists (if provided)
  if (barberId) {
    const barber = await Barber.findById(barberId);
    if (!barber || barber.status !== 'Active') {
      res.status(404);
      throw new Error('Barber not found or inactive');
    }
  }

  // Check if the time slot is available (only if specific barber selected)
  const appointmentDate = new Date(dateTime);
  const endTime = new Date(appointmentDate.getTime() + (service.duration * 60000));

  if (barberId) {
    const conflictingAppointment = await Appointment.findOne({
      barber: barberId,
      status: { $in: ['Confirmed'] },
      dateTime: { $lt: endTime },
      $expr: {
        $gt: [
          { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
          appointmentDate
        ]
      }
    });

    if (conflictingAppointment) {
      res.status(400);
      throw new Error('Time slot is not available');
    }
  }

  // Find or create customer
  let customer;
  
  // Try to find by email first, then by phone (if phone is provided)
  if (customerInfo.email) {
    customer = await Customer.findOne({ email: customerInfo.email });
  }
  if (!customer && customerInfo.phone) {
    customer = await Customer.findOne({ phone: customerInfo.phone });
  }

  if (!customer) {
    customer = await Customer.create({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || ''
    });
  } else {
    // Update phone if it was empty and now provided
    if (!customer.phone && customerInfo.phone) {
      customer.phone = customerInfo.phone;
      await customer.save();
    }
    // Update name if empty
    if (!customer.name && customerInfo.name) {
      customer.name = customerInfo.name;
      await customer.save();
    }
  }

  // Create appointment
  const appointment = await Appointment.create({
    customer: customer._id,
    service: serviceId,
    barber: barberId || null,
    dateTime: appointmentDate,
    totalAmount: service.price,
    duration: service.duration,
    notes: notes || ''
  });

  // Populate the appointment with related data
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('customer', 'name email phone picture')
    .populate('service', 'name duration price category')
    .populate('barber', 'name role');

  res.status(201).json({
    success: true,
    data: populatedAppointment
  });
});

// @desc    Get all appointments with filtering and pagination
// @route   GET /api/appointments
// @access  Public
const getAppointments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    date,
    barberId,
    serviceId,
    status,
    paymentStatus,
    customerId,
    sortBy = 'dateTime',
    sortOrder = 'asc'
  } = req.query;

  // Build filter object
  const filter = {};

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    filter.dateTime = { $gte: startDate, $lt: endDate };
  }

  if (barberId) filter.barber = barberId;
  if (serviceId) filter.service = serviceId;
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (customerId) filter.customer = customerId;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get appointments with population
  const appointments = await Appointment.find(filter)
    .populate('customer', 'name email phone isVIP picture')
    .populate('service', 'name duration price category')
    .populate('barber', 'name role profileImage')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Appointment.countDocuments(filter);

  res.json({
    success: true,
    data: appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get available time slots for a barber on a specific date
// @route   GET /api/appointments/available-slots
// @access  Public
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date, barberId } = req.query;

  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }

  const [year, month, day] = date.split('-').map(Number);

  const filter = {
    status: { $in: ['Confirmed'] }
  };

  if (barberId) {
    filter.barber = barberId;
  }

  const existingAppointments = await Appointment.find(filter).populate('service', 'duration');

  // Filter to only appointments on the target date (compare date parts)
  const targetAppointments = existingAppointments.filter(apt => {
    const d = new Date(apt.dateTime);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  });

  // All time slots (matching the frontend list)
  const allSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  // Build time ranges from existing appointments
  const bookedTimeRanges = targetAppointments.map(apt => {
    const aptDate = new Date(apt.dateTime);
    const start = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate(), aptDate.getHours(), aptDate.getMinutes(), 0, 0);
    const end = new Date(start.getTime() + (apt.duration * 60000));
    return { start, end };
  });

  const now = new Date();

  const availableSlots = allSlots.map(time => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const slotStart = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

    // Skip past times
    if (slotStart <= now) {
      return { time, available: false, reason: 'past' };
    }

    // Check if slot conflicts with any existing appointment
    const isBooked = bookedTimeRanges.some(range => {
      return slotStart < range.end && slotEnd > range.start;
    });

    return { time, available: !isBooked, reason: isBooked ? 'booked' : null };
  });

  res.json({
    success: true,
    data: availableSlots
  });
});

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Public
const updateAppointment = asyncHandler(async (req, res) => {
  const { status, paymentStatus, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Update fields if provided
  if (status) appointment.status = status;
  if (paymentStatus) appointment.paymentStatus = paymentStatus;
  if (notes !== undefined) appointment.notes = notes;

  const updatedAppointment = await appointment.save();

  // Populate the updated appointment
  const populatedAppointment = await Appointment.findById(updatedAppointment._id)
    .populate('customer', 'name email phone isVIP picture')
    .populate('service', 'name duration price category')
    .populate('barber', 'name role profileImage');

  res.json({
    success: true,
    data: populatedAppointment
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('customer', 'name email phone isVIP totalVisits picture')
    .populate('service', 'name duration price category description')
    .populate('barber', 'name role profileImage');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.json({
    success: true,
    data: appointment
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await appointment.deleteOne();

  res.json({
    success: true,
    message: 'Appointment deleted successfully'
  });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  updateAppointment,
  getAppointment,
  deleteAppointment
};