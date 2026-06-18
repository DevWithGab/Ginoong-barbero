const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Barber name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Barber role is required'],
    enum: {
      values: ['Senior Barber', 'Barber', 'Master Barber'],
      message: 'Role must be one of: Senior Barber, Barber, Master Barber'
    }
  },
  profileImage: {
    type: String,
    default: '',
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be either Active or Inactive'
    },
    default: 'Active'
  },
  workingHours: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '18:00'
    }
  },
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, {
  timestamps: true
});

// Index for efficient queries
barberSchema.index({ status: 1 });
barberSchema.index({ role: 1 });

module.exports = mongoose.model('Barber', barberSchema);