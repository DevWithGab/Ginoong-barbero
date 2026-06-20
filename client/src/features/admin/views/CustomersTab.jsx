import { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Search, 
  Upload, 
  MoreHorizontal, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ChevronDown, 
  Receipt,
  Loader2
} from "lucide-react";
import { InsightCard } from "../UI/InsightCard";
import { customerAPI } from "../../../services/customerService";

export const CustomersTab = ({ 
  customers: propCustomers, 
  searchTerm, 
  setSearchTerm 
}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchCustomers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const res = await customerAPI.getCustomers(params);
      setCustomers(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(1, searchTerm);
  }, [fetchCustomers, searchTerm]);

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const insightData = [
    { v: 10, v2: 5 }, { v: 15, v2: 8 }, { v: 12, v2: 12 }, { v: 18, v2: 15 }, { v: 14, v2: 18 }, { v: 22, v2: 24 }, { v: 16, v2: 20 }
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-10 w-full mb-10" id="admin-customers-tab">
      <div className="flex-1 space-y-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-1">
               <div className="w-8 h-[1px] bg-vintage-tan/30"></div>
               <span>Directory</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#18181b] leading-none">
               The <span className="text-[#cccccc] italic">Patrons</span>
            </h2>
            <p className="text-[13px] font-medium text-[#a1a1aa] max-w-lg">View and manage your customers. Build stronger relationships and keep them coming back.</p>
          </div>
          <button className="w-full md:w-auto flex items-center gap-3 px-8 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-vintage-tan/10 justify-center text-center">
            <Plus size={14} /> ADD CUSTOMER
          </button>
        </div>

        {/* Search and Action Bar */}
        <div className="flex items-center gap-4">
           <div className="flex-1 flex items-center gap-4 bg-[#ffffff] border border-[#efefef] px-6 py-3.5 rounded group focus-within:border-[#cccccc] transition-all shadow-sm">
              <Search size={16} className="text-[#cccccc] group-focus-within:text-[#18181b]" />
              <input 
                type="text" 
                placeholder="Search customers by name, phone, or email..." 
                className="bg-transparent border-none outline-none text-[13px] text-[#18181b] w-full font-medium placeholder:text-[#cccccc]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="flex items-center gap-3 px-6 py-3.5 bg-[#ffffff] border border-[#efefef] rounded text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1a1aa] hover:text-[#18181b] transition-all shadow-sm shrink-0">
              <Upload size={16} /> IMPORT
           </button>
           <button className="p-3.5 bg-[#ffffff] border border-[#efefef] rounded text-[#cccccc] hover:text-[#18181b] transition-all shadow-sm shrink-0">
              <MoreHorizontal size={18} />
           </button>
        </div>

        {/* Table Area */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg overflow-hidden shadow-sm">
           {/* Table Header */}
           <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-5 bg-[#f9fafb] border-b border-[#efefef] text-[10px] font-bold uppercase tracking-[0.2em] text-[#cccccc]">
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-1 text-center">Total Visits</div>
              <div className="col-span-1 text-center">Total Spent</div>
              <div className="col-span-2">Last Appointment</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
           </div>

           {/* Table Body */}
           {loading ? (
             <div className="flex items-center justify-center py-20">
               <Loader2 size={24} className="animate-spin text-vintage-tan" />
             </div>
           ) : filtered.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-[#cccccc]">
               <Search size={40} className="mb-4" />
               <p className="text-[13px] font-bold">No customers found</p>
             </div>
           ) : (
             <div className="divide-y divide-[#efefef]">
               {filtered.map((c) => (
                 <div key={c._id} className="grid grid-cols-12 gap-4 px-10 py-6 items-center hover:bg-[#f9fafb] transition-colors group">
                   <div className="col-span-3 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`} alt="" />
                      </div>
                      <div className="flex items-center gap-2">
                         <p className="text-[14px] font-bold text-[#18181b]">{c.name}</p>
                         {c.isVIP && (
                           <span className="px-1.5 py-0.5 bg-vintage-tan/10 text-vintage-tan text-[8px] font-black uppercase tracking-widest rounded border border-vintage-tan/20">VIP</span>
                         )}
                      </div>
                   </div>
                   <div className="col-span-3">
                      <p className="text-[13px] font-bold text-[#a1a1aa]">{c.phone}</p>
                      <p className="text-[11px] font-medium text-[#cccccc]">{c.email}</p>
                   </div>
                   <div className="col-span-1 text-center font-bold text-[#18181b] text-[14px]">
                      {c.totalVisits || 0}
                   </div>
                   <div className="col-span-1 text-center font-bold text-[#18181b] text-[14px]">
                      ₱{(c.totalSpent || 0).toLocaleString()}
                   </div>
                   <div className="col-span-2">
                      <p className="text-[13px] font-bold text-[#18181b]">{formatDate(c.lastAppointment)}</p>
                      <p className="text-[10px] font-medium text-[#cccccc] uppercase tracking-widest">{formatTime(c.lastAppointment)}</p>
                   </div>
                   <div className="col-span-1">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-colors ${
                        c.status === 'Active' ? 'bg-[#f0f9f4] text-emerald-600 border-emerald-100' : 'bg-[#f4f4f5] text-[#cccccc] border-[#efefef]'
                      }`}>
                        {c.status}
                      </span>
                   </div>
                   <div className="col-span-1 text-right text-[#efefef]">
                      <button className="hover:text-[#18181b] transition-colors p-1">
                         <MoreVertical size={16} />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {/* Pagination Footer */}
           <div className="px-10 py-6 border-t border-[#efefef] flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
              <p>Showing {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} patrons</p>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => pagination.page > 1 && fetchCustomers(pagination.page - 1, searchTerm)}
                   className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors"
                 >
                   <ChevronLeft size={16}/>
                 </button>
                 {Array.from({ length: Math.min(pagination.pages, 4) }, (_, i) => i + 1).map(p => (
                   <button 
                     key={p}
                     onClick={() => fetchCustomers(p, searchTerm)}
                     className={`w-8 h-8 flex items-center justify-center font-bold rounded transition-colors ${
                       pagination.page === p 
                         ? 'bg-vintage-tan text-white shadow-lg shadow-vintage-tan/20' 
                         : 'border border-[#efefef] hover:border-[#a1a1aa]'
                     }`}
                   >
                     {p}
                   </button>
                 ))}
                 {pagination.pages > 4 && <span className="px-2">...</span>}
                 {pagination.pages > 4 && (
                   <button 
                     onClick={() => fetchCustomers(pagination.pages, searchTerm)}
                     className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors"
                   >
                     {pagination.pages}
                   </button>
                 )}
                 <button 
                   onClick={() => pagination.page < pagination.pages && fetchCustomers(pagination.page + 1, searchTerm)}
                   className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors"
                 >
                   <ChevronRight size={16}/>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Right Sidebar - Insights & Filters */}
      <aside className="w-80 shrink-0 space-y-10">
        {/* Customer Insights */}
        <div className="space-y-6">
           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#333]">
              <p>CUSTOMER INSIGHTS</p>
              <div className="flex items-center gap-2 cursor-pointer hover:text-[#555] transition-colors">
                 <span>This Month</span>
                 <ChevronDown size={14} />
              </div>
           </div>
           
           <div className="space-y-4">
              <InsightCard icon={Calendar} label="NEW CUSTOMERS" value={String(pagination.total)} trend={`+ ${pagination.total > 0 ? Math.round((pagination.total / 30) * 100) : 0}% vs last month`} chartData={insightData} />
              <InsightCard icon={Calendar} label="RETURNING CUSTOMERS" value={String(customers.filter(c => (c.totalVisits || 0) > 1).length)} trend={`+ ${customers.filter(c => (c.totalVisits || 0) > 1).length > 0 ? Math.round((customers.filter(c => (c.totalVisits || 0) > 1).length / 30) * 100) : 0}% vs last month`} chartData={insightData.map(d => ({ v: d.v2 }))} />
              <InsightCard icon={Receipt} label="AVG. SPENT PER CUSTOMER" value={`₱${customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length).toLocaleString() : 0}`} trend="+ 12% vs last month" chartData={insightData} />
           </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-lg p-8 space-y-10">
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#333]">FILTERS</p>
              <button className="text-[10px] font-bold text-vintage-tan underline decoration-vintage-tan/20 underline-offset-4">Clear All</button>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Search</p>
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Name, phone or email..." 
                   className="w-full bg-[#111] border border-[#1a1a1a] p-4 rounded text-[12px] text-white outline-none focus:border-[#333] transition-all placeholder:text-[#222]"
                 />
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Status</p>
                 <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-4 rounded cursor-pointer group">
                    <span className="text-[12px] text-white font-medium">All Status</span>
                    <ChevronDown size={14} className="text-[#333] group-hover:text-[#555]" />
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Customer Type</p>
                 <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-4 rounded cursor-pointer group">
                    <span className="text-[12px] text-white font-medium">All Types</span>
                    <ChevronDown size={14} className="text-[#333] group-hover:text-[#555]" />
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Total Visits</p>
                 <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-4 rounded cursor-pointer group">
                    <span className="text-[12px] text-white font-medium">All</span>
                    <ChevronDown size={14} className="text-[#333] group-hover:text-[#555]" />
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Total Spent</p>
                 <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-4 rounded cursor-pointer group">
                    <span className="text-[12px] text-white font-medium">All</span>
                    <ChevronDown size={14} className="text-[#333] group-hover:text-[#555]" />
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-bold text-[#222] uppercase tracking-widest">Last Appointment</p>
                 <div className="flex items-center justify-between bg-[#111] border border-[#1a1a1a] p-4 rounded cursor-pointer group">
                    <div className="flex items-center gap-3">
                       <Calendar size={14} className="text-[#333]" />
                       <span className="text-[12px] text-[#333] font-medium tracking-tight">Select date range</span>
                    </div>
                    <Receipt size={14} className="text-transparent" />
                 </div>
              </div>

              <button className="w-full mt-4 py-4 border border-vintage-tan/30 text-vintage-tan rounded text-[10px] font-black uppercase tracking-[0.3em] hover:bg-vintage-tan hover:text-[#0a0a0a] transition-all">
                APPLY FILTERS
              </button>
           </div>
        </div>
      </aside>
    </div>
  );
};
