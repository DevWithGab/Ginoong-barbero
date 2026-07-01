import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Bookmark, Scissors, Sparkles } from 'lucide-react';
import { addDays, startOfToday, isSameDay, isToday, format } from 'date-fns';
import { appointmentAPI } from '../../../services/appointmentService';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

const getImageUrl = (image) => {
  if (!image) return null;
  return image.startsWith('http') ? image : `${API_BASE}${image}`;
};

export function Step3DateTime({ 
  selectedStaff,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onChangeStaff
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const baseDate = addDays(startOfToday(), weekOffset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => addDays(baseDate, i));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const barberId = selectedStaff?._id || selectedStaff?.id || '';
        const tzOffset = new Date().getTimezoneOffset();
        const res = await appointmentAPI.getAvailableSlots(dateStr, barberId || undefined, tzOffset);
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

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Barber Selection Overview Quick Change Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-vintage-card/30 border border-white/5 rounded-2xl gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img 
            src={getImageUrl(selectedStaff?.photo || selectedStaff?.profileImage) || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=200"} 
            className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover border border-white/10 shrink-0" 
            alt="" 
          />
          <div className="min-w-0">
            <span className="text-[8px] font-black uppercase tracking-widest text-[#C9A84C] block leading-none">Selected Barber</span>
            <span className="font-serif font-black text-xs sm:text-sm uppercase tracking-tight text-white mt-1 block truncate">
              {selectedStaff?.name || "Any Available"}
            </span>
          </div>
        </div>

        <button 
          onClick={onChangeStaff}
          className="bg-white/5 border border-white/10 hover:border-vintage-tan/50 hover:bg-white/10 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-vintage-tan transition-all duration-300 flex items-center gap-1 shrink-0 cursor-pointer"
        >
          Change Barber
        </button>
      </div>

      {/* Date selection widget */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-serif font-black uppercase tracking-tight flex items-center gap-2 text-white">
          <span className="w-1.5 h-6 bg-vintage-tan rounded-sm"></span>
          Select a Date
        </h3>

        {/* Week Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setWeekOffset(0)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              weekOffset === 0
                ? 'bg-vintage-tan text-black'
                : 'bg-vintage-card/30 border border-white/5 text-white/40 hover:border-white/15 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setWeekOffset(1)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              weekOffset === 1
                ? 'bg-vintage-tan text-black'
                : 'bg-vintage-card/30 border border-white/5 text-white/40 hover:border-white/15 hover:text-white'
            }`}
          >
            Next Week
          </button>
        </div>
        
        {/* Date Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={`flex flex-col items-center justify-center py-2.5 sm:py-3 rounded-xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/20 z-10' 
                    : 'bg-vintage-card border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`text-[7px] sm:text-[9px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1 ${isSelected ? 'text-black font-black' : 'text-white/40'}`}>
                  {format(date, "EEE")}
                </span>
                <span className={`text-sm sm:text-xl font-black ${isSelected ? 'text-black' : 'text-white'}`}>
                  {format(date, "d")}
                </span>
                <span className={`text-[6px] sm:text-[8px] uppercase font-bold tracking-tighter sm:tracking-normal ${isSelected ? 'text-black/70 font-black' : 'text-white/20'}`}>
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

      {/* Segmented Time Selection Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-serif font-black uppercase tracking-tight flex items-center gap-2 text-white">
            <span className="w-1.5 h-6 bg-vintage-tan rounded-sm"></span>
            Pick a Time Slot
          </h3>
          {loadingSlots && (
            <span className="text-[9px] sm:text-[10px] text-white/30 font-bold animate-pulse">Checking availability...</span>
          )}
        </div>

        <div className="space-y-6">
          {/* Segment 1: Sunrise Sessions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Bookmark size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-wider min-[360px]:tracking-[0.25em] truncate">Sunrise Rituals (Morning Slots)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2.5 justify-center">
              {morningSlots.map(time => {
                const available = isSlotAvailable(time);
                const isTimeSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => available && onSelectTime(time)}
                    disabled={!available}
                    className={`relative py-2.5 px-0.5 rounded-xl border text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-tight transition-all duration-300 text-center flex justify-center items-center group cursor-pointer whitespace-nowrap ${
                      !available
                        ? 'bg-white/[0.02] border-white/[0.03] text-white/10 cursor-not-allowed'
                        : isTimeSelected 
                          ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/15 scale-102 font-black animate-none' 
                          : 'bg-vintage-card/30 border-white/5 text-white/85 hover:border-white/15 hover:bg-vintage-card/60'
                    }`}
                  >
                    {!available ? (
                      <>
                        <Lock size={9} className="opacity-30 shrink-0" />
                        <span>{time}</span>
                      </>
                    ) : (
                      <>
                        <span>{time}</span>
                        {isTimeSelected && (
                          <span className="absolute top-1 right-1 bg-black text-vintage-tan rounded-full p-0.5 flex items-center justify-center">
                            <Check size={8} strokeWidth={4} />
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Segment 2: Midday Cuts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Scissors size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-wider min-[360px]:tracking-[0.25em] truncate">Midday Master Cuts (Afternoon Slots)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2.5 justify-center">
              {afternoonSlots.map(time => {
                const available = isSlotAvailable(time);
                const isTimeSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => available && onSelectTime(time)}
                    disabled={!available}
                    className={`relative py-2.5 px-0.5 rounded-xl border text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-tight transition-all duration-300 text-center flex justify-center items-center group cursor-pointer whitespace-nowrap ${
                      !available
                        ? 'bg-white/[0.02] border-white/[0.03] text-white/10 cursor-not-allowed'
                        : isTimeSelected 
                          ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/15 scale-102 font-black animate-none' 
                          : 'bg-vintage-card/30 border-white/5 text-white/85 hover:border-white/15 hover:bg-vintage-card/60'
                    }`}
                  >
                    {!available ? (
                      <>
                        <Lock size={9} className="opacity-30 shrink-0" />
                        <span>{time}</span>
                      </>
                    ) : (
                      <>
                        <span>{time}</span>
                        {isTimeSelected && (
                          <span className="absolute top-1 right-1 bg-black text-vintage-tan rounded-full p-0.5 flex items-center justify-center">
                            <Check size={8} strokeWidth={4} />
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Segment 3: Sunset Sessions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Sparkles size={11} className="text-vintage-tan" />
              <span className="text-[9px] font-black uppercase tracking-wider min-[360px]:tracking-[0.25em] truncate">Sunset Rituals (Evening Slots)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2.5 justify-center">
              {eveningSlots.map(time => {
                const available = isSlotAvailable(time);
                const isTimeSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => available && onSelectTime(time)}
                    disabled={!available}
                    className={`relative py-2.5 px-0.5 rounded-xl border text-[10px] min-[360px]:text-[11px] sm:text-xs md:text-sm font-mono font-bold tracking-tight transition-all duration-300 text-center flex justify-center items-center group cursor-pointer whitespace-nowrap ${
                      !available
                        ? 'bg-white/[0.02] border-white/[0.03] text-white/10 cursor-not-allowed'
                        : isTimeSelected 
                          ? 'bg-vintage-tan border-vintage-tan text-black shadow-lg shadow-vintage-tan/15 scale-102 font-black animate-none' 
                          : 'bg-vintage-card/30 border-white/5 text-white/85 hover:border-white/15 hover:bg-vintage-card/60'
                    }`}
                  >
                    {!available ? (
                      <>
                        <Lock size={9} className="opacity-30 shrink-0" />
                        <span>{time}</span>
                      </>
                    ) : (
                      <>
                        <span>{time}</span>
                        {isTimeSelected && (
                          <span className="absolute top-1 right-1 bg-black text-vintage-tan rounded-full p-0.5 flex items-center justify-center">
                            <Check size={8} strokeWidth={4} />
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedDate && !loadingSlots && availableSlots.length > 0 && (
          <p className="text-[9px] sm:text-[10px] text-white/20 font-bold">
            {availableSlots.filter(s => s.available).length} of {availableSlots.length} slots available
          </p>
        )}
      </div>
    </div>
  );
}
