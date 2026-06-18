import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Scissors, Sparkles, Quote } from 'lucide-react';
import { Footer } from '../components/Layout/Footer';
import { LandingNavbar } from '../features/landing/components/navbar/LandingNavbar';
import storyDp from '../assets/display-pics/story-dp-ginoo.jpg';

const BUSINESS_INFO = {
  name: "GINOONG BARBERO"
};

export default function OurStoryPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-vintage-bg min-h-screen relative overflow-hidden flex flex-col justify-between">
      <LandingNavbar />
      {/* Background Texture */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.05] pointer-events-none z-0" />
      
      {/* Background Large Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-black text-white/[0.01] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none">
        Our History Heritage Story
      </div>

      <div className="pt-36 pb-40 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto w-full relative z-10 flex-1">
        <header className="mb-20 text-center flex flex-col items-center mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6"
          >
            <div className="w-8 h-px bg-vintage-tan/35" />
            <span>Our History</span>
            <div className="w-8 h-px bg-vintage-tan/35" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-8"
          >
            Our <span className="text-outline-white italic">Story</span>
          </motion.h1>

          <div className="max-w-2xl mx-auto mb-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-slab italic text-lg sm:text-xl md:text-2xl leading-relaxed"
            >
              A decade of dedication to the art of traditional grooming, preserving the sacred rituals of the barber's chair.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-4 group text-white/50 hover:text-vintage-tan transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 relative flex items-center justify-center overflow-hidden bg-vintage-charcoal/30 group-hover:border-vintage-tan/30 transition-colors">
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-10 transition-transform duration-500"
              />
              <ArrowLeft
                size={14}
                className="translate-x-10 group-hover:translate-x-0 absolute transition-transform duration-500"
              />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              Back to Main
            </span>
          </motion.button>
        </header>

        <div className="space-y-48">
          <section className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="flex items-center gap-4 text-vintage-tan">
                <Clock size={16} className="opacity-40" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">The Beginning</h2>
              </div>
              <p className="text-3xl md:text-5xl font-serif font-bold text-white uppercase leading-tight tracking-tighter">
                Born from a <span className="italic text-vintage-tan">Sacred</span> desire to preserve the craft.
              </p>
              <p className="text-xl font-slab italic leading-relaxed text-white/50 border-l-2 border-vintage-tan/20 pl-10 max-w-xl">
                In an era of disposable culture, we chose the permanent. {BUSINESS_INFO.name} was established with a singular focus: honoring the traditions of traditional Filipino grooming that were being lost to time.
              </p>
            </div>
            
            <div className="relative group order-1 lg:order-2">
              <div className="aspect-[4/5] w-full overflow-hidden bg-stone-900 shadow-[60px_60px_120px_-30px_rgba(0,0,0,0.5)]">
                <img 
                  src={storyDp}
                  alt="Heritage Workshop Interior" 
                  className="w-full h-full object-cover brightness-100 group-hover:brightness-90 transition-all duration-[2s]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-vintage-bg/20 mix-blend-color group-hover:opacity-0 transition-opacity duration-1000"></div>
              </div>
              <div className="absolute top-10 -right-10 hidden xl:block">
                <div className="text-[12rem] font-serif font-bold text-white/[0.03] leading-none select-none">
                  EST.
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-20 py-40 border-y border-white/5 relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center space-y-12 relative z-10">
              <Quote className="text-vintage-tan/20 w-16 h-16 mx-auto" />
              <p className="text-3xl md:text-5xl font-serif italic text-vintage-tan leading-tight tracking-tight">
                "We do not merely groom hair; we cultivate the timeless presence of a gentleman in a world that has forgotten how to wait."
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="h-px w-12 bg-vintage-tan/20"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 italic">Kim Perez, Founder</span>
                <div className="h-px w-12 bg-vintage-tan/20"></div>
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-3 gap-16">
            {[
              { 
                icon: <Scissors size={32} />, 
                title: "Precision", 
                text: "Every cut is a calculated maneuver, executed with medical precision and artistic soul." 
              },
              { 
                icon: <Sparkles size={32} />, 
                title: "Silent Sanctuary", 
                text: "A rejection of digital noise. We provide a space where silence is respected and conversation is earned." 
              },
              { 
                icon: <Clock size={32} />, 
                title: "Time Honor", 
                text: "We believe a great service cannot be rushed. Excellence requires the luxury of time." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-white/[0.02] border border-white/5 space-y-6 group"
              >
                <div className="text-vintage-tan opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                  {item.icon}
                </div>
                <h4 className="text-2xl font-serif font-bold uppercase text-white tracking-tight">{item.title}</h4>
                <p className="text-lg font-slab italic text-white/50 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </section>

          <footer className="pt-20 flex flex-col items-center gap-12">
            <div className="text-center max-w-xl">
              <h3 className="text-2xl font-serif font-bold uppercase text-white mb-4">Be Part of the Legacy</h3>
              <p className="text-white/40 font-slab italic">Experience the rituals that have defined us for a decade.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
              className="group relative px-20 py-8 bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.6em] hover:text-vintage-charcoal transition-all overflow-hidden shadow-3xl"
            >
              <span className="relative z-10 transition-colors duration-500">See Services</span>
              <div className="absolute inset-0 bg-vintage-tan translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo"></div>
            </motion.button>
          </footer>
        </div>
      </div>
      <Footer onBookNow={() => navigate('/book')} />
    </div>
  );
}