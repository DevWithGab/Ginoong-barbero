import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Clock, 
  Scissors, 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Edit,
  Trash2,
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Package, 
  Users,
  Loader2,
  X,
  XCircle,
  StickyNote,
  Tag,
  DollarSign,
  Camera,
  ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { SimpleStatCard } from "../UI/SimpleStatCard";
import { serviceAPI } from "../../../services/serviceMenu";

const CATEGORIES = ['Haircuts', 'Beard', 'Hair Color', 'Add-ons', 'Packages'];

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

export const ServicesTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("ALL SERVICES");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Haircuts',
    duration: 30,
    price: 0,
    status: 'Active'
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await serviceAPI.getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (isModalOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') handleCloseModal(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  const filteredServices = activeSubTab === "ALL SERVICES" 
    ? services 
    : services.filter(s => s.category === activeSubTab);

  const dummyChartData = [
    { v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 16 }
  ];

  const categoryCount = {};
  services.forEach(s => {
    const cat = s.category || 'Other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const categoryList = [
    { name: 'Haircuts', icon: Scissors, count: categoryCount['Haircuts'] || 0 },
    { name: 'Beard', icon: Users, count: categoryCount['Beard'] || 0 },
    { name: 'Hair Color', icon: Edit, count: categoryCount['Hair Color'] || 0 },
    { name: 'Add-ons', icon: Plus, count: categoryCount['Add-ons'] || 0 },
    { name: 'Packages', icon: Package, count: categoryCount['Packages'] || 0 },
  ];

  const pieData = services.slice(0, 5).map((s, i) => ({
    name: s.name,
    value: s.price || 0,
    color: ['#C9A84C', '#888', '#444', '#222', '#111'][i]
  }));

  const totalRevenue = services.reduce((sum, s) => sum + (s.price || 0), 0);

  const tabs = ['ALL SERVICES', 'HAIRCUTS', 'BEARD', 'HAIR COLOR', 'ADD-ONS', 'PACKAGES'];

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name || '',
        description: service.description || '',
        category: service.category || 'Haircuts',
        duration: service.duration || 30,
        price: service.price || 0,
        status: service.status || 'Active'
      });
      setImageFile(null);
      setImagePreview(service.image ? (service.image.startsWith('http') ? service.image : `${API_BASE}${service.image}`) : '');
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', category: 'Haircuts', duration: 30, price: 0, status: 'Active' });
      setImageFile(null);
      setImagePreview('');
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setErrors({});
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setSelectedService(null);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Service name is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    if (!formData.category) e.category = 'Category is required';
    if (!formData.duration || formData.duration < 15) e.duration = 'Minimum 15 minutes';
    if (formData.price < 0) e.price = 'Price cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name.trim());
      fd.append('description', formData.description.trim());
      fd.append('category', formData.category);
      fd.append('duration', Number(formData.duration));
      fd.append('price', Number(formData.price));
      fd.append('status', formData.status);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editingService) {
        await serviceAPI.updateService(editingService._id, fd);
      } else {
        await serviceAPI.createService(fd);
      }

      fetchServices();
      handleCloseModal();
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    try {
      await serviceAPI.deleteService(service._id);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete service');
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active'
      ? 'bg-[#f0f9f4] text-emerald-600 border-emerald-100'
      : 'bg-[#f4f4f5] text-[#cccccc] border-[#efefef]';
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10 w-full mb-10" id="admin-services-tab">
      <div className="flex-1 space-y-10 w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-1">
               <div className="w-8 h-[1px] bg-vintage-tan/30"></div>
               <span>Service Menu</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#18181b] leading-none">
               The <span className="text-[#cccccc] italic">Craft</span>
            </h2>
            <p className="text-[13px] font-medium text-[#a1a1aa] max-w-lg">Manage your services, set prices, and keep your specialized menu up to date.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center gap-3 px-8 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-vintage-tan/10 justify-center text-center font-bold"
          >
            <Plus size={14} /> ADD NEW SERVICE
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
           <SimpleStatCard icon={Scissors} label="TOTAL SERVICES" value={String(services.length)} trend="+ 20%" chartData={dummyChartData} />
           <SimpleStatCard icon={BarChart3} label="MOST BOOKED" value={services.length > 0 ? services[0].name : '—'} trend={`${services.length} total`} chartData={dummyChartData} />
           <SimpleStatCard icon={TrendingUp} label="TOTAL REVENUE" value={`₱${totalRevenue.toLocaleString()}`} trend="+ 18%" chartData={dummyChartData} />
        </div>

        {/* Table Area */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg overflow-hidden shadow-sm">
           {/* Tabs */}
           <div className="flex items-center justify-between px-10 py-6 border-b border-[#efefef] overflow-x-auto no-scrollbar whitespace-nowrap">
              <div className="flex items-center gap-10" role="tablist" aria-label="Service category filters">
                {tabs.map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveSubTab(t)}
                    role="tab"
                    aria-selected={activeSubTab === t}
                    className={`text-[10px] font-black uppercase tracking-widest relative pb-6 -mb-6 transition-colors ${activeSubTab === t ? 'text-vintage-tan after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-vintage-tan' : 'text-[#a1a1aa] hover:text-[#18181b]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
           </div>

           {/* Table Header */}
           <div className="hidden md:flex items-center px-10 py-4 bg-[#f9fafb] border-b border-[#efefef] text-[10px] font-bold uppercase tracking-[0.2em] text-[#cccccc]">
               <div className="w-[30%]">Service</div>
               <div className="w-[15%]">Category</div>
               <div className="w-[15%]">Duration</div>
               <div className="w-[10%]">Price</div>
               <div className="w-[15%]">Status</div>
               <div className="w-[15%] text-right">Actions</div>
           </div>

           {/* Table Body */}
           <div role="tabpanel">
            {loading ? (
              <div className="flex items-center justify-center py-20" aria-live="polite">
                <Loader2 size={24} className="animate-spin text-vintage-tan" />
                <span className="sr-only">Loading services...</span>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#cccccc]" aria-live="polite">
                <Scissors size={40} className="mb-4" />
                <p className="text-[13px] font-bold">No services found</p>
                <button onClick={() => handleOpenModal()} className="mt-3 text-[11px] font-bold text-vintage-tan hover:underline">Add a service</button>
              </div>
            ) : (
              <div className="divide-y divide-[#efefef]">
                {filteredServices.map((s) => (
                  <div 
                    key={s._id} 
                    onClick={() => handleViewDetails(s)}
                    className="flex items-center px-10 py-6 hover:bg-[#f9fafb] transition-colors group cursor-pointer active:scale-[0.995]"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(s)}
                    aria-label={`View details for ${s.name}`}
                  >
                    <div className="w-[30%] flex items-center gap-4 min-w-0">
                       <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef] shrink-0">
                          {s.image ? (
                            <img src={s.image.startsWith('http') ? s.image : `${API_BASE}${s.image}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} alt="" className="w-full h-full object-cover" />
                          )}
                       </div>
                       <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#18181b] truncate group-hover:text-vintage-tan transition-colors">{s.name}</p>
                          <p className="text-[10px] font-medium text-[#cccccc] truncate">{s.description}</p>
                       </div>
                    </div>
                    <div className="w-[15%]">
                       <span className="px-2 py-1 bg-[#f9fafb] text-[#a1a1aa] text-[8px] font-black uppercase tracking-widest rounded border border-[#efefef]">
                          {s.category || 'N/A'}
                       </span>
                    </div>
                    <div className="w-[15%] flex items-center gap-2 text-[#a1a1aa]">
                       <Clock size={12} />
                       <span className="text-[11px] font-bold">{s.duration || 30} mins</span>
                    </div>
                    <div className="w-[10%]">
                       <p className="text-[13px] font-bold text-[#18181b]">₱{(s.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="w-[15%]">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getStatusColor(s.status)}`}>
                         {s.status}
                       </span>
                    </div>
                    <div className="w-[15%] flex items-center justify-end gap-2 text-[#efefef]" onClick={(e) => e.stopPropagation()}>
                       <button 
                         onClick={() => handleOpenModal(s)}
                         className="hover:text-vintage-tan transition-colors p-1"
                         title="Edit service"
                         aria-label={`Edit ${s.name}`}
                       >
                          <Edit size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(s)}
                         className="hover:text-red-500 transition-colors p-1"
                         title="Delete service"
                         aria-label={`Delete ${s.name}`}
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
           </div>

           {/* Pagination Footer */}
           <div className="px-10 py-6 border-t border-[#efefef] flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
              <p>Showing 1 to {filteredServices.length} of {services.length} services</p>
           </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 shrink-0 space-y-10">
        {/* Revenue by Service */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-8 shadow-sm">
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">REVENUE BY SERVICE</p>
           </div>
           
           <div className="flex flex-col items-center gap-6">
              <div className="w-40 h-40 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                         data={pieData}
                         innerRadius={45}
                         outerRadius={65}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {pieData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                         ))}
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[14px] font-black text-[#18181b]">₱{totalRevenue.toLocaleString()}</p>
                    <p className="text-[7px] font-bold text-[#cccccc] uppercase">TOTAL</p>
                 </div>
              </div>

              <div className="w-full space-y-4">
                 {pieData.map(item => (
                   <div key={item.name} className="space-y-1 group cursor-default">
                      <div className="flex items-center justify-between gap-3">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                           <span className="text-[10px] font-bold text-[#444] group-hover:text-[#888] transition-colors">{item.name}</span>
                         </div>
                         <p className="text-[11px] font-black text-[#555] whitespace-nowrap">₱{item.value.toLocaleString()} <span className="text-[9px] font-bold text-[#cccccc]">({totalRevenue > 0 ? Math.round(item.value / totalRevenue * 100) : 0}%)</span></p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-6 shadow-sm">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">CATEGORY BREAKDOWN</p>
           <div className="space-y-4">
              {categoryList.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setActiveSubTab(cat.name.toUpperCase())}
                  className="w-full flex items-center justify-between p-3 rounded hover:bg-neutral-50 transition-colors group text-left"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-[#111] flex items-center justify-center text-vintage-tan/40 group-hover:text-vintage-tan transition-colors">
                         <cat.icon size={14} />
                      </div>
                      <span className="text-[12px] font-medium text-[#888]">{cat.name}</span>
                   </div>
                   <span className="text-[14px] font-black text-[#18181b]">{cat.count}</span>
                </button>
              ))}
           </div>
        </div>
      </aside>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
              aria-hidden="true"
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#efefef]">
                <h3 id="service-modal-title" className="text-lg font-serif font-black uppercase tracking-widest text-[#18181b]">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#999] transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form id="service-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                {errors.submit && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded text-[12px] text-rose-600 font-medium" role="alert">
                    {errors.submit}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="svc-name" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                    Service Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="svc-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#fbfcfa] border rounded focus:outline-none focus:ring-1 transition-all text-sm font-medium ${errors.name ? 'border-rose-300 focus:ring-rose-300' : 'border-[#efefef] focus:border-vintage-tan/50 focus:ring-vintage-tan/50'}`}
                    placeholder="e.g. Classic Haircut"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'svc-name-error' : undefined}
                  />
                  {errors.name && <p id="svc-name-error" className="text-[11px] text-rose-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="svc-desc" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                    Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="svc-desc"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#fbfcfa] border rounded focus:outline-none focus:ring-1 transition-all text-sm font-medium resize-none ${errors.description ? 'border-rose-300 focus:ring-rose-300' : 'border-[#efefef] focus:border-vintage-tan/50 focus:ring-vintage-tan/50'}`}
                    placeholder="Describe the service..."
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'svc-desc-error' : undefined}
                  />
                  {errors.description && <p id="svc-desc-error" className="text-[11px] text-rose-500">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                    Service Image
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef] flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-[#d4d4d8]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-[#efefef] rounded-lg cursor-pointer hover:border-vintage-tan/50 hover:bg-vintage-tan/5 transition-all">
                        <div className="flex items-center gap-2 text-[#a1a1aa]">
                          <Camera size={16} />
                          <span className="text-[11px] font-medium">
                            {imageFile ? imageFile.name : 'Click to upload image'}
                          </span>
                        </div>
                        <span className="text-[9px] text-[#cccccc] mt-1">JPG, PNG, GIF, WebP (max 5MB)</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImageFile(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(editingService?.image ? (editingService.image.startsWith('http') ? editingService.image : `${API_BASE}${editingService.image}`) : ''); }}
                          className="text-[10px] text-red-400 hover:text-red-600 mt-1 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="svc-category" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                      Category <span className="text-rose-400">*</span>
                    </label>
                    <select
                      id="svc-category"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="svc-status" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                      Status
                    </label>
                    <select
                      id="svc-status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="svc-duration" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                      Duration (mins) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="svc-duration"
                      type="number"
                      required
                      min={15}
                      max={300}
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#fbfcfa] border rounded focus:outline-none focus:ring-1 transition-all text-sm font-medium ${errors.duration ? 'border-rose-300 focus:ring-rose-300' : 'border-[#efefef] focus:border-vintage-tan/50 focus:ring-vintage-tan/50'}`}
                      aria-invalid={!!errors.duration}
                      aria-describedby={errors.duration ? 'svc-duration-error' : undefined}
                    />
                    {errors.duration && <p id="svc-duration-error" className="text-[11px] text-rose-500">{errors.duration}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="svc-price" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                      Price (₱) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="svc-price"
                      type="number"
                      required
                      min={0}
                      step={1}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#fbfcfa] border rounded focus:outline-none focus:ring-1 transition-all text-sm font-medium ${errors.price ? 'border-rose-300 focus:ring-rose-300' : 'border-[#efefef] focus:border-vintage-tan/50 focus:ring-vintage-tan/50'}`}
                      aria-invalid={!!errors.price}
                      aria-describedby={errors.price ? 'svc-price-error' : undefined}
                    />
                    {errors.price && <p id="svc-price-error" className="text-[11px] text-rose-500">{errors.price}</p>}
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#efefef] bg-neutral-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-widest text-[#71717a] hover:bg-neutral-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  form="service-form"
                  type="submit"
                  className="px-8 py-2.5 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    editingService ? 'Update Service' : 'Add Service'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Service Detail Slide-Over */}
      <AnimatePresence>
        {isDetailOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Service details">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleCloseDetails}
              aria-hidden="true"
            />
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
                  Service Details
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
                {/* Status + Category */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3"
                >
                  <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedService.status)}`}>
                    {selectedService.status}
                  </span>
                  <span className="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border bg-[#f9fafb] text-[#a1a1aa] border-[#efefef]">
                    {selectedService.category}
                  </span>
                </motion.div>

                {/* Service Name + Description */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <Scissors size={12} />
                    <span>Service</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    {selectedService.image && (
                      <div className="w-full h-32 rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                        <img 
                          src={selectedService.image.startsWith('http') ? selectedService.image : `${API_BASE}${selectedService.image}`} 
                          alt={selectedService.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedService.name}`} alt="" />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#18181b]">{selectedService.name}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <StickyNote size={14} className="text-[#cccccc]" />
                        <span className="text-[13px] font-medium text-[#18181b]">{selectedService.description || '—'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Pricing & Duration */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <DollarSign size={12} />
                    <span>Pricing & Duration</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Price</span>
                      <span className="text-[15px] font-bold text-[#18181b]">₱{(selectedService.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Duration</span>
                      <span className="text-[15px] font-bold text-[#18181b]">{selectedService.duration || 0} mins</span>
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">
                    <BarChart3 size={12} />
                    <span>Statistics</span>
                  </div>
                  <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Total Bookings</span>
                      <span className="text-[15px] font-bold text-[#18181b]">{selectedService.bookingCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#a1a1aa]">Revenue Generated</span>
                      <span className="text-[15px] font-bold text-[#18181b]">₱{(selectedService.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Panel Footer - Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="p-6 border-t border-[#efefef] bg-neutral-50"
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => { handleCloseDetails(); handleOpenModal(selectedService); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-colors"
                  >
                    <Edit size={14} /> EDIT SERVICE
                  </button>
                  <button
                    onClick={() => { handleCloseDetails(); handleDelete(selectedService); }}
                    className="px-6 py-3 border border-rose-200 text-rose-600 rounded text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
