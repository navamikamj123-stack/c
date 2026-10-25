import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Search,
  RefreshCw,
  TrendingUp,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, usersRes, itemsRes, reportsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getItems(),
        api.getAdminReports(),
      ]);

      if (overviewRes.success) setOverview(overviewRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (itemsRes.success) setItems(itemsRes.data);
      if (reportsRes.success) setReports(reportsRes.data);
    } catch (err) {
      setError(err.message || 'Error fetching administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('As administrator, are you sure you want to delete this listing?')) return;
    try {
      await api.adminDeleteItem(itemId);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to remove listing.');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    const notes = prompt('Enter resolution notes for this report (optional):', 'Reviewed and handled by admin.');
    try {
      await api.resolveAdminReport(reportId, { status, resolutionNotes: notes || '' });
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update report.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted small mt-2">Loading administrative portal...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="p-3 text-white rounded-3 shadow-sm"
            style={{ backgroundColor: 'var(--eco-forest)' }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <span className="badge bg-warning text-dark mb-1">Administrative Privileges</span>
            <h1 className="h3 fw-bold mb-0">Platform Moderation & System Admin</h1>
            <small className="text-muted">Oversee registered users, enforce safety rules, and moderate community content.</small>
          </div>
        </div>

        <button onClick={loadAdminData} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

      {/* KPI Cards Strip */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
              <span>Total Users</span>
              <Users size={16} className="text-primary" />
            </div>
            <div className="stat-number">{overview?.totalUsers || users.length}</div>
            <div className="stat-label">Registered Accounts</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
              <span>Listings</span>
              <Package size={16} className="text-success" />
            </div>
            <div className="stat-number">{overview?.totalListings || items.length}</div>
            <div className="stat-label">Total Donations</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
              <span>Exchanges</span>
              <CheckCircle2 size={16} className="text-success" />
            </div>
            <div className="stat-number">{overview?.completedExchanges || 0}</div>
            <div className="stat-label">Rehomed Items</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
              <span>Pending Reports</span>
              <AlertTriangle size={16} className="text-danger" />
            </div>
            <div className="stat-number text-danger">{overview?.pendingReports || 0}</div>
            <div className="stat-label">Content Flags</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom pb-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            activeTab === 'overview' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          Reports & Moderation ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            activeTab === 'listings' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          Manage All Listings ({items.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            activeTab === 'users' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          Registered Members ({users.length})
        </button>
      </div>

      {/* Tab 1: Moderation Reports */}
      {activeTab === 'overview' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <AlertTriangle size={20} className="text-warning" /> Flagged Community Content Reports
          </h5>

          {reports.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No reported content. Community guidelines are being followed!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr className="small text-muted">
                    <th>Target Type</th>
                    <th>Item / Request Title</th>
                    <th>Reporter</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <span className="badge bg-light text-dark border">{r.targetType}</span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{r.targetTitle}</div>
                        <small className="text-muted">ID: {r.targetId}</small>
                      </td>
                      <td>
                        <div className="small">{r.reporterName}</div>
                      </td>
                      <td>
                        <div className="small text-secondary" style={{ maxWidth: '280px' }}>{r.reason}</div>
                        {r.resolutionNotes && (
                          <small className="text-success d-block">Note: {r.resolutionNotes}</small>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          r.status === 'Pending' ? 'bg-danger' : r.status === 'Reviewed' ? 'bg-success' : 'bg-secondary'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {r.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleResolveReport(r._id, 'Reviewed')}
                                className="btn btn-sm btn-outline-success py-0 px-2 small"
                                title="Mark as Reviewed & Safe"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleResolveReport(r._id, 'Dismissed')}
                                className="btn btn-sm btn-outline-secondary py-0 px-2 small"
                                title="Dismiss Report"
                              >
                                Dismiss
                              </button>
                            </>
                          ) : (
                            <span className="text-muted small">Handled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage All Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Package size={20} className="text-success" /> All Platform Donation Listings
          </h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr className="small text-muted">
                  <th>Listing</th>
                  <th>Category</th>
                  <th>Donor</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id}>
                    <td>
                      <div className="fw-semibold text-dark">{i.title}</div>
                      <small className="text-muted">Cond: {i.condition} • ~{i.estimatedWasteDivertedKg || 2}kg</small>
                    </td>
                    <td>
                      <span className="badge badge-eco-sand small">{i.category}</span>
                    </td>
                    <td>
                      <div className="small fw-semibold">{i.donorName}</div>
                      <small className="text-muted">{i.donorEmail}</small>
                    </td>
                    <td className="small">{i.location}</td>
                    <td>
                      <span className={`badge ${
                        i.status === 'Available' ? 'bg-success' : i.status === 'Completed' ? 'bg-secondary' : 'bg-warning text-dark'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="small text-muted">{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/items/${i._id}`} className="btn btn-sm btn-outline-secondary py-0 px-2 small">
                          <Eye size={12} />
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(i._id)}
                          className="btn btn-sm btn-outline-danger py-0 px-2 small"
                          title="Remove Listing"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Registered Users */}
      {activeTab === 'users' && (
        <div className="bg-white p-4 rounded-4 border shadow-sm">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Users size={20} className="text-primary" /> Registered Community Members
          </h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr className="small text-muted">
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Area</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="fw-semibold text-dark">{u.name}</div>
                    </td>
                    <td className="small">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'badge-eco-green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="small text-muted">{u.location || 'Local Community'}</td>
                    <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
