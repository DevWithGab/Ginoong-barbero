const express = require('express');
const {
  getBarbers,
  getBarber,
  createBarber,
  updateBarber,
  deleteBarber,
  getBarberAvailability
} = require('../controllers/barberController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { uploadBarberPhoto } = require('../middleware/upload');
const { validateBarber, validateMongoId } = require('../middleware/validate');

const router = express.Router();

// @route   GET /api/barbers
// @desc    Get all barbers
// @access  Public (booking needs to list barbers)
router.get('/', getBarbers);

// @route   POST /api/barbers
// @desc    Create new barber
// @access  Private (Staff)
router.post('/', protect, staffOnly, uploadBarberPhoto, validateBarber, createBarber);

// @route   GET /api/barbers/:id
// @desc    Get single barber
// @access  Public
router.get('/:id', validateMongoId, getBarber);

// @route   PUT /api/barbers/:id
// @desc    Update barber
// @access  Private (Staff)
router.put('/:id', protect, staffOnly, uploadBarberPhoto, validateBarber, updateBarber);

// @route   DELETE /api/barbers/:id
// @desc    Delete barber
// @access  Private (Staff)
router.delete('/:id', protect, staffOnly, validateMongoId, deleteBarber);

// @route   GET /api/barbers/:id/availability
// @desc    Get barber availability for a specific date
// @access  Public (booking needs availability)
router.get('/:id/availability', validateMongoId, getBarberAvailability);

module.exports = router;