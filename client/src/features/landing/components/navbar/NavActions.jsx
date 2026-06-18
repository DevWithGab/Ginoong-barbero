import { Link, useNavigate } from 'react-router-dom';
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
  isBarber,
  pendingCount = 0,
  todayAppointments = 0,
  onBookNow,
  onLogout,
  layout = 'desktop' 
}) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow();
    } else {
      navigate('/book');
    }
  };

  if (layout === 'mobile') {
    return (
      <div className="flex flex-col gap-6 mt-auto pt-10 space-y-6">
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
              onClick={() => onLogout?.()}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link 
            to="/admin/login" 
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
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-10">
      {/* Portfolio Link */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        <Link 
          to="/gallery"
          className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/50 hover:text-white transition-all relative group/link py-2"
        >
          <span className="relative z-10">Gallery</span>
          <span className="absolute bottom-0 right-0 w-0 h-px bg-vintage-tan transition-all duration-500 ease-expo group-hover/link:w-full"></span>
        </Link>
      </motion.div>

      {/* Social Links */}
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
      
      {/* Admin Indicators */}
      {isAuthenticated && (isAdmin || isBarber) && (
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5">
            <Calendar size={12} className="text-blue-400" />
            <span className="text-[9px] font-bold text-blue-400">
              {todayAppointments}
            </span>
          </div>

          {pendingCount > 0 && (
            <div className="relative">
              <button 
                onClick={() => navigate('/admin/appointments')}
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 hover:bg-orange-500/20 transition-colors"
              >
                <Bell size={12} className="text-orange-400" />
                <span className="text-[9px] font-bold text-orange-400">
                  {pendingCount}
                </span>
              </button>
            </div>
          )}

          {isAdmin && (
            <Link
              to="/admin/settings"
              className="p-2 text-white/20 hover:text-vintage-tan transition-colors rounded-full hover:bg-white/5"
            >
              <Settings size={12} />
            </Link>
          )}
        </div>
      )}
      
      {/* User Info or Login */}
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
            onClick={onLogout}
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

      {/* Book Button */}
      <motion.button 
        whileHover={{ scale: 1.02, backgroundColor: "var(--vintage-tan)", color: "var(--vintage-charcoal)" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookNow}
        className="hidden sm:flex group items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-3 text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 overflow-hidden relative"
      >
        <span className="relative z-10">Book Now</span>
        <div className="absolute inset-0 bg-vintage-tan translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
      </motion.button>
    </div>
  );
}
