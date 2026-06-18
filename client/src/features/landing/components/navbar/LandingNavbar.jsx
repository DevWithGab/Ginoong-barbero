import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { useAppointments } from '../../../../hooks/useAPI';
import { NavLogo } from './NavLogo';
import { NavLinks } from './NavLinks';
import { NavActions } from './NavActions';
import { MobileMenu } from './MobileMenu';

export function LandingNavbar({ onBookNow }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, isBarber } = useAuth();

  const { data: pendingAppointments } = useAppointments(
    isAuthenticated ? { status: 'Pending', limit: 5 } : null
  );

  const pendingCount = pendingAppointments?.data?.length || 0;
  const todayAppointments = 0; // You can fetch this from your API

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  return (
    <>
      <nav 
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 flex justify-center px-4 md:px-12 pointer-events-none ${
          isScrolled ? 'py-4 md:py-6' : 'py-8 md:py-10'
        }`}
      >
        <div className={`w-full max-w-[1800px] mx-auto transition-all duration-700 relative overflow-hidden pointer-events-auto bg-vintage-charcoal/85 backdrop-blur-3xl px-4 md:px-12 ${
          isScrolled 
            ? 'rounded-2xl md:rounded-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)]' 
            : ''
        }`}>
          {/* Subtle Border Glow and Noise */}
          {isScrolled && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-vintage-tan/0 via-vintage-tan/[0.04] to-vintage-tan/0 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03] pointer-events-none"></div>
            </>
          )}

          {/* Bottom Border Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20"></div>

          {/* Scroll Progress Line */}
          {isScrolled && (
            <motion.div 
              className="absolute bottom-0 left-0 h-px bg-vintage-tan/30 z-20"
              style={{ width: `${scrollProgress}%` }}
            />
          )}

          <div className="flex justify-between items-center relative z-10 transition-all duration-500">
            {/* Left: Nav Links */}
            <div className="flex-1">
              <NavLinks layout="desktop" />
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <NavLogo isScrolled={isScrolled} />
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex justify-end">
              <NavActions 
                isAuthenticated={isAuthenticated}
                user={user}
                isAdmin={isAdmin}
                isBarber={isBarber}
                pendingCount={pendingCount}
                todayAppointments={todayAppointments}
                onBookNow={onBookNow}
                onLogout={handleLogout}
                layout="desktop"
              />

              {/* Mobile Menu Button */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden text-white p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 relative ml-4"
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
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        isAdmin={isAdmin}
        isBarber={isBarber}
        pendingCount={pendingCount}
        todayAppointments={todayAppointments}
        onBookNow={onBookNow}
        onLogout={handleLogout}
      />
    </>
  );
}
