const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const Appointment = require('../models/Appointment');

// Escape special regex characters in user input
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all customers with filtering and pagination
// @route   GET /api/customers
// @access  Public
const getCustomers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    isVIP,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};

  if (search) {
    const sanitizedSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: sanitizedSearch, $options: 'i' } },
      { email: { $regex: sanitizedSearch, $options: 'i' } },
      { phone: { $regex: sanitizedSearch, $options: 'i' } }
    ];
  }

  if (status) filter.status = status;
  if (isVIP !== undefined) filter.isVIP = isVIP === 'true';

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get customers
  const customers = await Customer.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Customer.countDocuments(filter);

  // Add computed fields for each customer
  const customersWithStats = customers.map(customer => {
    const customerObj = customer.toObject();
    customerObj.tier = customer.tier; // Virtual field
    return customerObj;
  });

  res.json({
    success: true,
    data: customersWithStats,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single customer with appointment history
// @route   GET /api/customers/:id
// @access  Public
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Get customer's appointment history
  const appointments = await Appointment.find({ customer: req.params.id })
    .populate('service', 'name category price')
    .populate('barber', 'name role')
    .sort({ dateTime: -1 })
    .limit(10);

  // Get customer stats
  const appointmentStats = await Appointment.aggregate([
    { $match: { customer: customer._id } },
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
        totalSpentCalculated: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, '$totalAmount', 0] }
        }
      }
    }
  ]);

  const stats = appointmentStats[0] || {
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalSpentCalculated: 0
  };

  const customerObj = customer.toObject();
  customerObj.tier = customer.tier; // Virtual field

  res.json({
    success: true,
    data: {
      customer: customerObj,
      recentAppointments: appointments,
      stats
    }
  });
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Public
const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, notes } = req.body;

  // Check if customer already exists
  const existingCustomer = await Customer.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingCustomer) {
    res.status(400);
    throw new Error('Customer with this email or phone already exists');
  }

  const customer = await Customer.create({
    name,
    email,
    phone,
    notes: notes || ''
  });

  res.status(201).json({
    success: true,
    data: customer
  });
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Public
const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, status, isVIP, notes } = req.body;

  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check if email or phone is being changed and already exists
  if (email && email !== customer.email) {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  if (phone && phone !== customer.phone) {
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      res.status(400);
      throw new Error('Phone number already exists');
    }
  }

  // Update fields
  if (name) customer.name = name;
  if (email) customer.email = email;
  if (phone) customer.phone = phone;
  if (status) customer.status = status;
  if (isVIP !== undefined) customer.isVIP = isVIP;
  if (notes !== undefined) customer.notes = notes;

  const updatedCustomer = await customer.save();

  res.json({
    success: true,
    data: updatedCustomer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Public
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check if customer has any appointments
  const appointmentCount = await Appointment.countDocuments({ 
    customer: req.params.id,
    status: { $in: ['Pending', 'Confirmed'] }
  });

  if (appointmentCount > 0) {
    res.status(400);
    throw new Error('Cannot delete customer with active appointments');
  }

  await customer.deleteOne();

  res.json({
    success: true,
    message: 'Customer deleted successfully'
  });
});

// @desc    Get customer statistics
// @route   GET /api/customers/stats
// @access  Public
const getCustomerStats = asyncHandler(async (req, res) => {
  const stats = await Customer.aggregate([
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        activeCustomers: {
          $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
        },
        vipCustomers: {
          $sum: { $cond: ['$isVIP', 1, 0] }
        },
        averageSpent: { $avg: '$totalSpent' },
        totalRevenue: { $sum: '$totalSpent' }
      }
    }
  ]);

  // Get customer tier distribution via aggregation
  const tierResult = await Customer.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $gte: ['$totalSpent', 5000] }, then: 'Platinum' },
              { case: { $gte: ['$totalSpent', 2000] }, then: 'Gold' },
              { case: { $gte: ['$totalSpent', 500] }, then: 'Silver' }
            ],
            default: 'Bronze'
          }
        },
        count: { $sum: 1 }
      }
    }
  ]);

  const tierDistribution = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 };
  tierResult.forEach(t => { tierDistribution[t._id] = t.count; });

  const result = stats[0] || {
    totalCustomers: 0,
    activeCustomers: 0,
    vipCustomers: 0,
    averageSpent: 0,
    totalRevenue: 0
  };

  res.json({
    success: true,
    data: {
      ...result,
      tierDistribution
    }
  });
});

// @desc    Get customer testimonials
// @route   GET /api/customers/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  // Get customers with testimonials (not null or empty)
  const customers = await Customer.find({
    testimonial: { $exists: true, $ne: null, $ne: "" }
  })
  .limit(10)
  .sort({ createdAt: -1 });

  // Format testimonials
  const testimonials = customers.map(customer => ({
    quote: customer.testimonial,
    author: customer.name || "Anonymous Customer",
    role: customer.role || "Valued Customer"
  }));

  // If no testimonials from customers, return default ones
  if (testimonials.length === 0) {
    return res.status(200).json({
      success: true,
      data: [
        {
          quote: "Outstanding craftsmanship and attention to detail. My go-to barber shop in the city.",
          author: "Juan Santos",
          role: "Business Executive"
        },
        {
          quote: "The best barbershop experience I've had. Professional staff and premium service every time.",
          author: "Miguel Torres",
          role: "Entrepreneur"
        },
        {
          quote: "Exceptional quality and impeccable service. Highly recommended for any gentleman.",
          author: "Carlos Rivera",
          role: "Corporate Manager"
        }
      ]
    });
  }

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  getTestimonials
};