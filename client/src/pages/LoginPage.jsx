import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Leaf, Sparkles, Mail, Lock, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/explore';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
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
              <h2 className="fw-bold mb-1">Welcome Back</h2>
              <p className="text-muted small">Log in to manage donations, requests, and impact.</p>
            </div>

            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-eco-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
                disabled={loading}
              >
                <LogIn size={18} /> {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Credentials Box for College Evaluators */}
            <div className="p-3 bg-light rounded-3 border mb-3">
              <div className="d-flex align-items-center gap-1 text-muted small fw-bold mb-2">
                <Sparkles size={14} className="text-warning" /> Quick-Fill Demo Credentials (1-Click):
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@ecoconnect.org', 'admin123')}
                  className="btn btn-sm btn-outline-warning text-dark w-50 py-1 small fw-semibold"
                >
                  <ShieldCheck size={13} className="text-warning" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('sarah@ecoconnect.org', 'ecopass123')}
                  className="btn btn-sm btn-outline-success text-dark w-50 py-1 small fw-semibold"
                >
                  <User size={13} className="text-success" /> Member
                </button>
              </div>
            </div>

            <div className="text-center small text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-success fw-bold">
                Register Free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
