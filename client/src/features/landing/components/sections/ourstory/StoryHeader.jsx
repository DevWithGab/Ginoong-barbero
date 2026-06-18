import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function StoryHeader() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic"
        >
          <div className="w-8 h-px bg-vintage-tan/40"></div>
          <span>Our Story</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold uppercase leading-[0.9] tracking-tighter text-white">
            Mastery <br />
            <span className="text-outline italic font-normal opacity-40">& Precision</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base md:text-lg font-slab italic leading-relaxed text-white/90 max-w-md"
        >
          Ginoong Barbero was born from a passion for the classic Filipino grooming heritage. We blend modern
          precision with the timeless art of the gentleman's haircut.
        </motion.p>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/our-story')}
          className="flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 relative flex items-center justify-center overflow-hidden">
            <ArrowLeft
              size={16}
              className="rotate-180 group-hover:translate-x-10 transition-transform duration-500 text-white"
            />
            <ArrowLeft
              size={16}
              className="rotate-180 -translate-x-10 group-hover:translate-x-0 absolute transition-transform duration-500 text-white"
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-vintage-tan transition-colors">
            Our Story
          </span>
        </button>
      </div>
    </div>
  );
}
