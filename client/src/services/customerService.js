import api from './api';

// ============================================
// CUSTOMER API SERVICES
// ============================================
export const customerAPI = {
  // Get all customers with filtering and pagination
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  // Get single customer by ID with appointment history
  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Get customer statistics
  getCustomerStats: async () => {
    const response = await api.get('/customers/stats');
    return response.data;
  },

  // Search customers
  searchCustomers: async (searchTerm, params = {}) => {
    const response = await api.get('/customers', {
      params: { search: searchTerm, ...params }
    });
    return response.data;
  },

  // Get VIP customers
  getVIPCustomers: async (params = {}) => {
    const response = await api.get('/customers', {
      params: { isVIP: true, ...params }
    });
    return response.data;
  },

  // Get active customers
  getActiveCustomers: async (params = {}) => {
    const response = await api.get('/customers', {
      params: { status: 'Active', ...params }
    });
    return response.data;
  },

  // Get customers by tier
  getCustomersByTier: async (minSpent, params = {}) => {
    const response = await api.get('/customers', { params });
    const customers = response.data.data;
    
    return {
      ...response.data,
      data: customers.filter(customer => customer.totalSpent >= minSpent)
    };
  },

  // Toggle VIP status
  toggleVIPStatus: async (id, currentStatus) => {
    const response = await api.put(`/customers/${id}`, { 
      isVIP: !currentStatus 
    });
    return response.data;
  },

  // Update customer status
  updateCustomerStatus: async (id, status) => {
    const response = await api.put(`/customers/${id}`, { status });
    return response.data;
  },

  // Get customer appointment history
  getCustomerAppointments: async (customerId, params = {}) => {
    const response = await api.get('/appointments', {
      params: { customerId, ...params }
    });
    return response.data;
  },

  // Bulk update customers
  bulkUpdateCustomers: async (customerIds, updateData) => {
    const promises = customerIds.map(id => 
      api.put(`/customers/${id}`, updateData)
    );
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  },

  // Get testimonials
  getTestimonials: async (params = {}) => {
    try {
      const response = await api.get('/customers/testimonials', { params });
      return response.data?.data || [];
    } catch (error) {
      console.warn('Failed to fetch testimonials:', error);
      return [];
    }
  }
};