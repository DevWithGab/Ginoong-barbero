import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { NavLogo } from './NavLogo';
import { NavLinks } from './NavLinks';
import { NavActions } from './NavActions';
import { MobileMenu } from './MobileMenu';

export function LandingNavbar({ onBookNow }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsScrolled(scrolled > 50);
      
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0) {
        setScrollProgress((scrolled / height) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <nav 
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 pointer-events-none ${
          isScrolled ? 'py-3 md:py-4' : 'py-5 md:py-7'
        }`}
      >
        <div className={`w-full max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pointer-events-auto transition-all duration-700 relative ${
          isScrolled ? 'px-3 md:px-6' : 'px-4 md:px-8 lg:px-12'
        }`}>
          {/* Main Nav Container */}
          <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isScrolled
              ? 'bg-vintage-charcoal/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)]'
              : 'bg-vintage-charcoal/60 backdrop-blur-xl'
          }`}>
            
            {/* Animated Border Glow (only when scrolled) */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -inset-px rounded-2xl pointer-events-none overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-vintage-tan/0 via-vintage-tan/10 to-vintage-tan/0 animate-[shimmer_3s_ease-in-out_infinite]"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inner Glass Effect (only when scrolled) */}
            {isScrolled && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            )}

            {/* Scroll Progress Bar */}
            {isScrolled && (
              <div className="absolute bottom-0 left-4 right-4 h-px bg-white/5 rounded-full overflow-hidden z-20">
                <motion.div 
                  className="h-full bg-gradient-to-r from-vintage-tan/40 via-vintage-tan/60 to-vintage-tan/40"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            )}

            {/* Content */}
            <div className={`grid grid-cols-[1fr_auto_1fr] items-center relative z-10 transition-all duration-500 ${
              isScrolled ? 'px-4 md:px-8 py-3' : 'px-4 md:px-8 py-4'
            }`}>
              {/* Left: Nav Links */}
              <div className="flex justify-start min-w-0">
                <NavLinks layout="desktop" />
              </div>

              {/* Center: Logo */}
              <div className="flex justify-center px-6 md:px-10">
                <NavLogo isScrolled={isScrolled} />
              </div>

              {/* Right: Actions */}
              <div className="flex justify-end items-center min-w-0">
                <NavActions
                  onBookNow={onBookNow}
                  layout="desktop"
                />

                {/* Mobile Menu Button */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className={`lg:hidden relative ml-4 transition-all duration-500 ${
                    isScrolled
                      ? 'p-2.5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10'
                      : 'p-2.5 rounded-full hover:bg-white/5'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu size={20} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onBookNow={onBookNow}
      />
    </>
  );
}
