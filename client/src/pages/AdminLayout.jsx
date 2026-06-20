import { useState, useEffect, Suspense, lazy } from "react";
import { 
  LayoutDashboard,
  ClipboardList,
  Scissors,
  UserCircle,
  Image as ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { appointmentAPI } from "../services/appointmentService";

// Extracted UI Components
import { AdminSidebar } from "../features/admin/components/AdminSidebar";
import { AdminMobileMenu } from "../features/admin/components/AdminMobileMenu";
import { AdminAuthScreens } from "../components/Auth/AdminAuthScreen";

// Lazy Loaded Tab Components
const DashboardHome = lazy(() => import('../features/admin/views/DashboardHome').then(m => ({ default: m.DashboardHome })));
const AppointmentsTab = lazy(() => import('../features/admin/views/AppointmentsTab').then(m => ({ default: m.AppointmentsTab })));
const ServicesTab = lazy(() => import('../features/admin/views/ServicesTab').then(m => ({ default: m.ServicesTab })));
const BarbersTab = lazy(() => import('../features/admin/views/BarbersTab').then(m => ({ default: m.BarbersTab })));
const GalleryTab = lazy(() => import('../features/admin/views/GalleryTab').then(m => ({ default: m.GalleryTab })));

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [filter, setFilter] = useState("all");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  const { user, isAdmin, loading, logout } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

  const fetchPending = async () => {
    try {
      const res = await appointmentAPI.getAppointments({ status: 'Pending', limit: 100 });
      setPendingCount(res.pagination?.total || res.data?.length || 0);
    } catch (err) {
      console.error('Failed to fetch pending count:', err);
    }
  };

  useEffect(() => {
    fetchPending();

    const eventSource = new EventSource(`${API_BASE}/api/events`);

    eventSource.addEventListener('appointment:created', () => {
      fetchPending();
    });

    eventSource.addEventListener('appointment:updated', () => {
      fetchPending();
    });

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    return () => eventSource.close();
  }, []);

  const refreshPendingCount = async () => {
    try {
      const res = await appointmentAPI.getAppointments({ status: 'Pending', limit: 100 });
      setPendingCount(res.pagination?.total || res.data?.length || 0);
    } catch (err) {
      console.error('Failed to fetch pending count:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Appointments', icon: ClipboardList },
    { label: 'Services', icon: Scissors },
    { label: 'Barbers', icon: UserCircle },
    { label: 'Gallery', icon: ImageIcon },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#fbfcfa] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-vintage-tan border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || isAdmin === false) {
    return <AdminAuthScreens />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#fbfcfa] text-[#18181b] font-sans overflow-hidden selection:bg-vintage-tan/20 w-full" id="admin-dashboard-root">
      <AdminMobileMenu 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
        menuItems={menuItems}
        pendingCount={pendingCount}
      />

      <AdminSidebar 
        sidebarExpanded={sidebarExpanded}
        setSidebarExpanded={setSidebarExpanded}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        handleLogout={handleLogout}
        menuItems={menuItems}
        pendingCount={pendingCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
         <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 bg-[#fbfcfa] w-full relative">
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-[#fbfcfa]">
                <div className="w-8 h-8 border-4 border-vintage-tan border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
              {activeTab === "Dashboard" && (
                <DashboardHome onNavigate={setActiveTab} />
              )}
              
              {activeTab === "Appointments" && (
                <AppointmentsTab 
                  filter={filter}
                  setFilter={setFilter}
                  onStatusChange={refreshPendingCount}
                />
              )}

              {activeTab === "Services" && (
                <ServicesTab />
              )}

              {activeTab === "Barbers" && (
                <BarbersTab />
              )}

              {activeTab === "Gallery" && (
                <GalleryTab />
              )}
            </Suspense>
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;
