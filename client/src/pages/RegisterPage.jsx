import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Leaf, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location || 'Local Community',
      });
      navigate('/explore');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
            <div className="text-center mb-4">
              <div 
                className="d-inline-flex align-items-center justify-content-center text-white rounded-3 mb-2 shadow-sm"
                style={{ width: '48px', height: '48px', backgroundColor: 'var(--eco-primary)' }}
              >
                <Leaf size={24} />
              </div>
              <h2 className="fw-bold mb-1">Create an Account</h2>
              <p className="text-muted small">Join EcoConnect and build a zero-waste community.</p>
            </div>

            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <User size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    required
                    placeholder="alex@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Neighborhood / Pickup Area</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <MapPin size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Maplewood North"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password (min 6 characters) *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Confirm Password *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-eco-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={loading}
              >
                <UserPlus size={18} /> {loading ? 'Registering...' : 'Complete Free Registration'}
              </button>
            </form>

            <div className="text-center small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-success fw-bold">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
