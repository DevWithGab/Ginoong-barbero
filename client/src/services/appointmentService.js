import api from './api';

// ============================================
// APPOINTMENT API SERVICES
// ============================================
export const appointmentAPI = {
  // Get all appointments with filtering and pagination
  getAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get single appointment by ID
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment status
  updateAppointment: async (id, updateData) => {
    const response = await api.patch(`/appointments/${id}`, updateData);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Get available time slots for booking
  getAvailableSlots: async (date, barberId) => {
    const response = await api.get('/appointments/available-slots', {
      params: { date, barberId }
    });
    return response.data;
  },

  // Get appointments for today's schedule
  getTodayAppointments: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await api.get('/appointments', {
      params: { date: today }
    });
    return response.data;
  },

  // Get appointments by status
  getAppointmentsByStatus: async (status, params = {}) => {
    const response = await api.get('/appointments', {
      params: { status, ...params }
    });
    return response.data;
  },

  // Get appointments by barber
  getAppointmentsByBarber: async (barberId, params = {}) => {
    const response = await api.get('/appointments', {
      params: { barberId, ...params }
    });
    return response.data;
  },

  // Get appointments by customer
  getAppointmentsByCustomer: async (customerId, params = {}) => {
    const response = await api.get('/appointments', {
      params: { customerId, ...params }
    });
    return response.data;
  },

  // Bulk update appointments
  bulkUpdateAppointments: async (appointmentIds, updateData) => {
    const promises = appointmentIds.map(id => 
      api.patch(`/appointments/${id}`, updateData)
    );
    const responses = await Promise.all(promises);
    return responses.map(response => response.data);
  },

  // Get appointment statistics
  getAppointmentStats: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    const appointments = response.data.data;
    
    return {
      total: appointments.length,
      pending: appointments.filter(apt => apt.status === 'Pending').length,
      confirmed: appointments.filter(apt => apt.status === 'Confirmed').length,
      completed: appointments.filter(apt => apt.status === 'Completed').length,
      cancelled: appointments.filter(apt => apt.status === 'Cancelled').length,
    };
  }
};