import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { UserRole } from '../../types/dhostAuth';
import { AccessRestrictedScreen } from './AccessRestrictedScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ['COMMANDER', 'RESCUE_TEAM', 'MEDICAL']
}) => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useDhostAuth();


  // 1. If not authenticated at all, unobtrusively redirect to responder login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/responder/login" state={{ from: location }} replace />;
  }

  // 2. If role is not authorized for this route
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <AccessRestrictedScreen
        requiredRole={allowedRoles[0]}
        attemptedPath={location.pathname}
      />
    );
  }

  return <>{children}</>;
};
