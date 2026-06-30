const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  getServiceCategories,
  getPopularServices
} = require('../controllers/serviceController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { uploadServicePhoto } = require('../middleware/upload');
const { validateService, validateMongoId } = require('../middleware/validate');

const router = express.Router();

// @route   GET /api/services/categories
// @desc    Get all service categories
// @access  Public
router.get('/categories', getServiceCategories);

// @route   GET /api/services/popular
// @desc    Get popular services
// @access  Public
router.get('/popular', getPopularServices);

// @route   GET /api/services/category/:category
// @desc    Get services by category
// @access  Public
router.get('/category/:category', getServicesByCategory);

// @route   GET /api/services
// @desc    Get all services with filtering
// @access  Public (booking needs to list services)
router.get('/', getServices);

// @route   POST /api/services
// @desc    Create new service
// @access  Private (Staff)
router.post('/', protect, staffOnly, uploadServicePhoto, validateService, createService);

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', validateMongoId, getService);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private (Staff)
router.put('/:id', protect, staffOnly, uploadServicePhoto, validateService, updateService);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private (Staff)
router.delete('/:id', protect, staffOnly, validateMongoId, deleteService);

module.exports = router;