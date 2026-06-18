const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      if (!process.env.JWT_SECRET) {
        res.status(500);
        throw new Error('JWT_SECRET environment variable is not set');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only middleware
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admin privileges required.');
  }
});

// Admin or Barber middleware
const staffOnly = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'barber')) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Staff privileges required.');
  }
});

module.exports = { protect, adminOnly, staffOnly };