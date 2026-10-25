import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit3, ArrowLeft, Image, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Gently Used', 'Fair', 'Needs TLC'];

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Furniture',
    condition: 'Gently Used',
    description: '',
    location: '',
    imageUrl: '',
    status: 'Available',
    contactPreference: 'In-app Requests Only',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.getItemById(id);
        if (res.success && res.data) {
          const item = res.data;
          const isOwner = user && (user._id?.toString() === item.donor?.toString() || user.id?.toString() === item.donor?.toString());
          if (!isOwner && !isAdmin) {
            navigate('/explore');
            return;
          }
          setFormData({
            title: item.title,
            category: item.category,
            condition: item.condition,
            description: item.description,
            location: item.location,
            imageUrl: item.imageUrl || '',
            status: item.status || 'Available',
            contactPreference: item.contactPreference || 'In-app Requests Only',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch item.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.updateItem(id, formData);
      if (res.success) {
        navigate(`/items/${id}`);
      } else {
        setError(res.message || 'Failed to update item.');
      }
    } catch (err) {
      setError(err.message || 'Network error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to={`/items/${id}`} className="text-muted small d-inline-flex align-items-center gap-1 text-decoration-none">
          <ArrowLeft size={16} /> Cancel editing
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div 
                className="d-flex align-items-center justify-content-center text-white rounded-3 shadow-sm"
                style={{ width: '48px', height: '48px', backgroundColor: 'var(--eco-primary)' }}
              >
                <Edit3 size={24} />
              </div>
              <div>
                <h1 className="h3 fw-bold mb-0">Edit Donation Listing</h1>
                <small className="text-muted">Update listing details or mark item availability status.</small>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Item Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Category</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Condition</label>
                  <select name="condition" className="form-select" value={formData.condition} onChange={handleChange}>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold small">Status</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Requested">In Request</option>
                    <option value="Completed">Rehomed / Completed</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  required
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Pickup Area</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    required
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Contact Preference</label>
                  <select name="contactPreference" className="form-select" value={formData.contactPreference} onChange={handleChange}>
                    <option value="In-app Requests Only">In-app Requests Only</option>
                    <option value="Email Contact">Email Contact</option>
                    <option value="In-app Chat or Call">In-app Chat or Call</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <Link to={`/items/${id}`} className="btn btn-light px-4">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-eco-primary px-4" disabled={saving}>
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
