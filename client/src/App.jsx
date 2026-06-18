import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { ReactLenis } from 'lenis/react';
import './index.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Auth Provider
import { AuthProvider } from './hooks/useAuth';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const OurStoryPage = lazy(() => import('./pages/OurStoryPage'));
const BookingWizard = lazy(() => import('./pages/BookingWizard'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const BarbersPage = lazy(() => import('./pages/BarbersPage'));
const AdminLayout = lazy(() => import('./pages/AdminLayout'));
const LoginForm = lazy(() => import('./components/Auth/LoginForm'));

// Protected Routes
import { AdminRoute, BarberRoute, PublicRoute } from './components/Auth/ProtectedRoute';

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-vintage-charcoal flex items-center justify-center z-[9999]">
      <div className="w-8 h-8 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/barbers" element={<BarbersPage />} />
              
              {/* Booking Route */}
              <Route path="/book" element={<BookingWizard />} />

              {/* Auth Routes */}
              <Route 
                path="/admin/login" 
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                } 
              />

              {/* Catch-all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ReactLenis>
  );
}

export default App;
