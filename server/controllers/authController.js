const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

// Note: You may need to adjust the path to your User model
const User = require('../models/User');
const Customer = require('../models/Customer');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user (admin creates accounts)
// @route   POST /api/auth/register
// @access  Private (admin only)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Only allow registration by admin
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    res.status(403);
    throw new Error('Admin account must be created via Google login');
  }

  // Check if caller is admin
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can create new accounts');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'customer'
  });

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Only allow admin email to log in
  if (email !== process.env.ADMIN_EMAIL) {
    res.status(403);
    throw new Error('Access denied. This account is not authorized to access the admin panel.');
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    res.status(423);
    throw new Error('Account is locked. Please try again later.');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(403);
    throw new Error('Account is deactivated. Contact administrator.');
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture
      },
      token
    }
  });
});

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Google token is required');
  }

  try {
    let googleUser;
    
    // Verify the actual Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    googleUser = ticket.getPayload();

    const { email, name, picture, sub: googleId } = googleUser;

    // Only allow the designated admin email to log in
    if (email !== process.env.ADMIN_EMAIL) {
      res.status(403);
      throw new Error('Access denied. This account is not authorized to access the admin panel.');
    }

    // Check if user exists by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new admin user
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        role: 'admin',
        password: require('crypto').randomBytes(32).toString('hex')
      });
    } else {
      // Update googleId and picture if not set
      if (!user.googleId) user.googleId = googleId;
      if (picture) user.picture = picture;
      
      // Ensure admin role
      if (user.role !== 'admin') {
        user.role = 'admin';
      }
      
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    if (error.statusCode) {
      throw error;
    }
    res.status(401);
    throw new Error('Invalid Google token');
  }
});

// @desc    Google OAuth login for customers (any account allowed)
// @route   POST /api/auth/google-customer
// @access  Public
const googleCustomerLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Google token is required');
  }

  try {
    let googleUser;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    googleUser = ticket.getPayload();

    const { email, name, picture, sub: googleId } = googleUser;

    // Find or create customer
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'This account is registered as admin. Please use the admin login instead.'
      });
    }

    if (!user) {
      // Create new customer account
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        role: 'customer',
        password: require('crypto').randomBytes(32).toString('hex')
      });
    } else {
      // Update googleId and picture if not set
      if (!user.googleId) user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // Also sync to Customer collection so admin dashboard can see them
    let customer = await Customer.findOne({ email });
    if (!customer) {
      customer = await Customer.create({
        name,
        email,
        phone: '',
        picture: picture || ''
      });
    } else if (picture && !customer.picture) {
      customer.picture = picture;
      await customer.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Customer Google login error:', error.message);
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(401).json({
        success: false,
        message: 'Google token expired. Please try signing in again.'
      });
    }
    if (error.message && error.message.includes('Wrong number of segments')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token. Please try signing in again.'
      });
    }
    res.status(401);
    throw new Error('Google authentication failed. Please check your Google account and try again.');
  }
});

// @desc    Verify JWT token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = asyncHandler(async (req, res) => {
  // Token verification is handled by middleware
  // If we reach here, token is valid
  // Note: You may need to adjust this to your actual User model and query
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture
      }
    }
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // Note: You may need to adjust this to your actual User model and query
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // In a more sophisticated setup, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  googleCustomerLogin,
  verifyToken,
  getProfile,
  logoutUser
};