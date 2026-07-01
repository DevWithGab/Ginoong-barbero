const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const { broadcast } = require('../utils/sse');

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

  // Atomically verify no conflict exists after creation (prevents double-booking race condition)
  if (barberId) {
    const conflictCount = await Appointment.countDocuments({
      _id: { $ne: appointment._id },
      barber: barberId,
      status: { $in: ['Pending', 'Confirmed'] },
      dateTime: { $lt: endTime },
      $expr: {
        $gt: [
          { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
          appointmentDate
        ]
      }
    });

    if (conflictCount > 0) {
      await appointment.deleteOne();
      res.status(400);
      throw new Error('Time slot is no longer available');
    }
  }

  // Populate the appointment with related data
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('customer', 'name email phone picture')
    .populate('service', 'name duration price category')
    .populate('barber', 'name role');

  res.status(201).json({
    success: true,
    data: populatedAppointment
  });

  broadcast('appointment:created', { appointment: populatedAppointment });
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
  const { date, barberId, tzOffset } = req.query;

  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }

  const [year, month, day] = date.split('-').map(Number);

  // Use provided timezone offset (minutes from UTC) or default to PHT (+8 = -480)
  const offsetMinutes = tzOffset ? parseInt(tzOffset) : -480;

  const filter = {
    status: { $in: ['Confirmed'] }
  };

  if (barberId) {
    filter.barber = barberId;
  }

  const existingAppointments = await Appointment.find(filter).populate('service', 'duration');

  // All time slots (matching the frontend list)
  const allSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  // Build booked time ranges from confirmed appointments on the target date
  // Convert each appointment's UTC stored time to local time for comparison
  const bookedTimeRanges = existingAppointments.filter(apt => {
    const aptLocal = new Date(apt.dateTime.getTime() - offsetMinutes * 60000);
    return aptLocal.getUTCFullYear() === year &&
           aptLocal.getUTCMonth() === month - 1 &&
           aptLocal.getUTCDate() === day;
  }).map(apt => {
    const aptLocal = new Date(apt.dateTime.getTime() - offsetMinutes * 60000);
    const start = new Date(Date.UTC(year, month - 1, day, aptLocal.getUTCHours(), aptLocal.getUTCMinutes(), 0, 0));
    const end = new Date(start.getTime() + (apt.duration * 60000));
    return { start, end };
  });

  // Current time in user's local timezone
  const nowUTC = Date.now();
  const nowLocal = new Date(nowUTC - offsetMinutes * 60000);

  const availableSlots = allSlots.map(time => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const slotStart = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

    const nowSlot = new Date(Date.UTC(
      nowLocal.getUTCFullYear(), nowLocal.getUTCMonth(), nowLocal.getUTCDate(),
      nowLocal.getUTCHours(), nowLocal.getUTCMinutes(), 0, 0
    ));

    // Disable past time slots
    if (slotStart <= nowSlot) {
      return { time, available: false, reason: 'past' };
    }

    // Disable slots overlapping confirmed bookings for the selected barber
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
  const { status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Update fields if provided
  if (status) appointment.status = status;
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

  broadcast('appointment:updated', { appointment: populatedAppointment });
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