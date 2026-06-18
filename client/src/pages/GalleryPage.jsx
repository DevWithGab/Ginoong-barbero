import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Scissors,
  Sparkles,
  User,
  Clock,
  Star,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { galleryAPI } from "../services/galleryService";
import { Footer } from "../components/Layout/Footer";
import { LandingNavbar } from "../features/landing/components/navbar/LandingNavbar";

const CATEGORY_ICONS = {
  Featured: Trophy,
  Artistry: Scissors,
  Cuts: Sparkles,
  Equipment: User,
  Treatment: Clock,
  History: Star,
  Lounge: MapPin
};

export function GalleryPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await galleryAPI.getGalleryImages({ isActive: "true" });
        setImages(result.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(images.map((img) => img.category)))
  ];

  const filteredImages =
    filter === "All"
      ? images
      : images.filter((img) => img.category === filter);

  const getIcon = (cat) => {
    const Icon = CATEGORY_ICONS[cat];
    return Icon ? <Icon size={14} /> : null;
  };

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
      {/* Background Texture */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.05] pointer-events-none z-0" />

      {/* Background Large Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-black text-white/[0.01] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none">
        Our Work Gallery Photos
      </div>

      <div className="pt-36 pb-40 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex-1">
        <header className="mb-20 text-center flex flex-col items-center mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6"
          >
            <div className="w-8 h-px bg-vintage-tan/35" />
            <span>Our Work</span>
            <div className="w-8 h-px bg-vintage-tan/35" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-8"
          >
            The <span className="text-outline-white italic">Gallery</span>
          </motion.h1>

          <div className="max-w-2xl mx-auto mb-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-slab italic text-lg sm:text-xl md:text-2xl leading-relaxed"
            >
              A curated collection of our finest cuts, traditional shaves, and
              the distinctive atmosphere of Ginoong Barbero.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-4 group text-white/50 hover:text-vintage-tan transition-colors duration-300 mb-12"
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

          {/* Categories */}
          <div className="w-full relative overflow-visible mt-4">
            <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 w-full max-w-full justify-start md:justify-center md:flex-wrap no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-3 md:px-8 md:py-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 border flex items-center gap-2.5 relative group overflow-hidden focus:ring-1 focus:ring-vintage-tan outline-none shrink-0 snap-center md:snap-align-none ${
                    filter === cat
                      ? "bg-vintage-tan text-vintage-charcoal border-vintage-tan shadow-[0_12px_30px_-10px_rgba(201,168,76,0.3)]"
                      : "bg-white/5 text-white/30 border-white/5 hover:text-white/80 hover:border-white/20"
                  }`}
                >
                  <span className="relative z-10 shrink-0 opacity-60">
                    {getIcon(cat)}
                  </span>
                  <span className="relative z-10">{cat}</span>
                  {filter !== cat && (
                    <div className="absolute inset-0 bg-vintage-tan translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-expo" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </header>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 md:gap-12 justify-items-center w-full mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => (
              <motion.div
                key={img._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedImage(img)}
                className={`group relative overflow-hidden bg-stone-900 cursor-zoom-in ${
                  img.cols || "md:col-span-4"
                } col-span-full md:col-span-4 aspect-[4/5] md:aspect-auto h-auto md:h-[650px] lg:h-[700px] shadow-2xl w-full max-w-sm sm:max-w-none mx-auto`}
              >
                <motion.img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s] ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-vintage-bg via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-1000" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14">
                  <div className="space-y-2.5 transform translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-700 ease-expo">
                    <span className="text-vintage-tan text-[9px] font-bold uppercase tracking-[0.5em] block font-slab italic opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700">
                      {img.category}
                    </span>
                    <h4 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white uppercase leading-none tracking-tighter">
                      {img.title}
                    </h4>
                    <div className="pt-4 md:pt-6 border-t border-white/10 md:border-white/0 md:group-hover:border-white/10 transition-all duration-1000">
                      <div className="flex items-center gap-3">
                        <div className="h-px w-8 md:w-10 bg-vintage-tan/50 scale-x-100 md:scale-x-0 md:group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-1000">
                          View Photo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-t border-l border-white/15 md:border-white/0 md:group-hover:border-white/10 transition-all duration-1000" />
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-b border-r border-white/15 md:border-white/0 md:group-hover:border-white/10 transition-all duration-1000" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-3 sm:p-6 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-vintage-bg/98 backdrop-blur-2xl"
              onClick={() => setSelectedImage(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full max-w-5xl h-[80vh] md:h-[85vh] bg-stone-950/40 rounded-xl overflow-hidden group flex flex-col justify-between border border-white/5"
            >
              {/* Image */}
              <div className="flex-1 w-full h-full flex items-center justify-center relative p-2 sm:p-4 overflow-hidden">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh] max-w-full object-contain mx-auto transition-transform duration-500 rounded z-10"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-10 pointer-events-none scale-105"
                  style={{ backgroundImage: `url(${selectedImage.url})` }}
                  aria-hidden="true"
                />
              </div>

              {/* Close */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-vintage-charcoal/80 hover:bg-white text-white hover:text-vintage-charcoal rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all shadow-lg group/btn"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover/btn:text-black group-hover/btn:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 sm:p-8 z-20 flex flex-col items-center text-center">
                <div className="max-w-xl space-y-1 sm:space-y-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-vintage-tan font-slab italic">
                      {selectedImage.category}
                    </span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-tighter leading-none"
                  >
                    {selectedImage.title}
                  </motion.h3>
                  {selectedImage.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-[10px] sm:text-xs text-white/50 font-slab italic leading-relaxed"
                    >
                      {selectedImage.description}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Nav controls */}
              <div className="absolute inset-x-3 sm:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30">
                {[
                  { dir: "prev", icon: ChevronLeft },
                  { dir: "next", icon: ChevronRight }
                ].map(({ dir, icon: Icon }) => (
                  <button
                    key={dir}
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredImages.findIndex(
                        (i) => i._id === selectedImage._id
                      );
                      const nextIndex =
                        dir === "next"
                          ? (currentIndex + 1) % filteredImages.length
                          : (currentIndex - 1 + filteredImages.length) %
                            filteredImages.length;
                      setSelectedImage(filteredImages[nextIndex]);
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-vintage-charcoal/80 hover:bg-vintage-tan hover:text-vintage-charcoal text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all pointer-events-auto active:scale-95 shadow-lg"
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer onBookNow={() => navigate("/book")} />
    </div>
  );
}

export default GalleryPage;
