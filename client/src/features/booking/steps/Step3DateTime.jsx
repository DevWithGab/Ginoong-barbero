import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, CalendarIcon, Lock, Bookmark, Scissors, Sparkles } from 'lucide-react';
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
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedStaff]);

  const isSlotAvailable = (time) => {
    if (availableSlots.length === 0) return true;
    const slot = availableSlots.find(s => s.time === time);
    return slot ? slot.available : true;
  };

  const morningSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  const afternoonSlots = ["12:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"];
  const eveningSlots = ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"];

  const TimeSlot = ({ time }) => {
    const available = isSlotAvailable(time);
    const isSelected = selectedTime === time;
    return (
      <button
        key={time}
        onClick={() => available && onSelectTime(time)}
        disabled={!available}
        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-black tracking-wide transition-all duration-300 text-center flex justify-center items-center gap-2 cursor-pointer ${
          !available
            ? 'bg-white/[0.02] border-white/[0.03] text-white/10 cursor-not-allowed'
            : isSelected
              ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/15 scale-[1.02] font-black'
              : 'bg-vintage-card/30 border-white/5 text-white/80 hover:border-white/15 hover:bg-vintage-card/60'
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
            {isSelected && <Check size={11} strokeWidth={3.5} />}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Barber Selection Overview */}
      <div className="flex items-center justify-between p-4 bg-vintage-card/30 border border-white/5 rounded-2xl">
        <div className="flex items-center gap-3">
          <img 
            src={selectedStaff?.photo || selectedStaff?.profileImage || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200"} 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/10 shrink-0" 
            alt="" 
          />
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-vintage-tan block leading-none">Selected Barber</span>
            <span className="font-serif font-black text-sm uppercase tracking-tight text-white mt-1 block">
              {selectedStaff?.name || "Any Available"}
            </span>
          </div>
        </div>
        <button 
          onClick={onChangeStaff}
          className="bg-white/5 border border-white/10 hover:border-vintage-tan/50 hover:bg-white/10 rounded-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-vintage-tan transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          Change Barber
        </button>
      </div>

      {/* Date Picker */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-black uppercase tracking-tight flex items-center gap-2 text-white">
          <span className="w-1.5 h-6 bg-vintage-tan rounded-sm"></span>
          Select a Date
        </h3>
        
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

      {/* Time Picker - Segmented */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-black uppercase tracking-tight flex items-center gap-2 text-white">
            <span className="w-1.5 h-6 bg-vintage-tan rounded-sm"></span>
            Pick a Time Slot
          </h3>
          {loadingSlots && (
            <span className="text-[10px] text-white/30 font-bold animate-pulse">Checking availability...</span>
          )}
        </div>

        <div className="space-y-6">
          {/* Morning Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Bookmark size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">Sunrise Rituals (Morning Slots)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {morningSlots.map(time => <TimeSlot key={time} time={time} />)}
            </div>
          </div>

          {/* Afternoon Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Scissors size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">Midday master cuts (Afternoon Slots)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {afternoonSlots.map(time => <TimeSlot key={time} time={time} />)}
            </div>
          </div>

          {/* Evening Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Sparkles size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em]">Sunset Rituals (Evening Slots)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {eveningSlots.map(time => <TimeSlot key={time} time={time} />)}
            </div>
          </div>
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
