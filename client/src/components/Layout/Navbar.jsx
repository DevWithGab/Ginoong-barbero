import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Shield,
  LogOut,
  User as UserIcon,
  Calendar,
  Bell,
  Settings
} from "lucide-react";
import { useDashboardMetrics, useAppointments } from "../../hooks/useAPI";
import { useAuth } from "../../hooks/useAuth";
import { useLenis } from "lenis/react";
import logo from "../../assets/logo/ginoong-barbero_LOGO.png";

const InstagramIcon = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 14, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const BUSINESS_INFO = {
  name: "Ginoong Barbero",
  tagline: "Premium Barbershop Experience"
};

export function Navbar({ onBookNow }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();

  // Real authentication hook
  const { user, logout, isAuthenticated, isAdmin, isBarber } = useAuth();

  // Backend data hooks (only fetch if authenticated and user has staff role)
  const shouldFetch = isAuthenticated && (isAdmin || isBarber);
  const { data: dashboardMetrics, loading: metricsLoading } = useDashboardMetrics(shouldFetch);
  const { data: pendingAppointments } = useAppointments(shouldFetch ? { 
    status: 'Pending', 
    limit: 5 
  } : null);

  const todayAppointments = dashboardMetrics?.data?.todayAppointments ?? 0;
  const pendingCount = pendingAppointments?.data?.length ?? 0;

  useEffect(() => {
    // Set up notifications from pending appointments (only for staff)
    if (pendingAppointments?.data && isAuthenticated && (isAdmin || isBarber)) {
      const newNotifications = pendingAppointments.data.map(appointment => ({
        id: appointment._id,
        type: 'appointment',
        message: `New booking from ${appointment.customer.name}`,
        time: new Date(appointment.createdAt).toLocaleTimeString(),
        unread: true
      }));
      setNotifications(newNotifications);
    }
  }, [pendingAppointments, isAuthenticated, isAdmin, isBarber]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsScrolled(scrolled > 50);
      
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0) {
        setScrollProgress((scrolled / height) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      navigate('/');
    }
  };

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      navigate('/book');
    }
  };

  const safeScrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      try {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <nav 
      aria-label="Main Navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 flex justify-center px-4 md:px-12 pointer-events-none ${
        isScrolled ? "py-3 md:py-4" : "py-5 md:py-6"
      }`}
    >
      <div className="w-full max-w-[1800px] mx-auto transition-all duration-700 relative overflow-hidden pointer-events-auto bg-vintage-charcoal/85 backdrop-blur-3xl border border-white/5 rounded-2xl md:rounded-3xl px-8 md:px-12 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)]">
        {/* Subtle Border Glow and Noise Texture for scrolled state */}
        {isScrolled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-vintage-tan/0 via-vintage-tan/[0.04] to-vintage-tan/0 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03] pointer-events-none"></div>
            {/* Scroll Progress Bar at the bottom */}
            <motion.div 
              className="absolute bottom-0 left-0 h-px bg-vintage-tan/30 z-20"
              style={{ width: `${scrollProgress}%` }}
            />
          </>
        )}

        {/* Bottom Border Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20"></div>

        <div className="flex justify-between items-center relative z-10 transition-all duration-500">
          {/* Left: Nav Links */}
          <div className="hidden lg:flex gap-12 items-center">
            {[
              { name: 'Our Story', href: '/our-story' },
              { name: 'Services', href: '/services' },
              { name: 'Barbers', href: '/barbers' },
            ].map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.8 }}
              >
                <Link 
                  to={link.href}
                  className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/50 hover:text-white transition-all relative group/link py-2"
                >
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-vintage-tan transition-all duration-500 ease-expo group-hover/link:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Center: Iconic Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            onClick={safeScrollToTop}
            className={`lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center group cursor-pointer transition-transform duration-700 ${isScrolled ? 'scale-90' : 'scale-100'}`}
          >
            <img 
              src={logo} 
              alt="Ginoong Barbero Logo" 
              className="h-10 md:h-11 lg:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity duration-700"
            />
          </motion.div>

          {/* Right: Actions */}
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-12 items-center">
              {[
                { name: 'Portfolio', href: '/gallery' },
              ].map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.8 }}
                >
                  <Link 
                    to={link.href}
                    className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/50 hover:text-white transition-all relative group/link py-2 text-right"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute bottom-0 right-0 w-0 h-px bg-vintage-tan transition-all duration-500 ease-expo group-hover/link:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-6 items-center pl-10 border-l border-white/10 ml-4">
              <div className="hidden xl:flex gap-5">
                <a 
                  href="https://instagram.com/ginoongbarbero" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/20 hover:text-vintage-tan cursor-pointer transition-all duration-500 hover:scale-110 focus:text-vintage-tan outline-none" 
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon size={14} aria-hidden="true" />
                </a>
                <a 
                  href="https://facebook.com/ginoongbarbero" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/20 hover:text-vintage-tan cursor-pointer transition-all duration-500 hover:scale-110 focus:text-vintage-tan outline-none" 
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon size={14} aria-hidden="true" />
                </a>
              </div>
              
              {/* Admin Dashboard Indicators */}
              {isAuthenticated && (isAdmin || isBarber) && (
                <div className="hidden lg:flex items-center gap-3">
                  {/* Today's Appointments Indicator */}
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5">
                    <Calendar size={12} className="text-blue-400" />
                    <span className="text-[9px] font-bold text-blue-400">
                      {metricsLoading ? '...' : todayAppointments}
                    </span>
                  </div>

                  {/* Pending Notifications */}
                  {pendingCount > 0 && (
                    <div className="relative">
                      <button 
                        onClick={() => navigate('/admin/appointments')}
                        className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 hover:bg-orange-500/20 transition-colors"
                        title={`${pendingCount} pending appointments`}
                      >
                        <Bell size={12} className="text-orange-400" />
                        <span className="text-[9px] font-bold text-orange-400">
                          {pendingCount}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Admin Settings */}
                  {isAdmin && (
                    <Link
                      to="/admin/settings"
                      className="p-2 text-white/20 hover:text-vintage-tan transition-colors rounded-full hover:bg-white/5"
                      title="Admin Settings"
                    >
                      <Settings size={12} />
                    </Link>
                  )}
                </div>
              )}
              
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 font-bold text-[9px] uppercase tracking-wider text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-vintage-tan text-black flex items-center justify-center font-black text-[8px] tracking-tight shrink-0">
                      {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-white/70 max-w-[100px] truncate">
                      {user?.name || user?.email}
                    </span>
                    <span className="px-2 py-0.5 bg-vintage-tan/20 text-vintage-tan rounded text-[7px] font-bold uppercase">
                      {user?.role}
                    </span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut size={11} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="hidden lg:flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-vintage-tan transition-colors"
                >
                  <Shield size={12} />
                  Admin Login
                </Link>
              )}

              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "var(--vintage-tan)", color: "var(--vintage-charcoal)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="hidden sm:flex group items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-3 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 overflow-hidden relative"
              >
                <span className="relative z-10">Book Now</span>
                <div className="absolute inset-0 bg-vintage-tan translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
              </motion.button>

              {/* Mobile Controls */}
              <div className="lg:hidden flex items-center gap-3">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="text-white p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 relative"
                >
                  <Menu size={20} />
                  {isAuthenticated && (isAdmin || isBarber) && pendingCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-vintage-charcoal/40 backdrop-blur-md z-[60] pointer-events-auto"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-vintage-charcoal border-l border-white/10 z-[70] p-12 flex flex-col pointer-events-auto"
            >
              <div className="flex justify-between items-start mb-16">
                <div className="flex flex-col gap-1">
                  <span className="text-vintage-tan text-[10px] font-bold uppercase tracking-[0.4em] font-slab italic">{BUSINESS_INFO.name}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">Crafting Excellence</span>
                  {/* Mobile Admin Stats */}
                  {isAuthenticated && (isAdmin || isBarber) && (
                    <div className="flex gap-2 mt-2">
                      <div className="bg-blue-500/10 px-2 py-1 rounded text-[8px] text-blue-400">
                        Today: {todayAppointments}
                      </div>
                      {pendingCount > 0 && (
                        <div className="bg-orange-500/10 px-2 py-1 rounded text-[8px] text-orange-400">
                          Pending: {pendingCount}
                        </div>
                      )}
                      <div className="bg-vintage-tan/10 px-2 py-1 rounded text-[8px] text-vintage-tan">
                        {user?.role}
                      </div>
                    </div>
                  )}
                </div>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)} 
                  className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-10">
                <div className="space-y-6">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">Main Menu</span>
                  {[
                    { name: 'Our Story', href: '/our-story' },
                    { name: 'Services', href: '/services' },
                    { name: 'Portfolio', href: '/gallery' },
                    { name: 'Master Barbers', href: '/barbers' },
                  ].map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <Link 
                        to={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-3xl font-serif font-black text-white hover:text-vintage-tan transition-all duration-500 uppercase tracking-tighter block group"
                      >
                        <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Admin Menu Section */}
                {isAuthenticated && (isAdmin || isBarber) && (
                  <div className="space-y-6">
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">
                      {isAdmin ? 'Admin Panel' : 'Barber Panel'}
                    </span>
                    {[
                      { name: 'Dashboard', href: '/admin', roles: ['admin', 'barber'] },
                      { name: 'Appointments', href: '/admin/appointments', roles: ['admin', 'barber'] },
                      { name: 'Customers', href: '/admin/customers', roles: ['admin', 'barber'] },
                      { name: 'Services', href: '/admin/services', roles: ['admin'] },
                      { name: 'Barbers', href: '/admin/barbers', roles: ['admin'] },
                      { name: 'Settings', href: '/admin/settings', roles: ['admin'] },
                    ].filter(link => link.roles.includes(user?.role)).map((link, idx) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (idx + 4) }}
                      >
                        <Link 
                          to={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-lg font-serif font-bold text-white/70 hover:text-vintage-tan transition-all duration-500 uppercase tracking-tighter block group"
                        >
                          <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">{link.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="space-y-6 mt-4">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">Connect</span>
                  <div className="flex flex-col gap-5">
                    <a 
                      href="https://instagram.com/ginoongbarbero" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group focus:text-white outline-none" 
                      aria-label="Ginoong Barbero on Instagram"
                    >
                      <InstagramIcon size={18} className="text-vintage-tan" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Instagram</span>
                    </a>
                    <a 
                      href="https://facebook.com/ginoongbarbero" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-white/60 hover:text-white transition-colors group focus:text-white outline-none" 
                      aria-label="Ginoong Barbero on Facebook"
                    >
                      <FacebookIcon size={18} className="text-vintage-tan" aria-hidden="true" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10 space-y-6">
                {isAuthenticated ? (
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-4 font-bold text-xs text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-vintage-tan text-black flex items-center justify-center font-black text-xs shrink-0">
                        {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-white/90 text-[10px] uppercase font-bold tracking-wider truncate max-w-[120px]">
                          {user?.name || "User"}
                        </span>
                        <span className="text-white/30 text-[9px] truncate max-w-[120px] font-mono">
                          {user?.email}
                        </span>
                        <span className="text-vintage-tan text-[8px] font-bold uppercase">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/admin/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-vintage-tan transition-colors mb-4"
                  >
                    <Shield size={12} />
                    Admin Login
                  </Link>
                )}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleBookNow();
                  }}
                  className="w-full bg-vintage-tan text-vintage-charcoal py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl"
                >
                  Book Appointment
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
