const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    default: '',
    match: [
      /^$|^[\+]?[1-9][\d]{0,15}$/,
      'Please enter a valid phone number'
    ]
  },
  totalVisits: {
    type: Number,
    default: 0,
    min: [0, 'Total visits cannot be negative']
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative']
  },
  lastAppointment: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be either Active or Inactive'
    },
    default: 'Active'
  },
  isVIP: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ isVIP: 1 });
customerSchema.index({ name: 'text', email: 'text' });

// Virtual for customer tier based on total spent
customerSchema.virtual('tier').get(function() {
  if (this.totalSpent >= 5000) return 'Platinum';
  if (this.totalSpent >= 2000) return 'Gold';
  if (this.totalSpent >= 500) return 'Silver';
  return 'Bronze';
});

// Automatically set VIP status based on spending
customerSchema.pre('save', function(next) {
  if (this.totalSpent >= 2000) {
    this.isVIP = true;
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);