import api from './api';

// ============================================
// GOOGLE OAUTH AUTHENTICATION SERVICE
// ============================================
export const authAPI = {
  // Google OAuth login
  googleLogin: async (googleToken) => {
    const response = await api.post('/auth/google', { token: googleToken });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role || 'barber');
      
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
      // Clear local storage regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Remove auth header
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Verify token validity
  verifyToken: async () => {
    const token = localStorage.getItem('token');
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
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole') || 'customer';
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authUtils.getUserRole();
    return userRole === role;
  },

  // Check if user is admin
  isAdmin: () => {
    return authUtils.hasRole('admin');
  },

  // Check if user is barber
  isBarber: () => {
    return authUtils.hasRole('barber');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Set up auth header for API calls
  setupAuthHeader: () => {
    const token = authUtils.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header on app start
authUtils.setupAuthHeader();