import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Filter, RefreshCw, PlusCircle, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

const CATEGORIES = ['All', 'Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];
const CONDITIONS = ['All', 'New', 'Like New', 'Gently Used', 'Fair', 'Needs TLC'];

export default function ExploreItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Filters state
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Request modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getItems({
        category: category !== 'All' ? category : undefined,
        condition: condition !== 'All' ? condition : undefined,
        status: status !== 'All' ? status : undefined,
        search: search.trim() ? search.trim() : undefined,
      });
      if (res.success) {
        setItems(res.data);
      } else {
        setError(res.message || 'Failed to load items.');
      }
    } catch (err) {
      setError(err.message || 'Network error fetching items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, condition, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenRequest = (item) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/explore' } } });
      return;
    }
    setSelectedItem(item);
    setRequestMessage(`Hi ${item.donorName}, I would love to reuse this item and can arrange pickup in ${item.location} at your convenience.`);
    setRequestSuccess('');
    setRequestError('');
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmittingRequest(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      const res = await api.requestItem(selectedItem._id, requestMessage);
      setRequestSuccess(res.message || 'Request sent to donor!');
      setTimeout(() => {
        setSelectedItem(null);
        fetchItems();
      }, 1800);
    } catch (err) {
      setRequestError(err.message || 'Failed to submit request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <span className="section-tag">Circularity in Action</span>
          <h1 className="display-6 fw-bold mb-1">Explore Community Donations</h1>
          <p className="text-muted small mb-0">
            Discover usable items available for free pickup in your local neighborhood.
          </p>
        </div>
        <Link to="/donate" className="btn btn-eco-primary d-flex align-items-center gap-2">
          <PlusCircle size={18} /> Donate an Item
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search by title, description or area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select bg-light"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select
              className="form-select bg-light"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  Condition: {cond}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select
              className="form-select bg-light"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Requested">In Request</option>
              <option value="Completed">Rehomed</option>
            </select>
          </div>

          <div className="col-6 col-md-1">
            <button type="submit" className="btn btn-eco-primary w-100">
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills shortcut */}
      <div className="d-flex gap-2 overflow-x-auto pb-3 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn btn-sm rounded-pill px-3 text-nowrap ${
              category === cat ? 'btn-eco-primary' : 'btn-outline-secondary bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading, Error, Empty States */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Loading items from database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger p-4 rounded-4 shadow-sm text-center">
          <AlertCircle size={32} className="mb-2" />
          <h5>Unable to load items</h5>
          <p className="small mb-3">{error}</p>
          <button onClick={fetchItems} className="btn btn-sm btn-outline-danger">
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border shadow-sm p-4">
          <Package size={50} className="text-muted mb-2" />
          <h4 className="fw-bold">No items found matching your filters</h4>
          <p className="text-muted small mb-4">
            Try adjusting your search terms or be the first to list an item in this category!
          </p>
          <div className="d-flex justify-content-center gap-2">
            <button
              onClick={() => {
                setCategory('All');
                setCondition('All');
                setStatus('All');
                setSearch('');
              }}
              className="btn btn-sm btn-outline-secondary"
            >
              Reset Filters
            </button>
            <Link to="/donate" className="btn btn-sm btn-eco-primary">
              Donate an Item
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted fw-semibold">
              Showing {items.length} {items.length === 1 ? 'item' : 'items'}
            </small>
            <button
              onClick={fetchItems}
              className="btn btn-sm btn-link text-muted d-flex align-items-center gap-1 text-decoration-none"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="row g-4">
            {items.map((item) => (
              <div key={item._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <ItemCard item={item} onRequest={handleOpenRequest} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Item Modal */}
      {selectedItem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  Request Item: {selectedItem.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedItem(null)}
                  disabled={submittingRequest}
                ></button>
              </div>

              <div className="modal-body">
                {requestSuccess ? (
                  <div className="text-center py-4">
                    <CheckCircle size={44} className="text-success mb-2" />
                    <h5 className="fw-bold">Request Submitted!</h5>
                    <p className="text-muted small">{requestSuccess}</p>
                    <p className="small text-muted">
                      The donor will be notified. You can track this in your profile activity.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendRequest}>
                    <div className="alert alert-light border small mb-3">
                      <strong>Donor:</strong> {selectedItem.donorName}
                      <br />
                      <strong>Pickup Area:</strong> {selectedItem.location}
                      <br />
                      <strong>Preference:</strong> {selectedItem.contactPreference}
                    </div>

                    {requestError && (
                      <div className="alert alert-danger small py-2 mb-3">{requestError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Message to Donor / Proposed Pickup Time
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        required
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Introduce yourself, explain how you will use the item, and suggest pickup times..."
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() => setSelectedItem(null)}
                        disabled={submittingRequest}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-eco-primary px-3"
                        disabled={submittingRequest}
                      >
                        {submittingRequest ? 'Sending Request...' : 'Send Request'}
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
