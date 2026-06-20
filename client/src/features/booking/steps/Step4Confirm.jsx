import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { format } from 'date-fns';

export function Step4Confirm({ 
  currentUser,
  formData,
  onFormChange,
  onAuthRequired,
  onSignOut,
  isSubmitting,
  authError
}) {
  const handleChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Auth Feedback / CTA */}
      {currentUser ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-bold">
          <div className="flex items-center gap-2 font-serif text-[10px] sm:text-[11px] uppercase tracking-wider min-w-0">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span className="truncate">Signed in as {currentUser.email}</span>
          </div>
          <button 
            type="button"
            onClick={onSignOut}
            className="underline uppercase tracking-wider text-[10px] opacity-70 hover:opacity-100 transition-opacity shrink-0 self-start sm:self-auto"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="bg-vintage-tan/10 border border-vintage-tan/25 text-vintage-tan text-xs py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-bold">
          <span className="font-serif text-[10px] sm:text-[11px] uppercase tracking-wider">Authentication required to compile booking</span>
          <button 
            type="button"
            onClick={onAuthRequired}
            className="bg-vintage-tan text-black py-1.5 px-4 rounded-full uppercase tracking-wider text-[9px] sm:text-[10px] font-black hover:bg-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            Sign In First
          </button>
        </div>
      )}

      {/* Error Alert */}
      {authError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-3 px-4 rounded-xl font-bold leading-normal">
          {authError}
        </div>
      )}

      {/* Missing phone hint */}
      {currentUser && !formData.phone && (
        <div className="bg-vintage-tan/10 border border-vintage-tan/25 text-vintage-tan text-[11px] py-3 px-4 rounded-xl font-bold">
          Please enter your phone number below to complete the booking.
        </div>
      )}

      {/* Form Fields */}
      <div className="grid gap-3 sm:gap-5">
        <div className="space-y-1.5">
          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-vintage-card border border-white/5 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 placeholder:text-white/10 focus:border-vintage-tan outline-none transition-all font-bold text-sm" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 ml-1">Email</label>
          <input 
            type="email" 
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-vintage-card border border-white/5 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 placeholder:text-white/10 focus:border-vintage-tan outline-none transition-all font-bold text-sm" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 ml-1">Phone Number *</label>
          <input 
            type="tel" 
            placeholder="09123456789"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value.replace(/\s+/g, ''))}
            required
            className={`w-full bg-vintage-card border rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 placeholder:text-white/10 focus:border-vintage-tan outline-none transition-all font-bold text-sm ${!formData.phone ? 'border-vintage-tan/50' : 'border-white/5'}`}
          />
          <p className="text-[8px] text-white/20 ml-1">No spaces allowed</p>
        </div>
        <div className="space-y-1.5">
          <label className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 ml-1">Notes</label>
          <textarea 
            placeholder="Special requests..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full bg-vintage-card border border-white/5 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 placeholder:text-white/10 focus:border-vintage-tan outline-none transition-all font-bold text-sm min-h-[80px] sm:min-h-[120px]" 
          />
        </div>
      </div>
    </div>
  );
}
