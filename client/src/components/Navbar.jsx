import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  PlusCircle, 
  Compass, 
  MapPin, 
  BarChart3, 
  Users, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Database
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, storageStatus } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-eco py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeMenu}>
          <div 
            className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
            style={{ width: '40px', height: '40px', backgroundColor: 'var(--eco-primary)' }}
          >
            <Leaf size={22} />
          </div>
          <div className="d-flex flex-column">
            <span className="brand-font fs-4 lh-1 text-dark">EcoConnect</span>
            <small style={{ fontSize: '0.72rem', color: 'var(--eco-sage)', fontWeight: '600', letterSpacing: '0.02em' }}>
              Give More • Waste Less
            </small>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="navbar-toggler border-0 shadow-none p-1" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={26} color="var(--eco-forest)" /> : <Menu size={26} color="var(--eco-forest)" />}
        </button>

        {/* Collapsible Nav Links */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show mt-3 mt-lg-0' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link nav-link-eco" onClick={closeMenu}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className="nav-link nav-link-eco d-flex align-items-center gap-1" onClick={closeMenu}>
                <Compass size={16} /> Explore Items
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/donate" className="nav-link nav-link-eco d-flex align-items-center gap-1" onClick={closeMenu}>
                <PlusCircle size={16} /> Donate an Item
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/community-requests" className="nav-link nav-link-eco d-flex align-items-center gap-1" onClick={closeMenu}>
                <Users size={16} /> Community Needs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/recycling-map" className="nav-link nav-link-eco d-flex align-items-center gap-1" onClick={closeMenu}>
                <MapPin size={16} /> Recycling Map
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/impact" className="nav-link nav-link-eco d-flex align-items-center gap-1" onClick={closeMenu}>
                <BarChart3 size={16} /> Impact
              </NavLink>
            </li>
          </ul>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 fw-semibold rounded-pill px-3 py-1"
                    onClick={closeMenu}
                  >
                    <ShieldCheck size={16} /> Admin Portal
                  </Link>
                )}

                <Link 
                  to="/profile" 
                  className="btn btn-sm btn-eco-outline-green d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                  onClick={closeMenu}
                >
                  <User size={16} /> {user?.name?.split(' ')[0] || 'Profile'}
                </Link>

                <button 
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3 py-1"
                  title="Log out"
                >
                  <LogOut size={15} /> Exit
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-eco-secondary px-3" onClick={closeMenu}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-sm btn-eco-primary px-3" onClick={closeMenu}>
                  Register Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
