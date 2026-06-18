const express = require('express');
const {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', getGalleryImages);

// @route   POST /api/gallery
// @desc    Create gallery image
// @access  Private (Staff)
router.post('/', protect, staffOnly, createGalleryImage);

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', getGalleryImage);

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private (Staff)
router.put('/:id', protect, staffOnly, updateGalleryImage);

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private (Staff)
router.delete('/:id', protect, staffOnly, deleteGalleryImage);

module.exports = router;
