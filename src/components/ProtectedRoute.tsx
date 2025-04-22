
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Authentication and authorization checks are disabled for demo mode.
  return <>{children}</>;
};

export default ProtectedRoute;

