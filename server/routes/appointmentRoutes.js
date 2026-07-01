const express = require('express');
const {
  createAppointment,
  getAppointments,
  getAvailableSlots,
  updateAppointment,
  getAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { validateAppointment, validateAppointmentUpdate, validatePagination } = require('../middleware/validate');

const router = express.Router();

// Rate limit: 15 bookings per 15 minutes per IP
const bookingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
  message: 'Too many booking attempts. Please wait before trying again.'
});

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for booking
// @access  Public
router.get('/available-slots', getAvailableSlots);

// @route   GET /api/appointments
// @desc    Get all appointments with filtering
// @access  Private (Staff)
router.get('/', protect, staffOnly, validatePagination, getAppointments);

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Public (booking)
router.post('/', bookingLimiter, validateAppointment, createAppointment);

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private (Staff)
router.get('/:id', protect, staffOnly, getAppointment);

// @route   PATCH /api/appointments/:id
// @desc    Update appointment status
// @access  Private (Staff)
router.patch('/:id', protect, staffOnly, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (Staff)
router.delete('/:id', protect, staffOnly, deleteAppointment);

module.exports = router;