import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Scissors, Shield } from 'lucide-react';
import { customerAPI } from '../../../../services/customerService';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default testimonials in case API fails
  const DEFAULT_TESTIMONIALS = [
    {
      quote: "Outstanding craftsmanship and attention to detail. My go-to barber shop in the city.",
      author: "Juan Santos",
      role: "Business Executive"
    },
    {
      quote: "The best barbershop experience I've had. Professional staff and premium service every time.",
      author: "Miguel Torres",
      role: "Entrepreneur"
    },
    {
      quote: "Exceptional quality and impeccable service. Highly recommended for any gentleman.",
      author: "Carlos Rivera",
      role: "Corporate Manager"
    }
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from backend
      const data = await customerAPI.getTestimonials?.();
      if (data && Array.isArray(data)) {
        setTestimonials(data.slice(0, 3)); // Limit to 3 testimonials
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    } catch (err) {
      console.warn('Failed to fetch testimonials from backend, using defaults:', err);
      setTestimonials(DEFAULT_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="testimonials" className="py-32 md:py-40 px-6 bg-vintage-bg overflow-hidden relative">
      {/* Background Parallax Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1800px] flex justify-center pointer-events-none opacity-[0.02]">
        <span className="text-[12rem] md:text-[18rem] font-serif font-black uppercase tracking-widest whitespace-nowrap">SATISFIED</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="space-y-4 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic"
            >
              <div className="w-8 h-px bg-vintage-tan/40"></div>
              <span>Customer Reviews</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tighter leading-tight">
              What <br/><span className="text-outline-dark italic font-normal">People Say</span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2 text-right opacity-60">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} className="text-vintage-tan fill-current" />)}
            </div>
            <p className="text-[9px] font-slab italic uppercase tracking-widest">Global Excellence</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400/60">
            <p className="text-sm">Failed to load testimonials</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-0 border border-white/5">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`p-10 relative flex flex-col items-start text-left group border-white/5 ${
                  idx !== 2 ? 'md:border-r' : ''
                } ${idx === 1 ? 'bg-vintage-card text-white' : 'bg-vintage-bg text-white'}`}
              >
                <Quote size={24} className={`mb-8 ${
                  idx === 1 ? 'text-vintage-tan' : 'text-vintage-tan/40'
                }`} />
                
                <p className="text-lg font-serif italic mb-10 leading-relaxed relative z-10 text-white/70">
                  "{t.quote}"
                </p>
                
                <div className="mt-auto relative z-10">
                  <h4 className="font-serif font-black uppercase text-lg tracking-tight mb-1 text-white">{t.author}</h4>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${
                    idx === 1 ? 'text-vintage-tan/80' : 'text-vintage-tan/60'
                  }`}>{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 opacity-20 grayscale pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Endorsed by the Plovdiv Gentlemen's Circle</span>
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-2">
              <Scissors size={14}/>
              <span className="font-serif font-bold text-sm italic uppercase">Mastery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14}/>
              <span className="font-serif font-bold text-sm italic uppercase">Safety</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
