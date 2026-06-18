import api from './api';

// ============================================
// DASHBOARD API SERVICES
// ============================================
export const dashboardAPI = {
  // Get main dashboard metrics
  getDashboardMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period = 'month') => {
    const response = await api.get('/dashboard/revenue', {
      params: { period }
    });
    return response.data;
  },

  // Get appointment analytics
  getAppointmentAnalytics: async (period = 'month') => {
    const response = await api.get('/dashboard/appointments', {
      params: { period }
    });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async () => {
    const response = await api.get('/dashboard/customers');
    return response.data;
  },

  // Get today's schedule
  getTodaySchedule: async () => {
    const response = await api.get('/dashboard/today-schedule');
    return response.data;
  },

  // Get comprehensive dashboard data
  getDashboardData: async () => {
    try {
      const [metrics, revenue, appointments, customers, schedule] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/dashboard/revenue'),
        api.get('/dashboard/appointments'),
        api.get('/dashboard/customers'),
        api.get('/dashboard/today-schedule')
      ]);

      return {
        metrics: metrics.data,
        revenue: revenue.data,
        appointments: appointments.data,
        customers: customers.data,
        schedule: schedule.data
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get real-time metrics (for live updates)
  getRealTimeMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },

  // Get revenue by period
  getRevenueByPeriod: async (startDate, endDate) => {
    const response = await api.get('/appointments', {
      params: {
        startDate,
        endDate,
        paymentStatus: 'Paid'
      }
    });

    const appointments = response.data.data;
    const totalRevenue = appointments.reduce((sum, apt) => sum + apt.totalAmount, 0);
    
    return {
      totalRevenue,
      appointmentCount: appointments.length,
      averageTicket: appointments.length > 0 ? totalRevenue / appointments.length : 0,
      appointments
    };
  },

  // Get top performing services
  getTopServices: async (limit = 5, period = 'month') => {
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

    const response = await api.get('/services/popular', {
      params: { limit }
    });
    
    return response.data;
  },

  // Get appointment trends
  getAppointmentTrends: async (days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const response = await api.get('/appointments', {
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });

    const appointments = response.data.data;
    
    // Group appointments by date
    const trends = {};
    appointments.forEach(apt => {
      const date = new Date(apt.dateTime).toISOString().split('T')[0];
      if (!trends[date]) {
        trends[date] = { date, count: 0, revenue: 0 };
      }
      trends[date].count++;
      if (apt.paymentStatus === 'Paid') {
        trends[date].revenue += apt.totalAmount;
      }
    });

    return Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Get barber performance comparison
  getBarberPerformance: async (period = 'month') => {
    const response = await api.get('/dashboard/appointments', {
      params: { period }
    });
    
    return response.data.appointmentsByBarber || [];
  },

  // Get customer retention metrics
  getCustomerRetention: async () => {
    const response = await api.get('/dashboard/customers');
    return response.data.customerRetention || {};
  },

  // Get queue status (pending appointments)
  getQueueStatus: async () => {
    const response = await api.get('/appointments', {
      params: { status: 'Pending' }
    });
    
    return {
      pendingCount: response.data.data.length,
      pendingAppointments: response.data.data
    };
  },

  // Get daily summary
  getDailySummary: async (date = null) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const response = await api.get('/appointments', {
      params: { date: targetDate }
    });

    const appointments = response.data.data;
    
    return {
      date: targetDate,
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(apt => apt.status === 'Completed').length,
      pendingAppointments: appointments.filter(apt => apt.status === 'Pending').length,
      cancelledAppointments: appointments.filter(apt => apt.status === 'Cancelled').length,
      dailyRevenue: appointments
        .filter(apt => apt.paymentStatus === 'Paid')
        .reduce((sum, apt) => sum + apt.totalAmount, 0),
      appointments
    };
  }
};