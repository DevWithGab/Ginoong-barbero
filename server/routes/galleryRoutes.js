const express = require('express');
const {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} = require('../controllers/galleryController');
const { protect, staffOnly } = require('../middleware/authMiddleware');
const { uploadGalleryPhoto } = require('../middleware/upload');

const router = express.Router();

router.get('/', getGalleryImages);
router.post('/', protect, staffOnly, uploadGalleryPhoto, createGalleryImage);
router.get('/:id', getGalleryImage);
router.put('/:id', protect, staffOnly, uploadGalleryPhoto, updateGalleryImage);
router.delete('/:id', protect, staffOnly, deleteGalleryImage);

module.exports = router;
