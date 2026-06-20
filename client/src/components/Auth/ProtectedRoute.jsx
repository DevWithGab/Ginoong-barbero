import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../UI/LoadingSpinner';

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
export const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/admin/login',
  fallback = null 
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ============================================
// ADMIN PROTECTED ROUTE
// ============================================
export const AdminRoute = ({ children, fallback = null }) => {
  return (
    <ProtectedRoute 
      requiredRole="admin" 
      redirectTo="/admin/login"
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
};

// ============================================
// BARBER PROTECTED ROUTE (admin only now)
// ============================================
export const BarberRoute = ({ children, fallback = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ============================================
// PUBLIC ROUTE (redirect if authenticated)
// ============================================
export const PublicRoute = ({ 
  children, 
  redirectTo = '/admin',
  restrictWhenAuthenticated = false 
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect authenticated users away from login pages
  if (restrictWhenAuthenticated && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// ============================================
// ROLE CHECKER COMPONENT
// ============================================
export const RoleChecker = ({ 
  allowedRoles = [], 
  children, 
  fallback = null,
  showFallback = true 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return showFallback ? (fallback || <LoadingSpinner />) : null;
  }

  if (!user) {
    return showFallback ? (fallback || <div>Access denied</div>) : null;
  }

  const hasAccess = allowedRoles.includes(user.role) || user.role === 'admin';

  if (!hasAccess) {
    return showFallback ? (fallback || <div>Insufficient permissions</div>) : null;
  }

  return children;
};

export default ProtectedRoute;