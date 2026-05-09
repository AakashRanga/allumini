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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { clearAuthSession, refreshAuthSessionActivity } from "@/lib/session";
import logoSrc from "../../imports/logo.png";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/verification", label: "Verification Requests", icon: CheckSquare },
  { path: "/admin/posts", label: "Posts & Achievements", icon: FileText },
  { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { path: "/admin/messages", label: "Gurupadigam Messages", icon: MessageCircle },
  { path: "/admin/notifications", label: "Notifications", icon: Bell },
  { path: "/admin/alumni-management", label: "Alumni Management", icon: Users },

];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mocked counts for badges
  const badgeCounts: Record<string, number> = {
    "/admin/notifications": 12,
    "/admin/verification": 5,
    "/admin/jobs": 3,
    "/admin/posts": 8,
  };

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
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 ${sidebarCollapsed ? "w-20" : "w-72"
          } bg-white transition-all duration-300 flex flex-col shadow-2xl border-r border-gray-200`}
      >
        {/* Collapse toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-7 bg-white border border-gray-200 rounded-full p-1 shadow-sm text-gray-400 hover:text-purple-600 z-50 hover:bg-gray-50 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-4 border-b border-gray-200 flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"} h-20`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 shadow-xl shrink-0">
                <ImageWithFallback
                  src={logoSrc}
                  alt="SACRED Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg tracking-wide">SACRED</span>
                <span className="text-gray-500 text-[10px] tracking-wider">ADMIN PANEL</span>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600 p-0.5 shadow-xl shrink-0 cursor-pointer" onClick={() => setSidebarCollapsed(false)}>
              <ImageWithFallback
                src={logoSrc}
                alt="SACRED Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-700 hover:bg-gray-100 rounded-lg p-1 ml-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const count = badgeCounts[item.path];

              return (
                <button
                  key={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center py-2.5 px-3 rounded-xl transition-all duration-300 group relative ${sidebarCollapsed ? "justify-center" : "justify-start gap-3"
                    } ${isActive
                      ? "bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm border border-purple-100/50"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-purple-600" : "text-gray-500"} group-hover:scale-110 transition-transform group-hover:text-purple-600`} />
                    {sidebarCollapsed && count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm ring-2 ring-white">
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
                  </div>

                  {!sidebarCollapsed && (
                    <>
                      <span className={`flex-1 text-sm text-left truncate ${isActive ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                        {item.label}
                      </span>
                      {count > 0 && (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center py-2.5 px-3 hover:bg-red-50 rounded-xl transition-all group ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
          >
            <LogOut className="w-5 h-5 text-red-500 shrink-0 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && (
              <span className="text-red-600 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        <header className="bg-white/90 backdrop-blur-md border-b-2 border-purple-200 shadow-sm px-4 py-2 sticky top-0 z-30">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-500 hover:text-purple-600 p-1.5 hover:bg-purple-50 rounded-lg transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Highlight title for topbar context */}
              <div className="hidden sm:flex items-center gap-2 text-purple-800">
                <span className="text-sm font-semibold tracking-wide">SACRED Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/notifications")} className="relative p-1.5 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-all group">
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-1.5 rounded-full border border-purple-100 shadow-inner">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-[10px] font-bold">AD</span>
                </div>
                <div className="hidden md:flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-800 leading-none mb-0.5">Admin</p>
                  <p className="text-[9px] text-slate-500 leading-none">Role</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-transparent custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
