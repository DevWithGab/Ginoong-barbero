import api from './api';

// ============================================
// BARBER API SERVICES
// ============================================
export const barberAPI = {
  // Get all barbers with statistics
  getBarbers: async (params = {}) => {
    const response = await api.get('/barbers', { params });
    return response.data;
  },

  // Get single barber by ID with statistics
  getBarber: async (id) => {
    const response = await api.get(`/barbers/${id}`);
    return response.data;
  },

  // Create new barber
  createBarber: async (formData) => {
    const response = await api.post('/barbers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update barber
  updateBarber: async (id, formData) => {
    const response = await api.put(`/barbers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete barber
  deleteBarber: async (id) => {
    const response = await api.delete(`/barbers/${id}`);
    return response.data;
  },

  // Get barber availability for a specific date
  getBarberAvailability: async (id, date) => {
    const response = await api.get(`/barbers/${id}/availability`, {
      params: { date }
    });
    return response.data;
  },

  // Get active barbers only
  getActiveBarbers: async (params = {}) => {
    const response = await api.get('/barbers', {
      params: { status: 'Active', ...params }
    });
    return response.data;
  },

  // Get barbers by role
  getBarbersByRole: async (role, params = {}) => {
    const response = await api.get('/barbers', {
      params: { role, ...params }
    });
    return response.data;
  },

  // Get barber appointments
  getBarberAppointments: async (barberId, params = {}) => {
    const response = await api.get('/appointments', {
      params: { barberId, ...params }
    });
    return response.data;
  },

  // Get barber schedule for a date range
  getBarberSchedule: async (barberId, startDate, endDate) => {
    const response = await api.get('/appointments', {
      params: { 
        barberId,
        startDate,
        endDate,
        sortBy: 'dateTime',
        sortOrder: 'asc'
      }
    });
    return response.data;
  },

  // Update barber status
  updateBarberStatus: async (id, status) => {
    const response = await api.put(`/barbers/${id}`, { status });
    return response.data;
  },

  // Update barber working hours
  updateWorkingHours: async (id, workingHours) => {
    const response = await api.put(`/barbers/${id}`, { workingHours });
    return response.data;
  },

  // Update barber working days
  updateWorkingDays: async (id, workingDays) => {
    const response = await api.put(`/barbers/${id}`, { workingDays });
    return response.data;
  },

  // Get barber performance metrics
  getBarberPerformance: async (barberId, period = 'month') => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    const response = await api.get('/appointments', {
      params: {
        barberId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });

    const appointments = response.data.data;
    
    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(apt => apt.status === 'Completed').length,
      cancelledAppointments: appointments.filter(apt => apt.status === 'Cancelled').length,
      totalRevenue: appointments
        .filter(apt => apt.paymentStatus === 'Paid')
        .reduce((sum, apt) => sum + apt.totalAmount, 0),
      averageRating: 0, // Can be implemented when rating system is added
      completionRate: appointments.length > 0 
        ? (appointments.filter(apt => apt.status === 'Completed').length / appointments.length) * 100 
        : 0
    };
  },

  // Toggle barber status
  toggleBarberStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const response = await api.put(`/barbers/${id}`, { status: newStatus });
    return response.data;
  },

  // Bulk update barbers
  bulkUpdateBarbers: async (barberIds, updateData) => {
    const promises = barberIds.map(id => 
      api.put(`/barbers/${id}`, updateData)
    );
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  }
};