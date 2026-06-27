const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    required: false,
    default: null
  },
  dateTime: {
    type: Date,
    required: [true, 'Appointment date and time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      message: 'Status must be one of: Pending, Confirmed, Completed, Cancelled, Rejected'
    },
    default: 'Pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes']
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ dateTime: 1 });
appointmentSchema.index({ customer: 1 });
appointmentSchema.index({ barber: 1 });
appointmentSchema.index({ service: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ barber: 1, dateTime: 1 });

// Compound index for availability checking
appointmentSchema.index({ 
  barber: 1, 
  dateTime: 1, 
  status: 1 
});

// Virtual for end time calculation
appointmentSchema.virtual('endTime').get(function() {
  return new Date(this.dateTime.getTime() + (this.duration * 60000));
});

// Track previous status before save
appointmentSchema.pre('save', function(next) {
  if (!this.isNew && this.isModified('status')) {
    this._previousStatus = this.$__.previous?.status || this.$__?.saveOptions?.previousStatus;
  }
  next();
});

// Pre-save middleware to update customer stats when appointment status changes
appointmentSchema.pre('save', async function(next) {
  if (this.isModified('status') && !this.isNew) {
    try {
      const Customer = mongoose.model('Customer');
      const previousStatus = this._previousStatus;
      
      // If status changed to Completed, increment stats
      if (this.status === 'Completed' && previousStatus !== 'Completed') {
        await Customer.findByIdAndUpdate(this.customer, {
          $inc: { 
            totalVisits: 1,
            totalSpent: this.totalAmount 
          },
          lastAppointment: this.dateTime
        });
      }
      // If status changed from Completed to something else, decrement stats
      else if (previousStatus === 'Completed' && this.status !== 'Completed') {
        // Fetch current customer stats to prevent going negative
        const customer = await Customer.findById(this.customer).select('totalVisits totalSpent');
        if (customer) {
          const newTotalVisits = Math.max(0, customer.totalVisits - 1);
          const newTotalSpent = Math.max(0, customer.totalSpent - this.totalAmount);
          await Customer.findByIdAndUpdate(this.customer, {
            $set: { 
              totalVisits: newTotalVisits,
              totalSpent: newTotalSpent
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating customer stats:', error);
    }
  }
  // For new appointments that are immediately Completed
  else if (this.isNew && this.status === 'Completed') {
    try {
      const Customer = mongoose.model('Customer');
      await Customer.findByIdAndUpdate(this.customer, {
        $inc: { totalVisits: 1, totalSpent: this.totalAmount },
        lastAppointment: this.dateTime
      });
    } catch (error) {
      console.error('Error updating customer stats:', error);
    }
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);