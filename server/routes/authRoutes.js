const express = require('express');
const {
  registerUser,
  loginUser,
  googleLogin,
  googleCustomerLogin,
  verifyToken,
  getProfile,
  logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegistration,
  validateLogin,
  validateGoogleLogin
} = require('../middleware/validate');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user (admin creates accounts)
// @access  Private (admin only)
router.post('/register', protect, validateRegistration, registerUser);

// @route   POST /api/auth/login
// @desc    Login with email/password
// @access  Public
router.post('/login', validateLogin, loginUser);

// @route   POST /api/auth/google
// @desc    Google OAuth login (admin only)
// @access  Public
router.post('/google', validateGoogleLogin, googleLogin);

// @route   POST /api/auth/google-customer
// @desc    Google OAuth login for customers
// @access  Public
router.post('/google-customer', validateGoogleLogin, googleCustomerLogin);

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', protect, verifyToken);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logoutUser);

module.exports = router;