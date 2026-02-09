import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if role not allowed
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : 
                         user.role === 'staff' ? '/staff/orders' : '/menu';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
