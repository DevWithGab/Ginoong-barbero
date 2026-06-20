import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { galleryAPI } from '../../../../services/galleryService';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

const getImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
};

export function VisualLegacy() {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getGalleryImages({ isActive: 'true' });
      const images = response?.data;
      if (images && Array.isArray(images) && images.length > 0) {
        setGalleryImages(images.slice(0, 9));
      }
    } catch {
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-40 px-6 bg-vintage-charcoal text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-24">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-8">
              <div className="w-8 h-px bg-vintage-tan/40"></div>
              <span>The Archive</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif font-bold uppercase tracking-tighter leading-[0.8] mb-6">
              Our <span className="text-outline-white italic">Gallery</span>
            </h2>
          </div>
          <div className="flex justify-center items-center h-[500px] md:h-[700px]">
            <div className="w-8 h-8 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  const displayImages = galleryImages;

  if (displayImages.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 md:py-40 bg-vintage-charcoal text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-8"
          >
            <div className="w-8 h-px bg-vintage-tan/40"></div>
            <span>The Archive</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-8xl font-serif font-bold uppercase tracking-tighter leading-[0.85]"
            >
              Our <span className="text-vintage-tan italic">Gallery</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-slab italic text-white/60 max-w-sm"
            >
              A curated collection of our finest work, each piece telling its own story.
            </motion.p>
          </div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayImages.map((img, idx) => (
            <motion.div
              key={img._id || idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="flex-shrink-0 w-[85vw] md:w-[450px] lg:w-[500px] snap-center"
            >
              <div className="relative w-full aspect-[3/4] bg-stone-900 border border-white/5 overflow-hidden rounded-xl group cursor-pointer shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
                <img
                  src={getImageUrl(img.url)}
                  alt={img.title}
                  className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1.5s]"
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Corner Accents */}
                <div className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2 border-vintage-tan/20 rounded-tl-sm group-hover:border-vintage-tan/50 transition-colors duration-700" />
                <div className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2 border-vintage-tan/20 rounded-br-sm group-hover:border-vintage-tan/50 transition-colors duration-700" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-700 group-hover:-translate-y-2">
                  <span className="text-vintage-tan text-[8px] md:text-[9px] font-bold uppercase tracking-[0.5em] font-slab italic block mb-2">
                    {img.category}
                  </span>
                  <h4 className="text-xl md:text-2xl lg:text-3xl font-serif font-black text-white uppercase leading-none tracking-tighter mb-2">
                    {img.title}
                  </h4>
                  {img.description && (
                    <p className="text-white/40 text-[10px] md:text-xs font-slab italic leading-relaxed line-clamp-2 mb-3">
                      {img.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-0 h-px bg-vintage-tan group-hover:w-8 transition-all duration-500" />
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] text-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      View in Gallery
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 flex justify-center"
        >
          <button
            onClick={() => navigate('/gallery')}
            className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-vintage-tan hover:text-white transition-colors duration-500"
          >
            <span>Explore Full Collection</span>
            <div className="w-10 h-px bg-vintage-tan group-hover:w-16 transition-all duration-500" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default VisualLegacy;
