import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Recycle, 
  TreePine, 
  CloudRain, 
  Package, 
  User, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ImpactDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImpact = async () => {
      setLoading(true);
      try {
        const res = await api.getImpactStats();
        if (res.success && res.data) {
          setImpactData(res.data);
        } else {
          setError(res.message || 'Failed to calculate metrics.');
        }
      } catch (err) {
        setError(err.message || 'Error loading impact calculations.');
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted small mt-2">Aggregating community sustainability data from database...</p>
      </div>
    );
  }

  const {
    totalListings = 0,
    activeAvailableItems = 0,
    completedExchanges = 0,
    totalFulfilledCommunityRequests = 0,
    totalWasteDivertedKg = 0,
    estimatedCo2SavedKg = 0,
    treeSeedlingsEquivalent = 0,
    categoryBreakdown = {},
    userStats = null,
    methodology = {},
  } = impactData || {};

  // Find max category count for proportional bar rendering
  const maxCategoryCount = Math.max(...Object.values(categoryBreakdown), 1);

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <span className="section-tag">Empirical Lifecycle Data</span>
        <h1 className="display-6 fw-bold mb-1">Environmental Impact Dashboard</h1>
        <p className="text-muted small mb-0">
          Tracking cumulative material diversion and greenhouse gas abatement achieved through neighborhood reuse.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="row g-4 mb-4">
        {/* KPI 1 */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge badge-eco-sage">Diverted Waste</span>
              <Recycle size={20} className="text-success" />
            </div>
            <div className="stat-number text-success">
              {totalWasteDivertedKg} <span className="fs-6 text-muted">kg</span>
            </div>
            <div className="stat-label">Landfill Solid Waste Diverted</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              From {completedExchanges} verified completed item exchanges
            </small>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge badge-eco-sage">Embodied Carbon</span>
              <CloudRain size={20} className="text-primary" />
            </div>
            <div className="stat-number text-primary">
              ~{estimatedCo2SavedKg} <span className="fs-6 text-muted">kg CO₂e</span>
            </div>
            <div className="stat-label">Estimated GHG Emissions Prevented</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              Avoided manufacturing & distribution footprint
            </small>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge badge-eco-sage">Forest Equivalent</span>
              <TreePine size={20} className="text-success" />
            </div>
            <div className="stat-number text-dark">
              {treeSeedlingsEquivalent}
            </div>
            <div className="stat-label">Mature Trees Annual Absorption Equiv.</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              Standard 21.77 kg CO₂ absorption factor per tree/yr
            </small>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge badge-eco-sage">Community Actions</span>
              <CheckCircle2 size={20} className="text-warning" />
            </div>
            <div className="stat-number">
              {completedExchanges + totalFulfilledCommunityRequests}
            </div>
            <div className="stat-label">Total Successful Circular Actions</div>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>
              {completedExchanges} exchanges + {totalFulfilledCommunityRequests} fulfilled requests
            </small>
          </div>
        </div>
      </div>

      {/* Middle Section: Personal Impact Strip (If Authenticated) */}
      {isAuthenticated && userStats ? (
        <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ backgroundColor: 'var(--eco-sage-light)' }}>
          <div className="card-body p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
              <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
                <div className="p-2 bg-white rounded-circle shadow-sm text-success">
                  <User size={20} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Your Personal Sustainability Impact</h5>
                  <small className="text-muted">Contributions by {user.name}</small>
                </div>
              </div>
              <Link to="/donate" className="btn btn-sm btn-eco-primary">
                Donate Another Item →
              </Link>
            </div>

            <div className="row g-3 text-center">
              <div className="col-6 col-md-3">
                <div className="bg-white p-3 rounded-3 shadow-sm border">
                  <div className="fs-3 fw-bold text-success">{userStats.totalDonated}</div>
                  <div className="small text-muted">Donations Listed</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white p-3 rounded-3 shadow-sm border">
                  <div className="fs-3 fw-bold text-success">{userStats.completedDonations}</div>
                  <div className="small text-muted">Completed Rehomes</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white p-3 rounded-3 shadow-sm border">
                  <div className="fs-3 fw-bold text-success">{userStats.personalWasteDivertedKg} kg</div>
                  <div className="small text-muted">Personal Waste Rescued</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white p-3 rounded-3 shadow-sm border">
                  <div className="fs-3 fw-bold text-success">~{userStats.personalCo2SavedKg} kg</div>
                  <div className="small text-muted">Personal CO₂ Abated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="alert bg-white border shadow-sm rounded-4 p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h5 className="fw-bold mb-1">Track Your Personal Carbon & Waste Reduction</h5>
            <p className="text-muted small mb-0">
              Log in to see your individual item donations, items received, and personalized diversion metrics.
            </p>
          </div>
          <Link to="/login" className="btn btn-sm btn-eco-primary px-3 text-nowrap">
            Log In to View Profile Impact
          </Link>
        </div>
      ) : null}

      {/* Category Diversion Progress Chart & Real-world Comparisons */}
      <div className="row g-4 mb-4">
        {/* Category breakdown bar charts */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <BarChart3 size={20} className="text-success" /> Waste Rescued by Category
            </h5>
            <p className="text-muted small mb-4">
              Distribution of community listings across durable product groups.
            </p>

            <div className="d-flex flex-column gap-3">
              {Object.entries(categoryBreakdown).map(([cat, count]) => {
                const percent = Math.round((count / (totalListings || 1)) * 100);
                const barWidth = Math.max(8, Math.round((count / maxCategoryCount) * 100));

                return (
                  <div key={cat}>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="fw-semibold text-dark">{cat}</span>
                      <span className="text-muted">
                        {count} items ({percent}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '10px', borderRadius: '6px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: 'var(--eco-primary)',
                          borderRadius: '6px',
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real World Equivalencies */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
              <TrendingUp size={20} className="text-success" /> Real-World Equivalencies
            </h5>
            <p className="text-muted small mb-3">
              Putting community metrics into tangible real-world environmental terms:
            </p>

            <ul className="list-group list-group-flush small">
              <li className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                  🚗
                </div>
                <div>
                  <strong>{Math.round(estimatedCo2SavedKg * 4.1)} km</strong> of passenger vehicle driving avoided based on average gasoline car tailpipe metrics.
                </div>
              </li>

              <li className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                  💡
                </div>
                <div>
                  <strong>{Math.round(estimatedCo2SavedKg * 12.5)} hours</strong> of standard domestic LED household lighting powered.
                </div>
              </li>

              <li className="list-group-item px-0 py-3 d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning">
                  🗑️
                </div>
                <div>
                  <strong>{Math.round(totalWasteDivertedKg * 1.4)} standard municipal trash bags</strong> diverted from local incineration or landfill compactors.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scientific Methodology & Academic Transparency Note */}
      <div className="alert alert-light border rounded-4 p-4 shadow-sm">
        <div className="d-flex align-items-start gap-2">
          <Info size={22} className="text-success flex-shrink-0 mt-1" />
          <div className="small">
            <h6 className="fw-bold mb-1 text-dark">Environmental Calculation Methodology & Transparency Notice</h6>
            <p className="text-muted mb-2">
              {methodology.note ||
                'Calculations are modeled on the US Environmental Protection Agency (EPA) Waste Reduction Model (WARM) durable goods lifecycle averages. Embodied greenhouse gas figures reflect avoided raw material extraction, refining, and industrial fabrication.'}
            </p>
            <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: '0.78rem' }}>
              <span>• Waste diversion factor: <strong>~1.85 kg CO₂e / kg durable goods reused</strong></span>
              <span>• Tree absorption constant: <strong>21.77 kg CO₂ / mature tree / year</strong></span>
              <span>• Integrity principle: <strong>Estimates are modeled projections, not laboratory facts.</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
