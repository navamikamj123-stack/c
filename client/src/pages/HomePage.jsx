import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Recycle, 
  Search, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Leaf,
  PlusCircle,
  Package,
  Layers,
  TreePine
} from 'lucide-react';
import { api } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalListings: 5,
    completedExchanges: 1,
    totalWasteDivertedKg: 28.5,
    estimatedCo2SavedKg: 53,
    treeSeedlingsEquivalent: 2.4,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [impactRes, itemsRes] = await Promise.all([
          api.getImpactStats().catch(() => ({ data: {} })),
          api.getItems({ status: 'Available' }).catch(() => ({ data: [] })),
        ]);

        if (impactRes.success && impactRes.data) {
          setStats(impactRes.data);
        }
        if (itemsRes.success && itemsRes.data) {
          setRecentItems(itemsRes.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="py-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(232, 240, 236, 0.7) 0%, rgba(251, 249, 246, 0.4) 100%)',
        borderBottom: '1px solid rgba(27, 56, 43, 0.06)'
      }}>
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="section-tag d-inline-flex align-items-center gap-1">
                <Leaf size={14} /> Community Sustainability Platform
              </span>

              <h1 className="display-4 fw-extrabold text-forest mb-3" style={{ fontSize: 'calc(1.8rem + 1.8vw)', lineHeight: 1.15 }}>
                Give More.<br />
                <span style={{ color: 'var(--eco-primary)' }}>Waste Less.</span>
              </h1>

              <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem', maxWidth: '580px' }}>
                EcoConnect is a neighborhood circular sharing network connecting households with preloved items to donate with individuals, schools, and charities who need them. Discover local recycling depots and track our collective carbon reduction in real time.
              </p>

              {/* Prominent CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/donate" className="btn btn-eco-primary btn-lg d-flex align-items-center gap-2 px-4 shadow">
                  <PlusCircle size={20} /> Donate an Item
                </Link>
                <Link to="/explore" className="btn btn-eco-secondary btn-lg d-flex align-items-center gap-2 px-4">
                  <Search size={20} /> Find Items
                </Link>
              </div>

              {/* Fast trust stats */}
              <div className="d-flex align-items-center gap-4 text-muted small pt-2">
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={18} className="text-success" /> Verified Local Neighbors
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Recycle size={18} className="text-success" /> 100% Free & Zero Waste
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="position-relative">
                <div 
                  className="rounded-4 overflow-hidden shadow-lg border" 
                  style={{ maxHeight: '420px', borderColor: 'rgba(27,56,43,0.1)' }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80" 
                    alt="Sustainable community sharing"
                    className="w-100 h-100 object-fit-cover"
                    style={{ minHeight: '340px' }}
                  />
                </div>

                {/* Floating Impact Card */}
                <div 
                  className="position-absolute bottom-0 start-0 translate-middle-y bg-white p-3 rounded-3 shadow-lg border d-none d-sm-flex align-items-center gap-3 ms-n3"
                  style={{ borderRadius: '14px', maxWidth: '280px' }}
                >
                  <div className="p-2 rounded-circle text-white bg-success d-flex align-items-center justify-content-center">
                    <TreePine size={24} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark fs-6">~{stats.totalWasteDivertedKg || 28} kg Diverted</div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Directly rescued from local landfills</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real Application Impact Statistics Strip */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="stat-number">{stats.totalListings || 0}</div>
                <div className="stat-label">Items Listed</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="stat-number">{stats.completedExchanges || 0}</div>
                <div className="stat-label">Completed Rehomes</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="stat-number text-success">{stats.totalWasteDivertedKg || 0} <span className="fs-5">kg</span></div>
                <div className="stat-label">Landfill Diverted</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <div className="stat-number text-success">{stats.estimatedCo2SavedKg || 0} <span className="fs-5">kg</span></div>
                <div className="stat-label">CO₂ Emissions Avoided</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Cards (Reuse, Donation, Recycling) */}
      <section className="py-5 my-3">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="section-tag">How It Works</span>
            <h2 className="display-6 fw-bold">Three Pillars of Neighborhood Sustainability</h2>
            <p className="text-muted">
              EcoConnect brings together individuals and local institutions to complete the loop on household goods.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="eco-card p-4 h-100 d-flex flex-column">
                <div 
                  className="rounded-3 p-3 mb-3 d-inline-flex align-items-center justify-content-center text-white"
                  style={{ width: '56px', height: '56px', backgroundColor: 'var(--eco-primary)' }}
                >
                  <HeartHandshake size={28} />
                </div>
                <h4 className="fw-bold mb-2">1. Direct Donation</h4>
                <p className="text-muted small flex-grow-1">
                  Have textbooks, winter coats, working electronics, or sturdy furniture? Post them in under 60 seconds with pickup details and connect directly with grateful neighbors.
                </p>
                <Link to="/donate" className="text-success fw-semibold small d-inline-flex align-items-center gap-1 mt-2">
                  List a donation <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="eco-card p-4 h-100 d-flex flex-column">
                <div 
                  className="rounded-3 p-3 mb-3 d-inline-flex align-items-center justify-content-center text-white"
                  style={{ width: '56px', height: '56px', backgroundColor: 'var(--eco-sage)' }}
                >
                  <Layers size={28} />
                </div>
                <h4 className="fw-bold mb-2">2. Community Requests</h4>
                <p className="text-muted small flex-grow-1">
                  Need study supplies, a microwave for a community kitchen, or baby clothing? Post your community need so neighbors can check their closets and lend a hand.
                </p>
                <Link to="/community-requests" className="text-success fw-semibold small d-inline-flex align-items-center gap-1 mt-2">
                  Browse community needs <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="eco-card p-4 h-100 d-flex flex-column">
                <div 
                  className="rounded-3 p-3 mb-3 d-inline-flex align-items-center justify-content-center text-white"
                  style={{ width: '56px', height: '56px', backgroundColor: '#344e41' }}
                >
                  <Recycle size={28} />
                </div>
                <h4 className="fw-bold mb-2">3. Interactive Recycling Map</h4>
                <p className="text-muted small flex-grow-1">
                  When an item has reached the true end of its usable life, locate municipal depots, e-waste drop-offs, and compost collection points with OpenStreetMap navigation.
                </p>
                <Link to="/recycling-map" className="text-success fw-semibold small d-inline-flex align-items-center gap-1 mt-2">
                  Find recycling depots <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recently Listed Items Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-2">
            <div>
              <span className="section-tag">Fresh Listings</span>
              <h2 className="display-6 fw-bold mb-1">Recently Donated in Your Community</h2>
              <p className="text-muted small mb-0">Browse preloved items currently available for neighborhood pickup.</p>
            </div>
            <Link to="/explore" className="btn btn-outline-success btn-sm rounded-pill px-3 fw-semibold">
              Explore All Items →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="text-muted small mt-2">Loading neighborhood donations...</p>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="row g-4">
              {recentItems.map((item) => (
                <div key={item._id} className="col-12 col-sm-6 col-lg-3">
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center bg-white rounded-4 border">
              <Package size={48} className="text-muted mb-2" />
              <h5 className="fw-bold">No active listings yet</h5>
              <p className="text-muted small mb-3">Be the first in your area to give an item a second life!</p>
              <Link to="/donate" className="btn btn-eco-primary btn-sm px-4">
                Post First Donation
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="py-5 text-white" style={{ backgroundColor: 'var(--eco-forest)' }}>
        <div className="container text-center py-4">
          <h2 className="display-6 fw-bold mb-3 text-white">Join the Circular Community Movement</h2>
          <p className="lead mx-auto mb-4" style={{ maxWidth: '620px', color: '#cde4d6' }}>
            Every exchange keeps good materials out of incinerators and landfills while building a kinder, more resourceful neighborhood.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-light btn-lg text-dark fw-bold px-4 rounded-3 shadow">
              Create Free Account
            </Link>
            <Link to="/impact" className="btn btn-outline-light btn-lg px-4 rounded-3">
              View Impact Metrics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
