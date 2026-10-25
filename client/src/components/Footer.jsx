import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Database, ShieldCheck, Mail, MapPin, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { storageStatus } = useAuth();
  const [showDbModal, setShowDbModal] = useState(false);

  return (
    <footer className="footer-eco">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Col 1: About EcoConnect */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div 
                className="d-flex align-items-center justify-content-center text-white rounded-3"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--eco-primary)' }}
              >
                <Leaf size={20} />
              </div>
              <span className="brand-font fs-4 text-white">EcoConnect</span>
            </div>
            <p className="small text-light-50 mb-3" style={{ opacity: 0.85, lineHeight: 1.7 }}>
              EcoConnect is a modern community sustainability platform dedicated to circular living.
              We connect generous donors with neighbors in need, map local recycling depots, and quantify
              our collective environmental impact.
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 px-2 py-1 small">
                College Project Presentation Edition
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/explore">Available Items</Link></li>
              <li><Link to="/donate">Donate an Item</Link></li>
              <li><Link to="/community-requests">Community Needs</Link></li>
              <li><Link to="/recycling-map">Recycling Map</Link></li>
              <li><Link to="/impact">Impact Dashboard</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources & Trust */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Trust & Mission</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><span className="text-light-50" style={{ opacity: 0.85 }}>Zero Waste Initiative</span></li>
              <li><span className="text-light-50" style={{ opacity: 0.85 }}>EPA WARM Model Metrics</span></li>
              <li><span className="text-light-50" style={{ opacity: 0.85 }}>Community Verification</span></li>
              <li><span className="text-light-50" style={{ opacity: 0.85 }}>Privacy & Neighborhood Safety</span></li>
              <li><Link to="/admin">Administrator Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Database Status & Tech Stack */}
          <div className="col-lg-3 col-md-12">
            <h6 className="text-white fw-bold mb-3">System Persistence</h6>
            <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-white fw-semibold d-flex align-items-center gap-1">
                  <Database size={15} color="var(--eco-primary)" /> Storage Engine:
                </span>
                {storageStatus?.connected ? (
                  <span className="badge bg-success text-white">● MongoDB Live</span>
                ) : (
                  <span className="badge bg-warning text-dark">● Dev Fallback Active</span>
                )}
              </div>
              <p className="small text-light-50 mb-2" style={{ fontSize: '0.78rem', opacity: 0.8 }}>
                {storageStatus?.connected
                  ? 'Application is persisting data directly into MongoDB.'
                  : 'Running seamless file-backed local JSON storage with real persistence.'}
              </p>
              <button 
                onClick={() => setShowDbModal(true)} 
                className="btn btn-sm btn-link text-white p-0 small text-decoration-underline"
                style={{ fontSize: '0.8rem' }}
              >
                View Database & MongoDB Setup Guide
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Bottom bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 pt-3 small text-light-50" style={{ opacity: 0.75 }}>
          <div>
            © {new Date().getFullYear()} EcoConnect – Give More, Waste Less. Built with MERN Stack.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Designed for social impact & college presentation</span>
          </div>
        </div>
      </div>

      {/* Database Setup Guide Modal */}
      {showDbModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Database size={20} color="var(--eco-primary)" /> Database & Storage Status
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDbModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-success d-flex align-items-start gap-2 mb-3">
                  <Info size={20} className="flex-shrink-0 mt-1" />
                  <div className="small">
                    <strong>Current Mode:</strong> {storageStatus?.type || 'Active'}
                    <br />
                    {storageStatus?.note}
                  </div>
                </div>

                <h6 className="fw-bold mb-2">How to connect MongoDB:</h6>
                <ol className="small ps-3 mb-3 text-muted">
                  <li>Install MongoDB Community Server or create a free MongoDB Atlas cloud cluster.</li>
                  <li>In <code>server/.env</code>, verify your connection string:
                    <pre className="p-2 bg-light rounded mt-1 mb-1">MONGODB_URI=mongodb://127.0.0.1:27017/ecoconnect</pre>
                  </li>
                  <li>Restart the backend server. The app automatically detects MongoDB and saves all records directly!</li>
                </ol>
                <div className="p-2 bg-light rounded small text-muted">
                  <strong>Notice:</strong> When MongoDB is not running locally, the built-in development fallback engine guarantees that all CRUD operations, user accounts, listings, and requests persist flawlessly to disk.
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-eco-primary btn-sm px-4" onClick={() => setShowDbModal(false)}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
