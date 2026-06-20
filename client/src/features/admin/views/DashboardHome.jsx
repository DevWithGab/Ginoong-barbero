import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { 
  ChevronDown, 
  TrendingUp, 
  Calendar,
  Loader2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { StatCard } from "./StatCard";
import { dashboardAPI } from "../../../services/dashboardService";
import { useAuth } from "../../../hooks/useAuth";

export const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [metricsRes, scheduleRes, revenueRes] = await Promise.all([
          dashboardAPI.getDashboardMetrics(),
          dashboardAPI.getTodaySchedule(),
          dashboardAPI.getRevenueAnalytics('week')
        ]);
        setMetrics(metricsRes.data);
        setSchedule(scheduleRes.data?.allAppointments || []);

        const revData = (revenueRes.data || []).map(d => ({
          name: new Date(d._id.year, d._id.month - 1, d._id.day).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          v: d.revenue
        }));
        setRevenueData(revData.length > 0 ? revData : [
          { name: 'MON', v: 0 }, { name: 'TUE', v: 0 }, { name: 'WED', v: 0 },
          { name: 'THU', v: 0 }, { name: 'FRI', v: 0 }, { name: 'SAT', v: 0 }, { name: 'SUN', v: 0 }
        ]);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const dummyChartData = [
    { v: metrics?.todayAppointments || 0 }, 
    { v: metrics?.pendingApprovals || 0 }, 
    { v: metrics?.grossRevenue || 0 }
  ];

  const chartTrend = [
    { v: 30 }, { v: 45 }, { v: 35 }, { v: 55 }, { v: 40 }, { v: 65 }, { v: 50 }
  ];

  const topServices = (metrics?.topServices || []).map(s => ({
    name: s.name,
    percent: metrics?.topServices?.length > 0 
      ? Math.round((s.bookingCount / metrics.topServices[0].bookingCount) * 100) 
      : 0
  }));

  const statusData = [
    { name: 'Confirmed', value: metrics?.statusBreakdown?.Confirmed || 0, color: '#C9A84C' },
    { name: 'Pending', value: metrics?.statusBreakdown?.Pending || 0, color: '#d4d4d8' },
    { name: 'Completed', value: metrics?.statusBreakdown?.Completed || 0, color: '#18181b' },
    { name: 'Cancelled', value: metrics?.statusBreakdown?.Cancelled || 0, color: '#efefef' },
  ];

  const totalStatus = statusData.reduce((sum, d) => sum + d.value, 0);

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatCurrency = (amount) => {
    return '₱' + Number(amount || 0).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-vintage-tan" />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10 max-w-[1600px] mx-auto w-full" id="admin-dashboard-home">
      {/* Hero Welcome */}
      <div className="relative min-h-[360px] md:h-80 rounded-2xl overflow-hidden group border border-[#efefef] shadow-xl flex flex-col justify-center">
        <img 
          src="https://images.unsplash.com/photo-1599351431247-f10b21ce538d?auto=format&fit=crop&q=80&w=2070" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-15 md:opacity-10 group-hover:scale-105 transition-transform duration-[3s] ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#ffffff] via-[#ffffff]/90 md:via-[#ffffff]/80 to-transparent"></div>
        <div className="relative z-10 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
          <div className="space-y-3 sm:space-y-4 max-w-xl">
             <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.5em] text-vintage-tan/80">OPERATIONS COMMANDER</p>
             <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-[#18181b] tracking-tight leading-[0.95] group-hover:tracking-tighter transition-all duration-1000 uppercase">
               Welcome Back,<br/>
               <span className="text-[#a1a1aa] italic font-serif lowercase normal-case">{user?.name?.split(' ')[0] || "Admin"}.</span>
             </h1>
             <p className="text-[#a1a1aa] text-xs sm:text-sm font-bold font-sans max-w-md">The shop is currently running at peak efficiency. Here is your situational briefing for today.</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 md:gap-8 w-full md:w-auto text-left md:text-right shrink-0">
             <div className="space-y-1 sm:space-y-2">
                <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#a1a1aa]">{format(new Date(), "EEEE, d MMMM yyyy").toUpperCase()}</p>
                <div className="flex items-center gap-2 md:justify-end">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"></div>
                   <p className="text-[10px] sm:text-[12px] font-black text-[#a1a1aa]">Live Status: <span className="text-emerald-600">ACTIVE</span></p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
         <StatCard title="TODAY'S APPOINTMENTS" value={String(metrics?.todayAppointments || 0)} trend={`+ ${metrics?.todayAppointments || 0}`} chartData={chartTrend} />
         <StatCard title="PENDING APPROVAL" value={String(metrics?.pendingApprovals || 0)} trend={`${metrics?.pendingApprovals || 0}`} trendUp={false} chartData={chartTrend} />
         <StatCard title="GROSS REVENUE" value={formatCurrency(metrics?.grossRevenue)} trend="+ 18%" chartData={chartTrend} />
      </div>

      {/* Lower Section Split */}
      <div className="grid grid-cols-12 gap-6 md:gap-8">
         {/* Today's Schedule */}
         <div className="col-span-12 lg:col-span-7 bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl p-5 sm:p-10 space-y-6 sm:space-y-10">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
               <p className="text-[#333]">TODAY'S SCHEDULE</p>
               <button className="text-vintage-tan hover:brightness-125 transition-all underline underline-offset-4 decoration-vintage-tan/20">VIEW CALENDAR</button>
            </div>

            <div className="relative pl-16 xs:pl-20 sm:pl-28 space-y-0">
               <div className="absolute left-[54px] xs:left-[66px] sm:left-[88px] top-4 bottom-4 w-px bg-zinc-800"></div>
               
               {schedule.length === 0 ? (
                 <div className="py-10 text-center text-[#444] text-[13px] font-bold">No appointments today</div>
               ) : (
                 schedule.slice(0, 5).map((item, idx) => (
                   <div key={item._id || idx} className="flex items-center justify-between py-6 relative group w-full">
                      {/* Time & Dot */}
                      <div className="flex items-center gap-2 sm:gap-4 absolute left-0">
                         <p className="text-[9px] sm:text-[11px] font-black text-[#555] w-12 xs:w-14 sm:w-20 text-right shrink-0">{formatTime(item.dateTime)}</p>
                         <div className="w-2.5 h-2.5 rounded-full bg-[#111] border-2 border-[#1a1a1a] relative z-10 group-hover:border-vintage-tan transition-colors shrink-0"></div>
                      </div>

                      <div className="flex items-center gap-3 ml-16 xs:ml-20 sm:ml-24 flex-1 min-w-0">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.customer?.name}`} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#1a1a1a] bg-[#111] shrink-0" alt="" />
                         <div className="min-w-0">
                            <p className="text-xs sm:text-[13px] font-bold text-white group-hover:text-vintage-tan transition-colors truncate">{item.customer?.name}</p>
                            <p className="text-[9px] sm:text-[10px] font-medium text-[#444] truncate">{item.service?.name}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-6 shrink-0 ml-2">
                         <p className="text-[10px] sm:text-[11px] font-bold text-[#888] hidden sm:block">{item.barber?.name}</p>
                         <span className={`px-1.5 py-0.5 sm:px-2 rounded text-[7px] sm:text-[8px] font-black uppercase tracking-wider border transition-all ${
                           item.status === 'Confirmed' ? 'bg-[#1a1a1a] text-emerald-500 border-emerald-500/10' : 'bg-[#1a1a1a] text-vintage-tan border-vintage-tan/10'
                         }`}>
                           {item.status}
                         </span>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* Detailed Analytics Right Sidebar */}
         <div className="col-span-12 lg:col-span-5 space-y-8">
            {/* Revenue Overview */}
            <div className="bg-[#ffffff] border border-[#efefef] rounded-xl p-8 space-y-8 shadow-sm">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <p className="text-[#cccccc]">REVENUE OVERVIEW</p>
                  <div className="flex items-center gap-2 cursor-pointer text-[#a1a1aa] hover:text-[#18181b] transition-colors">
                     <span>This Week</span>
                     <ChevronDown size={14} />
                  </div>
               </div>
               <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData}>
                       <Bar 
                         dataKey="v" 
                         fill="#C9A84C" 
                         radius={[2, 2, 0, 0]} 
                         opacity={0.3} 
                       />
                       <XAxis 
                         dataKey="name" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{fill: '#222', fontSize: 9, fontWeight: 'bold'}}
                         dy={10}
                       />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
               {/* Top Services */}
               <div className="bg-[#ffffff] border border-[#efefef] rounded-xl p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#cccccc]">TOP SERVICES</p>
                  {topServices.length === 0 ? (
                    <p className="text-[13px] text-[#cccccc] font-bold">No data yet</p>
                  ) : (
                    <div className="space-y-6">
                       {topServices.map((s, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold">
                               <span className="text-[#a1a1aa]">{s.name}</span>
                               <span className="text-[#18181b]">{s.percent}%</span>
                            </div>
                            <div className="h-1 bg-[#f4f4f5] rounded-full overflow-hidden">
                               <div className="h-full bg-vintage-tan" style={{ width: `${s.percent}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               {/* Appointment Status */}
               <div className="bg-[#ffffff] border border-[#efefef] rounded-xl p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#cccccc]">APPOINTMENT STATUS</p>
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-36 h-36 sm:w-40 sm:h-40 relative px-2">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                               data={statusData}
                               innerRadius={45}
                               outerRadius={65}
                               paddingAngle={5}
                               dataKey="value"
                             >
                               {statusData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                               ))}
                             </Pie>
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-[18px] sm:text-[20px] font-black text-[#18181b]">{totalStatus}</p>
                          <p className="text-[8px] font-bold text-[#cccccc] uppercase tracking-widest leading-none mb-0.5">TOTAL</p>
                       </div>
                    </div>
                    <div className="w-full space-y-2">
                       {statusData.map(item => (
                         <div key={item.name} className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                               <span className="text-[#a1a1aa]">{item.name}</span>
                            </div>
                            <span className="text-[#888]">{item.value}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Promotional Banner */}
      <div className="relative min-h-[160px] md:h-64 rounded-2xl overflow-hidden group border border-[#efefef] shadow-sm w-full">
         <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-[#ffffff] p-6 sm:p-10 md:p-16 flex flex-col justify-center space-y-4">
               <h4 className="text-xl sm:text-2xl font-serif font-black text-[#18181b] tracking-tight uppercase leading-none">
                 KEEP YOUR BOOK FULL.<br/>KEEP YOUR CLIENTS HAPPY.
               </h4>
               <p className="text-[#a1a1aa] text-xs sm:text-[13px] font-bold max-w-sm leading-relaxed">
                 Send reminders, manage walk-ins, and grow your business.
               </p>
            </div>
            <div className="relative overflow-hidden hidden md:block">
               <img 
                 src="https://images.unsplash.com/photo-1542385151-efd9000782a6?auto=format&fit=crop&q=80&w=2070" 
                 alt="" 
                 className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-[2s]"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-transparent"></div>
            </div>
         </div>
      </div>
    </div>
  );
};
