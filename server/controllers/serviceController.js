const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

// Escape special regex characters in user input
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// @desc    Get all services with filtering
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const {
    category,
    status,
    search,
    sortBy = 'name',
    sortOrder = 'asc'
  } = req.query;

  // Build filter object
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    const sanitizedSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: sanitizedSearch, $options: 'i' } },
      { description: { $regex: sanitizedSearch, $options: 'i' } }
    ];
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const services = await Service.find(filter).sort(sortOptions);

  // Get service statistics
  const serviceStats = await Promise.all(
    services.map(async (service) => {
      const appointmentCount = await Appointment.countDocuments({
        service: service._id,
        status: { $in: ['Completed', 'Confirmed', 'Pending'] }
      });

      const revenue = await Appointment.aggregate([
        {
          $match: {
            service: service._id,
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
        ...service.toObject(),
        bookingCount: appointmentCount,
        totalRevenue: revenue[0]?.totalRevenue || 0
      };
    })
  );

  res.json({
    success: true,
    data: serviceStats
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Get service statistics
  const appointmentStats = await Appointment.aggregate([
    { $match: { service: service._id } },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0] }
        },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  const stats = appointmentStats[0] || {
    totalBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  };

  res.json({
    success: true,
    data: {
      service,
      stats
    }
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Public
const createService = asyncHandler(async (req, res) => {
  const { name, description, category, duration, price, status } = req.body;
  const image = req.file ? `/uploads/services/${req.file.filename}` : null;

  // Check if service with same name already exists
  const existingService = await Service.findOne({ name });
  if (existingService) {
    res.status(400);
    throw new Error('Service with this name already exists');
  }

  const service = await Service.create({
    name,
    description,
    category,
    duration: Number(duration),
    price: Number(price),
    status: status || 'Active',
    image
  });

  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Public
const updateService = asyncHandler(async (req, res) => {
  const { name, description, category, duration, price, status } = req.body;

  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if name is being changed and already exists
  if (name && name !== service.name) {
    const existingService = await Service.findOne({ name });
    if (existingService) {
      res.status(400);
      throw new Error('Service with this name already exists');
    }
  }

  // Update fields
  if (name) service.name = name;
  if (description) service.description = description;
  if (category) service.category = category;
  if (duration) service.duration = Number(duration);
  if (price !== undefined) service.price = Number(price);
  if (status) service.status = status;

  if (req.file) {
    service.image = `/uploads/services/${req.file.filename}`;
  }

  const updatedService = await service.save();

  res.json({
    success: true,
    data: updatedService
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Public
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if service has any active appointments
  const activeAppointments = await Appointment.countDocuments({
    service: req.params.id,
    status: { $in: ['Pending', 'Confirmed'] }
  });

  if (activeAppointments > 0) {
    res.status(400);
    throw new Error('Cannot delete service with active appointments');
  }

  await service.deleteOne();

  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
});

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
const getServicesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { status = 'Active' } = req.query;

  const services = await Service.find({ 
    category: category,
    status: status 
  }).sort({ name: 1 });

  res.json({
    success: true,
    data: services
  });
});

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await Service.distinct('category');
  
  // Get count for each category
  const categoryStats = await Promise.all(
    categories.map(async (category) => {
      const count = await Service.countDocuments({ 
        category, 
        status: 'Active' 
      });
      return { category, count };
    })
  );

  res.json({
    success: true,
    data: categoryStats
  });
});

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
const getPopularServices = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const popularServices = await Appointment.aggregate([
    {
      $match: {
        status: { $in: ['Completed', 'Confirmed'] }
      }
    },
    {
      $group: {
        _id: '$service',
        bookingCount: { $sum: 1 },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$totalAmount', 0] }
        }
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
      $match: {
        'service.status': 'Active'
      }
    },
    {
      $project: {
        _id: '$service._id',
        name: '$service.name',
        category: '$service.category',
        price: '$service.price',
        duration: '$service.duration',
        image: '$service.image',
        bookingCount: 1,
        totalRevenue: 1
      }
    },
    {
      $sort: { bookingCount: -1 }
    },
    {
      $limit: parseInt(limit)
    }
  ]);

  res.json({
    success: true,
    data: popularServices
  });
});

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServiceCategories,
  getPopularServices
};