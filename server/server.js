const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/barbers', require('./routes/barberRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Ginoong Barbero API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Ginoong Barbero API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      appointments: '/api/appointments',
      customers: '/api/customers',
      services: '/api/services',
      barbers: '/api/barbers',
      dashboard: '/api/dashboard',
      gallery: '/api/gallery',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Ginoong Barbero Server running on port ${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/metrics`);
  console.log(`📅 Appointments API: http://localhost:${PORT}/api/appointments`);
  console.log(`👥 Customers API: http://localhost:${PORT}/api/customers`);
  console.log(`✂️ Services API: http://localhost:${PORT}/api/services`);
  console.log(`💇 Barbers API: http://localhost:${PORT}/api/barbers`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;