import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Loader2,
  Check,
  X,
  Trash2,
  Search,
  User,
  Phone,
  Mail,
  Scissors,
  StickyNote,
  History,
  XCircle
} from "lucide-react";
import { SimpleStatCard } from "../UI/SimpleStatCard";
import { appointmentAPI } from "../../../services/appointmentService";

export const AppointmentsTab = ({ 
  bookings, 
  searchTerm, 
  setSearchTerm, 
  filter, 
  setFilter, 
  updateStatus 
}) => {
  const [activeSubTab, setActiveSubTab] = useState("ALL APPOINTMENTS");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, rejected: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [localSearch, setLocalSearch] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchAppointments = useCallback(async (page = 1, status = null) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status && status !== 'ALL APPOINTMENTS') {
        const statusMap = {
          'PENDING': 'Pending',
          'CONFIRMED': 'Confirmed',
          'COMPLETED': 'Completed',
          'CANCELLED': 'Cancelled',
          'REJECTED': 'Rejected'
        };
        if (statusMap[status]) params.status = statusMap[status];
      }
      if (localSearch) params.search = localSearch;
      const res = await appointmentAPI.getAppointments(params);
      setAppointments(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [localSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const allRes = await appointmentAPI.getAppointments({ limit: 9999 });
      const all = allRes.data || [];
      setStats({
        total: all.length,
        pending: all.filter(a => a.status === 'Pending').length,
        confirmed: all.filter(a => a.status === 'Confirmed').length,
        completed: all.filter(a => a.status === 'Completed').length,
        cancelled: all.filter(a => a.status === 'Cancelled').length,
        rejected: all.filter(a => a.status === 'Rejected').length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments(1);
    fetchStats();
  }, [fetchAppointments, fetchStats]);

  useEffect(() => {
    fetchAppointments(1, activeSubTab);
  }, [activeSubTab, fetchAppointments]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentAPI.updateAppointment(id, { status: newStatus });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      fetchStats();
      if (selectedAppointment?._id === id) {
        setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setSelectedAppointment(null);
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatFullDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-[#f0f9f4] text-emerald-600 border-emerald-100';
      case 'Pending': return 'bg-[#fff7ed] text-vintage-tan border-vintage-tan/20';
      case 'Completed': return 'bg-[#eff6ff] text-blue-600 border-blue-100';
      case 'Rejected': return 'bg-[#fef2f2] text-rose-600 border-rose-100';
      case 'Cancelled': return 'bg-[#f4f4f5] text-[#a1a1aa] border-[#efefef]';
      default: return 'bg-[#f4f4f5] text-[#a1a1aa] border-[#efefef]';
    }
  };

  const dummyChartData = [
    { v: stats.pending || 3 }, { v: stats.confirmed || 5 }, { v: stats.completed || 8 }, 
    { v: stats.total || 12 }, { v: stats.completed || 10 }, { v: stats.confirmed || 7 }, { v: stats.total || 14 }
  ];

  const tabs = [
    'ALL APPOINTMENTS',
    `PENDING (${stats.pending})`,
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'REJECTED'
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 lg:gap-10 w-full mb-10" id="admin-appointments-tab">
      <div className="flex-1 space-y-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-1">
               <div className="w-8 h-[1px] bg-vintage-tan/30"></div>
               <span>Operation Log</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#18181b] leading-none">
               The <span className="text-[#cccccc] italic">Queue</span>
            </h2>
            <p className="text-[13px] font-medium text-[#a1a1aa] max-w-lg">Manage and track all customer appointments. Maintain the rhythm of the shop floor.</p>
          </div>
          <button className="w-full md:w-auto flex items-center gap-3 px-8 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-vintage-tan/10 justify-center text-center active:scale-95 shrink-0">
            <Plus size={14} /> NEW APPOINTMENT
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
           <SimpleStatCard icon={Calendar} label="TOTAL APPOINTMENTS" value={String(stats.total)} trend={`+ ${stats.total > 0 ? Math.round((stats.total / 30) * 100) : 0}%`} chartData={dummyChartData} />
           <SimpleStatCard icon={Clock} label="PENDING APPROVAL" value={String(stats.pending)} trend={`${stats.pending}`} trendUp={false} chartData={dummyChartData} />
           <SimpleStatCard icon={CheckCircle} label="COMPLETED" value={String(stats.completed)} trend={`+ ${stats.completed > 0 ? Math.round((stats.completed / 30) * 100) : 0}%`} chartData={dummyChartData} />
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
           <div className="flex-1 flex items-center gap-4 bg-[#ffffff] border border-[#efefef] px-6 py-3.5 rounded group focus-within:border-[#cccccc] transition-all shadow-sm">
              <Search size={16} className="text-[#cccccc] group-focus-within:text-[#18181b]" />
              <input 
                type="text" 
                placeholder="Search by customer name, phone, or service..." 
                className="bg-transparent border-none outline-none text-[13px] text-[#18181b] w-full font-medium placeholder:text-[#cccccc]"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAppointments(1, activeSubTab)}
                aria-label="Search appointments"
              />
              {localSearch && (
                <button 
                  onClick={() => { setLocalSearch(''); fetchAppointments(1, activeSubTab); }}
                  className="text-[#cccccc] hover:text-[#18181b] transition-colors"
                  aria-label="Clear search"
                >
                  <XCircle size={16} />
                </button>
              )}
           </div>
        </div>

        {/* Table Area */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg overflow-hidden shadow-sm">
           {/* Tabs */}
            <div className="flex items-center gap-6 sm:gap-10 px-6 sm:px-10 py-4 sm:py-6 border-b border-[#efefef] overflow-x-auto no-scrollbar whitespace-nowrap" role="tablist" aria-label="Appointment status filters">
              {tabs.map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveSubTab(t)}
                  role="tab"
                  aria-selected={activeSubTab === t}
                  aria-controls="appointments-table"
                  id={`tab-${t.replace(/\s+/g, '-').replace(/[()]/g, '')}`}
                  className={`text-[10px] font-black uppercase tracking-widest relative pb-6 -mb-6 transition-colors ${activeSubTab === t ? 'text-vintage-tan after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-vintage-tan' : 'text-[#a1a1aa] hover:text-[#18181b]'}`}
                >
                  {t}
                </button>
              ))}
           </div>

           {/* Table Body */}
           <div id="appointments-table" role="tabpanel" aria-labelledby={`tab-${activeSubTab.replace(/\s+/g, '-').replace(/[()]/g, '')}`}>
            {loading ? (
              <div className="flex items-center justify-center py-20" aria-live="polite">
                <Loader2 size={24} className="animate-spin text-vintage-tan" />
                <span className="sr-only">Loading appointments...</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#cccccc]" aria-live="polite">
                <Calendar size={40} className="mb-4" />
                <p className="text-[13px] font-bold">No appointments found</p>
                <p className="text-[11px] mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-[#efefef]">
                {appointments.map((b) => (
                  <div 
                    key={b._id} 
                    onClick={() => handleViewDetails(b)}
                    className="p-6 md:p-8 hover:bg-[#f9fafb] transition-colors group cursor-pointer active:scale-[0.995]"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(b)}
                    aria-label={`View appointment details for ${b.customer?.name}`}
                  >
                    {/* Top Row: Status + Actions */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusColor(b.status)}`} aria-label={`Status: ${b.status}`}>
                        {b.status}
                      </span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {b.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(b._id, 'Confirmed')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-colors border border-emerald-100"
                              title="Approve appointment"
                              aria-label={`Approve appointment for ${b.customer?.name}`}
                            >
                              <Check size={12} /> APPROVE
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(b._id, 'Rejected')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-colors border border-rose-100"
                              title="Reject appointment"
                              aria-label={`Reject appointment for ${b.customer?.name}`}
                            >
                              <X size={12} /> REJECT
                            </button>
                          </>
                        )}
                        {b.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleUpdateStatus(b._id, 'Completed')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors border border-blue-100"
                            title="Mark as completed"
                            aria-label={`Mark appointment for ${b.customer?.name} as completed`}
                          >
                            <CheckCircle size={12} /> COMPLETE
                          </button>
                        )}
                        {(b.status === 'Pending' || b.status === 'Confirmed') && (
                          <button 
                            onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 text-neutral-500 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors border border-neutral-200"
                            title="Cancel appointment"
                            aria-label={`Cancel appointment for ${b.customer?.name}`}
                          >
                            <Trash2 size={12} /> CANCEL
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Main Content Row */}
                    <div className="flex items-start gap-6">
                      {/* Time */}
                      <div className="w-20 shrink-0">
                        <p className="text-[15px] font-bold text-[#18181b]">{formatTime(b.dateTime)}</p>
                        <p className="text-[11px] font-medium text-[#cccccc]">{formatDate(b.dateTime)}</p>
                      </div>

                      {/* Customer */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef] shrink-0">
                          <img src={b.customer?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.customer?.name}`} alt="" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-[#18181b] truncate group-hover:text-vintage-tan transition-colors">{b.customer?.name}</p>
                          <p className="text-[11px] font-medium text-[#cccccc]">{b.customer?.phone}</p>
                        </div>
                      </div>

                      {/* Service */}
                      <div className="hidden sm:block w-48 shrink-0">
                        <p className="text-[13px] font-bold text-[#18181b] truncate">{b.service?.name}</p>
                        <p className="text-[11px] font-medium text-[#cccccc]">{b.duration} mins</p>
                      </div>

                      {/* Barber */}
                      <div className="hidden md:flex items-center gap-3 w-40 shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${b.barber?.name}`} className="w-8 h-8 rounded-full border border-[#efefef] bg-[#f4f4f5] shrink-0" alt="" aria-hidden="true" />
                        <p className="text-[12px] font-bold text-[#a1a1aa] truncate">{b.barber?.name}</p>
                      </div>
                    </div>

                    {/* Mobile: Service + Barber (shown below on small screens) */}
                    <div className="flex items-center gap-4 mt-4 sm:hidden">
                      <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa]">
                        <Scissors size={12} />
                        <span className="font-medium">{b.service?.name} · {b.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${b.barber?.name}`} className="w-5 h-5 rounded-full border border-[#efefef]" alt="" />
                        <span className="font-medium">{b.barber?.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
           </div>

           {/* Pagination Footer */}
           <div className="px-8 py-6 border-t border-[#efefef] flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
              <p>Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} appointments</p>
              <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
                 <button 
                   onClick={() => pagination.page > 1 && fetchAppointments(pagination.page - 1, activeSubTab)}
                   disabled={pagination.page <= 1}
                   className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                   aria-label="Previous page"
                 >
                   <ChevronLeft size={16}/>
                 </button>
                 {Array.from({ length: Math.min(pagination.pages, 4) }, (_, i) => i + 1).map(p => (
                   <button 
                     key={p}
                     onClick={() => fetchAppointments(p, activeSubTab)}
                     aria-current={pagination.page === p ? 'page' : undefined}
                     className={`w-8 h-8 flex items-center justify-center font-bold rounded transition-colors ${
                       pagination.page === p 
                         ? 'bg-vintage-tan text-white' 
                         : 'border border-[#efefef] hover:border-[#a1a1aa]'
                     }`}
                   >
                     {p}
                   </button>
                 ))}
                 <button 
                   onClick={() => pagination.page < pagination.pages && fetchAppointments(pagination.page + 1, activeSubTab)}
                   disabled={pagination.page >= pagination.pages}
                   className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                   aria-label="Next page"
                 >
                   <ChevronRight size={16}/>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 shrink-0 space-y-10">
        {/* Calendar Widget */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-8 shadow-sm">
           <div className="flex justify-between items-center">
              <ChevronLeft size={16} className="text-[#cccccc] cursor-pointer hover:text-[#18181b] transition-colors" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#18181b]">MAY 2026</p>
              <ChevronRight size={16} className="text-[#cccccc] cursor-pointer hover:text-[#18181b] transition-colors" />
           </div>
           
           <div className="grid grid-cols-7 gap-y-6 text-center" role="grid" aria-label="Calendar">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                <span key={d} className="text-[9px] font-black text-[#cccccc] tracking-widest" role="columnheader">{d}</span>
              ))}
              {[26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6].map((day, i) => {
                const isCurrentMonth = i >= 5 && i < 36;
                const isSelected = day === 19 && isCurrentMonth;
                const hasDot = [5, 11, 15, 19, 26, 30].includes(day) && isCurrentMonth;
                return (
                  <div key={i} className="flex flex-col items-center" role="gridcell">
                    <span className={`text-[11px] font-bold cursor-pointer transition-colors w-7 h-7 flex items-center justify-center rounded-full leading-none ${
                        isSelected ? 'bg-vintage-tan text-white' : 
                        isCurrentMonth ? 'text-[#18181b] hover:text-vintage-tan' : 'text-[#efefef]'
                    }`}>
                      {day}
                    </span>
                    {hasDot && !isSelected && <div className="w-1 h-1 rounded-full bg-vintage-tan mt-1" aria-hidden="true"></div>}
                  </div>
                );
              })}
           </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-6 shadow-sm">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">TODAY'S SUMMARY</p>
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#a1a1aa]">Pending</span>
                <span className="text-[13px] font-bold text-vintage-tan">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#a1a1aa]">Confirmed</span>
                <span className="text-[13px] font-bold text-emerald-600">{stats.confirmed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#a1a1aa]">Completed</span>
                <span className="text-[13px] font-bold text-blue-600">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#a1a1aa]">Cancelled</span>
                <span className="text-[13px] font-bold text-[#a1a1aa]">{stats.cancelled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#a1a1aa]">Rejected</span>
                <span className="text-[13px] font-bold text-rose-600">{stats.rejected}</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Customer Detail Slide-Over */}
      <AnimatePresence>
        {isDetailOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Appointment details">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseDetails}
              aria-hidden="true"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Panel Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-6 border-b border-[#efefef]"
              >
                <h3 className="text-lg font-serif font-black uppercase tracking-widest text-[#18181b]">
                  Appointment Details
                </h3>
                <button 
                  onClick={handleCloseDetails}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#999] transition-colors"
                  aria-label="Close details panel"
                >
                  <XCircle size={20} />
                </button>
              </motion.div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3"
                >
                  <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                  <span className="text-[11px] font-medium text-[#a1a1aa]">
                    {formatFullDate(selectedAppointment.dateTime)}
                  </span>
                </motion.div>

                {/* Customer Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <User size={12} />
                    <span>Customer</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                        <img src={selectedAppointment.customer?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.customer?.name}`} alt="" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#18181b]">{selectedAppointment.customer?.name}</p>
                        {selectedAppointment.customer?.isVIP && (
                          <span className="px-1.5 py-0.5 bg-vintage-tan/10 text-vintage-tan text-[8px] font-black uppercase tracking-widest rounded border border-vintage-tan/20">VIP</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-[#cccccc]" />
                        <span className="text-[13px] font-medium text-[#18181b]">{selectedAppointment.customer?.phone || '—'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={14} className="text-[#cccccc]" />
                        <span className="text-[13px] font-medium text-[#18181b]">{selectedAppointment.customer?.email || '—'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Appointment Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <Calendar size={12} />
                    <span>Appointment</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Date</span>
                      <span className="text-[13px] font-bold text-[#18181b]">{formatDate(selectedAppointment.dateTime)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Time</span>
                      <span className="text-[13px] font-bold text-[#18181b]">{formatTime(selectedAppointment.dateTime)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Duration</span>
                      <span className="text-[13px] font-bold text-[#18181b]">{selectedAppointment.duration} mins</span>
                    </div>
                  </div>
                </motion.div>

                {/* Service Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <Scissors size={12} />
                    <span>Service</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Service</span>
                      <span className="text-[13px] font-bold text-[#18181b]">{selectedAppointment.service?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Category</span>
                      <span className="text-[13px] font-bold text-[#18181b]">{selectedAppointment.service?.category || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Price</span>
                      <span className="text-[13px] font-bold text-[#18181b]">₱{(selectedAppointment.service?.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Barber Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <User size={12} />
                    <span>Barber</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAppointment.barber?.name}`} alt="" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#18181b]">{selectedAppointment.barber?.name}</p>
                        <p className="text-[11px] font-medium text-[#a1a1aa]">{selectedAppointment.barber?.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                      <StickyNote size={12} />
                      <span>Notes</span>
                    </div>
                    <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5">
                      <p className="text-[13px] font-medium text-[#18181b]">{selectedAppointment.notes}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Panel Footer - Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="p-6 border-t border-[#efefef] bg-neutral-50 space-y-3"
              >
                {selectedAppointment.status === 'Pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'Confirmed')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                    >
                      <Check size={14} /> APPROVE
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors"
                    >
                      <X size={14} /> REJECT
                    </button>
                  </div>
                )}
                {selectedAppointment.status === 'Confirmed' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'Completed')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle size={14} /> COMPLETE
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'Cancelled')}
                      className="px-6 py-3 border border-neutral-200 text-neutral-500 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                )}
                {(selectedAppointment.status === 'Pending' || selectedAppointment.status === 'Confirmed') && selectedAppointment.status !== 'Confirmed' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedAppointment._id, 'Cancelled')}
                    className="w-full py-3 border border-neutral-200 text-neutral-500 rounded text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-colors"
                  >
                    CANCEL APPOINTMENT
                  </button>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
