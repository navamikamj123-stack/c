import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Edit3, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Inbox, 
  Send, 
  HelpCircle,
  Trash2,
  Check,
  History
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('listings');

  // Data states
  const [myItems, setMyItems] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);
  const [myCommunityReqs, setMyCommunityReqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [itemsRes, requestsRes, commRes] = await Promise.all([
        api.getItems({ donor: user?._id || user?.id }).catch(() => ({ data: [] })),
        api.getMyRequests().catch(() => ({ asDonor: [], asRequester: [] })),
        api.getCommunityRequests({ requester: user?._id || user?.id }).catch(() => ({ data: [] })),
      ]);

      if (itemsRes.success) setMyItems(itemsRes.data);
      if (requestsRes.success) {
        setRequestsReceived(requestsRes.asDonor || []);
        setRequestsSent(requestsRes.asRequester || []);
      }
      if (commRes.success) setMyCommunityReqs(commRes.data);
    } catch (err) {
      console.error('Failed to load user activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
      setProfileForm({
        name: user.name || '',
        location: user.location || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await updateUserProfile(profileForm);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setShowEditProfile(false), 1400);
    } catch (err) {
      setProfileMsg(err.message || 'Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      await api.respondToRequest(requestId, status);
      loadUserData();
    } catch (err) {
      alert(err.message || 'Error responding to request.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this donation listing?')) return;
    try {
      await api.deleteItem(itemId);
      loadUserData();
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
    }
  };

  return (
    <div className="container py-4">
      {/* User Header Profile Card */}
      <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm mb-4">
        <div className="row align-items-center g-4">
          <div className="col-auto">
            <div 
              className="d-flex align-items-center justify-content-center text-white rounded-circle shadow"
              style={{ width: '84px', height: '84px', backgroundColor: 'var(--eco-primary)', fontSize: '2rem', fontWeight: 'bold' }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
              <h2 className="fw-bold mb-0 text-dark">{user?.name}</h2>
              <span className="badge badge-eco-green text-capitalize">{user?.role || 'Member'}</span>
            </div>

            <div className="d-flex flex-wrap gap-3 text-muted small mb-2">
              <span className="d-flex align-items-center gap-1">
                <Mail size={14} className="text-success" /> {user?.email}
              </span>
              <span className="d-flex align-items-center gap-1">
                <MapPin size={14} className="text-success" /> {user?.location || 'Community District'}
              </span>
              {user?.phone && (
                <span className="d-flex align-items-center gap-1">
                  <Phone size={14} className="text-success" /> {user.phone}
                </span>
              )}
            </div>

            <p className="text-muted small mb-0" style={{ maxWidth: '640px' }}>
              {user?.bio || 'EcoConnect member promoting circular reuse and sustainable living.'}
            </p>
          </div>

          <div className="col-auto ms-md-auto">
            <button 
              onClick={() => setShowEditProfile(true)} 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="d-flex gap-2 border-bottom pb-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold ${
            activeTab === 'listings' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          My Listings ({myItems.length})
        </button>

        <button
          onClick={() => setActiveTab('inbox')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ${
            activeTab === 'inbox' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          <Inbox size={15} /> Incoming Requests ({requestsReceived.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ${
            activeTab === 'sent' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          <Send size={15} /> My Item Requests ({requestsSent.length})
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ${
            activeTab === 'community' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          <HelpCircle size={15} /> Community Needs ({myCommunityReqs.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ${
            activeTab === 'history' ? 'btn-eco-primary' : 'btn-light'
          }`}
        >
          <History size={15} /> Rehome History
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div>
          {/* 1. My Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Your Active & Listed Donations</h5>
                <Link to="/donate" className="btn btn-sm btn-eco-primary">
                  + Add New Donation
                </Link>
              </div>

              {myItems.length === 0 ? (
                <div className="p-5 text-center bg-white rounded-4 border">
                  <Package size={40} className="text-muted mb-2" />
                  <h6 className="fw-bold">You haven't listed any items for donation yet</h6>
                  <p className="text-muted small mb-3">Share items you no longer use with neighbors in need.</p>
                  <Link to="/donate" className="btn btn-sm btn-eco-primary">
                    Donate an Item
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {myItems.map((item) => (
                    <div key={item._id} className="col-md-6 col-lg-4">
                      <div className="eco-card p-3 h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge badge-eco-sand small">{item.category}</span>
                          <span className={`badge ${
                            item.status === 'Available' ? 'bg-success' : item.status === 'Completed' ? 'bg-secondary' : 'bg-warning text-dark'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <h6 className="fw-bold text-dark mb-1 text-truncate">{item.title}</h6>
                        <p className="text-muted small flex-grow-1" style={{ maxHeight: '42px', overflow: 'hidden' }}>
                          {item.description}
                        </p>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                          <Link to={`/items/${item._id}`} className="small text-success fw-semibold">
                            View Details
                          </Link>
                          <div className="d-flex gap-2">
                            <Link to={`/items/${item._id}/edit`} className="btn btn-sm btn-outline-secondary py-0 px-2 small">
                              Edit
                            </Link>
                            <button onClick={() => handleDeleteItem(item._id)} className="btn btn-sm btn-outline-danger py-0 px-2 small">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Incoming Requests Tab (As Donor) */}
          {activeTab === 'inbox' && (
            <div>
              <h5 className="fw-bold mb-3">Requests Received for Your Items</h5>
              {requestsReceived.length === 0 ? (
                <div className="p-5 text-center bg-white rounded-4 border">
                  <Inbox size={40} className="text-muted mb-2" />
                  <h6 className="fw-bold">No requests received yet</h6>
                  <p className="text-muted small mb-0">When neighbors request your listed items, they will appear here for your review.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {requestsReceived.map((req) => (
                    <div key={req._id} className="bg-white p-4 rounded-4 border shadow-sm">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2">
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">
                            Item: <span className="text-success">{req.itemTitle}</span>
                          </h6>
                          <small className="text-muted">
                            Requested by <strong>{req.requesterName}</strong> ({req.requesterEmail}) on {new Date(req.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div>
                          <span className={`badge ${
                            req.status === 'Accepted' ? 'bg-success' : req.status === 'Completed' ? 'bg-secondary' : req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-light rounded-3 small mb-3">
                        <strong>Message:</strong> "{req.message}"
                      </div>

                      {/* Donor response actions */}
                      {req.status === 'Pending' && (
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            onClick={() => handleRespondRequest(req._id, 'Rejected')}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          >
                            <XCircle size={15} /> Decline
                          </button>
                          <button
                            onClick={() => handleRespondRequest(req._id, 'Accepted')}
                            className="btn btn-sm btn-eco-primary d-flex align-items-center gap-1"
                          >
                            <CheckCircle2 size={15} /> Accept Request & Arrange Pickup
                          </button>
                        </div>
                      )}

                      {req.status === 'Accepted' && (
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-success fw-semibold">
                            ✓ You accepted this request. Coordinate pickup with {req.requesterName}.
                          </small>
                          <button
                            onClick={() => handleRespondRequest(req._id, 'Completed')}
                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          >
                            <Check size={14} /> Mark Exchange as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. My Item Requests Tab (As Requester) */}
          {activeTab === 'sent' && (
            <div>
              <h5 className="fw-bold mb-3">Items You Have Requested</h5>
              {requestsSent.length === 0 ? (
                <div className="p-5 text-center bg-white rounded-4 border">
                  <Send size={40} className="text-muted mb-2" />
                  <h6 className="fw-bold">You haven't requested any items yet</h6>
                  <p className="text-muted small mb-3">Explore available items to find what you need.</p>
                  <Link to="/explore" className="btn btn-sm btn-eco-primary">
                    Explore Items
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {requestsSent.map((req) => (
                    <div key={req._id} className="bg-white p-4 rounded-4 border shadow-sm">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="fw-bold mb-1 text-dark">{req.itemTitle}</h6>
                          <small className="text-muted">
                            Request sent on {new Date(req.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className={`badge ${
                          req.status === 'Accepted' ? 'bg-success' : req.status === 'Completed' ? 'bg-secondary' : req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <p className="small text-muted mb-2">
                        <strong>Your message:</strong> "{req.message}"
                      </p>

                      <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                        <Link to={`/items/${req.item}`} className="small text-success fw-semibold">
                          View Listing Details →
                        </Link>
                        {req.status === 'Accepted' && (
                          <span className="small text-success fw-bold">
                            🎉 Donor accepted! Check your email or message to coordinate pickup.
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. My Community Needs Tab */}
          {activeTab === 'community' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Community Needs You Posted</h5>
                <Link to="/community-requests" className="btn btn-sm btn-eco-primary">
                  + Post Community Need
                </Link>
              </div>

              {myCommunityReqs.length === 0 ? (
                <div className="p-5 text-center bg-white rounded-4 border">
                  <HelpCircle size={40} className="text-muted mb-2" />
                  <h6 className="fw-bold">No community requests posted</h6>
                  <p className="text-muted small mb-0">Ask your neighborhood for study materials, kitchenware, or furniture.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {myCommunityReqs.map((req) => (
                    <div key={req._id} className="col-md-6">
                      <div className="bg-white p-4 rounded-4 border shadow-sm h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge badge-eco-sand">{req.category}</span>
                          <span className={`badge ${req.status === 'Open' ? 'bg-success' : 'bg-secondary'}`}>
                            {req.status}
                          </span>
                        </div>

                        <h6 className="fw-bold mb-1 text-dark">{req.title}</h6>
                        <p className="text-muted small flex-grow-1">{req.description}</p>

                        <div className="p-2 bg-light rounded-3 small mb-3">
                          <strong>Offers Received:</strong> {req.offers?.length || 0}
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-auto">
                          <small className="text-muted">{new Date(req.createdAt).toLocaleDateString()}</small>
                          <Link to="/community-requests" className="btn btn-sm btn-outline-secondary small">
                            View on Needs Board
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white p-4 rounded-4 border shadow-sm">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <History size={20} className="text-success" /> Your Circular Donation & Reuse History
              </h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-muted mb-3">Completed Items Donated ({myItems.filter(i => i.status === 'Completed').length})</h6>
                  {myItems.filter(i => i.status === 'Completed').length === 0 ? (
                    <p className="text-muted small">No completed donations yet.</p>
                  ) : (
                    <ul className="list-group list-group-flush small">
                      {myItems.filter(i => i.status === 'Completed').map(item => (
                        <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <strong>{item.title}</strong>
                            <div className="text-muted">Rehomed to neighbor</div>
                          </div>
                          <span className="badge bg-success">~{item.estimatedWasteDivertedKg || 2} kg Diverted</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-md-6">
                  <h6 className="fw-bold text-muted mb-3">Completed Items Received ({requestsSent.filter(r => r.status === 'Completed').length})</h6>
                  {requestsSent.filter(r => r.status === 'Completed').length === 0 ? (
                    <p className="text-muted small">No items received yet.</p>
                  ) : (
                    <ul className="list-group list-group-flush small">
                      {requestsSent.filter(r => r.status === 'Completed').map(req => (
                        <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <strong>{req.itemTitle}</strong>
                            <div className="text-muted">Received from community donor</div>
                          </div>
                          <span className="badge bg-secondary">Reused</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Edit3 size={18} className="text-success" /> Edit Profile Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowEditProfile(false)}></button>
              </div>

              <div className="modal-body">
                {profileMsg && <div className="alert alert-info small py-2">{profileMsg}</div>}

                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Pickup Area / General Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Maplewood North"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +1 555-0192"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Short Bio</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() => setShowEditProfile(false)}
                      disabled={savingProfile}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-eco-primary px-3" disabled={savingProfile}>
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
