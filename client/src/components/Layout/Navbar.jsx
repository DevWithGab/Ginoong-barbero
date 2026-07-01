import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Shield,
} from "lucide-react";
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
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();

  // Real authentication hook
  const { user, logout, isAuthenticated } = useAuth();

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
              
              <Link
                to="/admin/login"
                className="hidden lg:flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-vintage-tan transition-colors"
              >
                <Shield size={12} />
                Admin
              </Link>

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
                <Link
                  to="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-vintage-tan transition-colors mb-4"
                >
                  <Shield size={12} />
                  Admin Login
                </Link>
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
