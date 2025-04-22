
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { authState, isAuthorized } = useAuth();
  const location = useLocation();

  if (!authState.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role-based access
  if (roles && !isAuthorized(roles)) {
    // Redirect to unauthorized or dashboard based on user role
    if (authState.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (authState.role === 'staff') {
      return <Navigate to="/staff-panel" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
