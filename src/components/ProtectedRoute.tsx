
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

  // If no specific roles are required, allow access
  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  // Check role-based access
  if (!isAuthorized(roles)) {
    // Determine where to redirect based on user role
    let redirectPath = '/';
    
    if (authState.role === 'admin') {
      redirectPath = '/admin-dashboard';
    } else if (authState.role === 'staff') {
      redirectPath = '/staff-panel';
    } else if (authState.role === 'user') {
      redirectPath = '/'; // Regular users go to home page
    }
    
    // Only redirect to unauthorized if trying to access a page not suitable for their role
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
