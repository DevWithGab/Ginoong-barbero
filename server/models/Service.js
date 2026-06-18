const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: {
      values: ['Haircuts', 'Beard', 'Hair Color', 'Add-ons', 'Packages'],
      message: 'Category must be one of: Haircuts, Beard, Hair Color, Add-ons, Packages'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be either Active or Inactive'
    },
    default: 'Active'
  },
  image: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);