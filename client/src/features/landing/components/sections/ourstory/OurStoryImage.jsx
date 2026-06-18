import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Scissors } from 'lucide-react';
import storyDp from '../../../../../assets/display-pics/story-dp-ginoo.jpg';

export function OurStoryImage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 10]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative group perspective-1000">
        <div className="aspect-[4/5] bg-stone-200 overflow-hidden relative shadow-[50px_50px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-1000 group-hover:shadow-[70px_70px_120px_-20px_rgba(0,0,0,0.2)]">
          <motion.div style={{ y }} className="w-full h-[130%] absolute top-[-15%] left-0">
            <img
              src={storyDp}
              alt="The Barber's Craft"
              className="w-full h-full object-cover brightness-[0.9] contrast-[1.1] transition-all duration-1000 group-hover:brightness-[1]"
              referrerPolicy="no-referrer"
            />
            {/* Light Leak Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-vintage-tan/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          </motion.div>

          {/* Internal Decorative Border */}
          <div className="absolute inset-8 border border-white/10 pointer-events-none z-20"></div>
          <div className="absolute inset-4 border border-white/5 pointer-events-none z-20"></div>
        </div>

        {/* Promise Card */}
        <motion.div
          style={{ rotate }}
          className="absolute -top-16 -right-20 w-48 h-64 bg-vintage-card shadow-2xl p-6 hidden lg:flex flex-col gap-4 border border-white/5 group-hover:scale-110 transition-transform duration-1000 z-30"
        >
          <div className="w-full h-full border border-vintage-tan/30 p-4 flex flex-col items-center text-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-3">
              Our Promise
            </span>
            <p className="text-[8px] leading-relaxed font-serif italic text-white/40">
              "Every man deserves to look his best. We make it happen."
            </p>
            <div className="mt-4 w-10 h-px bg-vintage-tan/40"></div>
          </div>
        </motion.div>

        {/* Quality Badge */}
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-vintage-charcoal border-4 border-vintage-bg shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700 z-40">
          <div className="w-[85%] h-[85%] rounded-full border border-vintage-tan/20 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] mb-1 text-vintage-tan/60">
              Quality
            </span>
            <span className="font-serif font-black text-2xl uppercase tracking-tighter text-vintage-tan">
              SUPREME
            </span>
            <Scissors size={14} className="mt-1 text-vintage-tan/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
