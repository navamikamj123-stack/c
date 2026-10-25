import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PlusCircle, 
  HandHeart, 
  CheckCircle, 
  MapPin, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];

export default function CommunityRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Create Request Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({
    title: '',
    category: 'Books',
    description: '',
    location: user?.location || 'Downtown Metro',
    urgency: 'Medium',
    imageUrl: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Offer Help Modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState('');
  const [offerError, setOfferError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCommunityRequests({
        category: category !== 'All' ? category : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      if (res.success) {
        setRequests(res.data);
      } else {
        setError(res.message || 'Failed to retrieve requests.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [category, statusFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setCreating(true);
    setCreateError('');
    try {
      const res = await api.createCommunityRequest(createData);
      if (res.success) {
        setShowCreateModal(false);
        setCreateData({
          title: '',
          category: 'Books',
          description: '',
          location: user?.location || 'Downtown Metro',
          urgency: 'Medium',
          imageUrl: '',
        });
        fetchRequests();
      } else {
        setCreateError(res.message || 'Failed to post request.');
      }
    } catch (err) {
      setCreateError(err.message || 'Network error.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenOffer = (req) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedRequest(req);
    setOfferMessage(`Hi ${req.requesterName}! I have a matching item in great condition that I can pass along to help.`);
    setOfferSuccess('');
    setOfferError('');
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSubmittingOffer(true);
    setOfferError('');
    setOfferSuccess('');

    try {
      const res = await api.offerHelp(selectedRequest._id, offerMessage);
      setOfferSuccess(res.message || 'Offer sent to neighbor!');
      setTimeout(() => {
        setSelectedRequest(null);
        fetchRequests();
      }, 1800);
    } catch (err) {
      setOfferError(err.message || 'Failed to submit offer.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleMarkFulfilled = async (id) => {
    try {
      await api.updateCommunityRequestStatus(id, 'Fulfilled');
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Could not update status.');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="section-tag">Mutual Aid & Sharing</span>
          <h1 className="display-6 fw-bold mb-1">Community Item Requests</h1>
          <p className="text-muted small mb-0">
            Browse items needed by neighbors, schools, and local groups, or post what you are looking for.
          </p>
        </div>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate('/login');
            } else {
              setShowCreateModal(true);
            }
          }}
          className="btn btn-eco-primary d-flex align-items-center gap-2"
        >
          <PlusCircle size={18} /> Post a Need
        </button>
      </div>

      {/* Filter row */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex gap-2 overflow-x-auto pb-1 flex-grow-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm rounded-pill px-3 text-nowrap ${
                category === cat ? 'btn-eco-primary' : 'btn-outline-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm bg-light"
            style={{ width: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open Needs</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Loading community requests...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center">
          <AlertCircle size={32} className="mb-2" />
          <h5>Unable to load requests</h5>
          <p className="small mb-2">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-4 shadow-sm">
          <HelpCircle size={48} className="text-muted mb-2" />
          <h4 className="fw-bold">No community requests in this category</h4>
          <p className="text-muted small mb-3">Be the first to post a community need or reset filters.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-sm btn-eco-primary">
            Post a Request
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((req) => {
            const isOwner = user && (user._id?.toString() === req.requester?.toString() || user.id?.toString() === req.requester?.toString());
            const isOpen = req.status === 'Open';

            return (
              <div key={req._id} className="col-lg-6">
                <div className="eco-card p-4 h-100 d-flex flex-column border">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2">
                      <span className="badge badge-eco-sand">{req.category}</span>
                      <span className={`badge ${req.urgency === 'High' ? 'bg-danger' : 'bg-secondary'}`}>
                        {req.urgency} Urgency
                      </span>
                    </div>

                    <div>
                      {isOpen ? (
                        <span className="badge bg-success bg-opacity-90">Open Need</span>
                      ) : (
                        <span className="badge bg-secondary">Fulfilled</span>
                      )}
                    </div>
                  </div>

                  <h4 className="fw-bold mb-2 text-dark">{req.title}</h4>

                  <p className="text-muted small flex-grow-1 mb-3" style={{ whiteSpace: 'pre-line' }}>
                    {req.description}
                  </p>

                  <div className="p-2 bg-light rounded-3 mb-3 d-flex flex-wrap justify-content-between text-muted small">
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-success" /> {req.location}
                    </span>
                    <span>Posted by <strong>{req.requesterName}</strong></span>
                  </div>

                  {/* Offers display */}
                  {req.offers && req.offers.length > 0 && (
                    <div className="p-2 rounded-3 bg-light border small mb-3">
                      <div className="fw-bold text-success d-flex align-items-center gap-1 mb-1">
                        <MessageSquare size={13} /> {req.offers.length} Community {req.offers.length === 1 ? 'Offer' : 'Offers'} Received
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                        Latest from {req.offers[req.offers.length - 1].donorName}: "{req.offers[req.offers.length - 1].message}"
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                    <small className="text-muted">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </small>

                    {isOwner ? (
                      <div className="d-flex gap-2">
                        {isOpen ? (
                          <button
                            onClick={() => handleMarkFulfilled(req._id)}
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                          >
                            <Check size={14} /> Mark as Fulfilled
                          </button>
                        ) : (
                          <span className="badge bg-light text-success border">✓ Fulfilled</span>
                        )}
                      </div>
                    ) : isOpen ? (
                      <button
                        onClick={() => handleOpenOffer(req)}
                        className="btn btn-sm btn-eco-primary d-flex align-items-center gap-1"
                      >
                        <HandHeart size={15} /> Offer Matching Item
                      </button>
                    ) : (
                      <span className="text-muted small">Fulfilled by community</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. Modal: Create Community Need */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <PlusCircle size={20} className="text-success" /> Post a Community Need
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>

              <div className="modal-body">
                {createError && <div className="alert alert-danger small py-2">{createError}</div>}

                <form onSubmit={handleCreateSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">What item do you need? *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Children's Science Storybooks or Clean Microwave"
                      required
                      value={createData.title}
                      onChange={(e) => setCreateData({ ...createData, title: e.target.value })}
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Category *</label>
                      <select
                        className="form-select"
                        value={createData.category}
                        onChange={(e) => setCreateData({ ...createData, category: e.target.value })}
                      >
                        {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-semibold">Urgency</label>
                      <select
                        className="form-select"
                        value={createData.urgency}
                        onChange={(e) => setCreateData({ ...createData, urgency: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High (Immediate Need)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description & Context *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      required
                      placeholder="Explain who will use this item, preferred condition or specifications..."
                      value={createData.description}
                      onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">General Location / Neighborhood *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Riverside Commons or Westend Center"
                      required
                      value={createData.location}
                      onChange={(e) => setCreateData({ ...createData, location: e.target.value })}
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() => setShowCreateModal(false)}
                      disabled={creating}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-eco-primary px-3" disabled={creating}>
                      {creating ? 'Posting...' : 'Publish Need'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Offer Help */}
      {selectedRequest && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <HandHeart size={20} className="text-success" /> Offer Item to {selectedRequest.requesterName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRequest(null)}></button>
              </div>

              <div className="modal-body">
                {offerSuccess ? (
                  <div className="text-center py-4">
                    <CheckCircle size={44} className="text-success mb-2" />
                    <h5 className="fw-bold">Offer Sent!</h5>
                    <p className="text-muted small">{offerSuccess}</p>
                  </div>
                ) : (
                  <form onSubmit={handleOfferSubmit}>
                    <p className="small text-muted mb-3">
                      Responding to: <strong>"{selectedRequest.title}"</strong> in {selectedRequest.location}.
                    </p>

                    {offerError && <div className="alert alert-danger small py-2">{offerError}</div>}

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Your Offer Message & Pickup Availability</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        placeholder="Describe the item you have and how the requester can collect it..."
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => setSelectedRequest(null)}
                        disabled={submittingOffer}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-sm btn-eco-primary px-3" disabled={submittingOffer}>
                        {submittingOffer ? 'Sending...' : 'Send Offer'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
