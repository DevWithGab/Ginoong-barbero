import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import logo from '../../assets/logo/ginoong-barbero_LOGO.png';

const BUSINESS_INFO = {
  name: 'Ginoong Barbero',
  location: 'Vigan City, Ilocos Sur',
  tagline: 'Excellence in Grooming',
};

export function Footer({ onBookNow }) {
  return (
    <footer className="pt-20 md:pt-40 pb-12 md:pb-20 px-4 md:px-6 bg-[#111] text-white relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center space-y-10 md:space-y-16 mb-16 md:mb-32">
          <div className="flex flex-col items-center group cursor-pointer w-full">
            <img 
              src={logo} 
              alt="Ginoong Barbero Logo" 
              className="h-20 sm:h-28 md:h-36 w-auto object-contain group-hover:opacity-90 transition-opacity duration-700"
            />
          </div>
          
          <p className="text-base sm:text-lg md:text-2xl font-serif italic text-white/50 max-w-2xl leading-relaxed px-4">
            "{BUSINESS_INFO.location}"
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-20">
            <Link 
              to="/gallery" 
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/30 hover:text-vintage-tan transition-colors focus:text-vintage-tan outline-none"
            >
              Gallery
            </Link>
            <Link 
              to="/our-story" 
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/30 hover:text-vintage-tan transition-colors focus:text-vintage-tan outline-none"
            >
              Our Story
            </Link>
            <Link 
              to="/barbers" 
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/30 hover:text-vintage-tan transition-colors focus:text-vintage-tan outline-none"
            >
              Barbers
            </Link>
            <button 
              onClick={() => onBookNow()} 
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-white/30 hover:text-vintage-tan transition-colors focus:text-vintage-tan outline-none cursor-pointer"
            >
              Booking
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-30 font-slab text-center">
            <span>{BUSINESS_INFO.location}</span>
            <span className="hidden sm:block w-1.5 h-1.5 bg-vintage-tan rounded-full shrink-0"></span>
            <span>Established 2025</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] font-slab text-center">
            
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-center">
              <Link to="/admin" className="text-vintage-tan/40 hover:text-vintage-tan transition-all sm:border-l sm:border-white/10 sm:pl-6 flex items-center justify-center gap-2">
                <Shield size={10} />
                Admin Login
              </Link>
              <span className="opacity-30">© 2025 {BUSINESS_INFO.name}.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%] opacity-40 pointer-events-none"></div>
    </footer>
  );
}