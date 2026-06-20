import { motion } from "framer-motion";
import { LogOut, ChevronLeft, ChevronRight, Shield } from "lucide-react";

export const AdminSidebar = ({
  sidebarExpanded,
  setSidebarExpanded,
  activeTab,
  setActiveTab,
  user,
  handleLogout,
  menuItems
}) => {
  return (
    <aside className={`hidden lg:flex ${sidebarExpanded ? 'w-72' : 'w-20'} bg-[#ffffff] border-r border-[#efefef] flex-col shrink-0 transition-all duration-500 ease-in-out relative group/sidebar shadow-sm`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        className="absolute -right-3 top-24 w-6 h-6 bg-[#ffffff] border border-[#efefef] rounded-full flex items-center justify-center text-[#999] hover:text-vintage-tan hover:border-vintage-tan transition-all z-50 group shadow-lg"
      >
        {sidebarExpanded ? <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> : <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
      </button>

      <div className={`${sidebarExpanded ? 'p-10' : 'p-5'} mb-8 flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} transition-all duration-500`}>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-vintage-tan rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-vintage-tan/20">
                <Shield size={22} className="text-[#ffffff]" />
            </div>
            {sidebarExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-0.5 whitespace-nowrap"
              >
                  <h1 className="text-xl font-serif font-black uppercase tracking-widest leading-none text-[#0a0a0a]">GINOONG</h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-vintage-tan leading-none">BARBERO</p>
              </motion.div>
            )}
         </div>
      </div>

      <div className={`${sidebarExpanded ? 'px-6' : 'px-3'} space-y-10 flex-1 overflow-y-auto custom-scrollbar-light overflow-x-hidden transition-all duration-500`}>
         <div className="space-y-4">
            {sidebarExpanded && (
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#cccccc]">Main Menu</p>
            )}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button 
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center ${sidebarExpanded ? 'gap-4 px-4' : 'justify-center'} py-3.5 rounded transition-all group relative ${activeTab === item.label ? 'bg-[#fbfcfa] text-vintage-tan font-bold border-l-2 border-vintage-tan shadow-sm' : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#f9f9f9]'}`}
                  title={!sidebarExpanded ? item.label : ""}
                >
                  <item.icon size={18} className={`${activeTab === item.label ? "text-vintage-tan" : "text-[#d4d4d8] group-hover:text-[#a1a1aa] transition-colors"} shrink-0`} />
                  {sidebarExpanded && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[13px] font-bold tracking-tight whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              ))}
            </nav>
         </div>
      </div>

      <div className={`${sidebarExpanded ? 'p-8' : 'p-4'} space-y-6 border-t border-[#efefef] transition-all duration-500`}>
         <div className={`flex items-center ${sidebarExpanded ? 'gap-4' : 'justify-center'} group cursor-pointer`}>
            <div className="w-10 h-10 rounded-full border border-[#efefef] overflow-hidden bg-[#f4f4f5] group-hover:border-vintage-tan/30 transition-all shrink-0">
               <img 
                 src={user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                 alt="" 
                 className="w-full h-full object-cover"
               />
            </div>
            {sidebarExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                  <p className="text-[13px] font-bold text-[#18181b] truncate">{user?.name}</p>
                  <p className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest">Super Admin</p>
              </motion.div>
            )}
         </div>
         
         <button 
           onClick={handleLogout}
           className={`w-full flex items-center justify-center ${sidebarExpanded ? 'gap-3 py-3.5 border border-[#efefef]' : 'py-2'} rounded text-[10px] font-black uppercase tracking-[0.2em] text-[#71717a] hover:text-[#18181b] hover:bg-[#f9f9f9] transition-all overflow-hidden ${!sidebarExpanded ? 'border-none' : ''}`}
           title={!sidebarExpanded ? "Sign Out" : ""}
         >
             <LogOut size={16} className="shrink-0" />
             {sidebarExpanded && <span>Sign Out</span>}
         </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
