
import api from './api';
import { authStorage } from './authStorage';

// ============================================

// AUTHENTICATION SERVICE
// ============================================
export const authAPI = {



  // Login with email/password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    if (response.data.success) {
      const { token, user } = response.data.data;

      authStorage.setToken(token, user.role);
      authStorage.setUser(user, user.role);
      authStorage.setUserRole(user.role);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    }

    throw new Error(response.data.message || 'Login failed');
  },




  // Google OAuth login (admin only)
  googleLogin: async (googleToken) => {
    const response = await api.post('/auth/google', { token: googleToken });

    if (response.data.success) {
      const { token, user } = response.data.data;

      authStorage.setToken(token, user.role);
      authStorage.setUser(user, user.role);
      authStorage.setUserRole(user.role);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    }

    throw new Error(response.data.message || 'Login failed');
  },






















































































  // Google OAuth login for customers (any account)
  googleCustomerLogin: async (googleToken) => {
    const response = await api.post('/auth/google-customer', { token: googleToken });

    if (response.data.success) {
      const { token, user } = response.data.data;

      authStorage.setToken(token, user.role);
      authStorage.setUser(user, user.role);
      authStorage.setUserRole(user.role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    }

    throw new Error(response.data.message || 'Login failed');
  },



  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      authStorage.clearAll();
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Verify token validity
  verifyToken: async () => {
    const token = authStorage.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// ============================================
// AUTH UTILITIES
// ============================================
export const authUtils = {
  isAuthenticated: () => authStorage.isAuthenticated(),

  getCurrentUser: () => authStorage.getUser(),

  getUserRole: () => authStorage.getUserRole(),

  hasRole: (role) => authStorage.getUserRole() === role,

  isAdmin: () => authStorage.isAdmin(),

  getToken: () => authStorage.getToken(),

  setupAuthHeader: () => {
    const token = authStorage.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  clearAuth: () => {
    authStorage.clearAll();
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header on app start
authUtils.setupAuthHeader();
