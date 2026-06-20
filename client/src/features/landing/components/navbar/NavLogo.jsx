import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import logo from '../../../../assets/logo/ginoong-barbero_LOGO.png';

export function NavLogo({ isScrolled = false, onClick }) {
  const lenis = useLenis();
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      onClick={onClick || safeScrollToTop}
      className={`flex items-center group cursor-pointer transition-transform duration-700 ${isScrolled ? 'scale-90' : 'scale-100'}`}
    >
      <img 
        src={logo} 
        alt="Ginoong Barbero Logo" 
        className="h-12 md:h-14 lg:h-16 max-w-[140px] md:max-w-[160px] lg:max-w-[180px] w-auto object-contain group-hover:opacity-90 transition-opacity duration-700"
      />
    </motion.div>
  );
}
