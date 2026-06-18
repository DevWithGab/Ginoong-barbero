const express = require('express');
const {
  getDashboardMetrics,
  getRevenueAnalytics,
  getAppointmentAnalytics,
  getCustomerAnalytics,
  getTodaySchedule
} = require('../controllers/dashboardController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/dashboard/metrics
// @desc    Get main dashboard metrics
// @access  Private (Staff)
router.get('/metrics', protect, staffOnly, getDashboardMetrics);

// @route   GET /api/dashboard/revenue
// @desc    Get revenue analytics
// @access  Private (Staff)
router.get('/revenue', protect, staffOnly, getRevenueAnalytics);

// @route   GET /api/dashboard/appointments
// @desc    Get appointment analytics
// @access  Private (Staff)
router.get('/appointments', protect, staffOnly, getAppointmentAnalytics);

// @route   GET /api/dashboard/customers
// @desc    Get customer analytics
// @access  Private (Staff)
router.get('/customers', protect, staffOnly, getCustomerAnalytics);

// @route   GET /api/dashboard/today-schedule
// @desc    Get today's appointment schedule
// @access  Private (Staff)
router.get('/today-schedule', protect, staffOnly, getTodaySchedule);

module.exports = router;