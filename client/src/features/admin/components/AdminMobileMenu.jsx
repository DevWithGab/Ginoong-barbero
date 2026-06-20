import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, XCircle, Shield } from "lucide-react";

export const AdminMobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
  setActiveTab,
  user,
  handleLogout,
  menuItems
}) => {
  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 bg-[#ffffff] border-b border-[#efefef] flex items-center justify-between px-6 shrink-0 relative z-30 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-vintage-tan rounded-lg flex items-center justify-center shadow-lg shadow-vintage-tan/20">
            <Shield size={18} className="text-[#ffffff]" />
          </div>
          <div className="space-y-0.5 whitespace-nowrap">
            <h1 className="text-md font-serif font-black uppercase tracking-widest leading-none text-[#0a0a0a]">GINOONG</h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-vintage-tan leading-none">BARBERO</p>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 border border-[#efefef] rounded-lg flex items-center justify-center text-[#71717a] hover:bg-zinc-50 active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            {/* Sidebar Drawer */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-[#ffffff] border-r border-[#efefef] flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <div className="p-5 flex items-center justify-between border-b border-[#efefef]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-vintage-tan rounded-lg flex items-center justify-center shadow-lg shadow-vintage-tan/20">
                    <Shield size={18} className="text-[#ffffff]" />
                  </div>
                  <div className="space-y-0.5 whitespace-nowrap">
                    <h1 className="text-md font-serif font-black uppercase tracking-widest leading-none text-[#0a0a0a]">GINOONG</h1>
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-vintage-tan leading-none">BARBERO</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#71717a] hover:bg-zinc-100 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="px-5 py-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar-light">
                <p className="px-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#cccccc]">Main Menu</p>
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button 
                      key={item.label}
                      onClick={() => {
                        setActiveTab(item.label);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded transition-all ${
                        activeTab === item.label 
                          ? 'bg-[#fbfcfa] text-vintage-tan font-bold border-l-2 border-vintage-tan shadow-sm' 
                          : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f9f9f9]'
                      }`}
                    >
                      <item.icon size={18} className={`${activeTab === item.label ? "text-vintage-tan" : "text-[#d4d4d8] transition-colors"} shrink-0`} />
                      <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 space-y-6 border-t border-[#efefef]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#efefef] overflow-hidden bg-[#f4f4f5] shrink-0">
                    <img 
                      src={user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[13px] font-bold text-[#18181b] truncate">{user?.name}</p>
                     <p className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest">Super Admin</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-[#efefef] rounded text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] hover:text-[#18181b] hover:bg-[#f9f9f9] transition-all"
                >
                  <LogOut size={16} className="shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMobileMenu;
