import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { OurStoryImage } from './ourstory/OurStoryImage';
import { StoryHeader } from './ourstory/StoryHeader';
import { StoryHighlights } from './ourstory/StoryHighlights';

export function OurStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const textX = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section
      id="our-story"
      ref={containerRef}
      className="py-32 md:py-56 px-6 relative bg-vintage-bg overflow-hidden border-y border-vintage-tan/10"
    >
      {/* Dynamic Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.08] pointer-events-none"></div>

      {/* Background Large Text - Interactive Parallax */}
      <motion.div
        style={{ x: textX }}
        className="absolute bottom-0 left-0 text-[10rem] md:text-[20rem] font-serif font-black text-white/[0.01] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none"
      >
        History Style Service Quality
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center mb-40">
          {/* Image Section */}
          <OurStoryImage />

          {/* Content Section */}
          <div>
            <StoryHeader />
            <div className="pt-12">
              <StoryHighlights />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-vintage-charcoal/[0.03] to-transparent pointer-events-none"></div>
    </section>
  );
}
