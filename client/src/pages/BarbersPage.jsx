import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Quote } from "lucide-react";
import { barberAPI } from "../services/barberService";
import { BarberCard } from "../features/booking/components/BarberCard";
import { StaffDetailModal } from "../features/booking/components/StaffDetailModal";
import { Footer } from "../components/Layout/Footer";
import { LandingNavbar } from "../features/landing/components/navbar/LandingNavbar";

export default function BarbersPage() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStaffDetail, setActiveStaffDetail] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const result = await barberAPI.getActiveBarbers();
        setBarbers(result.data || []);
      } catch (err) {
        console.error("Failed to fetch barbers:", err);
        setError("Failed to load barbers");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

  if (loading) {
    return (
      <div className="bg-vintage-bg min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-vintage-bg min-h-screen flex items-center justify-center">
        <p className="text-white/40 font-slab italic">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-vintage-bg min-h-screen relative overflow-hidden flex flex-col justify-between">
      <LandingNavbar />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.05] pointer-events-none z-0" />

      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-black text-white/[0.01] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none">
        Master Barbers Artisan Craft
      </div>

      <div className="pt-40 pb-40 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex-1">
        <header className="mb-20 text-center flex flex-col items-center mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6"
          >
            <div className="w-8 h-px bg-vintage-tan/35" />
            <span>Our Barbers</span>
            <div className="w-8 h-px bg-vintage-tan/35" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-8"
          >
            Master <span className="text-outline-white italic">Barbers</span>
          </motion.h1>

          <div className="max-w-2xl mx-auto mb-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-slab italic text-lg sm:text-xl md:text-2xl leading-relaxed"
            >
              Meet the artisans behind the chair. Each barber brings a lifetime
              of dedication and a unique perspective to the craft of masculine
              grooming.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-20 justify-items-center w-full mx-auto">
          {barbers.map((barber, index) => (
            <BarberCard
              key={barber._id}
              barber={barber}
              index={index}
              onClick={setActiveStaffDetail}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-32 pt-20 md:pt-32 border-t border-white/5 text-center flex flex-col items-center"
        >
          <Quote className="text-vintage-tan/20 w-12 h-12 md:w-20 md:h-20 mb-6 md:mb-12" />
          <h3 className="text-xl sm:text-3xl md:text-6xl font-serif font-bold italic text-white/80 max-w-3xl leading-tight tracking-tight px-4">
            "A true barber shop is the last of the sacred sanctuaries for a
            man."
          </h3>
          <div className="mt-6 md:mt-12 w-16 md:w-20 h-px bg-vintage-tan/30" />
        </motion.div>
      </div>

      <StaffDetailModal
        staff={activeStaffDetail}
        isOpen={!!activeStaffDetail}
        onClose={() => setActiveStaffDetail(null)}
      />

      <Footer onBookNow={() => navigate("/book")} />
    </div>
  );
}
