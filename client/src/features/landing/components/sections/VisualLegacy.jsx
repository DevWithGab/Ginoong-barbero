import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { galleryAPI } from '../../../../services/galleryService';
import galleryFeature1 from '../../../../assets/gallery-feature/gallery-feature1.jpg';
import galleryFeature2 from '../../../../assets/gallery-feature/galleryfeature2.jpg';
import galleryFeature3 from '../../../../assets/gallery-feature/galleryfeature3.jpg';
import galleryFeature4 from '../../../../assets/gallery-feature/galleryfeature4.jpg';
import galleryFeature6 from '../../../../assets/gallery-feature/gallery-feature6.jpg';
import galleryFeature8 from '../../../../assets/gallery-feature/gallery-feature8.jpg';
import galleryFeature9 from '../../../../assets/gallery-feature/gallery-feature9.jpg';
import galleryFeature10 from '../../../../assets/gallery-feature/gallery-feature10.jpg';
import galleryFeature11 from '../../../../assets/gallery-feature/gallery-feature11.jpg';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_GALLERY = [
  { title: 'Our Barbers', category: 'Barbers', description: 'Masters of their craft with years of dedication to the art of barbering.', url: galleryFeature1 },
  { title: 'Modern Fades', category: 'Haircuts', description: 'Precision fades that define contemporary style with clean transitions.', url: galleryFeature2 },
  { title: 'Kids Haircut', category: 'Kids', description: 'Gentle and fun haircuts tailored for our youngest clients.', url: galleryFeature3 },
  { title: 'Maginoo Scents', category: 'Products', description: 'Premium grooming products curated for the distinguished gentleman.', url: galleryFeature4 },
  { title: 'Classic Cut', category: 'Haircuts', description: 'Timeless techniques that honor the traditions of barbering excellence.', url: galleryFeature6 },
  { title: 'Craftsmanship', category: 'Haircuts', description: 'Every cut is a testament to patience, skill, and attention to detail.', url: galleryFeature8 },
  { title: 'Precision Cut', category: 'Haircuts', description: 'Sharp lines and flawless execution define our signature precision cuts.', url: galleryFeature9 },
  { title: 'The Experience', category: 'Barbershop', description: 'More than a haircut — a ritual of relaxation and refinement.', url: galleryFeature10 },
  { title: 'The Shop', category: 'Barbershop', description: 'A space where vintage charm meets modern luxury.', url: galleryFeature11 },
];

export function VisualLegacy() {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const navLineRef = useRef(null);
  const infoRef = useRef(null);

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
      } else {
        setGalleryImages(DEFAULT_GALLERY);
      }
    } catch {
      setGalleryImages(DEFAULT_GALLERY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || galleryImages.length === 0) return;
    if (window.innerWidth < 768) return;

    const cards = cardsContainerRef.current?.querySelectorAll('.gallery-card');
    if (!cards || cards.length === 0) return;

    const totalItems = galleryImages.length;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalItems * 80}%`,
          pin: pinWrapRef.current,
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const rawIndex = progress * (totalItems - 1);
            const idx = Math.min(Math.round(rawIndex), totalItems - 1);

            if (navLineRef.current) {
              navLineRef.current.style.height = `${progress * 100}%`;
            }

            const infoItems = infoRef.current?.querySelectorAll('.info-slide');
            if (infoItems) {
              infoItems.forEach((item, i) => {
                item.style.opacity = i === idx ? '1' : '0';
                item.style.transform = i === idx ? 'translateY(0)' : 'translateY(10px)';
                item.style.position = i === idx ? 'relative' : 'absolute';
                item.style.pointerEvents = i === idx ? 'auto' : 'none';
              });
            }

            const counter = infoRef.current?.querySelector('.counter-text');
            if (counter) {
              counter.textContent = `${String(idx + 1).padStart(2, '0')}/${String(totalItems).padStart(2, '0')}`;
            }
          },
        },
      });

      cards.forEach((card, idx) => {
        gsap.set(card, {
          y: idx === 0 ? '0%' : '100%',
          scale: idx === 0 ? 1 : 0.85,
          opacity: idx === 0 ? 1 : 0,
          zIndex: totalItems - idx,
        });
      });

      tl.to({}, { duration: 0.5 });

      for (let i = 0; i < totalItems - 1; i++) {
        const fromCard = cards[i];
        const toCard = cards[i + 1];

        tl.to(fromCard, {
          y: '-100%',
          scale: 0.85,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }, 0.5 + i * 1.2);

        tl.to(toCard, {
          y: '0%',
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut',
        }, 0.5 + i * 1.2);

        tl.to({}, { duration: 0.6 }, 0.5 + i * 1.2 + 0.6);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, galleryImages]);

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

  const displayImages = galleryImages.length > 0 ? galleryImages : DEFAULT_GALLERY;

  return (
    <section ref={sectionRef} id="portfolio" className="relative bg-vintage-charcoal text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vintage-tan/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Desktop: Pinned scroll-driven gallery */}
      <div ref={pinWrapRef} className="hidden md:flex relative z-10 w-full h-screen">
        {/* Left: Info Panel */}
        <div ref={infoRef} className="w-full md:w-[35%] lg:w-[35%] h-full flex flex-col justify-center px-6 md:px-10 lg:px-24 relative">
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-vintage-tan font-slab italic mb-6 md:mb-8">
              <div className="w-8 md:w-12 h-px bg-gradient-to-r from-vintage-tan/60 to-transparent"></div>
              <span>The Archive</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold uppercase tracking-tighter leading-[0.85] mb-4 md:mb-6">
              Our <span className="text-vintage-tan italic">Gallery</span>
            </h2>
            <p className="text-xs md:text-sm font-slab italic text-white/80 max-w-xs md:max-w-sm">
              A curated collection of our finest work, each piece telling its own story.
            </p>
          </div>

          <div className="flex items-start gap-4 md:gap-8 lg:gap-10 mb-8 md:mb-12">
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-[2px] h-32 md:h-44 bg-white/[0.06]">
                <div
                  ref={navLineRef}
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-vintage-tan via-vintage-tan to-vintage-tan/40"
                  style={{ height: '0%' }}
                />
              </div>
              <div className="mt-3 text-[8px] md:text-[9px] font-mono text-white/20 counter-text">
                01/{String(displayImages.length).padStart(2, '0')}
              </div>
            </div>

            <div className="relative w-full min-h-[120px] md:min-h-[140px] pt-2">
              {displayImages.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="info-slide w-full"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? 'translateY(0)' : 'translateY(10px)',
                    position: idx === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: idx === 0 ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-vintage-tan font-slab italic">
                      {item.category}
                    </span>
                    <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-3xl font-serif font-bold text-white uppercase tracking-tight mb-2 md:mb-3 leading-[1.1]">
                    {item.title}
                  </h3>
                  <p className="text-[10px] md:text-[11px] text-white/35 font-slab italic leading-relaxed max-w-[200px] md:max-w-sm">
                    {item.description || item.category}
                  </p>
                  <div className="mt-3 md:mt-5 flex items-center gap-2 md:gap-3">
                    <div className="w-6 md:w-8 h-px bg-vintage-tan/30" />
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20">
                      Scroll to explore
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/gallery')}
            className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-vintage-tan hover:text-white transition-colors duration-500"
          >
            <span>Explore Full Collection</span>
            <div className="w-10 h-px bg-vintage-tan group-hover:w-16 transition-all duration-500" />
          </button>
        </div>

        {/* Right: Cards Carousel */}
        <div className="w-[65%] lg:w-[65%] h-full items-center justify-center relative overflow-hidden flex">
          <div className="absolute inset-y-0 left-0 w-[10%] lg:w-[15%] bg-gradient-to-r from-vintage-charcoal to-transparent z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[8%] lg:w-[10%] bg-gradient-to-l from-vintage-charcoal to-transparent z-30 pointer-events-none" />

          <div ref={cardsContainerRef} className="relative w-full max-w-sm md:max-w-lg lg:max-w-xl h-[60vh] md:h-[65vh] lg:h-[70vh] overflow-hidden">
            {displayImages.map((img, idx) => (
              <div
                key={img._id || idx}
                className="gallery-card absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full overflow-hidden bg-stone-900 border border-white/5 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover grayscale-[0.3] brightness-75"
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vintage-bg via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-white/10" />
                  <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-white/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-10">
                    <span className="text-vintage-tan text-[7px] md:text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] font-slab italic block mb-1 md:mb-2">
                      {img.category}
                    </span>
                    <h4 className="text-base md:text-lg lg:text-2xl font-serif font-bold text-white uppercase leading-none tracking-tighter">
                      {img.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Simple stacked scroll */}
      <div className="md:hidden relative z-10 px-6 py-24 flex flex-col gap-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-vintage-tan/60 to-transparent"></div>
            <span>The Archive</span>
          </div>
          <h2 className="text-4xl font-serif font-bold uppercase tracking-tighter leading-[0.85] mb-4">
            Our <span className="text-vintage-tan italic">Gallery</span>
          </h2>
          <p className="text-xs font-slab italic text-white/80">
            A curated collection of our finest work.
          </p>
        </div>

        {displayImages.map((img, idx) => (
          <div
            key={img._id || idx}
            className="w-full aspect-[3/4] bg-stone-900 border border-white/5 overflow-hidden relative shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover grayscale-[0.3] brightness-75"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vintage-bg via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-vintage-tan text-[8px] font-bold uppercase tracking-[0.5em] font-slab italic block mb-2">
                {img.category}
              </span>
              <h4 className="text-lg font-serif font-bold text-white uppercase leading-none tracking-tighter">
                {img.title}
              </h4>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate('/gallery')}
          className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-vintage-tan hover:text-white transition-colors duration-500 mt-4"
        >
          <span>Explore Full Collection</span>
          <div className="w-10 h-px bg-vintage-tan group-hover:w-16 transition-all duration-500" />
        </button>
      </div>
    </section>
  );
}

export default VisualLegacy;
