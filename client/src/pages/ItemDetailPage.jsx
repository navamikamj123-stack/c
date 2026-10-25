import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Tag, 
  Calendar, 
  User, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReportModal from '../components/ReportModal';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Request state
  const [message, setMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  // Report modal
  const [showReport, setShowReport] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.getItemById(id);
        if (res.success && res.data) {
          setItem(res.data);
          setMessage(`Hi ${res.data.donorName}, I am interested in this item and would like to arrange pickup in ${res.data.location}.`);
        } else {
          setError(res.message || 'Item not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/items/${id}` } } });
      return;
    }

    setSubmittingRequest(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      const res = await api.requestItem(item._id, message);
      setRequestSuccess(res.message || 'Request submitted successfully to donor!');
      setItem(prev => ({ ...prev, status: 'Requested' }));
    } catch (err) {
      setRequestError(err.message || 'Could not send request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this donation listing?')) return;

    setDeleting(true);
    try {
      if (isAdmin && item.donor.toString() !== user?._id?.toString()) {
        await api.adminDeleteItem(item._id);
      } else {
        await api.deleteItem(item._id);
      }
      navigate('/explore');
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted small mt-2">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning d-inline-block p-4 rounded-4 shadow-sm">
          <h4>Listing Unavailable</h4>
          <p className="text-muted small mb-3">{error || 'This listing does not exist or has been removed.'}</p>
          <Link to="/explore" className="btn btn-eco-primary btn-sm">
            ← Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (user._id?.toString() === item.donor?.toString() || user.id?.toString() === item.donor?.toString());
  const isAvailable = item.status === 'Available';
  const isCompleted = item.status === 'Completed';

  const defaultImg = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="container py-4">
      {/* Breadcrumb / Back button */}
      <div className="mb-3">
        <Link to="/explore" className="text-muted small d-inline-flex align-items-center gap-1 text-decoration-none">
          <ArrowLeft size={16} /> Back to all listings
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Column: Image */}
        <div className="col-lg-6">
          <div className="bg-white rounded-4 overflow-hidden border shadow-sm p-2">
            <img
              src={item.imageUrl || defaultImg}
              alt={item.title}
              className="w-100 rounded-3 object-fit-cover"
              style={{ maxHeight: '460px', minHeight: '320px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
            />
          </div>

          {/* Environmental diverted weight callout */}
          <div className="bg-light p-3 rounded-4 border mt-3 d-flex align-items-center gap-3">
            <div className="p-3 bg-white text-success rounded-circle shadow-sm">
              <Scale size={24} />
            </div>
            <div>
              <div className="fw-bold">Rescues ~{item.estimatedWasteDivertedKg || 2} kg of Waste</div>
              <small className="text-muted">
                Rehoming this item saves embodied energy, materials, and landfill volume.
              </small>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded-4 border shadow-sm">
            {/* Status & Category Pills */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex gap-2">
                <span className="badge badge-eco-sand px-3 py-2">
                  {item.category}
                </span>
                <span className="badge bg-light text-dark border px-3 py-2">
                  Condition: {item.condition}
                </span>
              </div>

              <div>
                {isAvailable ? (
                  <span className="badge bg-success px-3 py-2">Available</span>
                ) : isCompleted ? (
                  <span className="badge bg-secondary px-3 py-2">Rehomed</span>
                ) : (
                  <span className="badge bg-warning text-dark px-3 py-2">Request In Progress</span>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="h2 fw-bold text-dark mt-2 mb-3">{item.title}</h1>

            {/* Donor & Location Strip */}
            <div className="p-3 rounded-3 bg-light mb-4">
              <div className="row g-2 text-muted small">
                <div className="col-sm-6 d-flex align-items-center gap-2">
                  <User size={16} className="text-success" />
                  <span>Donated by <strong>{item.donorName}</strong></span>
                </div>
                <div className="col-sm-6 d-flex align-items-center gap-2">
                  <MapPin size={16} className="text-success" />
                  <span>Pickup: <strong>{item.location}</strong></span>
                </div>
                <div className="col-12 d-flex align-items-center gap-2 pt-1 border-top mt-1">
                  <Clock size={15} className="text-muted" />
                  <span>Preference: <strong>{item.contactPreference || 'In-app Requests Only'}</strong></span>
                </div>
              </div>
            </div>

            {/* Description */}
            <h6 className="fw-bold text-dark mb-2">Item Description</h6>
            <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-line' }}>
              {item.description}
            </p>

            {/* Action / Request Section */}
            {isOwner ? (
              <div className="alert alert-info rounded-3 p-3 mb-0">
                <h6 className="fw-bold mb-2">Your Donation Listing</h6>
                <p className="small mb-3">You posted this listing. You can manage incoming requests in your profile or edit the listing details.</p>
                <div className="d-flex gap-2">
                  <Link to={`/items/${item._id}/edit`} className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1">
                    <Edit3 size={15} /> Edit Details
                  </Link>
                  <button 
                    onClick={handleDelete} 
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    disabled={deleting}
                  >
                    <Trash2 size={15} /> {deleting ? 'Removing...' : 'Delete Listing'}
                  </button>
                </div>
              </div>
            ) : isCompleted ? (
              <div className="alert alert-secondary rounded-3 p-3 mb-0 text-center">
                <CheckCircle2 size={28} className="text-success mb-1" />
                <h6 className="fw-bold">Item Successfully Rehomed!</h6>
                <p className="small text-muted mb-0">
                  This item has already been transferred to a neighbor. Check out other available items!
                </p>
              </div>
            ) : (
              <div>
                {requestSuccess ? (
                  <div className="alert alert-success rounded-3 p-3">
                    <CheckCircle2 size={24} className="mb-1" />
                    <h6 className="fw-bold">Request Sent to Donor</h6>
                    <p className="small mb-0">{requestSuccess}</p>
                  </div>
                ) : (
                  <div className="border rounded-3 p-3 bg-light">
                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                      <Send size={16} className="text-success" /> Request This Item
                    </h6>
                    <p className="small text-muted mb-3">
                      Send a message to <strong>{item.donorName}</strong> to introduce yourself and coordinate pickup.
                    </p>

                    {requestError && <div className="alert alert-danger small py-2 mb-2">{requestError}</div>}

                    <form onSubmit={handleRequestSubmit}>
                      <textarea
                        className="form-control mb-3"
                        rows="3"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write a brief message explaining why you need this item and your availability..."
                      ></textarea>

                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          type="button"
                          onClick={() => setShowReport(true)}
                          className="btn btn-link text-muted small p-0 text-decoration-none d-flex align-items-center gap-1"
                        >
                          <AlertTriangle size={14} /> Report listing
                        </button>

                        <button
                          type="submit"
                          className="btn btn-eco-primary px-4"
                          disabled={submittingRequest}
                        >
                          {submittingRequest ? 'Submitting...' : 'Submit Request'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Admin Delete Action */}
            {isAdmin && !isOwner && (
              <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="badge bg-warning text-dark">Admin Controls</span>
                <button 
                  onClick={handleDelete} 
                  className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                  disabled={deleting}
                >
                  <Trash2 size={15} /> Remove Inappropriate Listing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          targetType="Item"
          targetId={item._id}
          targetTitle={item.title}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
