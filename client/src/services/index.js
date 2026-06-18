// ============================================
// GINOONG BARBERO API SERVICES INDEX
// ============================================

// Base API configuration
export { default as api } from './api';

// Service APIs
export { appointmentAPI } from './appointmentService';
export { serviceAPI } from './serviceMenu';
export { customerAPI } from './customerService';
export { barberAPI } from './barberService';
export { dashboardAPI } from './dashboardService';
export { authAPI, authUtils } from './authService';

// Convenience exports for common operations
export const bookingAPI = {
  // Complete booking flow
  getAvailableServices: () => serviceAPI.getActiveServices(),
  getAvailableBarbers: () => barberAPI.getActiveBarbers(),
  getAvailableSlots: (date, barberId) => appointmentAPI.getAvailableSlots(date, barberId),
  createBooking: (bookingData) => appointmentAPI.createAppointment(bookingData),
  
  // Booking wizard helpers
  getServiceCategories: () => serviceAPI.getServiceCategories(),
  getServicesByCategory: (category) => serviceAPI.getServicesByCategory(category),
  getBarberAvailability: (barberId, date) => barberAPI.getBarberAvailability(barberId, date)
};

export const adminAPI = {
  // Admin dashboard
  getDashboardData: () => dashboardAPI.getDashboardData(),
  getTodaySchedule: () => dashboardAPI.getTodaySchedule(),
  getPendingAppointments: () => appointmentAPI.getAppointmentsByStatus('Pending'),
  
  // Queue management
  approveAppointment: (id) => appointmentAPI.updateAppointment(id, { status: 'Confirmed' }),
  cancelAppointment: (id) => appointmentAPI.updateAppointment(id, { status: 'Cancelled' }),
  completeAppointment: (id) => appointmentAPI.updateAppointment(id, { status: 'Completed' }),
  
  // Bulk operations
  bulkApproveAppointments: (ids) => appointmentAPI.bulkUpdateAppointments(ids, { status: 'Confirmed' }),
  bulkCancelAppointments: (ids) => appointmentAPI.bulkUpdateAppointments(ids, { status: 'Cancelled' })
};

// Error handling utilities
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return {
          type: 'validation',
          message: data.message || 'Invalid request data',
          details: data.details || null
        };
      case 401:
        return {
          type: 'auth',
          message: 'Authentication required',
          details: null
        };
      case 403:
        return {
          type: 'permission',
          message: 'Permission denied',
          details: null
        };
      case 404:
        return {
          type: 'notFound',
          message: data.message || 'Resource not found',
          details: null
        };
      case 409:
        return {
          type: 'conflict',
          message: data.message || 'Resource conflict',
          details: null
        };
      case 500:
        return {
          type: 'server',
          message: 'Internal server error',
          details: null
        };
      default:
        return {
          type: 'unknown',
          message: data.message || 'An unexpected error occurred',
          details: null
        };
    }
  } else if (error.request) {
    // Network error
    return {
      type: 'network',
      message: 'Network error - please check your connection',
      details: null
    };
  } else {
    // Other error
    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred',
      details: null
    };
  }
};

// Response data extractors
export const extractData = (response) => response.data;
export const extractPaginatedData = (response) => ({
  data: response.data,
  pagination: response.pagination
});

// Common query parameter builders
export const buildQueryParams = (filters = {}) => {
  const params = {};
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params[key] = filters[key];
    }
  });
  
  return params;
};

export const buildPaginationParams = (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => ({
  page,
  limit,
  sortBy,
  sortOrder
});

// Date utilities for API calls
export const formatDateForAPI = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

export const formatDateTimeForAPI = (dateTime) => {
  if (!dateTime) return null;
  return new Date(dateTime).toISOString();
};

// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateAppointmentData = (data) => {
  const errors = {};
  
  if (!data.customerInfo?.name) errors.customerName = 'Customer name is required';
  if (!data.customerInfo?.email) errors.customerEmail = 'Customer email is required';
  else if (!validateEmail(data.customerInfo.email)) errors.customerEmail = 'Invalid email format';
  if (!data.customerInfo?.phone) errors.customerPhone = 'Customer phone is required';
  else if (!validatePhone(data.customerInfo.phone)) errors.customerPhone = 'Invalid phone format';
  if (!data.serviceId) errors.service = 'Service selection is required';
  if (!data.barberId) errors.barber = 'Barber selection is required';
  if (!data.dateTime) errors.dateTime = 'Date and time selection is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};