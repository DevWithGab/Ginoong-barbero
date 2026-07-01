const asyncHandler = require('express-async-handler');
const GalleryImage = require('../models/Gallery');

const getGalleryImages = asyncHandler(async (req, res) => {
  const { category, isActive } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: images });
});

const getGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) { res.status(404); throw new Error('Gallery image not found'); }
  res.json({ success: true, data: image });
});

const createGalleryImage = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const imageUrl = req.file ? req.file.path : body.url;
  if (!imageUrl) { res.status(400); throw new Error('Image file or URL is required'); }

  const categoryValue = (body.category || '').trim();
  const validCategories = ['Barbers', 'Haircuts', 'Kids', 'Products', 'Barbershop'];
  if (!categoryValue || !validCategories.includes(categoryValue)) {
    res.status(400);
    throw new Error(`Invalid category: "${categoryValue}". Must be one of: ${validCategories.join(', ')}`);
  }

  const image = await GalleryImage.create({
    title: (body.title || 'Untitled').trim(),
    url: imageUrl,
    category: categoryValue,
    description: (body.description || '').trim(),
    cols: body.cols || '',
    order: Number(body.order) || 0
  });
  res.status(201).json({ success: true, data: image });
});

const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) { res.status(404); throw new Error('Gallery image not found'); }

  const body = req.body || {};
  if (body.title !== undefined) image.title = body.title;
  if (req.file) image.url = req.file.path;
  else if (body.url !== undefined) image.url = body.url;
  if (body.category !== undefined) image.category = body.category.trim();
  if (body.description !== undefined) image.description = body.description;
  if (body.cols !== undefined) image.cols = body.cols;
  if (body.order !== undefined) image.order = Number(body.order) || 0;
  if (body.isActive !== undefined) image.isActive = body.isActive === 'true' || body.isActive === true;

  const updatedImage = await image.save();
  res.json({ success: true, data: updatedImage });
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) { res.status(404); throw new Error('Gallery image not found'); }
  await image.deleteOne();
  res.json({ success: true, message: 'Gallery image deleted successfully' });
});

module.exports = { getGalleryImages, getGalleryImage, createGalleryImage, updateGalleryImage, deleteGalleryImage };
