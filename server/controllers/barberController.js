const asyncHandler = require('express-async-handler');
const Barber = require('../models/Barber');
const Appointment = require('../models/Appointment');

// @desc    Get all barbers
// @route   GET /api/barbers
// @access  Public
const getBarbers = asyncHandler(async (req, res) => {
  const { status, role, sortBy = 'name', sortOrder = 'asc' } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (role) filter.role = role;

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const barbers = await Barber.find(filter).sort(sortOptions);

  // Get barber statistics
  const barbersWithStats = await Promise.all(
    barbers.map(async (barber) => {
      const appointmentCount = await Appointment.countDocuments({
        barber: barber._id,
        status: { $in: ['Completed', 'Confirmed', 'Pending'] }
      });

      const completedCount = await Appointment.countDocuments({
        barber: barber._id,
        status: 'Completed'
      });

      const revenue = await Appointment.aggregate([
        {
          $match: {
            barber: barber._id,
            paymentStatus: 'Paid'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' }
          }
        }
      ]);

      return {
        ...barber.toObject(),
        stats: {
          totalAppointments: appointmentCount,
          completedAppointments: completedCount,
          totalRevenue: revenue[0]?.totalRevenue || 0,
          completionRate: appointmentCount > 0 ? (completedCount / appointmentCount) * 100 : 0
        }
      };
    })
  );

  res.json({
    success: true,
    data: barbersWithStats
  });
});

// @desc    Get single barber
// @route   GET /api/barbers/:id
// @access  Public
const getBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id);

  if (!barber) {
    res.status(404);
    throw new Error('Barber not found');
  }

  // Get barber's appointment statistics
  const appointmentStats = await Appointment.aggregate([
    { $match: { barber: barber._id } },
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: 1 },
        completedAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        cancelledAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0] }
        }
      }
    }
  ]);

  // Get recent appointments
  const recentAppointments = await Appointment.find({ barber: req.params.id })
    .populate('customer', 'name phone')
    .populate('service', 'name category')
    .sort({ dateTime: -1 })
    .limit(10);

  const stats = appointmentStats[0] || {
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalRevenue: 0
  };

  res.json({
    success: true,
    data: {
      barber,
      stats,
      recentAppointments
    }
  });
});

// @desc    Create new barber
// @route   POST /api/barbers
// @access  Public
const createBarber = asyncHandler(async (req, res) => {
  const { name, role, profileImage, workingHours, workingDays } = req.body;

  const barber = await Barber.create({
    name,
    role,
    profileImage: profileImage || '',
    workingHours: workingHours || { start: '09:00', end: '18:00' },
    workingDays: workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  res.status(201).json({
    success: true,
    data: barber
  });
});

// @desc    Update barber
// @route   PUT /api/barbers/:id
// @access  Public
const updateBarber = asyncHandler(async (req, res) => {
  const { name, role, profileImage, status, workingHours, workingDays } = req.body;

  const barber = await Barber.findById(req.params.id);

  if (!barber) {
    res.status(404);
    throw new Error('Barber not found');
  }

  // Update fields
  if (name) barber.name = name;
  if (role) barber.role = role;
  if (profileImage !== undefined) barber.profileImage = profileImage;
  if (status) barber.status = status;
  if (workingHours) barber.workingHours = workingHours;
  if (workingDays) barber.workingDays = workingDays;

  const updatedBarber = await barber.save();

  res.json({
    success: true,
    data: updatedBarber
  });
});

// @desc    Delete barber
// @route   DELETE /api/barbers/:id
// @access  Public
const deleteBarber = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id);

  if (!barber) {
    res.status(404);
    throw new Error('Barber not found');
  }

  // Check if barber has any active appointments
  const activeAppointments = await Appointment.countDocuments({
    barber: req.params.id,
    status: { $in: ['Pending', 'Confirmed'] }
  });

  if (activeAppointments > 0) {
    res.status(400);
    throw new Error('Cannot delete barber with active appointments');
  }

  await barber.deleteOne();

  res.json({
    success: true,
    message: 'Barber deleted successfully'
  });
});

// @desc    Get barber availability
// @route   GET /api/barbers/:id/availability
// @access  Public
const getBarberAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error('Date is required');
  }

  const barber = await Barber.findById(req.params.id);

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
      data: {
        isAvailable: false,
        reason: 'Barber does not work on this day',
        workingDays: barber.workingDays
      }
    });
  }

  // Get appointments for this date
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    barber: req.params.id,
    dateTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ['Pending', 'Confirmed'] }
  }).populate('service', 'duration');

  res.json({
    success: true,
    data: {
      isAvailable: true,
      workingHours: barber.workingHours,
      appointments: appointments.map(apt => ({
        id: apt._id,
        startTime: apt.dateTime,
        endTime: new Date(apt.dateTime.getTime() + (apt.duration * 60000)),
        duration: apt.duration
      }))
    }
  });
});

module.exports = {
  getBarbers,
  getBarber,
  createBarber,
  updateBarber,
  deleteBarber,
  getBarberAvailability
};