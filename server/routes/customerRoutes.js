const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  getTestimonials
} = require('../controllers/customerController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/customers/testimonials
// @desc    Get customer testimonials
// @access  Public
router.get('/testimonials', getTestimonials);

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private (Staff)
router.get('/stats', protect, staffOnly, getCustomerStats);

// @route   GET /api/customers
// @desc    Get all customers with filtering
// @access  Private (Staff)
router.get('/', protect, staffOnly, getCustomers);

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private (Staff)
router.post('/', protect, staffOnly, createCustomer);

// @route   GET /api/customers/:id
// @desc    Get single customer with appointment history
// @access  Private (Staff)
router.get('/:id', protect, staffOnly, getCustomer);

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private (Staff)
router.put('/:id', protect, staffOnly, updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private (Staff)
router.delete('/:id', protect, staffOnly, deleteCustomer);

module.exports = router;