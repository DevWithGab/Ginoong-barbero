import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogOut, Calendar, Bell, Settings } from 'lucide-react';

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

export function NavActions({ 
  isAuthenticated, 
  user, 
  isAdmin,
  pendingCount = 0,
  todayAppointments = 0,
  onBookNow,
  onLogout,
  layout = 'desktop' 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      navigate('/book');
    }
  };

  const isGalleryActive = location.pathname === '/gallery';

  if (layout === 'mobile') {
    return (
      <div className="flex flex-col gap-4 mt-auto pt-8">
        {isAuthenticated ? (
          <div className="flex justify-between items-center bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vintage-tan to-vintage-tan/70 flex items-center justify-center text-vintage-charcoal font-black text-xs shrink-0">
                {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white/90 text-[10px] uppercase font-bold tracking-wider truncate max-w-[120px]">
                  {user?.name || "User"}
                </span>
                <span className="text-white/25 text-[8px] truncate max-w-[120px]">
                  {user?.email}
                </span>
                {(user?.role === 'admin') && (
                  <span className="text-vintage-tan/80 text-[7px] font-bold uppercase tracking-wider mt-0.5">
                    {user?.role}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => onLogout?.()}
              className="bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 py-2 px-3 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            to="/admin/login" 
            onClick={onClose}
            className="flex items-center justify-center gap-2.5 py-3 text-[8px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-vintage-tan transition-colors border border-white/5 rounded-xl hover:border-vintage-tan/20"
          >
            <Shield size={12} />
            Admin Access
          </Link>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleBookNow}
          className="relative w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-vintage-tan group-hover:bg-white transition-colors duration-500"></div>
          <div className="absolute inset-0 border border-vintage-tan/30 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative z-10 text-vintage-charcoal">Book Now</span>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-2">
      {/* Gallery Link */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <Link 
          to="/gallery"
          className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 group/link ${
            isGalleryActive
              ? 'bg-white/[0.04]'
              : 'hover:bg-white/[0.03]'
          }`}
        >
          {isGalleryActive && (
            <motion.div
              layoutId="nav-active-dot-right"
              className="w-1 h-1 rounded-full bg-vintage-tan"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${
            isGalleryActive
              ? 'text-vintage-tan'
              : 'text-white/60 hover:text-white'
          }`}>
            Gallery
          </span>
          {!isGalleryActive && (
            <span className="absolute bottom-1 left-4 right-4 h-px bg-vintage-tan/0 group-hover/link:bg-vintage-tan/40 transition-all duration-500 rounded-full"></span>
          )}
        </Link>
      </motion.div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/5 mx-2 hidden xl:block"></div>

      {/* Social Links */}
      <div className="hidden xl:flex gap-1">
        <a 
          href="https://instagram.com/ginoongbarbero" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 text-white/30 hover:text-vintage-tan cursor-pointer transition-all duration-500 rounded-full hover:bg-white/[0.05] focus:text-vintage-tan outline-none" 
          aria-label="Follow us on Instagram"
        >
          <InstagramIcon size={13} aria-hidden="true" />
        </a>
        <a 
          href="https://facebook.com/ginoongbarbero" 
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 text-white/30 hover:text-vintage-tan cursor-pointer transition-all duration-500 rounded-full hover:bg-white/[0.05] focus:text-vintage-tan outline-none" 
          aria-label="Follow us on Facebook"
        >
          <FacebookIcon size={13} aria-hidden="true" />
        </a>
      </div>
      
      {/* Admin Indicators */}
      {isAuthenticated && isAdmin && (
        <div className="hidden lg:flex items-center gap-2 ml-1">
          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-full px-3 py-1.5">
            <Calendar size={11} className="text-white/30" />
            <span className="text-[9px] font-bold text-white/50">
              {todayAppointments}
            </span>
          </div>

          {pendingCount > 0 && (
            <button 
              onClick={() => navigate('/admin/appointments')}
              className="flex items-center gap-1.5 bg-orange-500/5 border border-orange-500/10 rounded-full px-3 py-1.5 hover:bg-orange-500/10 transition-colors"
            >
              <Bell size={11} className="text-orange-400/70" />
              <span className="text-[9px] font-bold text-orange-400/80">
                {pendingCount}
              </span>
            </button>
          )}

          {isAdmin && (
            <Link
              to="/admin/settings"
              className="p-2 text-white/30 hover:text-vintage-tan transition-colors rounded-full hover:bg-white/[0.05]"
            >
              <Settings size={12} />
            </Link>
          )}
        </div>
      )}
      
      {/* Divider */}
      <div className="w-px h-4 bg-white/5 mx-1"></div>

      {/* User Info or Login */}
      {isAuthenticated ? (
        <div className="hidden lg:flex items-center gap-2.5 bg-white/[0.03] border border-white/5 rounded-full pl-3 pr-1.5 py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-vintage-tan to-vintage-tan/70 flex items-center justify-center text-vintage-charcoal font-black text-[7px] tracking-tight shrink-0">
              {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 max-w-[80px] truncate">
              {user?.name || user?.email}
            </span>
            {(user?.role === 'admin') && (
              <span className="px-1.5 py-0.5 bg-vintage-tan/10 text-vintage-tan/70 rounded text-[6px] font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            )}
          </div>
          <button 
            onClick={onLogout}
            className="w-7 h-7 rounded-full bg-white/[0.03] hover:bg-red-500/10 text-white/30 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={10} />
          </button>
        </div>
      ) : (
        <Link
          to="/admin/login"
          className="hidden lg:flex items-center gap-2 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-vintage-tan/70 transition-colors rounded-full hover:bg-white/[0.05]"
        >
          <Shield size={11} />
          Admin
        </Link>
      )}

      {/* Divider */}
      <div className="w-px h-4 bg-white/5 mx-1"></div>

      {/* Book Button */}
      <motion.button 
        whileTap={{ scale: 0.97 }}
        onClick={handleBookNow}
        className="group relative flex items-center gap-3 bg-vintage-tan/90 hover:bg-white text-vintage-charcoal px-7 py-2.5 text-[9px] font-black uppercase tracking-[0.35em] transition-all duration-500 overflow-hidden rounded-full"
      >
        <span className="relative z-10">Book Now</span>
        <div className="w-1 h-1 rounded-full bg-vintage-charcoal/30 group-hover:bg-vintage-tan/50 transition-colors relative z-10"></div>
        
        {/* Hover Shine */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
      </motion.button>
    </div>
  );
}
