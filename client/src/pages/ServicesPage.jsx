import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  ArrowLeft,
  Clock,
  Search,
  Sparkles,
  Trophy,
  Compass,
  Heart,
  Wine,
  ChevronRight
} from "lucide-react";
import { serviceAPI } from "../services/serviceMenu";
import { Footer } from "../components/Layout/Footer";
import { LandingNavbar } from "../features/landing/components/navbar/LandingNavbar";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_BASE}${image}`;
};

const CATEGORY_DETAILS = [
  { id: "All", name: "All Services", subtitle: "Complete Sanctum", description: "Our entire range of tailored grooming treatments.", icon: Compass },
  { id: "Haircuts", name: "Haircuts", subtitle: "Sartorial Cuts", description: "Precision shear-work & clean custom clipper fades.", icon: Scissors },
  { id: "Packages", name: "Packages", subtitle: "Exclusive Packages", description: "Bespoke multi-step signature sensory treatments.", icon: Trophy },
];

const AMENITIES = [
  { title: "Chilled Elite Refreshments", description: "Unwind during your trim with a glass of single malt whiskey, local craft beer, espresso, or cooling loose tea.", icon: Wine },
  { title: "Therapeutic Towel Compress", description: "Every service starts or ends with warm or chilled towels steamed with natural menthol and organic essential oils.", icon: Sparkles },
  { title: "Anatomical Relieving Massage", description: "Includes a luxurious mechanical and manual shoulder, neck, and scalp massage using premium essential balms.", icon: Heart },
  { title: "Curated Product Guidance", description: "Get honest recommendations from our masters on selecting grooming clays, sea salt sprays, or skin elixirs.", icon: Compass },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredServiceId, setHoveredServiceId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await serviceAPI.getServices({ status: "Active" });
        setServices(result.data || []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const activeSpotlightService = useMemo(() => {
    const id = selectedServiceId || hoveredServiceId;
    if (id) {
      const found = services.find((s) => (s._id || s.id) === id);
      if (found) return found;
    }
    return filteredServices[0] || services[0];
  }, [hoveredServiceId, selectedServiceId, filteredServices, services]);

  useEffect(() => {
    if (filteredServices.length > 0) {
      const id = filteredServices[0]._id || filteredServices[0].id;
      setHoveredServiceId(id);
    }
  }, [selectedCategory, filteredServices]);

  const handleBookNow = (serviceName) => {
    navigate("/book", { state: { initialServiceName: serviceName } });
  };

  const handleServiceTap = (serviceId) => {
    setSelectedServiceId(serviceId);
    setHoveredServiceId(serviceId);
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
    <div className="bg-vintage-bg min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <LandingNavbar />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none z-0" />

      <div className="pt-36 sm:pt-40 pb-20 sm:pb-40 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 flex-1">
        {/* Header */}
        <header className="mb-10 sm:mb-20 text-center flex flex-col items-center mt-4 sm:mt-12 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-4 sm:mb-6"
          >
            <div className="w-6 sm:w-8 h-px bg-vintage-tan/35" />
            <span>Curated Catalog</span>
            <div className="w-6 sm:w-8 h-px bg-vintage-tan/35" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-4 sm:mb-8"
          >
            Our <span className="text-outline-white italic">Services</span>
          </motion.h1>

          <p className="text-white/40 font-slab italic text-sm sm:text-lg md:text-2xl leading-relaxed max-w-2xl mb-6 sm:mb-10 px-4">
            Every treatment is an intentional ritual — a blend of vintage craftsmanship and modern style.
          </p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group text-white/50 hover:text-vintage-tan transition-colors duration-300"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center bg-vintage-charcoal/30 group-hover:border-vintage-tan/30 transition-colors">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-500" />
            </div>
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em]">Back</span>
          </motion.button>
        </header>

        {/* Search + Category Filters */}
        <div className="sticky top-24 sm:top-24 z-10 bg-vintage-bg/95 backdrop-blur-sm pb-3 sm:pb-4 mb-4 sm:mb-6 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vintage-tan pointer-events-none" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 focus:border-vintage-tan/30 rounded-xl pl-9 pr-10 py-2.5 sm:py-3 text-xs text-white placeholder:text-white/20 outline-none transition-all font-slab"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-vintage-tan hover:text-white text-[9px] font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Desktop: 3-col grid | Mobile: horizontal scroll */}
          <div className="hidden sm:grid grid-cols-3 gap-2">
            {CATEGORY_DETAILS.map((cat) => {
              const IconComponent = cat.icon;
              const matchesCount = cat.id === "All" ? services.length : services.filter((s) => s.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(""); }}
                  className={`relative text-left border rounded-xl p-3 transition-all duration-300 flex items-center gap-2.5 outline-none focus-visible:ring-1 focus-visible:ring-vintage-tan cursor-pointer ${
                    isSelected ? "bg-vintage-card border-vintage-tan/40 shadow-lg" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    isSelected ? "bg-vintage-tan/10 text-vintage-tan border border-vintage-tan/20" : "bg-white/5 text-white/30 border border-white/5"
                  }`}>
                    <IconComponent size={13} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-[10px] font-serif font-bold uppercase tracking-wide truncate ${isSelected ? "text-vintage-tan" : "text-white/70"}`}>
                      {cat.name}
                    </h3>
                    <span className="text-[8px] font-mono text-white/25">{matchesCount} services</span>
                  </div>
                  {isSelected && <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-vintage-tan rounded-l" />}
                </button>
              );
            })}
          </div>

          {/* Mobile: horizontal scrollable pills */}
          <div className="flex sm:hidden gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {CATEGORY_DETAILS.map((cat) => {
              const matchesCount = cat.id === "All" ? services.length : services.filter((s) => s.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSearchQuery(""); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all shrink-0 ${
                    isSelected ? "bg-white text-black border-white" : "bg-transparent border-white/15 text-white/50"
                  }`}
                >
                  {cat.name}
                  <span className="opacity-50">{matchesCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop: Left/Right Panel Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: Service Cards */}
          <div className="col-span-7 space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => {
                  const serviceId = service._id || service.id;
                  const isActive = serviceId === (activeSpotlightService?._id || activeSpotlightService?.id);

                  return (
                    <motion.div
                      key={serviceId}
                      layout="position"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setHoveredServiceId(serviceId)}
                      onClick={() => setHoveredServiceId(serviceId)}
                      className={`relative overflow-hidden group border rounded-2xl p-6 transition-all duration-500 cursor-pointer ${
                        isActive
                          ? "bg-vintage-card/65 border-vintage-tan/30 shadow-2xl translate-x-1.5"
                          : "bg-white/[0.015] border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
                      }`}
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-vintage-tan" />}

                      <div className="flex items-center justify-between gap-4 relative z-10">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-vintage-tan font-mono uppercase tracking-[0.2em]">
                              {index < 9 ? `[ 0${index + 1} ]` : `[ ${index + 1} ]`}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-[0.3em] font-mono text-white/25 border border-white/5 px-2 py-0.5 rounded-full">
                              {service.category}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white leading-tight group-hover:text-vintage-tan transition-colors duration-400">
                            {service.name}
                          </h3>
                          <p className="text-white/40 text-xs leading-relaxed max-w-lg font-slab italic">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-4 gap-3.5">
                          <div className="text-right">
                            <span className="text-vintage-tan font-serif font-black text-2xl tracking-tighter">₱{service.price}</span>
                            <p className="text-[8px] font-mono text-white/20 tracking-widest uppercase">Steadfast price</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBookNow(service.name); }}
                            className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border outline-none cursor-pointer ${
                              isActive ? "bg-vintage-tan text-vintage-charcoal border-vintage-tan hover:bg-white shadow-md active:scale-95" : "bg-white/5 text-white/70 border-white/5 hover:border-white/10 hover:bg-white/10"
                            }`}
                          >
                            Book Session
                          </button>
                        </div>
                      </div>

                      <span className="absolute right-6 bottom-4 text-7xl font-bold font-serif opacity-[0.015] pointer-events-none select-none uppercase group-hover:opacity-[0.03] transition-opacity duration-700">
                        {service.category}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl py-24 text-center px-4">
                  <Scissors size={28} className="mx-auto text-white/15 animate-pulse mb-4" />
                  <h4 className="text-white/60 font-serif font-bold uppercase tracking-wider text-lg mb-1.5">No matching services found</h4>
                  <p className="text-white/30 text-xs italic font-slab max-w-sm mx-auto leading-relaxed">Try choosing a different style category.</p>
                  <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="mt-6 border border-white/10 hover:border-vintage-tan text-vintage-tan hover:text-white px-5 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white/5 transition-colors cursor-pointer">
                    Reset Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Spotlight Panel */}
          <div className="col-span-5">
            <div className="sticky top-28 space-y-6">
              <AnimatePresence mode="wait">
                {activeSpotlightService && (
                  <motion.div
                    key={activeSpotlightService._id || activeSpotlightService.id}
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-vintage-card/85 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-3xl text-left relative overflow-hidden"
                  >
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-vintage-tan/20 pointer-events-none z-10" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-vintage-tan/20 pointer-events-none z-10" />

                    <div className="space-y-6">
                      {activeSpotlightService.image && (
                        <div className="relative aspect-[16/10] w-full bg-stone-900 rounded-xl overflow-hidden shadow-inner border border-white/5 group">
                          <img
                            src={getImageUrl(activeSpotlightService.image)}
                            alt={activeSpotlightService.name}
                            className="w-full h-full object-cover brightness-[0.7] group-hover:scale-105 group-hover:brightness-95 transition-all duration-1000"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-vintage-tan bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/5">
                              {activeSpotlightService.category} Series
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/5">
                              <Clock size={12} className="text-vintage-tan shrink-0" /> {activeSpotlightService.duration} mins
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 border-b border-white/5 pb-4">
                        <h4 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-tight text-white leading-none">
                          {activeSpotlightService.name}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] font-mono font-slab italic">Included Treatment Ritual</span>
                          <span className="text-vintage-tan font-serif font-semibold text-lg sm:text-xl tracking-tight">₱{activeSpotlightService.price}</span>
                        </div>
                      </div>

                      {activeSpotlightService.description && (
                        <div className="space-y-3">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-vintage-tan/85 block font-mono">About This Service</span>
                          <p className="text-xs leading-relaxed text-white/50 font-slab italic">{activeSpotlightService.description}</p>
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          onClick={() => handleBookNow(activeSpotlightService.name)}
                          className="w-full bg-vintage-tan text-vintage-charcoal font-black text-[10px] uppercase tracking-[0.4em] py-4 rounded-xl hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-lg select-none"
                        >
                          Select & Book This Ritual
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-6 relative">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.3em] text-white/30 mb-4 block font-mono">Complimentary Guest Hospitality</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AMENITIES.slice(0, 2).map((item, index) => (
                    <div key={index} className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <item.icon size={13} className="text-vintage-tan" />
                        <h5 className="font-serif font-extrabold text-[11px] uppercase tracking-wider text-white">{item.title}</h5>
                      </div>
                      <p className="text-[10px] font-slab italic leading-relaxed text-white/40">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Service Cards */}
        <div className="lg:hidden space-y-3">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => {
              const serviceId = service._id || service.id;
              const isActive = serviceId === (activeSpotlightService?._id || activeSpotlightService?.id);
              const isMobileSelected = serviceId === selectedServiceId;

              return (
                <motion.div
                  key={serviceId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredServiceId(serviceId)}
                  onClick={() => handleServiceTap(serviceId)}
                  className={`relative overflow-hidden group border rounded-xl p-4 transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "bg-vintage-card/65 border-vintage-tan/30"
                      : "bg-white/[0.015] border-white/5 hover:border-white/10"
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-vintage-tan" />}

                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold text-vintage-tan font-mono uppercase tracking-[0.2em]">
                          {index < 9 ? `[ 0${index + 1} ]` : `[ ${index + 1} ]`}
                        </span>
                        <span className="text-[7px] font-bold uppercase tracking-[0.3em] font-mono text-white/25 border border-white/5 px-1.5 py-0.5 rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-base font-serif font-black uppercase text-white leading-tight mb-1">{service.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-white/40 flex items-center gap-1">
                          <Clock size={10} className="text-vintage-tan" /> {service.duration} min
                        </span>
                        <span className="text-[9px] font-black text-vintage-tan">₱{service.price}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-white/20 shrink-0 mt-2" />
                  </div>

                  <AnimatePresence>
                    {isMobileSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
                          {service.description && (
                            <p className="text-[10px] text-white/40 font-slab italic leading-relaxed">{service.description}</p>
                          )}
                          {activeSpotlightService?.image && isActive && (
                            <div className="relative aspect-[16/9] w-full bg-stone-900 rounded-lg overflow-hidden">
                              <img src={getImageUrl(activeSpotlightService.image)} alt={activeSpotlightService.name} className="w-full h-full object-cover brightness-[0.7]" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBookNow(service.name); }}
                            className="w-full bg-vintage-tan text-vintage-charcoal py-3 text-[9px] font-black uppercase tracking-[0.3em] rounded-xl active:scale-[0.98] transition-all"
                          >
                            Book This Service — ₱{service.price}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white/[0.01] border border-white/5 rounded-xl py-16 text-center px-4">
              <Scissors size={24} className="mx-auto text-white/15 animate-pulse mb-4" />
              <h4 className="text-white/60 font-serif font-bold uppercase tracking-wider text-base mb-1.5">No matching services</h4>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} className="mt-5 border border-white/10 hover:border-vintage-tan text-vintage-tan px-5 py-2 rounded-lg text-[9px] font-bold uppercase bg-white/5 transition-colors cursor-pointer">
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Amenities */}
        <section className="mt-20 sm:mt-32 pt-16 sm:pt-20 border-t border-white/5">
          <div className="text-center space-y-2 sm:space-y-3 mb-10 sm:mb-16">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em] text-vintage-tan font-slab italic">Barber Wellness</span>
            <h2 className="text-2xl sm:text-5xl font-serif font-black uppercase tracking-tighter text-white">
              Signature <span className="text-outline-white italic">Perks</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-slab italic max-w-lg mx-auto px-4">
              We complement our grooming with premium hospitality to ensure absolute relaxation.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {AMENITIES.map((amenity, index) => {
              const IconComp = amenity.icon;
              return (
                <div key={index} className="bg-white/[0.01] border border-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:border-vintage-tan/20 transition-all duration-500 relative group overflow-hidden text-left">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-vintage-tan/10 border border-vintage-tan/15 flex items-center justify-center text-vintage-tan mb-3 sm:mb-5 shrink-0">
                    <IconComp size={14} />
                  </div>
                  <h4 className="font-serif font-black text-[11px] sm:text-sm uppercase tracking-wide text-white mb-1.5 sm:mb-2">{amenity.title}</h4>
                  <p className="text-[9px] sm:text-xs font-slab leading-relaxed italic text-white/40 line-clamp-3">{amenity.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 sm:mt-40 relative text-center py-16 sm:py-28 border-t border-white/5 flex flex-col items-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vintage-bg px-8 sm:px-10">
            <Scissors size={28} className="text-vintage-tan/25" />
          </div>

          <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-vintage-tan/60 block mb-2 sm:mb-3 font-mono">Bespoke Experience</span>
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold uppercase tracking-tighter text-white/25 mb-6 sm:mb-12 px-4">
            The Complete <span className="italic">Grooming</span> Package
          </h2>

          <button
            onClick={() => handleBookNow()}
            className="bg-vintage-tan text-vintage-charcoal px-10 sm:px-20 py-5 sm:py-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.5em] transition-all shadow-[0_20px_45px_-12px_rgba(201,168,76,0.35)] hover:bg-white active:scale-[0.98] cursor-pointer select-none"
          >
            Custom Appointment
          </button>
        </div>
      </div>

      <Footer onBookNow={() => handleBookNow()} />
    </div>
  );
}
