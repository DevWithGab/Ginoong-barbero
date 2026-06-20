import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

export function StaffDetailModal({
  staff,
  isOpen,
  onClose
}) {
  if (!staff) return null;

  const getStaffImage = () => {
    if (staff.profileImage) {
      return staff.profileImage.startsWith('http')
        ? staff.profileImage
        : `${API_BASE}${staff.profileImage}`;
    }
    if (staff.photo) {
      return staff.photo.startsWith('http')
        ? staff.photo
        : `${API_BASE}${staff.photo}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`;
  };

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
            className="relative w-full max-w-xl bg-vintage-card rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/10"
          >
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Header Actions */}
              <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 md:top-8 md:right-8 flex justify-between items-center z-20">
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-vintage-charcoal/80 sm:bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors">
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-vintage-charcoal/80 sm:bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 sm:p-12 md:p-16 flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative mb-6 sm:mb-8 pt-4 group">
                  <div className="absolute -inset-3 border border-vintage-tan/20 rounded-full scale-105 group-hover:scale-102 transition-transform duration-700"></div>
                  <img 
                    src={getStaffImage()} 
                    className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border-4 border-vintage-card" 
                    alt={staff.name} 
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Profile Info */}
                <div className="text-center space-y-2 mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white uppercase tracking-tight">{staff.name}</h2>
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-6 bg-vintage-tan/30"></div>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-vintage-tan italic font-slab">{staff.role}</p>
                    <div className="h-px w-6 bg-vintage-tan/30"></div>
                  </div>
                </div>

                <div className="w-full space-y-8 sm:space-y-12">
                  {/* Tab Buttons */}
                  <div className="flex gap-2 p-1 bg-white/5 rounded-full w-fit mx-auto">
                    <button className="px-6 py-2.5 sm:px-10 sm:py-3 bg-vintage-tan text-black rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl">Profile</button>
                    <button className="px-6 py-2.5 sm:px-10 sm:py-3 text-white/30 hover:text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-colors">Reviews</button>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/30">Appointments completed</span>
                      <span className="text-sm sm:text-base font-black text-white">{staff.appointmentsCompleted || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/30">Clients served</span>
                      <span className="text-sm sm:text-base font-black text-white">{staff.clientsServed || 0}</span>
                    </div>

                    {/* Languages */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-vintage-tan">Spoken Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {staff.languages?.map(lang => (
                          <span key={lang} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase text-white/70">{lang}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
