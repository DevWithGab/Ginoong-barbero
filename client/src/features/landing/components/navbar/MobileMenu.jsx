import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Phone, Clock } from 'lucide-react';

const InstagramIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function MobileMenu({
  isOpen,
  onClose,
  onBookNow,
}) {
  const navigate = useNavigate();
  const location = useLocation();

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
    { name: 'Barbers', href: '/barbers' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[60] pointer-events-auto"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-vintage-charcoal/95 backdrop-blur-3xl border-l border-white/[0.03] z-[70] flex flex-col pointer-events-auto overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.02] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-vintage-tan/[0.03] blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start px-8 pt-8 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-vintage-tan"></div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-vintage-tan">
                      Ginoong Barbero
                    </span>
                  </div>
                  <span className="text-[7px] text-white/20 uppercase tracking-[0.3em] block pl-3.5">
                    Premium Grooming
                  </span>
                </div>

                <motion.button 
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
                {/* Main Navigation */}
                <div>
                  <span className="text-[7px] font-bold text-white/15 uppercase tracking-[0.6em] block mb-5">
                    Navigate
                  </span>
                  <div className="space-y-1">
                    {mainLinks.map((link, idx) => {
                      const active = isActive(link.href);
                      return (
                        <motion.div
                          key={link.name}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx, ease: [0.19, 1, 0.22, 1] }}
                        >
                          <Link 
                            to={link.href}
                            onClick={onClose}
                            className={`relative flex items-center gap-4 py-3.5 group transition-all duration-300 ${
                              active ? 'pl-2' : 'pl-0'
                            }`}
                          >
                            {active && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-px bg-vintage-tan"></div>
                            )}
                            <span className={`text-3xl font-serif font-black uppercase tracking-tighter transition-all duration-500 ${
                              active
                                ? 'text-vintage-tan'
                                : 'text-white/70 group-hover:text-white group-hover:translate-x-1'
                            }`}>
                              {link.name}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Contact */}
                <div>
                  <span className="text-[7px] font-bold text-white/15 uppercase tracking-[0.6em] block mb-5">
                    Contact
                  </span>
                  <div className="space-y-3">
                    <a href="tel:+639159262361" className="flex items-center gap-3 text-white/30 hover:text-vintage-tan transition-colors py-2">
                      <Phone size={13} />
                      <span className="text-[10px] font-bold tracking-wider">0915 926 2361</span>
                    </a>
                    <a href="https://maps.google.com/?q=17.5608724,120.3855652" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/30 hover:text-vintage-tan transition-colors py-2">
                      <MapPin size={13} />
                      <span className="text-[10px] font-bold tracking-wider">Vigan City</span>
                    </a>
                    <div className="flex items-center gap-3 text-white/30 py-2">
                      <Clock size={13} />
                      <span className="text-[10px] font-bold tracking-wider">9AM — 6PM Daily</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <span className="text-[7px] font-bold text-white/15 uppercase tracking-[0.6em] block mb-5">
                    Follow Us
                  </span>
                  <div className="flex gap-3">
                    <a 
                      href="https://instagram.com/ginoongbarbero" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/40 hover:text-vintage-tan hover:border-vintage-tan/20 transition-all" 
                    >
                      <InstagramIcon size={15} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Instagram</span>
                    </a>
                    <a 
                      href="https://facebook.com/ginoongbarbero" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white/40 hover:text-vintage-tan hover:border-vintage-tan/20 transition-all" 
                    >
                      <FacebookIcon size={15} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Facebook</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-8 pb-8 pt-6 border-t border-white/5 space-y-4">
                <Link
                  to="/admin/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 py-3 text-[8px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-vintage-tan transition-colors border border-white/5 rounded-xl hover:border-vintage-tan/20"
                >
                  <Shield size={11} />
                  Admin Access
                </Link>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookNow}
                  className="relative w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-vintage-tan group-hover:bg-white transition-colors duration-500"></div>
                  <div className="absolute inset-0 border border-vintage-tan/30 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10 text-vintage-charcoal">Book Appointment</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
