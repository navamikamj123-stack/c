import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container py-5 text-center my-5">
      <div className="p-3 bg-light rounded-circle d-inline-flex mb-3 text-success">
        <Leaf size={48} />
      </div>
      <h1 className="display-4 fw-bold">404</h1>
      <h3 className="fw-bold mb-2">Page Not Found</h3>
      <p className="text-muted mb-4">The sustainability resource you are looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-eco-primary d-inline-flex align-items-center gap-2">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
}
