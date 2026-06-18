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
  if (!customerInfo || !serviceId || !barberId || !dateTime) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if service exists
  const service = await Service.findById(serviceId);
  if (!service || service.status !== 'Active') {
    res.status(404);
    throw new Error('Service not found or inactive');
  }

  // Check if barber exists
  const barber = await Barber.findById(barberId);
  if (!barber || barber.status !== 'Active') {
    res.status(404);
    throw new Error('Barber not found or inactive');
  }

  // Check if the time slot is available
  const appointmentDate = new Date(dateTime);
  const endTime = new Date(appointmentDate.getTime() + (service.duration * 60000));

  const conflictingAppointment = await Appointment.findOne({
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

  if (conflictingAppointment) {
    res.status(400);
    throw new Error('Time slot is not available');
  }

  // Find or create customer
  let customer = await Customer.findOne({
    $or: [
      { email: customerInfo.email },
      { phone: customerInfo.phone }
    ]
  });

  if (!customer) {
    customer = await Customer.create({
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone
    });
  }

  // Create appointment
  const appointment = await Appointment.create({
    customer: customer._id,
    service: serviceId,
    barber: barberId,
    dateTime: appointmentDate,
    totalAmount: service.price,
    duration: service.duration,
    notes: notes || ''
  });

  // Populate the appointment with related data
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('customer', 'name email phone')
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
    .populate('customer', 'name email phone isVIP')
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

  if (!date || !barberId) {
    res.status(400);
    throw new Error('Date and barber ID are required');
  }

  // Check if barber exists
  const barber = await Barber.findById(barberId);
  if (!barber || barber.status !== 'Active') {
    res.status(404);
    throw new Error('Barber not found or inactive');
  }

  const targetDate = new Date(date);
  // Use UTC to avoid timezone issues
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[targetDate.getUTCDay()];

  // Check if barber works on this day
  if (!barber.workingDays.includes(dayName)) {
    return res.json({
      success: true,
      data: [],
      message: 'Barber does not work on this day'
    });
  }

  // Get existing appointments for the barber on this date
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
    barber: barberId,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['Pending', 'Confirmed'] }
  }).populate('service', 'duration');

  // Generate time slots (30-minute intervals)
  const workStart = barber.workingHours.start.split(':');
  const workEnd = barber.workingHours.end.split(':');
  
  const startHour = parseInt(workStart[0]);
  const startMinute = parseInt(workStart[1]);
  const endHour = parseInt(workEnd[0]);
  const endMinute = parseInt(workEnd[1]);

  const availableSlots = [];
  const slotDuration = 30; // 30 minutes

  // Calculate end time in minutes from midnight for comparison
  const endTotalMinutes = endHour * 60 + endMinute;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTotalMinutes = hour * 60 + minute;

      // Skip if slot starts at or after end time
      if (slotTotalMinutes >= endTotalMinutes) break;

      // Skip if before working hours start
      if (hour === startHour && minute < startMinute) continue;

      const slotTime = new Date(targetDate);
      slotTime.setHours(hour, minute, 0, 0);

      // Skip past times
      if (slotTime <= new Date()) continue;

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(appointment => {
        const appointmentStart = new Date(appointment.dateTime);
        const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.duration * 60000));
        const slotEnd = new Date(slotTime.getTime() + (slotDuration * 60000));

        return (slotTime < appointmentEnd && slotEnd > appointmentStart);
      });

      if (!hasConflict) {
        availableSlots.push({
          time: slotTime.toISOString(),
          displayTime: slotTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
        });
      }
    }
  }

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
    .populate('customer', 'name email phone isVIP')
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
    .populate('customer', 'name email phone isVIP totalVisits')
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