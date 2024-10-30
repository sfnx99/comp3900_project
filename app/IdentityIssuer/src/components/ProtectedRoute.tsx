import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const getToken = () => {
  return localStorage.getItem('token');
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;