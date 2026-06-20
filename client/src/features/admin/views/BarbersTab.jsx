import { useState, useEffect, useCallback } from "react";
import { UserCircle, Edit, Plus, ChevronLeft, ChevronRight, X, Image as ImageIcon, Trash2, Loader2, Camera } from "lucide-react";
import { SimpleStatCard } from "../UI/SimpleStatCard";
import { barberAPI } from "../../../services/barberService";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

export const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Barber',
    profileImageFile: null,
    profileImagePreview: '',
    status: 'Active',
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  const fetchBarbers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await barberAPI.getBarbers();
      setBarbers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch barbers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const handleOpenModal = (barber = null) => {
    if (barber) {
      setEditingBarber(barber);
      setFormData({
        name: barber.name || '',
        role: barber.role || 'Barber',
        profileImageFile: null,
        profileImagePreview: barber.profileImage || '',
        status: barber.status || 'Active',
        workingHoursStart: barber.workingHours?.start || '09:00',
        workingHoursEnd: barber.workingHours?.end || '18:00',
        workingDays: barber.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    } else {
      setEditingBarber(null);
      setFormData({
        name: '',
        role: 'Barber',
        profileImageFile: null,
        profileImagePreview: '',
        status: 'Active',
        workingHoursStart: '09:00',
        workingHoursEnd: '18:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBarber(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('role', formData.role);
      fd.append('status', formData.status);
      fd.append('workingHours', JSON.stringify({ start: formData.workingHoursStart, end: formData.workingHoursEnd }));
      fd.append('workingDays', JSON.stringify(formData.workingDays));
      if (formData.profileImageFile) {
        fd.append('profileImage', formData.profileImageFile);
      }

      if (editingBarber) {
        await barberAPI.updateBarber(editingBarber._id, fd);
      } else {
        await barberAPI.createBarber(fd);
      }

      fetchBarbers();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save barber:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this barber?")) {
      try {
        await barberAPI.deleteBarber(id);
        fetchBarbers();
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to delete barber.';
        alert(message);
      }
    }
  };

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleWorkingDay = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const totalAppointments = barbers.reduce((sum, b) => sum + (b.stats?.totalAppointments || 0), 0);
  const totalRevenue = barbers.reduce((sum, b) => sum + (b.stats?.totalRevenue || 0), 0);

  const dummyChartData = [
    { v: 10 }, { v: 15 }, { v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 16 }
  ];

  return (
    <div className="flex flex-col gap-10 w-full mb-10" id="admin-barbers-tab">
      <div className="flex-1 space-y-10 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-1">
               <div className="w-8 h-[1px] bg-vintage-tan/30"></div>
               <span>Master Barbers</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#18181b] leading-none">
               The <span className="text-[#cccccc] italic">Artisans</span>
            </h2>
            <p className="text-[13px] font-medium text-[#a1a1aa] max-w-lg">Manage barbers, update their skills, and oversee their performance.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center gap-3 px-8 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-vintage-tan/10 justify-center text-center font-bold"
          >
            <Plus size={14} /> ADD BARBER
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
           <SimpleStatCard icon={UserCircle} label="TOTAL BARBERS" value={String(barbers.length)} trend="Active" chartData={dummyChartData} />
           <SimpleStatCard icon={UserCircle} label="TOTAL APPOINTMENTS" value={String(totalAppointments)} trend={`${totalAppointments} total`} chartData={dummyChartData} />
           <SimpleStatCard icon={UserCircle} label="TOTAL REVENUE" value={`₱${totalRevenue.toLocaleString()}`} trend="+ 18%" chartData={dummyChartData} />
        </div>

        {/* Table Area */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg overflow-hidden shadow-sm">
           {/* Table Header */}
           <div className="hidden md:grid grid-cols-12 gap-4 px-10 py-4 bg-[#f9fafb] border-b border-[#efefef] text-[10px] font-bold uppercase tracking-[0.2em] text-[#cccccc]">
              <div className="col-span-4">Barber Details</div>
              <div className="col-span-3">Role</div>
              <div className="col-span-2">Appointments</div>
              <div className="col-span-2">Revenue</div>
              <div className="col-span-1 text-right">Actions</div>
           </div>

           {/* Table Body */}
           {loading ? (
             <div className="flex items-center justify-center py-20">
               <Loader2 size={24} className="animate-spin text-vintage-tan" />
             </div>
           ) : barbers.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-[#cccccc]">
               <UserCircle size={40} className="mb-4" />
               <p className="text-[13px] font-bold">No barbers found</p>
             </div>
           ) : (
             <div className="divide-y divide-[#efefef]">
               {barbers.map((b) => (
                 <div key={b._id} className="grid grid-cols-12 gap-4 px-10 py-6 items-center hover:bg-[#f9fafb] transition-colors group">
                   <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef] shrink-0">
                         <img src={b.profileImage ? (b.profileImage.startsWith('http') ? b.profileImage : `${API_BASE}${b.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.name}`} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div>
                         <p className="text-[13px] font-bold text-[#18181b]">{b.name}</p>
                         <p className="text-[10px] font-medium text-[#cccccc] truncate max-w-[150px]">{b.workingHours?.start} - {b.workingHours?.end}</p>
                      </div>
                   </div>
                   <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                      <span className="px-2 py-1 bg-[#f9fafb] text-[#a1a1aa] text-[8px] font-black uppercase tracking-widest rounded border border-[#efefef]">
                         {b.role}
                      </span>
                   </div>
                   <div className="col-span-4 md:col-span-2 mt-2 md:mt-0">
                      <span className="text-[13px] font-bold text-[#18181b]">{b.stats?.totalAppointments || 0}</span>
                   </div>
                   <div className="col-span-4 md:col-span-2 mt-2 md:mt-0">
                      <span className="text-[13px] font-bold text-[#18181b]">₱{(b.stats?.totalRevenue || 0).toLocaleString()}</span>
                   </div>
                    <div className="col-span-12 md:col-span-1 text-right flex justify-end gap-2 text-[#a1a1aa] mt-2 md:mt-0">
                      <button 
                        onClick={() => handleOpenModal(b)}
                        className="hover:text-vintage-tan transition-colors p-1"
                        title="Edit Barber"
                      >
                         <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(b._id)}
                        className="hover:text-red-500 transition-colors p-1"
                        title="Delete Barber"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {/* Pagination Footer */}
           {barbers.length > 0 && (
             <div className="px-10 py-6 border-t border-[#efefef] flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
                <p>Showing 1 to {barbers.length} of {barbers.length} barbers</p>
                <div className="flex items-center gap-2">
                   <button className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors"><ChevronLeft size={16}/></button>
                   <button className="w-8 h-8 flex items-center justify-center bg-vintage-tan text-white font-bold rounded">1</button>
                   <button className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors"><ChevronRight size={16}/></button>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-[#efefef]">
              <h3 className="text-xl font-serif font-black uppercase tracking-widest text-[#18181b]">
                {editingBarber ? 'Edit Barber' : 'Add New Barber'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#999] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar-light">
              <form id="barber-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                      placeholder="e.g. Master Basri"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Role *</label>
                    <select 
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    >
                      <option value="Barber">Barber</option>
                      <option value="Senior Barber">Senior Barber</option>
                      <option value="Master Barber">Master Barber</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Profile Image</label>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[#f4f4f5] border border-[#efefef] flex items-center justify-center shrink-0">
                      {formData.profileImagePreview ? (
                        <img src={formData.profileImagePreview.startsWith('http') || formData.profileImagePreview.startsWith('blob:') ? formData.profileImagePreview : `${API_BASE}${formData.profileImagePreview}`} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={32} className="text-[#d4d4d8]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-[#efefef] rounded-lg cursor-pointer hover:border-vintage-tan/50 hover:bg-vintage-tan/5 transition-all">
                        <div className="flex items-center gap-2 text-[#a1a1aa]">
                          <Camera size={16} />
                          <span className="text-[11px] font-medium">
                            {formData.profileImageFile ? formData.profileImageFile.name : 'Click to upload photo'}
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
                              setFormData({
                                ...formData,
                                profileImageFile: file,
                                profileImagePreview: URL.createObjectURL(file)
                              });
                            }
                          }}
                        />
                      </label>
                      {formData.profileImageFile && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, profileImageFile: null, profileImagePreview: editingBarber?.profileImage || '' })}
                          className="text-[10px] text-red-400 hover:text-red-600 mt-1 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Status *</label>
                  <select 
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Working Hours Start</label>
                    <input 
                      type="time" 
                      value={formData.workingHoursStart}
                      onChange={(e) => setFormData({...formData, workingHoursStart: e.target.value})}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Working Hours End</label>
                    <input 
                      type="time" 
                      value={formData.workingHoursEnd}
                      onChange={(e) => setFormData({...formData, workingHoursEnd: e.target.value})}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {allDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`px-3 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          formData.workingDays.includes(day)
                            ? 'bg-vintage-tan text-white border-vintage-tan'
                            : 'bg-[#fbfcfa] text-[#a1a1aa] border-[#efefef] hover:border-[#cccccc]'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
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
                form="barber-form"
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
                  'Save Barber'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
