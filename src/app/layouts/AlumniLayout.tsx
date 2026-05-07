import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import {
  Home,
  PlusSquare,
  Trophy,
  Briefcase,
  MessageCircle,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { clearAuthSession, refreshAuthSessionActivity } from "@/lib/session";
import logoSrc from "../../imports/logo.png";

const navItems = [
  { path: "/alumni", label: "Home", icon: Home },
  { path: "/alumni/post", label: "Share", icon: PlusSquare },
  { path: "/alumni/jobs", label: "Jobs", icon: Briefcase },
  { path: "/alumni/messages", label: "Messages", icon: MessageCircle },
  { path: "/alumni/profile", label: "Profile", icon: User },
];

export default function AlumniLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const session = refreshAuthSessionActivity();
    if (!session || session.role !== "alumni") {
      clearAuthSession();
      navigate("/auth/login");
      return;
    }

    if (!session.approved) {
      clearAuthSession();
      navigate("/auth/waiting");
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md border-2 border-blue-100">
                <ImageWithFallback
                  src={logoSrc}
                  alt="SACRED Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", color: '#1e3a8a' }}>
                SACRED
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-50 text-[#0A66C2] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/alumni/notifications")}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button
                onClick={() => navigate("/alumni/profile")}
                className="hidden md:flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-[#0A66C2] font-medium">JD</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <nav className="md:hidden bg-white border-t border-gray-200 sticky bottom-0 z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive ? "text-[#0A66C2]" : "text-gray-600"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
