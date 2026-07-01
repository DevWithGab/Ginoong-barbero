const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { addClient } = require('./utils/sse');
const { createRateLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust first proxy (needed for correct req.ip behind Render's proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Rate limiting (100 requests per 15 minutes per IP for general routes)
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: 'Too many requests. Please try again later.'
});

// Auth rate limiting (20 attempts per 15 minutes per IP)
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many authentication attempts. Please try again later.'
});

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiter to all /api routes
app.use('/api', generalLimiter);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/barbers', require('./routes/barberRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));

// SSE endpoint for real-time updates
app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': req.headers.origin || '*'
  });
  res.write('retry: 5000\n\n');
  addClient(res);
  req.on('close', () => {});
});

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