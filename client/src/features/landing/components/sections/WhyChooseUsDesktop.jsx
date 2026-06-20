import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { reasons } from './whyChooseUsData';

gsap.registerPlugin(ScrollTrigger);

export function WhyChooseUsDesktop() {
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const progressLineRef = useRef(null);
  const counterRef = useRef(null);
  const infoItemsRef = useRef(null);

  useEffect(() => {
    const cards = cardsContainerRef.current?.querySelectorAll('.feature-card');
    if (!cards || cards.length === 0) return;

    const totalItems = reasons.length;
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

            if (progressLineRef.current) {
              progressLineRef.current.style.height = `${progress * 100}%`;
            }

            if (counterRef.current) {
              counterRef.current.textContent = `0${idx + 1}/${String(totalItems).padStart(2, '0')}`;
            }

            const infoItems = infoItemsRef.current?.querySelectorAll('.info-item');
            if (infoItems) {
              infoItems.forEach((item, i) => {
                item.style.opacity = i === idx ? '1' : '0';
                item.style.transform = i === idx ? 'translateY(0)' : 'translateY(10px)';
                item.style.position = i === idx ? 'relative' : 'absolute';
                item.style.pointerEvents = i === idx ? 'auto' : 'none';
              });
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
  }, []);

  return (
    <div ref={pinWrapRef} className="hidden md:flex relative z-10 w-full h-screen">
      {/* Left: Info Panel */}
      <div className="w-full md:w-[38%] lg:w-[35%] h-full flex flex-col justify-center px-6 md:px-14 lg:px-20 pt-16 md:pt-24 relative">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6 md:mb-8">
            <div className="w-8 md:w-12 h-px bg-gradient-to-r from-vintage-tan/60 to-transparent"></div>
            <span>The Standard</span>
          </div>
          <h2 className="text-4xl md:text-4xl lg:text-7xl font-serif font-black uppercase tracking-tighter leading-[0.85] mb-4 md:mb-6 text-white">
            Why <br />
            <span className="text-vintage-tan italic font-normal">Choose Us</span>
          </h2>
          <p className="text-xs md:text-sm font-slab italic text-white/60 max-w-xs md:max-w-sm">
            We don't just cut hair; we elevate the daily ritual of grooming into a refined experience of masculinity and self-care.
          </p>
        </div>

        <div className="flex items-start gap-4 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-[2px] h-32 md:h-44 bg-white/[0.06]">
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-vintage-tan via-vintage-tan to-vintage-tan/40"
                style={{ height: '0%' }}
              />
            </div>
            <div className="mt-3 text-[8px] md:text-[9px] font-mono text-white/20" ref={counterRef}>
              01/06
            </div>
          </div>

          <div ref={infoItemsRef} className="relative w-full min-h-[140px] md:min-h-[160px] pt-2">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="info-item w-full"
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
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center rounded-full text-vintage-tan">
                      <Icon size={18} />
                    </div>
                    <span className="text-[9px] font-mono tracking-[0.4em] text-vintage-tan font-bold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-xl lg:text-3xl font-serif font-bold text-white uppercase tracking-tight mb-2 leading-[1.1]">
                    {item.title}
                  </h3>
                  <p className="text-[10px] md:text-[11px] text-white/40 font-slab italic leading-relaxed max-w-[250px] md:max-w-sm">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 md:gap-3">
                    <div className="w-6 md:w-8 h-px bg-vintage-tan/30" />
                    <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20">
                      Scroll to explore
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Cards Carousel */}
      <div className="w-[62%] lg:w-[65%] h-full items-center justify-center relative overflow-hidden flex pt-16 md:pt-24">
        <div className="absolute inset-y-0 left-0 w-[10%] lg:w-[15%] bg-gradient-to-r from-[#0a0a0a] to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[8%] lg:w-[10%] bg-gradient-to-l from-[#0a0a0a] to-transparent z-30 pointer-events-none" />

        <div ref={cardsContainerRef} className="relative w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
          {reasons.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="feature-card absolute inset-0 w-full h-full"
              >
                <div className="relative w-full h-full overflow-hidden bg-[#111] border border-white/5 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] rounded-xl group">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover grayscale-[0.2] brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-[1.5s]"
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-vintage-tan/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Corner Accents */}
                  <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-vintage-tan/30 rounded-tl-sm" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-vintage-tan/30 rounded-br-sm" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center rounded-full text-vintage-tan">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono tracking-[0.4em] text-vintage-tan font-bold">
                        0{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white uppercase leading-none tracking-tighter mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-white/40 text-[10px] md:text-xs font-slab italic leading-relaxed max-w-md hidden sm:block">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-3 pt-3">
                      <div className="w-8 h-px bg-vintage-tan/50" />
                      <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.3em] text-white/30">
                        The Standard
                      </span>
                    </div>
                  </div>

                  {/* Large Background Number */}
                  <span className="absolute -right-4 -bottom-8 text-[10rem] font-serif font-black text-white/[0.03] select-none pointer-events-none">
                    0{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
