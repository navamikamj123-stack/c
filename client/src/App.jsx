import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ExploreItemsPage from './pages/ExploreItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import DonateItemPage from './pages/DonateItemPage';
import EditItemPage from './pages/EditItemPage';
import CommunityRequestsPage from './pages/CommunityRequestsPage';
import RecyclingMapPage from './pages/RecyclingMapPage';
import ImpactDashboardPage from './pages/ImpactDashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExploreItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/community-requests" element={<CommunityRequestsPage />} />
              <Route path="/recycling-map" element={<RecyclingMapPage />} />
              <Route path="/impact" element={<ImpactDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected User Routes */}
              <Route
                path="/donate"
                element={
                  <ProtectedRoute>
                    <DonateItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/items/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditItemPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
