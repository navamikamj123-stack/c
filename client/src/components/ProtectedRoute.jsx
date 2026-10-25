import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 rounded-4 shadow-sm">
          <h4 className="fw-bold mb-2">Access Restricted</h4>
          <p className="mb-3">You need administrator privileges to access this dashboard.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
