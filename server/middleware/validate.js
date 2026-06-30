const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['admin', 'staff', 'customer']).withMessage('Invalid role'),
  handleValidation
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const validateGoogleLogin = [
  body('token').trim().notEmpty().withMessage('Google token is required'),
  handleValidation
];

const validateAppointment = [
  body('customerInfo.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('customerInfo.phone').optional().matches(/^[\d\s\-+()]*$/).withMessage('Invalid phone number'),
  body('serviceId').isMongoId().withMessage('Invalid service ID'),
  body('barberId').optional().isMongoId().withMessage('Invalid barber ID'),
  body('dateTime').isISO8601().withMessage('Valid date/time is required'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidation
];

const validateAppointmentUpdate = [
  param('id').isMongoId().withMessage('Invalid appointment ID'),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  handleValidation
];

const validateService = [
  body('name').trim().notEmpty().withMessage('Service name is required').isLength({ max: 100 }),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }),
  body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  body('category').optional().trim().isLength({ max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  handleValidation
];

const validateBarber = [
  body('name').trim().notEmpty().withMessage('Barber name is required').isLength({ max: 100 }),
  body('role').optional().trim().isLength({ max: 50 }),
  body('specialties').optional().isArray(),
  body('languages').optional().isArray(),
  handleValidation
];

const validateCustomer = [
  body('name').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('phone').optional().matches(/^[\d\s\-+()]*$/).withMessage('Invalid phone number'),
  handleValidation
];

const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  handleValidation
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidation
];

module.exports = {
  handleValidation,
  validateRegistration,
  validateLogin,
  validateGoogleLogin,
  validateAppointment,
  validateAppointmentUpdate,
  validateService,
  validateBarber,
  validateCustomer,
  validateMongoId,
  validatePagination
};
