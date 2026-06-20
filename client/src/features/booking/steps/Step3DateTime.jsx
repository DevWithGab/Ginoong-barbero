import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, CalendarIcon, Lock } from 'lucide-react';
import { addDays, startOfToday, isSameDay, isToday, format } from 'date-fns';
import { appointmentAPI } from '../../../services/appointmentService';

export function Step3DateTime({ 
  selectedStaff,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onChangeStaff
}) {
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const barberId = selectedStaff?._id || selectedStaff?.id || '';
        const res = await appointmentAPI.getAvailableSlots(dateStr, barberId || undefined);
        setAvailableSlots(res.data || []);
      } catch (err) {
        console.error('Failed to fetch available slots:', err);
        // On error, show all slots as available
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedStaff]);

  const allTimes = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const isSlotAvailable = (time) => {
    if (availableSlots.length === 0) return true;
    const slot = availableSlots.find(s => s.time === time);
    return slot ? slot.available : true;
  };

  return (
    <div className="space-y-12">
      {/* Staff Selector Pill */}
      <div className="flex items-center justify-between gap-3">
        <button 
          onClick={onChangeStaff}
          className="bg-white/5 border border-white/10 rounded-full px-3 py-2 sm:px-4 flex items-center gap-2 hover:bg-white/10 transition-all min-w-0"
        >
          <img 
            src={selectedStaff?.photo || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200"} 
            className="w-6 h-6 rounded-full object-cover shrink-0" 
            alt="" 
          />
          <span className="text-[10px] sm:text-[11px] font-bold text-white truncate">{selectedStaff?.name || "Any available"}</span>
          <ChevronRight size={14} className="text-white/30 shrink-0" />
        </button>

        <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0">
          <CalendarIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>

      {/* Date Picker */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-black uppercase tracking-tight">Select a date</h3>
        </div>
        
        <div className="flex overflow-x-auto pb-3 gap-2 w-full no-scrollbar snap-x snap-mandatory scroll-smooth sm:grid sm:grid-cols-7 sm:gap-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center justify-center py-2 px-3 sm:py-4 rounded-xl border transition-all duration-300 shrink-0 snap-center min-w-[58px] sm:min-w-0 ${
                  isSelected 
                  ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/20 scale-105 z-10 font-bold' 
                  : 'bg-vintage-card border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1 ${isSelected ? 'text-black font-black' : 'text-white/40'}`}>
                  {format(date, "EEE")}
                </span>
                <span className="text-base sm:text-xl font-black">
                  {format(date, "d")}
                </span>
                <span className={`text-[7px] sm:text-[8px] uppercase font-bold tracking-tighter sm:tracking-normal ${isSelected ? 'text-black/70 font-black' : 'text-white/20'}`}>
                  {format(date, "MMM")}
                </span>
                {isTodayDate && !isSelected && (
                  <div className="w-1 h-1 bg-vintage-tan rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Picker */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-black uppercase tracking-tight">Pick a time</h3>
          {loadingSlots && (
            <span className="text-[10px] text-white/30 font-bold animate-pulse">Checking availability...</span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
          {allTimes.map(time => {
            const available = isSlotAvailable(time);
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => available && onSelectTime(time)}
                disabled={!available}
                className={`py-3 px-3 sm:py-4 sm:px-5 rounded-xl border text-[11px] sm:text-sm font-bold transition-all text-center flex justify-center items-center gap-1.5 ${
                  !available
                    ? 'bg-white/[0.02] border-white/[0.03] text-white/10 cursor-not-allowed line-through'
                    : isSelected
                      ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/20'
                      : 'bg-vintage-card border-white/5 text-white hover:border-white/20'
                }`}
              >
                {!available ? (
                  <>
                    <Lock size={10} className="opacity-30" />
                    <span>{time}</span>
                  </>
                ) : (
                  <>
                    <span>{time}</span>
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </>
                )}
              </button>
            );
          })}
        </div>
        {selectedDate && !loadingSlots && availableSlots.length > 0 && (
          <p className="text-[10px] text-white/20 font-bold">
            {availableSlots.filter(s => s.available).length} of {availableSlots.length} slots available
          </p>
        )}
      </div>
    </div>
  );
}
