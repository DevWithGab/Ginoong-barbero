import { useState, useRef, useCallback } from 'react';
import { Clock, Check, Search, X } from 'lucide-react';

const SERVICE_CATEGORIES = ["Haircuts", "Beard", "Hair Color", "Add-ons", "Packages"];

export function Step1Services({ 
  selectedServices, 
  onToggleService, 
  onViewServiceDetail,
  activeCategory,
  onCategoryChange,
  services = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef(null);

  const servicesByCategory = {};
  services.forEach(s => {
    const cat = s.category || 'Other';
    if (!servicesByCategory[cat]) servicesByCategory[cat] = [];
    servicesByCategory[cat].push(s);
  });

  const categories = Object.keys(servicesByCategory);
  
  const filteredServices = searchQuery.trim()
    ? services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : servicesByCategory[activeCategory] || [];

  const getServiceId = (s) => s._id || s.id;

  const handleCardKeyDown = useCallback((e, s) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewServiceDetail(s);
    }
  }, [onViewServiceDetail]);

  const handleToggleKeyDown = useCallback((e, s) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onToggleService(s);
    }
  }, [onToggleService]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-220px)]">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs font-slab text-white placeholder:text-white/25 focus:outline-none focus:border-vintage-tan/40 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Tabs - Sticky */}
      <div className="sticky top-0 z-10 bg-vintage-bg/95 backdrop-blur-sm pb-3 mb-1 border-b border-white/5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { onCategoryChange(cat); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border transition-all shrink-0 ${
                activeCategory === cat && !searchQuery
                ? "bg-white text-black border-white"
                : "bg-transparent border-white/15 text-white/50 hover:border-white/30"
              }`}
            >
              {cat}
              <span className="ml-1.5 opacity-50">
                {(servicesByCategory[cat] || []).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Service Cards */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 scroll-smooth"
        role="listbox"
        aria-label="Available services"
      >
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-xs font-slab italic">
            {searchQuery ? 'No services match your search' : 'No services in this category'}
          </div>
        ) : (
          filteredServices.map(s => {
            const isSelected = selectedServices.find(item => getServiceId(item) === getServiceId(s));
            return (
              <div
                key={getServiceId(s)}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => onViewServiceDetail(s)}
                onKeyDown={(e) => handleCardKeyDown(e, s)}
                className="bg-vintage-card px-4 py-3 rounded-xl border border-white/5 group hover:border-white/10 transition-colors cursor-pointer outline-none focus-visible:border-vintage-tan/50 focus-visible:ring-1 focus-visible:ring-vintage-tan/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif font-black text-[12px] sm:text-[13px] md:text-sm uppercase tracking-tight leading-tight truncate">{s.name}</h3>
                      <span className="font-bold text-[11px] sm:text-xs md:text-sm shrink-0 text-vintage-tan">₱{s.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] text-white/35 flex items-center gap-1">
                        <Clock size={8} className="shrink-0" /> {s.duration} min
                      </p>
                      {s.description && (
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-white/25 font-slab italic truncate hidden md:block">
                          — {s.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleService(s);
                    }}
                    onKeyDown={(e) => handleToggleKeyDown(e, s)}
                    tabIndex={-1}
                    aria-label={isSelected ? `Remove ${s.name}` : `Add ${s.name}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                      ? "bg-vintage-tan border-vintage-tan text-black"
                      : "border-white/10 group-hover:border-white/30 text-white/40"
                    }`}
                  >
                    {isSelected ? <Check size={12} strokeWidth={3} /> : <span className="text-sm leading-none">+</span>}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
