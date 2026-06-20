import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield } from 'lucide-react';

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const BUSINESS_INFO = {
  name: 'Ginoong Barbero',
  tagline: 'Crafting Excellence',
};

export function MobileMenu({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  user, 
  isAdmin,
  pendingCount = 0,
  todayAppointments = 0,
  onBookNow,
  onLogout 
}) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    onClose?.();
    if (onBookNow) {
      onBookNow();
    } else {
      navigate('/book');
    }
  };

  const mainLinks = [
    { name: 'Our Story', href: '/our-story' },
    { name: 'Services', href: '/services' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Master Barbers', href: '/barbers' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', roles: ['admin'] },
    { name: 'Appointments', href: '/admin/appointments', roles: ['admin'] },
    { name: 'Customers', href: '/admin/customers', roles: ['admin'] },
    { name: 'Services', href: '/admin/services', roles: ['admin'] },
    { name: 'Barbers', href: '/admin/barbers', roles: ['admin'] },
    { name: 'Gallery', href: '/admin/gallery', roles: ['admin'] },
    { name: 'Settings', href: '/admin/settings', roles: ['admin'] },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-vintage-charcoal/40 backdrop-blur-md z-[60] pointer-events-auto"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-vintage-charcoal border-l border-white/10 z-[70] p-12 flex flex-col pointer-events-auto overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-16">
              <div className="flex flex-col gap-1">
                <span className="text-vintage-tan text-[10px] font-bold uppercase tracking-[0.4em] font-slab italic">
                  {BUSINESS_INFO.name}
                </span>
                <span className="text-[8px] text-white/30 uppercase tracking-[0.2em]">
                  {BUSINESS_INFO.tagline}
                </span>
                {/* Mobile Admin Stats */}
                {isAuthenticated && isAdmin && (
                  <div className="flex gap-2 mt-2 flex-wrap">
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
                onClick={onClose}
                className="text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-10">
              {/* Main Menu */}
              <div className="space-y-6">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">
                  Main Menu
                </span>
                {mainLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <Link 
                      to={link.href}
                      onClick={onClose}
                      className="text-3xl font-serif font-black text-white hover:text-vintage-tan transition-all duration-500 uppercase tracking-tighter block group"
                    >
                      <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Admin Menu */}
              {isAuthenticated && isAdmin && (
                <div className="space-y-6">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">
                      Admin Panel
                  </span>
                  {adminLinks
                    .filter(link => link.roles.includes(user?.role))
                    .map((link, idx) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (idx + 4) }}
                      >
                        <Link 
                          to={link.href}
                          onClick={onClose}
                          className="text-lg font-serif font-bold text-white/70 hover:text-vintage-tan transition-all duration-500 uppercase tracking-tighter block group"
                        >
                          <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">
                            {link.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-6">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">
                  Connect
                </span>
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

            {/* Footer Actions */}
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
                      {(user?.role === 'admin') && (
                        <span className="text-vintage-tan text-[8px] font-bold uppercase">
                          {user?.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      onLogout?.();
                      onClose?.();
                    }}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/admin/login" 
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-vintage-tan transition-colors"
                >
                  <Shield size={12} />
                  Admin Login
                </Link>
              )}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                className="w-full bg-vintage-tan text-vintage-charcoal py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl"
              >
                Book Appointment
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
