import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  Briefcase,
  MessageCircle,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { clearAuthSession, refreshAuthSessionActivity } from "@/lib/session";
import logoSrc from "../../imports/logo.png";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/alumni-management", label: "Alumni Management", icon: Users },
  { path: "/admin/verification", label: "Verification Requests", icon: CheckSquare },
  { path: "/admin/posts", label: "Posts & Achievements", icon: FileText },
  { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { path: "/admin/messages", label: "Gurupadigam Messages", icon: MessageCircle },
  { path: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = refreshAuthSessionActivity();
    if (!session || session.role !== "admin") {
      clearAuthSession();
      navigate("/auth/login");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 flex flex-col shadow-2xl border-r border-gray-200`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 shadow-xl">
                <ImageWithFallback
                  src={logoSrc}
                  alt="SACRED Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg tracking-wide">SACRED</span>
                <span className="text-gray-500 text-xs tracking-wider">ADMIN PANEL</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-700 hover:bg-gray-100 rounded-lg p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 shadow-md font-semibold"
                    : ""
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-600"} group-hover:scale-110 transition-transform`} />
                  <span className={isActive ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-left" : "text-gray-700 text-left"}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="glass border-b border-white/20 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-700 hover:text-purple-600 p-2 hover:bg-white/50 rounded-lg transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <button onClick={() => navigate("/admin/notifications")} className="relative p-2 text-slate-700 hover:bg-white/80 rounded-xl transition-all group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">AD</span>
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-slate-900">Admin User</p>
                  <p className="text-sm text-slate-600">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
