import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Loader2,
  X,
  XCircle,
  Upload,
  Eye,
  EyeOff,
  GripVertical,
  Camera,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SimpleStatCard } from "../UI/SimpleStatCard";
import { galleryAPI } from "../../../services/galleryService";
import { swalConfirm, swalSuccess, swalError } from "../../../utils/swal";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
const CATEGORIES = ['Barbers', 'Haircuts', 'Kids', 'Products', 'Barbershop'];
const COLS_OPTIONS = [
  { label: 'Default (1/3)', value: 'md:col-span-4' },
  { label: 'Wide (2/3)', value: 'md:col-span-8' },
  { label: 'Full Width', value: 'md:col-span-12' },
  { label: 'Half', value: 'md:col-span-6' }
];
const GALLERY_PER_PAGE = 8;

export const GalleryTab = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('ALL');
  const [galleryPage, setGalleryPage] = useState(1);
  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Barbers',
    cols: 'md:col-span-4',
    order: 0,
    url: ''
  });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await galleryAPI.getGalleryImages();
      setImages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  useEffect(() => {
    if (isModalOpen && firstInputRef.current) firstInputRef.current.focus();
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') handleCloseModal(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  const filteredImages = activeSubTab === 'ALL'
    ? images
    : images.filter(img => img.category === activeSubTab);

  const galleryTotalPages = Math.ceil(filteredImages.length / GALLERY_PER_PAGE);
  const paginatedImages = filteredImages.slice(
    (galleryPage - 1) * GALLERY_PER_PAGE,
    galleryPage * GALLERY_PER_PAGE
  );

  const categoryCount = {};
  images.forEach(img => {
    const cat = img.category || 'Other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const tabs = ['ALL', ...CATEGORIES];

  const dummyChartData = [{ v: images.length || 5 }, { v: 8 }, { v: 12 }, { v: 6 }, { v: 15 }, { v: 10 }, { v: 18 }];

  const handleOpenModal = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title || '',
        description: image.description || '',
        category: image.category || 'Barbers',
        cols: image.cols || 'md:col-span-4',
        order: image.order || 0,
        url: image.url || ''
      });
      setImageFile(null);
      setImagePreview(image.url ? (image.url.startsWith('http') ? image.url : `${API_BASE}${image.url}`) : '');
    } else {
      setEditingImage(null);
      setFormData({ title: '', description: '', category: 'Barbers', cols: 'md:col-span-4', order: 0, url: '' });
      setImageFile(null);
      setImagePreview('');
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setErrors({});
  };

  const handleViewDetails = (image) => {
    setSelectedImage(image);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setSelectedImage(null);
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.category) e.category = 'Category is required';
    if (!editingImage && !imageFile && !formData.url.trim()) e.image = 'Image file or URL is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('title', formData.title.trim());
      fd.append('description', formData.description.trim());
      fd.append('category', formData.category);
      fd.append('cols', formData.cols);
      fd.append('order', Number(formData.order));
      if (imageFile) {
        fd.append('image', imageFile);
      } else if (!editingImage && formData.url.trim()) {
        fd.append('url', formData.url.trim());
      }

      if (editingImage) {
        await galleryAPI.updateGalleryImage(editingImage._id, fd);
      } else {
        await galleryAPI.createGalleryImage(fd);
      }

      fetchImages();
      handleCloseModal();
      swalSuccess({
        title: editingImage ? 'Image Updated!' : 'Image Added!',
        text: `Successfully saved "${formData.title}".`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      swalError({ title: 'Save Failed', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (image) => {
    const result = await swalConfirm({
      title: 'Delete Image?',
      text: `"${image.title}" will be permanently removed.`,
      icon: 'warning',
      confirmText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        await galleryAPI.deleteGalleryImage(image._id);
        fetchImages();
        swalSuccess({ title: 'Deleted!', text: 'Image has been removed.' });
      } catch (err) {
        swalError({ title: 'Error', text: err.response?.data?.error || 'Failed to delete image' });
      }
    }
  };

  const handleToggleActive = async (image) => {
    try {
      await galleryAPI.updateGalleryImage(image._id, { isActive: !image.isActive });
      fetchImages();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-10 w-full mb-10" id="admin-gallery-tab">
      <div className="flex-1 space-y-10 w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-vintage-tan mb-1">
              <div className="w-8 h-[1px] bg-vintage-tan/30"></div>
              <span>Visual Portfolio</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#18181b] leading-none">
              The <span className="text-[#cccccc] italic">Gallery</span>
            </h2>
            <p className="text-[13px] font-medium text-[#a1a1aa] max-w-lg">Manage your portfolio images. Upload, organize by category, and control what customers see on the landing page.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center gap-3 px-8 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-vintage-tan/10 justify-center text-center font-bold shrink-0"
          >
            <Plus size={14} /> ADD NEW IMAGE
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <SimpleStatCard icon={ImageIcon} label="TOTAL IMAGES" value={String(images.length)} trend={`${images.filter(i => i.isActive).length} visible`} chartData={dummyChartData} />
          <SimpleStatCard icon={Eye} label="VISIBLE" value={String(images.filter(i => i.isActive).length)} trend={`${Math.round((images.filter(i => i.isActive).length / Math.max(images.length, 1)) * 100)}%`} chartData={dummyChartData} />
          <SimpleStatCard icon={EyeOff} label="HIDDEN" value={String(images.filter(i => !i.isActive).length)} trend="from gallery" chartData={dummyChartData} />
        </div>

        {/* Table Area */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg overflow-hidden shadow-sm">
          {/* Tabs */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-6 border-b border-[#efefef] overflow-x-auto no-scrollbar whitespace-nowrap">
            <div className="flex items-center gap-6 sm:gap-10" role="tablist" aria-label="Gallery category filters">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => { setActiveSubTab(t); setGalleryPage(1); }}
                  role="tab"
                  aria-selected={activeSubTab === t}
                  className={`text-[10px] font-black uppercase tracking-widest relative pb-6 -mb-6 transition-colors ${activeSubTab === t ? 'text-vintage-tan after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-vintage-tan' : 'text-[#a1a1aa] hover:text-[#18181b]'}`}
                >
                  {t}
                  {t !== 'ALL' && (
                    <span className="ml-1.5 text-[8px] text-[#cccccc]">({categoryCount[t] || 0})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div role="tabpanel" className="p-6 sm:p-10">
            {loading ? (
              <div className="flex items-center justify-center py-20" aria-live="polite">
                <Loader2 size={24} className="animate-spin text-vintage-tan" />
                <span className="sr-only">Loading gallery...</span>
              </div>
            ) : paginatedImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#cccccc]" aria-live="polite">
                <ImageIcon size={40} className="mb-4" />
                <p className="text-[13px] font-bold">No images found</p>
                <button onClick={() => handleOpenModal()} className="mt-3 text-[11px] font-bold text-vintage-tan hover:underline">Upload your first image</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedImages.map((img) => (
                  <div
                    key={img._id}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef] cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => handleViewDetails(img)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(img)}
                    aria-label={`View ${img.title}`}
                  >
                    <img
                      src={getImageUrl(img.url)}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!img.isActive ? 'opacity-100' : ''}`}>
                      {!img.isActive && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-800 text-white text-[7px] font-black uppercase tracking-widest rounded">
                          Hidden
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-[11px] font-bold truncate">{img.title}</p>
                      <p className="text-white/60 text-[9px] font-medium">{img.category}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleActive(img)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${img.isActive ? 'bg-emerald-500/80 text-white' : 'bg-neutral-800/80 text-white/60'}`}
                        title={img.isActive ? 'Hide from gallery' : 'Show in gallery'}
                        aria-label={img.isActive ? `Hide ${img.title}` : `Show ${img.title}`}
                      >
                        {img.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button
                        onClick={() => { handleOpenModal(img); }}
                        className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-vintage-tan transition-colors"
                        title="Edit image"
                        aria-label={`Edit ${img.title}`}
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(img)}
                        className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                        title="Delete image"
                        aria-label={`Delete ${img.title}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredImages.length > GALLERY_PER_PAGE && (
            <div className="px-6 sm:px-10 py-6 border-t border-[#efefef] flex items-center justify-between text-[11px] font-medium text-[#a1a1aa]">
              <p>Showing {(galleryPage - 1) * GALLERY_PER_PAGE + 1} to {Math.min(galleryPage * GALLERY_PER_PAGE, filteredImages.length)} of {filteredImages.length} images</p>
              <div className="flex items-center gap-2" role="navigation" aria-label="Gallery pagination">
                <button onClick={() => galleryPage > 1 && setGalleryPage(galleryPage - 1)} disabled={galleryPage <= 1} className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Previous page">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(galleryTotalPages, 4) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setGalleryPage(p)} aria-current={galleryPage === p ? 'page' : undefined} className={`w-8 h-8 flex items-center justify-center font-bold rounded transition-colors ${galleryPage === p ? 'bg-vintage-tan text-white' : 'border border-[#efefef] hover:border-[#a1a1aa]'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => galleryPage < galleryTotalPages && setGalleryPage(galleryPage + 1)} disabled={galleryPage >= galleryTotalPages} className="w-8 h-8 flex items-center justify-center border border-[#efefef] rounded hover:border-[#a1a1aa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Next page">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-80 shrink-0 space-y-10">
        {/* Category Breakdown */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">CATEGORY BREAKDOWN</p>
          <div className="space-y-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveSubTab(cat); setGalleryPage(1); }}
                className="w-full flex items-center justify-between p-3 rounded hover:bg-neutral-50 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-vintage-tan/40 group-hover:bg-vintage-tan transition-colors"></div>
                  <span className="text-[12px] font-medium text-[#888]">{cat}</span>
                </div>
                <span className="text-[13px] font-black text-[#18181b]">{categoryCount[cat] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">QUICK TIPS</p>
          <div className="space-y-3 text-[11px] text-[#a1a1aa] font-medium">
            <p>Click the <Eye size={10} className="inline" /> icon to toggle visibility on the landing page.</p>
            <p>Use <strong className="text-[#18181b]">Full Width</strong> for hero-style images.</p>
            <p>Drag-and-drop or paste a URL for external images.</p>
          </div>
        </div>
      </aside>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} aria-hidden="true" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#efefef]">
                <h3 id="gallery-modal-title" className="text-lg font-serif font-black uppercase tracking-widest text-[#18181b]">
                  {editingImage ? 'Edit Image' : 'Add New Image'}
                </h3>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#999] transition-colors" aria-label="Close modal">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form id="gallery-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                {errors.submit && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded text-[12px] text-rose-600 font-medium" role="alert">{errors.submit}</div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                    Image <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef] flex items-center justify-center shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-[#d4d4d8]" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-[#efefef] rounded-lg cursor-pointer hover:border-vintage-tan/50 hover:bg-vintage-tan/5 transition-all">
                        <div className="flex items-center gap-2 text-[#a1a1aa]">
                          <Upload size={16} />
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
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="text-[10px] text-red-400 hover:text-red-600 font-medium">
                          Remove
                        </button>
                      )}
                      {errors.image && <p className="text-[11px] text-rose-500">{errors.image}</p>}
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#cccccc]">Or paste image URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => { setFormData({ ...formData, url: e.target.value }); if (e.target.value) setImagePreview(e.target.value); }}
                      className="w-full mt-1 px-4 py-2.5 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 text-[12px] font-medium text-[#18181b] placeholder:text-[#cccccc]"
                      placeholder="https://example.com/image.jpg"
                      disabled={!!imageFile}
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="gallery-title" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                    Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="gallery-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 bg-[#fbfcfa] border rounded focus:outline-none focus:ring-1 transition-all text-sm font-medium ${errors.title ? 'border-rose-300 focus:ring-rose-300' : 'border-[#efefef] focus:border-vintage-tan/50 focus:ring-vintage-tan/50'}`}
                    placeholder="e.g. Classic Fade"
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="gallery-desc" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Description</label>
                  <textarea
                    id="gallery-desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium resize-none"
                    placeholder="Optional description..."
                  />
                </div>

                {/* Category + Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="gallery-category" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">
                      Category <span className="text-rose-400">*</span>
                    </label>
                    <select
                      id="gallery-category"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gallery-order" className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Sort Order</label>
                    <input
                      id="gallery-order"
                      type="number"
                      min={0}
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full px-4 py-3 bg-[#fbfcfa] border border-[#efefef] rounded focus:outline-none focus:border-vintage-tan/50 focus:ring-1 focus:ring-vintage-tan/50 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Grid Size */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#a1a1aa]">Grid Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COLS_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, cols: opt.value })}
                        className={`py-2.5 px-3 rounded border text-[11px] font-bold transition-all ${formData.cols === opt.value ? 'bg-vintage-tan text-white border-vintage-tan' : 'bg-[#fbfcfa] text-[#a1a1aa] border-[#efefef] hover:border-[#a1a1aa]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t border-[#efefef] bg-neutral-50 flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 rounded text-[10px] font-black uppercase tracking-widest text-[#71717a] hover:bg-neutral-200 transition-colors" disabled={isSubmitting}>Cancel</button>
                <button form="gallery-form" type="submit" className="px-8 py-2.5 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    editingImage ? 'Update Image' : 'Add Image'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Slide-Over */}
      <AnimatePresence>
        {isDetailOpen && selectedImage && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Image details">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseDetails} aria-hidden="true" />
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative w-full max-w-md bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-[#efefef]">
                <h3 className="text-lg font-serif font-black uppercase tracking-widest text-[#18181b]">Image Details</h3>
                <button onClick={handleCloseDetails} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#999] transition-colors" aria-label="Close details panel">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Image Preview */}
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-[#f4f4f5] border border-[#efefef]">
                  <img src={getImageUrl(selectedImage.url)} alt={selectedImage.title} className="w-full h-full object-cover" />
                </div>
                {/* Status */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${selectedImage.isActive ? 'bg-[#f0f9f4] text-emerald-600 border-emerald-100' : 'bg-[#f4f4f5] text-[#cccccc] border-[#efefef]'}`}>
                    {selectedImage.isActive ? 'Visible' : 'Hidden'}
                  </span>
                  <span className="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border bg-[#f9fafb] text-[#a1a1aa] border-[#efefef]">
                    {selectedImage.category}
                  </span>
                </div>
                {/* Details */}
                <div className="space-y-3">
                  <h4 className="text-[18px] font-bold text-[#18181b]">{selectedImage.title}</h4>
                  {selectedImage.description && (
                    <p className="text-[12px] font-medium text-[#a1a1aa] leading-relaxed">{selectedImage.description}</p>
                  )}
                </div>
                <div className="bg-[#fbfcfa] border border-[#efefef] rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-[#a1a1aa]">Sort Order</span>
                    <span className="font-bold text-[#18181b]">{selectedImage.order}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-[#a1a1aa]">Grid Size</span>
                    <span className="font-bold text-[#18181b]">{COLS_OPTIONS.find(c => c.value === selectedImage.cols)?.label || 'Default'}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-[#a1a1aa]">Created</span>
                    <span className="font-bold text-[#18181b]">{new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {/* Panel Footer */}
              <div className="p-6 border-t border-[#efefef] bg-neutral-50 flex gap-3">
                <button onClick={() => { handleCloseDetails(); handleToggleActive(selectedImage); }} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded text-[10px] font-black uppercase tracking-widest transition-colors ${selectedImage.isActive ? 'border border-neutral-200 text-neutral-500 hover:bg-neutral-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                  {selectedImage.isActive ? <><EyeOff size={14} /> HIDE</> : <><Eye size={14} /> SHOW</>}
                </button>
                <button onClick={() => { handleCloseDetails(); handleOpenModal(selectedImage); }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-vintage-tan text-white rounded text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-colors">
                  <Edit size={14} /> EDIT
                </button>
                <button onClick={() => { handleCloseDetails(); handleDelete(selectedImage); }} className="px-4 py-3 border border-rose-200 text-rose-600 rounded text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
