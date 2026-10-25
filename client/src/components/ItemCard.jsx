import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const CATEGORY_DEFAULT_IMAGES = {
  Furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  Electronics: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
  Clothes: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
  'School Supplies': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  Other: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
};

export default function ItemCard({ item, onRequest }) {
  const imageUrl = item.imageUrl || CATEGORY_DEFAULT_IMAGES[item.category] || CATEGORY_DEFAULT_IMAGES.Other;

  const isAvailable = item.status === 'Available';
  const isCompleted = item.status === 'Completed';

  return (
    <div className="card h-100 eco-card border-0 shadow-sm d-flex flex-column">
      {/* Image Container with Badge Overlay */}
      <div className="position-relative overflow-hidden" style={{ height: '210px', backgroundColor: '#e9ecef' }}>
        <img
          src={imageUrl}
          alt={item.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = CATEGORY_DEFAULT_IMAGES[item.category] || CATEGORY_DEFAULT_IMAGES.Other;
          }}
        />

        {/* Status Pill */}
        <div className="position-absolute top-0 start-0 m-2">
          {isAvailable ? (
            <span className="badge bg-success bg-opacity-90 px-2 py-1 shadow-sm d-flex align-items-center gap-1">
              <span className="p-1 rounded-circle bg-white d-inline-block"></span> Available
            </span>
          ) : isCompleted ? (
            <span className="badge bg-secondary px-2 py-1 shadow-sm d-flex align-items-center gap-1">
              <CheckCircle2 size={13} /> Rehomed
            </span>
          ) : (
            <span className="badge bg-warning text-dark px-2 py-1 shadow-sm d-flex align-items-center gap-1">
              <Clock size={13} /> Request In Review
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge badge-eco-sand shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="badge bg-light text-dark border small">
            {item.condition}
          </span>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            ~{item.estimatedWasteDivertedKg || 2} kg diverted
          </small>
        </div>

        <h5 className="card-title fw-bold text-truncate mt-1 mb-2" title={item.title}>
          {item.title}
        </h5>

        <p className="card-text text-muted small flex-grow-1 mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.description}
        </p>

        {/* Location & Donor info */}
        <div className="pt-2 border-top mt-auto">
          <div className="d-flex align-items-center justify-content-between text-muted small mb-3">
            <span className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '65%' }}>
              <MapPin size={14} className="text-success flex-shrink-0" />
              <span className="text-truncate">{item.location}</span>
            </span>
            <span className="text-truncate" style={{ maxWidth: '35%' }}>
              By {item.donorName?.split(' ')[0]}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <Link 
              to={`/items/${item._id}`} 
              className="btn btn-sm btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-1"
            >
              Details
            </Link>

            {isAvailable && onRequest ? (
              <button
                onClick={() => onRequest(item)}
                className="btn btn-sm btn-eco-primary w-50 d-flex align-items-center justify-content-center gap-1"
              >
                Request Item
              </button>
            ) : (
              <Link
                to={`/items/${item._id}`}
                className="btn btn-sm btn-eco-primary w-50 d-flex align-items-center justify-content-center gap-1"
              >
                View <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
