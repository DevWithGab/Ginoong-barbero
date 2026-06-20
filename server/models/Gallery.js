const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Barbers', 'Haircuts', 'Kids', 'Products', 'Barbershop'],
      message: 'Category must be one of: Barbers, Haircuts, Kids, Products, Barbershop'
    }
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cols: {
    type: String,
    default: '',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

galleryImageSchema.index({ category: 1 });
galleryImageSchema.index({ order: 1 });
galleryImageSchema.index({ isActive: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
