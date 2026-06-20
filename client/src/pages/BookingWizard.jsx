import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Check, CheckCircle2, ChevronRight, Scissors } from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { appointmentAPI } from '../services/appointmentService';
import { authAPI } from '../services/authService';
import { serviceAPI } from '../services/serviceMenu';
import { barberAPI } from '../services/barberService';

// Step Components - lazy loaded (only Step1 needed immediately)
import { Step1Services } from "../features/booking/steps/Step1Services";
import { Step2Professionals } from "../features/booking/steps/Step2Professionals";
const Step3DateTime = lazy(() => import("../features/booking/steps/Step3DateTime").then(m => ({ default: m.Step3DateTime })));
const Step4Confirm = lazy(() => import("../features/booking/steps/Step4Confirm").then(m => ({ default: m.Step4Confirm })));

// Modal Components - lazy loaded (only shown on demand)
const ServiceDetailModal = lazy(() => import("../features/booking/components/ServiceDetailModal").then(m => ({ default: m.ServiceDetailModal })));
const StaffDetailModal = lazy(() => import("../features/booking/components/StaffDetailModal").then(m => ({ default: m.StaffDetailModal })));
const LoginModal = lazy(() => import("../features/booking/components/LoginModal").then(m => ({ default: m.LoginModal })));

import theshop from "../assets/display-pics/the-shop.jpg";
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

const getImageUrl = (image) => {
  if (!image) return null;
  return image.startsWith('http') ? image : `${API_BASE}${image}`;
};

const BUSINESS_INFO = {
  name: "GINOONG BARBERO",
  location: "In front of One Ilocos Sur Hotel, Tamag, Vigan City",
  photo: theshop,
};

export default function BookingWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser, loginWithGoogle, syncUserFromStorage, logout } = useAuth();
  
  // Booking States
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Haircuts");
  const [activeServiceDetail, setActiveServiceDetail] = useState(null);
  const [activeStaffDetail, setActiveStaffDetail] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    notes: ""
  });

  // Auth States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Data
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Handle initial service from navigation
  useEffect(() => {
    if (location.state?.initialServiceName) {
      // Find and select the service after data is loaded
      const found = services.find(s => s.name === location.state.initialServiceName);
      if (found) {
        setSelectedServices([found]);
      }
    }
  }, [location.state, services]);

  // Fetch services and barbers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          serviceAPI.getServices({ status: 'Active' }),
          barberAPI.getBarbers({ status: 'Active' })
        ]);
        setServices(servicesRes.data || []);
        setBarbers(barbersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch booking data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const totalAmount = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const steps = ["Services", "Barbers", "Time", "Confirm"];

  // Get service ID (handles both _id from API and id from hardcoded data)
  const getServiceId = (s) => s._id || s.id;

  // Handlers
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const serviceId = getServiceId(service);
      const exists = prev.find(s => getServiceId(s) === serviceId);
      if (exists) {
        return prev.filter(s => getServiceId(s) !== serviceId);
      }
      return [...prev, service];
    });
  };

  const nextStep = () => {
    if (step === 3 && !currentUser) {
      setAuthError(null);
      setShowLoginModal(true);
    } else if (step < 4) {
      setStep(step + 1);
    } else {
      handleConfirm();
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    // Frontend validation
    if (selectedServices.length === 0) {
      setAuthError("Please select at least one service.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.name.trim()) {
      setAuthError("Please enter your name.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.trim()) {
      setAuthError("Please enter your email.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone.trim()) {
      setAuthError("Please enter your phone number.");
      setIsSubmitting(false);
      return;
    }

    // Strip spaces from phone number
    const cleanPhone = formData.phone.replace(/\s+/g, '');

    try {
      // Parse selectedTime (e.g. "09:00 AM") into hours and minutes
      const [timePart, period] = selectedTime.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      // Combine date and time into a single ISO datetime
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      // Check if appointment is in the past
      if (appointmentDateTime <= new Date()) {
        setAuthError("Selected time is in the past. Please choose a future time.");
        setIsSubmitting(false);
        return;
      }

      // Create appointments for all selected services
      const servicesToBook = selectedServices;
      
      for (const service of servicesToBook) {
        const appointmentData = {
          customerInfo: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: cleanPhone
          },
          serviceId: getServiceId(service),
          barberId: selectedStaff?.id !== "any" ? (selectedStaff?._id || selectedStaff?.id) : null,
          dateTime: appointmentDateTime.toISOString(),
          notes: formData.notes
        };

        await appointmentAPI.createAppointment(appointmentData);
      }

      setIsSuccess(true);
      
      // Logout after booking confirmed
      await logout();

      // Navigate after success
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      setAuthError(error.response?.data?.message || error.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auth handlers - use customer endpoint for booking
  const handleGoogleSignIn = async (googleResponse) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await authAPI.googleCustomerLogin(googleResponse.credential);
      if (result.data?.token) {
        // Update auth state with customer data
        const userData = result.data.user;
        
        setShowLoginModal(false);
        setStep(step + 1);
        // Sync auth context with the new user
        syncUserFromStorage();
        // Update form data with user info
        setFormData(prev => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email
        }));
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Google sign-in failed';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-vintage-bg text-vintage-text flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-16 h-16 sm:w-24 sm:h-24 bg-vintage-tan rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_40px_rgba(201,168,76,0.2)]"
        >
          <CheckCircle2 size={32} className="text-black sm:hidden" />
          <CheckCircle2 size={48} className="text-black hidden sm:block" />
        </motion.div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black mb-3 sm:mb-4 uppercase tracking-tighter">Booking Confirmed!</h1>
        <p className="text-white/60 mb-8 sm:mb-10 max-w-md italic font-slab text-base sm:text-lg px-4">
          Everything is set. We've sent a confirmation to your phone. We can't wait to see you at the shop.
        </p>
        
        <div className="bg-vintage-card p-6 sm:p-10 rounded-2xl w-full max-w-sm border border-white/5 space-y-4 sm:space-y-5 mb-8 sm:mb-12 text-left relative overflow-hidden mx-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vintage-tan/5 blur-3xl rounded-full"></div>
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Services</span>
            <span className="text-right text-xs font-bold">{selectedServices.map(s => s.name).join(", ")}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Barber</span>
            <span className="text-xs font-bold">{selectedStaff?.name || "Any Barber"}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-4">
            <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Time</span>
            <span className="text-xs font-bold">{format(selectedDate, "MMM d, yyyy")} at {selectedTime}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-bold">Total</span>
            <span className="text-vintage-tan font-black text-xl">₱{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate("/")}
          className="px-8 sm:px-12 bg-vintage-tan text-black py-4 sm:py-5 rounded-full font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] hover:bg-white transition-all duration-500 shadow-2xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-bg text-vintage-text font-sans flex flex-col relative overflow-x-hidden">
      {/* Background Large Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[8rem] sm:text-[15rem] md:text-[25rem] font-serif font-black text-white/[0.01] select-none pointer-events-none whitespace-nowrap z-0 tracking-widest uppercase leading-none">
        Book Your Appointment Today
      </div>

      {/* Header */}
      <header className="p-3 sm:p-4 md:p-8 flex items-center justify-between sticky top-0 bg-vintage-bg/80 backdrop-blur-xl z-50">
        {/* Step Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5 overflow-hidden">
          <motion.div 
            className="h-full bg-vintage-tan shadow-[0_0_10px_rgba(201,168,76,0.3)]"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => step > 1 ? prevStep() : navigate("/")}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors relative group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Step Indicators */}
        <div className="hidden md:flex items-center gap-6">
          {steps.map((s, i) => {
            const isCompleted = step > i + 1;
            const isActive = step === i + 1;

            return (
              <div key={s} className="flex items-center gap-6">
                <button 
                  disabled={step < i + 1}
                  onClick={() => setStep(i + 1)}
                  className={`flex items-center gap-3 transition-all group ${step > i + 1 ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border ${
                    isActive ? "bg-vintage-tan border-vintage-tan text-black scale-110 shadow-[0_0_15px_rgba(201,168,76,0.2)]" : 
                    isCompleted ? "bg-white/10 border-white/20 text-white" : 
                    "border-white/10 text-white/20"
                  }`}>
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    isActive ? "text-white" : 
                    isCompleted ? "text-white/60 hover:text-white" : 
                    "text-white/20"
                  }`}>
                    {s}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`w-4 h-px transition-all ${isCompleted ? "bg-vintage-tan/30" : "bg-white/5"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <button 
          onClick={() => navigate("/")}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <X size={18} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pb-32 pt-4">
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 md:gap-12 items-start">
          {/* Step Content */}
          <div className="space-y-8 md:space-y-12">
            <div className="space-y-3 sm:space-y-4">
              <motion.div 
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic"
              >
                <div className="w-6 sm:w-8 h-px bg-vintage-tan/40"></div>
                <span>Step {step} of 4</span>
              </motion.div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tighter uppercase mb-1">
                {step === 1 && "Select services"}
                {step === 2 && "Choose staff"}
                {step === 3 && "Select date and time"}
                {step === 4 && "Review & Confirm"}
              </h1>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <Step1Services 
                    selectedServices={selectedServices}
                    onToggleService={toggleService}
                    onViewServiceDetail={setActiveServiceDetail}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    services={services}
                  />
                )}

                {step === 2 && (
                  <Step2Professionals 
                    selectedStaff={selectedStaff}
                    onSelectStaff={(staff) => { setSelectedStaff(staff); setSelectedTime(null); }}
                    onViewStaffDetail={setActiveStaffDetail}
                    barbers={barbers}
                  />
                )}

                {step === 3 && (
                  <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" /></div>}>
                    <Step3DateTime 
                      selectedStaff={selectedStaff}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectDate={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                      onSelectTime={setSelectedTime}
                      onChangeStaff={() => setStep(2)}
                    />
                  </Suspense>
                )}

                {step === 4 && (
                  <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-vintage-tan/30 border-t-vintage-tan rounded-full animate-spin" /></div>}>
                    <Step4Confirm 
                      currentUser={currentUser}
                      formData={formData}
                      onFormChange={setFormData}
                      onAuthRequired={() => setShowLoginModal(true)}
                      onSignOut={logout}
                      isSubmitting={isSubmitting}
                      authError={authError}
                    />
                  </Suspense>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Summary - Hidden on mobile */}
          <aside className="hidden lg:block sticky top-32">
            <div className="bg-vintage-card text-white p-5 sm:p-8 lg:p-10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden flex flex-col min-h-[250px] sm:min-h-[380px] lg:min-h-[500px]">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-[0.03] pointer-events-none translate-x-12 -translate-y-12">
                <img src={BUSINESS_INFO.photo} alt="" className="w-full h-full object-cover grayscale scale-150 rotate-12" />
              </div>

              <div className="flex gap-4 sm:gap-5 relative z-10 mb-6 sm:mb-10">
                <img src={BUSINESS_INFO.photo} alt="" className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-2xl border border-white/10" />
                <div className="flex flex-col justify-center">
                  <h2 className="font-serif font-black text-lg sm:text-xl uppercase tracking-tight leading-none text-white">{BUSINESS_INFO.name}</h2>
                  <p className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-2 leading-relaxed max-w-[180px]">{BUSINESS_INFO.location}</p>
                </div>
              </div>

              <div className="flex-1 space-y-6 sm:space-y-8 relative z-10">
                {selectedServices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                    <Scissors size={28} className="text-white/5 mb-3" />
                    <p className="text-white/20 font-bold uppercase tracking-widest text-[8px] sm:text-[9px]">Select a service</p>
                  </div>
                ) : (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      {selectedServices.map(s => (
                        <div key={getServiceId(s)} className="flex items-center gap-3 group gap-2">
                          {getImageUrl(s.image) && (
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                              <img src={getImageUrl(s.image)} alt={s.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 flex justify-between items-start gap-2">
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-serif font-bold text-xs sm:text-sm uppercase tracking-tight text-white leading-tight truncate">{s.name}</p>
                              <div className="flex items-center gap-1.5 opacity-40">
                                <span className="text-[9px] font-bold uppercase tracking-widest">{s.duration} mins</span>
                              </div>
                            </div>
                            <p className="font-black text-xs sm:text-sm text-vintage-tan shrink-0">₱{s.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {(selectedStaff || selectedTime) && (
                      <div className="pt-4 sm:pt-6 border-t border-white/5 space-y-3 sm:space-y-4">
                        {selectedStaff && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white/30 tracking-[0.2em]">Barber</span>
                            <span className="text-[10px] sm:text-[11px] font-black flex items-center gap-2 text-white text-right truncate">
                              {selectedStaff.name}
                            </span>
                          </div>
                        )}

                        {selectedTime && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white/30 tracking-[0.2em]">Appointment</span>
                            <span className="text-[10px] sm:text-[11px] font-black text-white text-right shrink-0">
                              {format(selectedDate, "MMM d")} · {selectedTime}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-6 sm:pt-8 mt-auto relative z-10">
                <div className="flex justify-between items-end mb-5 sm:mb-8">
                  <div className="space-y-1">
                    <p className="text-[9px] sm:text-[10px] uppercase font-bold text-white/30 tracking-[0.3em]">Total amount</p>
                    <p className="text-3xl sm:text-4xl font-serif font-black tracking-tighter text-vintage-tan">₱{totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <button 
                  onClick={nextStep}
                  disabled={
                    (step === 1 && selectedServices.length === 0) ||
                    (step === 2 && !selectedStaff) ||
                    (step === 3 && !selectedTime) ||
                    (step === 4 && (!formData.name || !formData.email || !formData.phone)) ||
                    isSubmitting
                  }
                  className="w-full bg-vintage-tan text-black py-4 sm:py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 disabled:bg-white/5 disabled:text-white/10 transition-all hover:bg-white active:scale-[0.98] shadow-2xl shadow-black/40"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{step === 4 ? "Book Appointment" : "Next Step"}</span>
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-vintage-bg/95 backdrop-blur-2xl border-t border-white/5 z-50">
        <div className="max-w-md mx-auto space-y-3">
          {selectedServices.length > 0 && (
            <div className="flex justify-between items-center px-1">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-vintage-tan truncate">
                  {selectedServices.map(s => s.name).join(", ")}
                </span>
                <div className="flex items-center gap-2 text-[9px] text-white/40">
                  {selectedStaff && <span>{selectedStaff.name}</span>}
                  {selectedTime && <span>· {format(selectedDate, "MMM d")} · {selectedTime}</span>}
                </div>
              </div>
              <span className="text-vintage-tan font-black text-sm shrink-0 ml-3">₱{totalAmount.toFixed(2)}</span>
            </div>
          )}

          <button 
            onClick={nextStep}
            disabled={
              (step === 1 && selectedServices.length === 0) ||
              (step === 2 && !selectedStaff) ||
              (step === 3 && !selectedTime) ||
              (step === 4 && (!formData.name || !formData.email || !formData.phone)) ||
              isSubmitting
            }
            className="w-full bg-vintage-tan text-black py-4 rounded-full font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 disabled:opacity-20 shadow-[0_20px_50px_-10px_rgba(201,168,76,0.3)] active:scale-[0.98] transition-all"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                {step === 4 ? "Complete Booking" : "Continue"}
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        <ServiceDetailModal 
          service={activeServiceDetail}
          isOpen={!!activeServiceDetail}
          selectedServices={selectedServices}
          onToggleService={toggleService}
          onClose={() => setActiveServiceDetail(null)}
        />

        <StaffDetailModal 
          staff={activeStaffDetail}
          isOpen={!!activeStaffDetail}
          onClose={() => setActiveStaffDetail(null)}
        />

        <LoginModal 
          isOpen={showLoginModal}
          authLoading={authLoading}
          authError={authError}
          onGoogleSignIn={handleGoogleSignIn}
          onClose={() => setShowLoginModal(false)}
        />
      </Suspense>
    </div>
  );
}
