const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const Barber = require('../models/Barber');

// @desc    Get dashboard metrics and analytics
// @route   GET /api/dashboard/metrics
// @access  Public
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Today's appointments count (filter by date parts to avoid timezone issues)
  const allAppointments = await Appointment.find({}).select('dateTime');
  const todayAppointments = allAppointments.filter(apt => {
    const d = new Date(apt.dateTime);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }).length;

  // Pending approvals count
  const pendingApprovals = await Appointment.countDocuments({
    status: 'Pending'
  });

  // Gross revenue (all paid appointments)
  const revenueResult = await Appointment.aggregate([
    {
      $match: { paymentStatus: 'Paid' }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
  const grossRevenue = revenueResult[0]?.totalRevenue || 0;

  // Top services (most booked)
  const topServices = await Appointment.aggregate([
    {
      $match: {
        status: { $in: ['Completed', 'Confirmed', 'Pending'] }
      }
    },
    {
      $group: {
        _id: '$service',
        bookingCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    {
      $unwind: '$service'
    },
    {
      $project: {
        name: '$service.name',
        category: '$service.category',
        bookingCount: 1
      }
    },
    {
      $sort: { bookingCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  // Appointment status breakdown
  const statusBreakdown = await Appointment.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format status breakdown for charts
  const statusCounts = {
    Pending: 0,
    Confirmed: 0,
    Completed: 0,
    Cancelled: 0
  };

  statusBreakdown.forEach(item => {
    statusCounts[item._id] = item.count;
  });

  res.json({
    success: true,
    data: {
      todayAppointments,
      pendingApprovals,
      grossRevenue,
      topServices,
      statusBreakdown: statusCounts
    }
  });
});

// @desc    Get revenue analytics
// @route   GET /api/dashboard/revenue
// @access  Public
const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let dateRange;
  let groupBy;
  
  const now = new Date();
  
  switch (period) {
    case 'week':
      dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupBy = {
        year: { $year: '$dateTime' },
        month: { $month: '$dateTime' },
        day: { $dayOfMonth: '$dateTime' }
      };
      break;
    case 'month':
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupBy = {
        year: { $year: '$dateTime' },
        month: { $month: '$dateTime' },
        day: { $dayOfMonth: '$dateTime' }
      };
      break;
    case 'year':
      dateRange = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      groupBy = {
        year: { $year: '$dateTime' },
        month: { $month: '$dateTime' }
      };
      break;
    default:
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupBy = {
        year: { $year: '$dateTime' },
        month: { $month: '$dateTime' },
        day: { $dayOfMonth: '$dateTime' }
      };
  }

  const revenueData = await Appointment.aggregate([
    {
      $match: {
        dateTime: { $gte: dateRange },
        paymentStatus: 'Paid'
      }
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$totalAmount' },
        appointmentCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  res.json({
    success: true,
    data: revenueData
  });
});

// @desc    Get appointment analytics
// @route   GET /api/dashboard/appointments
// @access  Public
const getAppointmentAnalytics = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let dateRange;
  const now = new Date();
  
  switch (period) {
    case 'week':
      dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      dateRange = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Appointments by status over time
  const appointmentTrends = await Appointment.aggregate([
    {
      $match: {
        dateTime: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: {
          status: '$status',
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$dateTime'
            }
          }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ]);

  // Appointments by barber
  const appointmentsByBarber = await Appointment.aggregate([
    {
      $match: {
        dateTime: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: '$barber',
        appointmentCount: { $sum: 1 },
        completedCount: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        revenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0] }
        }
      }
    },
    {
      $lookup: {
        from: 'barbers',
        localField: '_id',
        foreignField: '_id',
        as: 'barber'
      }
    },
    {
      $unwind: '$barber'
    },
    {
      $project: {
        barberName: '$barber.name',
        barberRole: '$barber.role',
        appointmentCount: 1,
        completedCount: 1,
        revenue: 1,
        completionRate: {
          $cond: [
            { $eq: ['$appointmentCount', 0] },
            0,
            { $multiply: [{ $divide: ['$completedCount', '$appointmentCount'] }, 100] }
          ]
        }
      }
    },
    {
      $sort: { appointmentCount: -1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      appointmentTrends,
      appointmentsByBarber
    }
  });
});

// @desc    Get customer analytics
// @route   GET /api/dashboard/customers
// @access  Public
const getCustomerAnalytics = asyncHandler(async (req, res) => {
  // New customers this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const newCustomersThisMonth = await Customer.countDocuments({
    createdAt: { $gte: thisMonth }
  });

  // Customer retention (customers with more than 1 appointment)
  const customerRetention = await Customer.aggregate([
    {
      $lookup: {
        from: 'appointments',
        localField: '_id',
        foreignField: 'customer',
        as: 'appointments'
      }
    },
    {
      $addFields: {
        appointmentCount: { $size: '$appointments' }
      }
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        returningCustomers: {
          $sum: { $cond: [{ $gt: ['$appointmentCount', 1] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        totalCustomers: 1,
        returningCustomers: 1,
        retentionRate: {
          $cond: [
            { $eq: ['$totalCustomers', 0] },
            0,
            { $multiply: [{ $divide: ['$returningCustomers', '$totalCustomers'] }, 100] }
          ]
        }
      }
    }
  ]);

  // Customer tier distribution
  const customers = await Customer.find({}, 'totalSpent');
  const tierDistribution = {
    Bronze: 0,
    Silver: 0,
    Gold: 0,
    Platinum: 0
  };

  customers.forEach(customer => {
    if (customer.totalSpent >= 5000) tierDistribution.Platinum++;
    else if (customer.totalSpent >= 2000) tierDistribution.Gold++;
    else if (customer.totalSpent >= 500) tierDistribution.Silver++;
    else tierDistribution.Bronze++;
  });

  // Top customers by spending
  const topCustomers = await Customer.find({})
    .sort({ totalSpent: -1 })
    .limit(10)
    .select('name email totalSpent totalVisits isVIP');

  const retention = customerRetention[0] || {
    totalCustomers: 0,
    returningCustomers: 0,
    retentionRate: 0
  };

  res.json({
    success: true,
    data: {
      newCustomersThisMonth,
      customerRetention: retention,
      tierDistribution,
      topCustomers
    }
  });
});

// @desc    Get today's schedule
// @route   GET /api/dashboard/today-schedule
// @access  Public
const getTodaySchedule = asyncHandler(async (req, res) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const todayAppointments = (await Appointment.find({
    status: { $in: ['Pending', 'Confirmed'] }
  })
    .populate('customer', 'name phone isVIP picture')
    .populate('service', 'name duration category')
    .populate('barber', 'name role')
    .sort({ dateTime: 1 }))
    .filter(apt => {
      const d = new Date(apt.dateTime);
      return d.getFullYear() === todayYear && d.getMonth() === todayMonth && d.getDate() === todayDate;
    });

  // Group appointments by barber
  const scheduleByBarber = {};
  
  todayAppointments.forEach(appointment => {
    const barberId = appointment.barber?._id?.toString() || 'unassigned';
    if (!scheduleByBarber[barberId]) {
      scheduleByBarber[barberId] = {
        barber: appointment.barber || { name: 'Any Barber' },
        appointments: []
      };
    }
    scheduleByBarber[barberId].appointments.push(appointment);
  });

  res.json({
    success: true,
    data: {
      totalAppointments: todayAppointments.length,
      scheduleByBarber: Object.values(scheduleByBarber),
      allAppointments: todayAppointments
    }
  });
});

module.exports = {
  getDashboardMetrics,
  getRevenueAnalytics,
  getAppointmentAnalytics,
  getCustomerAnalytics,
  getTodaySchedule
};