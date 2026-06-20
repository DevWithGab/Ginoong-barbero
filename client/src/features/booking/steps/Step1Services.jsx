import { useState, useRef, useCallback } from 'react';
import { Clock, Check, Search, X, ChevronRight, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const getImageUrl = (image) => {
  if (!image) return null;
  return image.startsWith('http') ? image : `${API_BASE}${image}`;
};

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
  const [expandedCategories, setExpandedCategories] = useState([activeCategory || 'Haircuts']);
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
    : null;

  const getServiceId = (s) => s._id || s.id;

  const toggleCategory = (cat) => {
    setExpandedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

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

  if (searchQuery.trim()) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs font-slab text-white placeholder:text-white/25 focus:outline-none focus:border-vintage-tan/40 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-xs font-slab italic">No services match your search</div>
          ) : (
            filteredServices.map((s, idx) => (
              <ServiceCard key={getServiceId(s)} service={s} index={idx} selectedServices={selectedServices} onToggleService={onToggleService} onViewServiceDetail={onViewServiceDetail} />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-xs font-slab text-white placeholder:text-white/25 focus:outline-none focus:border-vintage-tan/40 transition-colors"
        />
      </div>

      <div className="space-y-6">
        {categories.map(category => {
          const catServices = servicesByCategory[category] || [];
          const isExpanded = expandedCategories.includes(category);
          const hasSelectedService = catServices.some(s =>
            selectedServices.some(sel => getServiceId(sel) === getServiceId(s))
          );

          return (
            <div key={category} className="space-y-5">
              <button
                onClick={(e) => { e.stopPropagation(); toggleCategory(category); }}
                className="relative z-10 w-full bg-white/[0.02] border border-white/5 hover:border-vintage-tan/30 rounded-xl p-5 sm:p-6 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif font-black uppercase text-base sm:text-lg text-white tracking-wide group-hover:text-vintage-tan transition-colors">
                    {category} Series
                  </span>
                  <span className="ml-2 text-[9px] font-mono bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
                    {catServices.length} Ritual{catServices.length !== 1 && 's'}
                  </span>
                  {hasSelectedService && (
                    <span className="bg-vintage-tan/20 text-vintage-tan text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border border-vintage-tan/30 ml-2">
                      Selected
                    </span>
                  )}
                </div>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${isExpanded ? "border-vintage-tan bg-vintage-tan/10 text-vintage-tan" : "border-white/10 text-white/40 group-hover:text-white"}`}>
                  <ChevronRight size={14} className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pt-2 pb-2 px-1">
                      {catServices.map((s, idx) => (
                        <ServiceCard key={getServiceId(s)} service={s} index={idx} selectedServices={selectedServices} onToggleService={onToggleService} onViewServiceDetail={onViewServiceDetail} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceCard({ service, index, selectedServices, onToggleService, onViewServiceDetail }) {
  const getServiceId = (s) => s._id || s.id;
  const isSelected = selectedServices.some(item => getServiceId(item) === getServiceId(service));
  const isPremium = (service.price || 0) >= 800;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onViewServiceDetail(service)}
      className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 relative group/item cursor-pointer flex items-center gap-4 sm:gap-5 ${
        isSelected
          ? "bg-vintage-card/60 shadow-[inset_0_0_0_1px_rgba(201,168,76,0.5)] border-vintage-tan/50 shadow-2xl"
          : "bg-vintage-card/30 border-white/5 hover:border-white/15 hover:bg-vintage-card/45"
      }`}
    >
      {/* Service Image */}
      {getImageUrl(service.image) && (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0 group-hover/item:border-vintage-tan/30 transition-colors">
          <img
            src={getImageUrl(service.image)}
            alt={service.name}
            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="space-y-2.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="font-serif font-black text-xl sm:text-2xl uppercase tracking-tight text-white group-hover/item:text-vintage-tan transition-colors">
            {service.name}
          </h3>
          {isPremium && (
            <span className="bg-vintage-tan/10 text-vintage-tan text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-vintage-tan/20 flex items-center gap-1">
              <Sparkles size={8} />
              Premium Ritual
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-white/60">
            <Clock size={11} className="text-vintage-tan" /> {service.duration} mins
          </span>
        </div>

        <p className="text-[11px] sm:text-xs font-slab italic text-white/50 leading-relaxed max-w-xl line-clamp-2">
          {service.description || "Indulge in a premium, time-honored grooming treatment designed specifically for discerning gentlemen."}
        </p>
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-between shrink-0 gap-3 sm:gap-4 pt-4 sm:pt-0 border-t border-white/5 sm:border-0">
        <div className="text-right">
          <span className="text-white/30 text-[8px] font-bold uppercase tracking-wider block sm:mb-0.5">Session Price</span>
          <span className="font-black text-lg sm:text-xl text-white group-hover/item:text-vintage-tan transition-colors">₱{service.price}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleService(service);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer shadow-lg ${
            isSelected
              ? "bg-vintage-tan border-vintage-tan text-black shadow-vintage-tan/20 scale-105"
              : "border-white/10 text-white/60 hover:border-white/30 hover:bg-white/5"
          }`}
          title={isSelected ? "Remove service" : "Add service"}
        >
          {isSelected ? <Check size={18} strokeWidth={3.5} /> : <span className="text-xl font-bold font-mono">+</span>}
        </button>
      </div>
    </motion.div>
  );
}
