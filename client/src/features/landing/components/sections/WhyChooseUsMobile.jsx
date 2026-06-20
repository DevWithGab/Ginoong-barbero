import { useRef, useCallback } from 'react';
import { reasons } from './whyChooseUsData';

export function WhyChooseUsMobile() {
  const scrollRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const dotsRef = useRef(null);
  const rafRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const idx = Math.min(Math.round(el.scrollLeft / el.offsetWidth), reasons.length - 1);

      if (progressRef.current) {
        progressRef.current.style.width = `${((idx + 1) / reasons.length) * 100}%`;
      }
      if (counterRef.current) {
        counterRef.current.textContent = `0${idx + 1}/${String(reasons.length).padStart(2, '0')}`;
      }
      if (dotsRef.current) {
        const dots = dotsRef.current.children;
        for (let i = 0; i < dots.length; i++) {
          dots[i].className = i === idx
            ? 'w-5 h-1.5 rounded-full bg-vintage-tan transition-all duration-300'
            : 'w-1.5 h-1.5 rounded-full bg-white/20 transition-all duration-300';
        }
      }
    });
  }, []);

  return (
    <div className="md:hidden relative z-10 pt-20 pb-10">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-vintage-tan/60 to-transparent"></div>
          <span>The Standard</span>
        </div>
        <h2 className="text-3xl font-serif font-bold uppercase tracking-tighter leading-[0.85] mb-3 text-white">
          Why <span className="text-vintage-tan italic">Choose Us</span>
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <span ref={counterRef} className="text-[10px] font-mono text-vintage-tan font-bold">
            01/{String(reasons.length).padStart(2, '0')}
          </span>
          <div className="flex-1 h-[1px] bg-white/10 relative">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-vintage-tan transition-all duration-300 ease-out"
              style={{ width: `${(1 / reasons.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {reasons.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="snap-center shrink-0 w-[80vw] bg-[#111] border border-white/5 overflow-hidden rounded-lg"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={224}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.75)' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute top-3 left-3 w-8 h-8 border border-white/20 bg-black/60 flex items-center justify-center rounded-full text-vintage-tan">
                  <Icon size={14} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[8px] font-mono tracking-[0.4em] text-vintage-tan font-bold block mb-1">
                    0{idx + 1}
                  </span>
                  <h4 className="text-lg font-serif font-black text-white uppercase leading-none tracking-tighter mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-white/40 text-[10px] font-slab italic leading-relaxed line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={dotsRef} className="px-6 mt-4 flex justify-center gap-1.5">
        {reasons.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              scrollRef.current?.scrollTo({ left: idx * scrollRef.current.offsetWidth, behavior: 'smooth' });
            }}
            className={`rounded-full transition-all duration-300 ${
              idx === 0
                ? 'w-5 h-1.5 bg-vintage-tan'
                : 'w-1.5 h-1.5 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
