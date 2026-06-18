import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';

export function ServiceDetailModal({
  service,
  isOpen,
  selectedServices,
  onToggleService,
  onClose
}) {
  if (!service || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-vintage-card rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-10 md:p-12 border border-white/10"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="space-y-6 sm:space-y-10">
              {service.image && (
                <div className="relative aspect-[16/9] w-full bg-stone-900 rounded-xl overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              <div className="space-y-1 sm:space-y-2">
                <div className="text-vintage-tan text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] font-slab italic">Service Detail</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-tight leading-none pt-1">
                  {service.name}
                </h2>
              </div>

              <p className="text-white/60 text-sm md:text-md leading-relaxed font-slab italic">
                {service.description || "Experience a complete vintage grooming session with specialized techniques. Our expert barbers ensure you leave looking and feeling your absolute best."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-6 sm:pt-8 border-t border-white/5">
                <div className="space-y-1">
                  <div className="text-xl sm:text-2xl font-black text-vintage-tan">₱{service.price.toFixed(2)}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                    <Clock size={11} />
                    {service.duration} minutes
                  </div>
                </div>

                <button 
                  onClick={() => {
                    onToggleService(service);
                    onClose();
                  }}
                  className={`w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4.5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] transition-all active:scale-95 shadow-xl ${
                    selectedServices.find(s => s.id === service.id)
                    ? "bg-white text-black"
                    : "bg-vintage-tan text-black hover:bg-white"
                  }`}
                >
                  {selectedServices.find(s => s.id === service.id) ? "Remove service" : "Add service"}
                </button>
              </div>
            </div>

            {/* Ornamental corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-vintage-tan/20"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-vintage-tan/20"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
