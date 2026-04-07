import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { token, role } = useAuthStore();

  // If there is no token or role, go back to login
  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  // If roles are restricted and current role is not allowed
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
