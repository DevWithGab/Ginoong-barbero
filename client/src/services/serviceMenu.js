import api from './api';

// ============================================
// SERVICE MENU API SERVICES
// ============================================
export const serviceAPI = {
  // Get all services with filtering
  getServices: async (params = {}) => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  // Get single service by ID
  getService: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category) => {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  },

  // Get all service categories
  getServiceCategories: async () => {
    const response = await api.get('/services/categories');
    return response.data;
  },

  // Get popular services
  getPopularServices: async (limit = 5) => {
    const response = await api.get('/services/popular', {
      params: { limit }
    });
    return response.data;
  },

  // Get active services only
  getActiveServices: async (params = {}) => {
    const response = await api.get('/services', {
      params: { status: 'Active', ...params }
    });
    return response.data;
  },

  // Search services
  searchServices: async (searchTerm, params = {}) => {
    const response = await api.get('/services', {
      params: { search: searchTerm, ...params }
    });
    return response.data;
  },

  // Get services with statistics
  getServicesWithStats: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Bulk update services
  bulkUpdateServices: async (serviceIds, updateData) => {
    const promises = serviceIds.map(id => 
      api.put(`/services/${id}`, updateData)
    );
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  },

  // Toggle service status
  toggleServiceStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const response = await api.put(`/services/${id}`, { status: newStatus });
    return response.data;
  }
};