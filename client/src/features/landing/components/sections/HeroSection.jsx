import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import heroBg from '../../../../assets/background/hero-bg-ginoo.jpg';

export function HeroSection({ onBookNow }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-vintage-charcoal">
      <div id="main-content" className="sr-only">Main Content Start</div>
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] font-serif font-bold text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter leading-none z-0">
        Story
      </div>

      <div className="grid lg:grid-cols-2 w-full h-full min-h-screen relative z-10">
        {/* Left Content */}
        <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-40 pb-20 md:pt-48 md:py-20 lg:py-20 bg-vintage-charcoal/40 backdrop-blur-sm">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
            className="max-w-2xl"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center gap-6 mb-12"
            >
              <div className="w-12 h-px bg-vintage-tan/50"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-vintage-tan font-slab italic">Est. 2025 -- Premium Grooming</span>
            </motion.div>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-black uppercase leading-[0.8] tracking-tighter mb-12"
            >
              <span className="text-outline-white-heavy">Ginoong</span> <br/>
              <span className="text-white italic font-normal">Barbero</span>
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="text-base md:text-lg text-white/60 mb-16 leading-relaxed max-w-md font-slab italic"
            >
              At Ginoong Barbero, we honor the timeless craft of barbering — where every cut is a conversation between tradition and the man who wears it. Our skilled barbers deliver precision, confidence, and a signature look that speaks volumes before you say a word.
            </motion.p>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-5 sm:gap-10"
            >
              <div className="relative group">
                <button 
                  onClick={() => onBookNow()}
                  className="relative z-10 bg-vintage-tan text-vintage-charcoal px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all flex items-center gap-4 group"
                >
                  Reserve Your Chair
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <div className="absolute -inset-2 border border-vintage-tan/20 z-0 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
              </div>
              
              <Link
                to="/services"
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-white hover:text-vintage-tan transition-colors flex items-center gap-4 group relative py-2"
              >
                Explore Services
                <span className="group-hover:translate-x-1 transition-transform">→</span>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-vintage-tan group-hover:w-full transition-all duration-500"></div>
              </Link>
            </motion.div>

            {/* Quick Contact Bar */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 sm:gap-10 text-[9px] uppercase tracking-[0.2em] text-white/40"
            >
              <div className="flex items-center gap-3">
                <Phone size={12} className="text-vintage-tan" />
                <span>0915 926 2361</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={12} className="text-vintage-tan" />
                <span>Vigan City</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Image Container */}
        <div className="relative h-[50vh] sm:h-[70vh] lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full overflow-hidden group perspective-1000">

          <motion.div
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 1.2, ease: "easeOut" }
            }}
            className="w-full h-full relative"
          >
            <img 
              src={heroBg}
              alt="Professional Barbering Detail" 
              className="w-full h-full object-cover brightness-[0.6] contrast-110 saturate-[1.2] group-hover:brightness-[0.8] transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            
            {/* Cinematic Warm Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-vintage-charcoal via-vintage-charcoal/10 to-transparent group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-vintage-charcoal via-transparent to-transparent opacity-80"></div>
            <div className="absolute inset-0 bg-vintage-tan/5 mix-blend-overlay group-hover:bg-vintage-tan/10 transition-colors duration-1000"></div>

            {/* Hover Grain Lightening */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] pointer-events-none"></div>
          </motion.div>

          {/* Corner Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 flex items-center gap-5 bg-vintage-charcoal/80 backdrop-blur-xl border border-white/10 px-4 sm:px-8 py-3 sm:py-5 text-[11px] font-bold tracking-[0.4em] text-white uppercase group cursor-default shadow-2xl z-50 shadow-black/50"
          >
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-vintage-tan rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-vintage-tan rounded-full animate-ping opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] opacity-40 mb-1">Status</span>
              <span>Open for Bookings</span>
            </div>
          </motion.div>

          {/* Floating Ornaments */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
            <div className="w-[600px] h-[600px] border border-white/[0.03] rounded-full animate-[spin_60s_linear_infinite]"></div>
            <div className="absolute inset-0 w-[400px] h-[400px] border border-white/[0.05] rounded-full m-auto animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Visual */}
      <div className="absolute bottom-12 left-12 h-20 w-px bg-white/10 overflow-hidden hidden md:block">
        <motion.div 
          animate={{ y: [0, 80] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-1/2 bg-vintage-tan"
        />
      </div>
    </section>
  );
}

export default HeroSection;
