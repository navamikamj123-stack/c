import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Image, MapPin, Tag, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Books', 'Clothes', 'Electronics', 'Furniture', 'School Supplies', 'Other'];
const CONDITIONS = ['New', 'Like New', 'Gently Used', 'Fair', 'Needs TLC'];

const SAMPLE_PHOTO_PRESETS = [
  { label: 'Books', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monitor', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Winter Coat', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Art Kit', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80' },
];

export default function DonateItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Furniture',
    condition: 'Gently Used',
    description: '',
    location: user?.location || 'Central Neighborhood',
    imageUrl: '',
    contactPreference: 'In-app Requests Only',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPreset = (url) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.createItem(formData);
      if (res.success) {
        navigate(`/items/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to publish donation listing.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/explore" className="text-muted small d-inline-flex align-items-center gap-1 text-decoration-none">
          <ArrowLeft size={16} /> Back to explore
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
                <PlusCircle size={26} />
              </div>
              <div>
                <span className="section-tag mb-0">Give More, Waste Less</span>
                <h1 className="h3 fw-bold mb-0">List an Item for Donation</h1>
                <small className="text-muted">
                  Offer preloved household items to neighbors and prevent usable goods from entering landfills.
                </small>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 small mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* 1. Item Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Item Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Ergonomic Wooden Study Desk with Drawers"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* 2. Category & Condition */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Item Condition <span className="text-danger">*</span>
                  </label>
                  <select
                    name="condition"
                    className="form-select"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">
                  Item Description <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Describe dimensions, functionality, materials, reason for giving away, and any special pickup requirements..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* 4. Pickup Location & Contact Method */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Pickup Area / Town <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <MapPin size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      placeholder="e.g. Maplewood North (Near City Library)"
                      required
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.74rem' }}>
                    For your privacy, provide general neighborhood rather than full apartment number.
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small">
                    Preferred Contact Method
                  </label>
                  <select
                    name="contactPreference"
                    className="form-select"
                    value={formData.contactPreference}
                    onChange={handleChange}
                  >
                    <option value="In-app Requests Only">In-app Requests Only (Recommended)</option>
                    <option value="Email Contact">Email Contact</option>
                    <option value="In-app Chat or Call">In-app Chat or Call</option>
                  </select>
                </div>
              </div>

              {/* 5. Optional Image URL & One-click Presets */}
              <div className="mb-4">
                <label className="form-label fw-semibold small d-flex justify-content-between align-items-center">
                  <span>Item Image URL (Optional)</span>
                  <span className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
                    Leave blank to use category default
                  </span>
                </label>
                <div className="input-group mb-2">
                  <span className="input-group-text bg-light">
                    <Image size={16} className="text-muted" />
                  </span>
                  <input
                    type="url"
                    name="imageUrl"
                    className="form-control"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </div>

                {/* Quick Presets for Demo Convenience */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Sparkles size={12} className="text-warning" /> Quick Demo Photos:
                  </small>
                  {SAMPLE_PHOTO_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p.url)}
                      className="btn btn-sm btn-outline-secondary py-0 px-2 rounded-pill small"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {formData.imageUrl && (
                  <div className="mt-3 p-2 bg-light rounded-3 border d-inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ height: '90px', width: '130px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <small className="d-block text-muted mt-1 text-center" style={{ fontSize: '0.7rem' }}>
                      Image Preview
                    </small>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                <Link to="/explore" className="btn btn-light px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-eco-primary px-4 d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Saving to Database...' : 'Publish Donation Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
