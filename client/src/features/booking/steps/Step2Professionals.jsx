import { motion } from 'framer-motion';
import { Check, User } from 'lucide-react';

export function Step2Professionals({ 
  selectedStaff, 
  onSelectStaff,
  onViewStaffDetail,
  barbers = []
}) {
  const getBarberId = (b) => b?._id || b?.id;
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Any Available Option */}
      <div 
        onClick={() => onSelectStaff({ id: "any", name: "Any available", role: "Specialist", photo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200" })}
        className={`p-3 sm:p-5 rounded-xl border transition-all duration-500 cursor-pointer flex items-center gap-3 sm:gap-5 ${
          selectedStaff?.id === "any" 
          ? 'bg-vintage-card border-vintage-tan scale-[1.01] shadow-2xl' 
          : 'bg-vintage-card border-white/5 hover:border-white/10'
        }`}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 flex items-center justify-center text-vintage-tan border border-white/5 shrink-0">
          <User size={20} className="sm:size-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-black text-lg sm:text-2xl uppercase tracking-tight mb-1 truncate">Any available</div>
          <p className="text-[10px] sm:text-[11px] text-white/40 font-slab italic line-clamp-1 sm:line-clamp-none">Select any available barber for your preferred time.</p>
        </div>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${selectedStaff?.id === "any" ? 'bg-vintage-tan text-black' : 'border border-white/10 text-white/10'}`}>
          {selectedStaff?.id === "any" ? <Check size={16} strokeWidth={3} /> : <span className="text-base leading-none">+</span>}
        </div>
      </div>

      {/* Staff Members */}
      {barbers.map((member) => {
        const memberId = getBarberId(member);
        return (
          <div 
            key={memberId}
            onClick={() => onSelectStaff(member)}
            className={`p-3 sm:p-5 rounded-xl border transition-all duration-500 cursor-pointer flex items-center gap-3 sm:gap-5 ${
              getBarberId(selectedStaff) === memberId 
              ? 'bg-vintage-card border-vintage-tan scale-[1.01] shadow-2xl' 
              : 'bg-vintage-card border-white/5 hover:border-white/10'
            }`}
          >
            <div className="relative shrink-0">
              <img src={member.profileImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200"} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-white/5" alt={member.name} referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif font-black text-lg sm:text-2xl uppercase tracking-tight truncate">{member.name}</div>
              <div className="text-[9px] sm:text-[10px] text-vintage-tan tracking-[0.2em] uppercase font-bold mt-1 mb-1 sm:mb-2">{member.role}</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewStaffDetail(member);
                }}
                className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
              >
                View profile
              </button>
            </div>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${getBarberId(selectedStaff) === memberId ? 'bg-vintage-tan text-black' : 'border border-white/10 text-white/10'}`}>
              {getBarberId(selectedStaff) === memberId ? <Check size={16} strokeWidth={3} /> : <span className="text-base leading-none">+</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
