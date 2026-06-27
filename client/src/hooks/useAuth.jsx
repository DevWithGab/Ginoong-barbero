import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authAPI, authUtils } from '../services/authService';

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authUtils.isAuthenticated()) {
          const currentUser = authUtils.getCurrentUser();
          setUser(currentUser);
          // Verify token in background (non-blocking)
          authAPI.verifyToken().catch(() => {
            // Token invalid - clear auth silently
            authUtils.clearAuth();
            setUser(null);
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        authUtils.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Email/password login
  const loginWithEmail = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);
      const userData = response.data.user;
      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Google login function
  const loginWithGoogle = useCallback(async (googleToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.googleLogin(googleToken);
      const userData = response.data.user;
      setUser(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync user from localStorage (for customer Google login)
  const syncUserFromStorage = useCallback(() => {
    const currentUser = authUtils.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authUtils.clearAuth();
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    loginWithEmail,
    loginWithGoogle,
    syncUserFromStorage,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBarber: false,
    hasRole: (role) => user?.role === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// MAIN AUTH HOOK
// ============================================
export const useAuth = () => {
  return useAuthContext();
};

// ============================================
// GOOGLE LOGIN HOOK
// ============================================
export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithGoogle = useCallback(async (googleToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.googleLogin(googleToken);
      setLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return { loginWithGoogle, loading, error };
};

// ============================================
// ROLE-BASED ACCESS HOOKS
// ============================================
export const useRoleAccess = (requiredRole) => {
  const { user } = useAuth();
  
  const hasAccess = user?.role === requiredRole || user?.role === 'admin';
  const isLoading = !user && authUtils.isAuthenticated();
  
  return { hasAccess, isLoading };
};

export const useAdminAccess = () => {
  return useRoleAccess('admin');
};

export const useBarberAccess = () => {
  const { user } = useAuth();
  
  const hasAccess = user?.role === 'admin';
  const isLoading = !user && authUtils.isAuthenticated();
  
  return { hasAccess, isLoading };
};