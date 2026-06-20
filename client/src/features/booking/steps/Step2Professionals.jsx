import { motion } from 'framer-motion';
import { Check, User, Users } from 'lucide-react';

export function Step2Professionals({ 
  selectedStaff, 
  onSelectStaff,
  onViewStaffDetail,
  barbers = []
}) {
  const getBarberId = (b) => b?._id || b?.id;

  return (
    <div className="space-y-4">
      {/* Any Available Option */}
      <div 
        onClick={() => onSelectStaff({ id: "any", name: "Any available", role: "Specialist Match", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200" })}
        className={`p-5 sm:p-6 rounded-xl border transition-all duration-500 cursor-pointer flex items-center gap-5 sm:gap-6 relative group overflow-hidden ${
          selectedStaff?.id === "any" 
            ? 'bg-vintage-card/80 border-vintage-tan scale-[1.01] shadow-2xl shadow-vintage-tan/5' 
            : 'bg-vintage-card/30 border-white/5 hover:border-white/15'
        }`}
      >
        {selectedStaff?.id === "any" && (
          <div className="absolute -inset-[100%] bg-[linear-gradient(45deg,transparent_25%,rgba(201,168,76,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite_linear]" />
        )}

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-vintage-tan/5 flex items-center justify-center text-vintage-tan border border-vintage-tan/20 shrink-0 relative z-10">
          <Users size={28} className="sm:w-10 sm:h-10 text-vintage-tan" />
        </div>

        <div className="flex-1 min-w-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <h3 className="font-serif font-black text-lg sm:text-2xl uppercase tracking-tight text-white mb-0.5 truncate">
              Any available barber
            </h3>
            <span className="bg-vintage-tan/10 text-vintage-tan text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-vintage-tan/15 select-none font-mono">
              Flexible
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed font-slab italic">
            Guarantees you lock in your preferred schedule immediately. We will assign the top available master artisan to your block.
          </p>
        </div>

        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 relative z-10 ${
          selectedStaff?.id === "any" 
            ? 'bg-vintage-tan text-black hover:bg-white' 
            : 'border border-white/10 text-white/20 group-hover:border-white/30 group-hover:text-white'
        }`}>
          {selectedStaff?.id === "any" ? <Check size={18} strokeWidth={3.5} /> : <span className="text-xl font-bold font-mono">+</span>}
        </div>
      </div>

      {/* Barber Roster */}
      <div className="space-y-4 pt-2">
        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-vintage-tan/75 ml-1">Distinguished Craftsmen</h4>
        
        {barbers.map((member, idx) => {
          const memberId = getBarberId(member);
          const isSelected = getBarberId(selectedStaff) === memberId;
          return (
            <motion.div
              key={memberId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => onSelectStaff(member)}
              className={`p-5 sm:p-6 rounded-xl border transition-all duration-500 cursor-pointer flex items-center gap-5 sm:gap-6 relative group ${
                isSelected 
                  ? 'bg-vintage-card/80 border-vintage-tan scale-[1.01] shadow-2xl shadow-vintage-tan/5' 
                  : 'bg-vintage-card/30 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`absolute -inset-1 border rounded-full transition-transform duration-700 ${isSelected ? "border-vintage-tan scale-105" : "border-transparent group-hover:scale-105 group-hover:border-white/15"}`}></div>
                <img 
                  src={member.profileImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200"} 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-white/10 shadow-lg relative z-10 transition-all duration-500 ${isSelected ? 'grayscale-0 contrast-105' : 'grayscale group-hover:grayscale-0'}`} 
                  alt={member.name} 
                  referrerPolicy="no-referrer" 
                />
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <h3 className="font-serif font-black text-lg sm:text-2xl uppercase tracking-tight text-white mb-0.5 truncate">
                  {member.name}
                </h3>
                
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[8px] sm:text-[9px] text-vintage-tan tracking-[0.2em] uppercase font-black">
                    {member.role}
                  </span>
                  <span className="text-white/20 text-xs font-mono select-none">·</span>
                  <span className="text-[10px] text-white/40 font-bold font-mono">
                    ★ 4.9 ({member.appointmentsCompleted || 0}+ cuts)
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-white/45 font-slab italic leading-relaxed line-clamp-2 max-w-lg mb-2">
                  {member.bio || "Crafting tailored classic and contemporary treatments with strict attention to grooming details."}
                </p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewStaffDetail(member);
                  }}
                  className="text-[9px] sm:text-[10px] text-vintage-tan/80 font-black uppercase tracking-widest hover:text-white transition-all underline underline-offset-4 cursor-pointer"
                >
                  View Portfolio Profile
                </button>
              </div>

              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                isSelected 
                  ? 'bg-vintage-tan text-black hover:bg-white' 
                  : 'border border-white/10 text-white/20 group-hover:border-white/30 group-hover:text-white hover:bg-white/5'
              }`}>
                {isSelected ? <Check size={18} strokeWidth={3.5} /> : <span className="text-xl font-bold font-mono">+</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
