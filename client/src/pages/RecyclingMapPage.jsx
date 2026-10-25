import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Clock, 
  Phone, 
  Layers, 
  AlertCircle, 
  Info,
  Compass
} from 'lucide-react';
import { api } from '../services/api';

// Create custom green leaf marker icon for Leaflet
const createEcoIcon = () => {
  return L.divIcon({
    className: 'custom-eco-marker',
    html: `
      <div style="
        background: #2d6a4f;
        color: white;
        border: 2px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); font-size: 16px;">🌱</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
};

// Component to recenter map dynamically when selected
function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length === 2) {
      map.flyTo(coords, 14, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

export default function RecyclingMapPage() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchArea, setSearchArea] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7306, -73.9652]); // Default metropolitan demo center
  const [demoNotice, setDemoNotice] = useState('');

  const fetchCentres = async () => {
    setLoading(true);
    try {
      const res = await api.getRecyclingCentres({
        area: searchArea.trim() || undefined,
        material: materialFilter || undefined,
      });
      if (res.success) {
        setCentres(res.data);
        setDemoNotice(res.demonstrationNotice || '');
        if (res.data.length > 0 && (!selectedCentre || !res.data.find(c => c.id === selectedCentre.id))) {
          setSelectedCentre(res.data[0]);
          setMapCenter(res.data[0].coordinates);
        }
      }
    } catch (err) {
      console.error('Failed to load recycling centres:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, [materialFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCentres();
  };

  const handleSelectCentre = (c) => {
    setSelectedCentre(c);
    setMapCenter(c.coordinates);
  };

  return (
    <div className="container-fluid py-4 px-lg-5">
      {/* Page Title */}
      <div className="mb-4">
        <span className="section-tag">Zero Waste Infrastructure</span>
        <h1 className="display-6 fw-bold mb-1">Interactive Recycling & Depot Map</h1>
        <p className="text-muted small mb-0">
          Discover verified collection points and drop-off stations powered by OpenStreetMap.
        </p>
      </div>

      {/* Demonstration Notice Alert (Academic Integrity) */}
      <div className="alert alert-warning border-warning border-opacity-25 rounded-3 d-flex align-items-center gap-2 py-2 px-3 mb-4 small">
        <Info size={18} className="text-warning flex-shrink-0" />
        <div>
          <strong>Demonstration Data Notice:</strong> In accordance with project requirements, the facilities listed below are demonstration sample points with verified geocoding to demonstrate interactive OpenStreetMap routing without privacy tracking.
        </div>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="row g-4">
        {/* Left: Filter and Centre List */}
        <div className="col-lg-4 d-flex flex-column" style={{ maxHeight: '720px' }}>
          {/* Search & Material Filters */}
          <div className="bg-white p-3 rounded-4 border shadow-sm mb-3">
            <form onSubmit={handleSearchSubmit} className="mb-2">
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by area (e.g. Downtown, Maplewood)..."
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                />
                <button type="submit" className="btn btn-eco-primary">
                  <Search size={14} />
                </button>
              </div>
            </form>

            <select
              className="form-select form-select-sm bg-light"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
            >
              <option value="">All Recyclable Materials</option>
              <option value="Electronics">Electronics & E-Waste</option>
              <option value="Plastics">Plastics & Containers</option>
              <option value="Textile">Textiles & Clothing</option>
              <option value="Paper">Paper & Cardboard</option>
              <option value="Compost">Compost & Organic Scrap</option>
              <option value="Metal">Scrap Metals</option>
            </select>
          </div>

          {/* List of Locations */}
          <div className="bg-white p-3 rounded-4 border shadow-sm flex-grow-1 overflow-y-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small fw-bold text-muted">
                {centres.length} {centres.length === 1 ? 'Depot Found' : 'Depots Found'}
              </span>
              {searchArea && (
                <button
                  onClick={() => {
                    setSearchArea('');
                    setMaterialFilter('');
                  }}
                  className="btn btn-link btn-sm text-muted p-0 small text-decoration-none"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                <p className="text-muted small mt-2">Loading depots...</p>
              </div>
            ) : centres.length === 0 ? (
              <div className="text-center py-5 px-3">
                <AlertCircle size={36} className="text-muted mb-2" />
                <h6 className="fw-bold">No Recycling Centres Available</h6>
                <p className="small text-muted mb-3">
                  No verified collection points match "{searchArea || materialFilter}". Try searching a different neighborhood.
                </p>
                <button
                  onClick={() => {
                    setSearchArea('');
                    setMaterialFilter('');
                  }}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Show All Locations
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {centres.map((c) => {
                  const isSelected = selectedCentre?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCentre(c)}
                      className={`p-3 rounded-3 border transition cursor-pointer ${
                        isSelected ? 'border-success bg-success bg-opacity-10 shadow-sm' : 'bg-light hover-shadow'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>
                          {c.name}
                        </h6>
                        <span className="badge badge-eco-sand small" style={{ fontSize: '0.7rem' }}>
                          {c.area}
                        </span>
                      </div>

                      <p className="small text-muted mb-2 d-flex align-items-center gap-1">
                        <MapPin size={13} className="text-success flex-shrink-0" />
                        <span className="text-truncate">{c.address}</span>
                      </p>

                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {c.acceptedMaterials.slice(0, 2).map((m) => (
                          <span key={m} className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>
                            {m}
                          </span>
                        ))}
                        {c.acceptedMaterials.length > 2 && (
                          <span className="badge bg-white text-muted border small" style={{ fontSize: '0.68rem' }}>
                            +{c.acceptedMaterials.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {c.type}
                        </small>
                        <a
                          href={c.externalMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small text-success fw-semibold d-flex align-items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Directions <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Leaflet Map */}
        <div className="col-lg-8" style={{ minHeight: '560px', height: '720px' }}>
          <div className="h-100 rounded-4 overflow-hidden shadow-sm border position-relative">
            <MapContainer
              center={mapCenter}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <ChangeMapView coords={mapCenter} />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {centres.map((c) => (
                <Marker
                  key={c.id}
                  position={c.coordinates}
                  icon={createEcoIcon()}
                  eventHandlers={{
                    click: () => setSelectedCentre(c),
                  }}
                >
                  <Popup>
                    <div style={{ maxWidth: '240px', padding: '4px' }}>
                      <span className="badge bg-success small mb-1">{c.area}</span>
                      <h6 className="fw-bold mb-1">{c.name}</h6>
                      <p className="small text-muted mb-2">{c.address}</p>
                      <div className="small mb-2">
                        <strong>Hours:</strong> {c.hours}
                      </div>
                      <a
                        href={c.externalMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-eco-primary w-100 text-white d-flex align-items-center justify-content-center gap-1"
                        style={{ fontSize: '0.75rem' }}
                      >
                        External Navigation Link <ExternalLink size={12} />
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Selected Depot Card Overlay */}
            {selectedCentre && (
              <div 
                className="position-absolute bottom-0 start-0 m-3 p-3 bg-white rounded-3 shadow-lg border d-none d-md-block"
                style={{ zIndex: 1000, maxWidth: '380px', borderRadius: '14px' }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <h6 className="fw-bold mb-0 text-dark">{selectedCentre.name}</h6>
                  <span className="badge badge-eco-sand small">{selectedCentre.area}</span>
                </div>
                <p className="small text-muted mb-2">{selectedCentre.address}</p>
                <div className="small text-muted mb-2 d-flex align-items-center gap-2">
                  <Clock size={14} className="text-success" /> {selectedCentre.hours}
                </div>
                <div className="small mb-3">
                  <strong>Accepted:</strong> {selectedCentre.acceptedMaterials.join(', ')}
                </div>
                <a
                  href={selectedCentre.externalMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-eco-primary w-100 d-flex align-items-center justify-content-center gap-1"
                >
                  Open in OpenStreetMap Directions <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
