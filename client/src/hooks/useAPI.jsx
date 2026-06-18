import { useState, useEffect, useRef } from 'react';
import { appointmentAPI } from '../services/appointmentService';
import { dashboardAPI } from '../services/dashboardService';

// ============================================
// APPOINTMENTS HOOK
// ============================================
export const useAppointments = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsRef = useRef(JSON.stringify(params));

  useEffect(() => {
    if (params === null) {
      setLoading(false);
      return;
    }

    const paramsString = JSON.stringify(params);
    if (paramsString === paramsRef.current && data !== null) return;
    paramsRef.current = paramsString;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const result = await appointmentAPI.getAppointments(params);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch appointments');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [JSON.stringify(params)]);

  return { data, loading, error };
};

// ============================================
// DASHBOARD METRICS HOOK
// ============================================
export const useDashboardMetrics = (enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const result = await dashboardAPI.getDashboardMetrics();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard metrics');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [enabled]);

  return { data, loading, error };
};

// ============================================
// AVAILABLE SLOTS HOOK
// ============================================
export const useAvailableSlots = (date, barberId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date || !barberId) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        const result = await appointmentAPI.getAvailableSlots(date, barberId);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch available slots');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, barberId]);

  return { data, loading, error };
};

// ============================================
// REVENUE ANALYTICS HOOK
// ============================================
export const useRevenueAnalytics = (period = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await dashboardAPI.getRevenueAnalytics(period);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch revenue analytics');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { data, loading, error };
};

// ============================================
// APPOINTMENT ANALYTICS HOOK
// ============================================
export const useAppointmentAnalytics = (period = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await dashboardAPI.getAppointmentAnalytics(period);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch appointment analytics');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  return { data, loading, error };
};
