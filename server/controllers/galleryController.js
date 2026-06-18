const asyncHandler = require('express-async-handler');
const GalleryImage = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = asyncHandler(async (req, res) => {
  const { category, isActive } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });

  res.json({
    success: true,
    data: images
  });
});

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  res.json({
    success: true,
    data: image
  });
});

// @desc    Create gallery image
// @route   POST /api/gallery
// @access  Private (Staff)
const createGalleryImage = asyncHandler(async (req, res) => {
  const { title, url, category, description, cols, order } = req.body;

  const image = await GalleryImage.create({
    title,
    url,
    category,
    description: description || '',
    cols: cols || '',
    order: order || 0
  });

  res.status(201).json({
    success: true,
    data: image
  });
});

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Staff)
const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  const { title, url, category, description, cols, order, isActive } = req.body;

  if (title !== undefined) image.title = title;
  if (url !== undefined) image.url = url;
  if (category !== undefined) image.category = category;
  if (description !== undefined) image.description = description;
  if (cols !== undefined) image.cols = cols;
  if (order !== undefined) image.order = order;
  if (isActive !== undefined) image.isActive = isActive;

  const updatedImage = await image.save();

  res.json({
    success: true,
    data: updatedImage
  });
});

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Staff)
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  await image.deleteOne();

  res.json({
    success: true,
    message: 'Gallery image deleted successfully'
  });
});

module.exports = {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
};
