import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

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
  onBookNow,
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
        <Link
          to="/admin/login"
          className="flex items-center justify-center gap-2.5 py-3 text-[8px] font-bold uppercase tracking-[0.4em] text-white/20 hover:text-vintage-tan transition-colors border border-white/5 rounded-xl hover:border-vintage-tan/20"
        >
          <Shield size={12} />
          Admin Access
        </Link>

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
      
      {/* Divider */}
      <div className="w-px h-4 bg-white/5 mx-1"></div>

      {/* Admin Login */}
      <Link
        to="/admin/login"
        className="hidden lg:flex items-center gap-2 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-vintage-tan/70 transition-colors rounded-full hover:bg-white/[0.05]"
      >
        <Shield size={11} />
        Admin
      </Link>

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
