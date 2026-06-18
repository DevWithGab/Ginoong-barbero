import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isBarber } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not authenticated or not admin/barber
  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || (!isAdmin && !isBarber)) {
    return null;
  }

  const NavLink = ({ to, emoji, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition-colors ${
        location.pathname === to ? 'text-vintage-tan bg-gray-800' : 'text-gray-300 hover:text-vintage-tan'
      }`}
    >
      <span className="text-xl">{emoji}</span>
      {sidebarOpen && <span>{children}</span>}
    </Link>
  );

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-gray-900 to-black border-r border-vintage-tan/20 transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="p-4 border-b border-vintage-tan/20 flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-vintage-tan">Admin</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-vintage-tan hover:bg-gray-800 p-2 rounded transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" emoji="📊">Dashboard</NavLink>
              <NavLink to="/admin/appointments" emoji="📅">Appointments</NavLink>
              <NavLink to="/admin/services" emoji="✂️">Services</NavLink>
              <NavLink to="/admin/barbers" emoji="💇">Barbers</NavLink>
            </>
          )}
          
          {isBarber && (
            <>
              <NavLink to="/barber/schedule" emoji="📅">My Schedule</NavLink>
              <NavLink to="/barber/appointments" emoji="✂️">Appointments</NavLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-vintage-tan/20">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-vintage-tan/20 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {isAdmin ? 'Admin Dashboard' : 'Barber Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="font-semibold text-white">{user?.name || user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-vintage-tan text-black flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}