import { useState, useEffect } from "react";
import { Users, UserCheck, Briefcase, TrendingUp, ArrowUp, Activity, Award, Sparkles } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiCall } from "@/lib/api";

interface DashboardStats {
  totalAlumni: number;
  totalAlumniChange: string;
  pendingRequests: number;
  pendingRequestsChange: string;
  jobsPosted: number;
  jobsPostedChange: string;
  activeUsers: number;
  activeUsersChange: string;
}

interface GrowthDataPoint {
  month: string;
  alumni: number;
}

interface BatchDataPoint {
  batch: string;
  count: number;
}

interface RecentActivityItem {
  title: string;
  message: string;
  type: string;
  time: string;
}

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 10000) return "Just now";
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch (e) {
    return "Recently";
  }
}

function getActivityStyle(type: string) {
  switch (type?.toLowerCase()) {
    case "registration":
    case "request":
    case "new":
      return { color: "bg-blue-500" };
    case "approval":
    case "verified":
      return { color: "bg-emerald-500" };
    case "job":
      return { color: "bg-purple-500" };
    case "achievement":
      return { color: "bg-amber-500" };
    case "gurupadigam":
      return { color: "bg-green-500" };
    case "newsletter":
      return { color: "bg-pink-500" };
    default:
      return { color: "bg-slate-500" };
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
  const [batchData, setBatchData] = useState<BatchDataPoint[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await apiCall("/verification/dashboard-stats");
        if (response.success) {
          const { stats, growthData, batchData, recentActivity } = response.data;
          setStats(stats);
          setGrowthData(growthData);
          setBatchData(batchData);
          setRecentActivity(recentActivity);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statsCards = stats
    ? [
        {
          label: "Total Alumni",
          value: stats.totalAlumni.toLocaleString(),
          icon: Users,
          gradient: "from-blue-500 to-cyan-500",
          change: stats.totalAlumniChange,
          trend: "up",
        },
        {
          label: "Pending Requests",
          value: stats.pendingRequests.toLocaleString(),
          icon: UserCheck,
          gradient: "from-amber-500 to-orange-500",
          change: stats.pendingRequestsChange,
          trend: "up",
        },
        {
          label: "Jobs Posted",
          value: stats.jobsPosted.toLocaleString(),
          icon: Briefcase,
          gradient: "from-green-500 to-emerald-500",
          change: stats.jobsPostedChange,
          trend: "up",
        },
        {
          label: "Active Users",
          value: stats.activeUsers.toLocaleString(),
          icon: TrendingUp,
          gradient: "from-purple-500 to-pink-500",
          change: stats.activeUsersChange,
          trend: "up",
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            Dashboard
            <Sparkles className="w-8 h-8 text-purple-500" />
          </h3>
          <p className="text-slate-600 text-lg">Overview of alumni network and platform activity</p>
        </div>
        <div className="glass px-6 py-3 rounded-full border border-white/20">
          <p className="text-sm text-slate-600">
            Last updated: <span className="font-semibold text-slate-900">Just now</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl p-6 border border-white/20 relative overflow-hidden animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-slate-200/50 rounded-2xl"></div>
                  <div className="w-12 h-6 bg-slate-200/50 rounded-full"></div>
                </div>
                <div className="h-8 bg-slate-200/50 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200/50 rounded w-1/2"></div>
              </div>
            ))
          : statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group glass rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 card-hover relative overflow-hidden animate-scaleIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient background effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</p>
                    <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Alumni Growth</h3>
              <p className="text-sm text-slate-600">Monthly progression</p>
            </div>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-slate-100/10 rounded-xl animate-pulse border border-white/10">
              <span className="text-slate-400 font-medium text-sm">Loading growth records...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <defs>
                  <linearGradient id="colorAlumni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="grid-line" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} key="xaxis-line" />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} key="yaxis-line" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  key="tooltip-line"
                />
                <Line
                  type="monotone"
                  dataKey="alumni"
                  stroke="#0A66C2"
                  strokeWidth={3}
                  dot={{ fill: '#0A66C2', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                  key="line-alumni"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Batch Distribution</h3>
              <p className="text-sm text-slate-600">Alumni by year</p>
            </div>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center bg-slate-100/10 rounded-xl animate-pulse border border-white/10">
              <span className="text-slate-400 font-medium text-sm">Loading batch distribution...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="grid-bar" />
                <XAxis dataKey="batch" stroke="#64748b" style={{ fontSize: '12px' }} key="xaxis-bar" />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} key="yaxis-bar" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  key="tooltip-bar"
                />
                <Bar
                  dataKey="count"
                  fill="url(#colorBar)"
                  radius={[12, 12, 0, 0]}
                  key="bar-count"
                />
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6 border border-white/20 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <p className="text-sm text-slate-600">Latest platform updates</p>
          </div>
        </div>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl animate-pulse">
                <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-12"></div>
              </div>
            ))
          ) : (
            recentActivity.map((activity, index) => {
              const style = getActivityStyle(activity.type);
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 rounded-xl transition-all duration-300 group border border-white/20"
                >
                  <div className={`w-3 h-3 ${style.color} rounded-full group-hover:scale-125 transition-transform`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-slate-600">{activity.message}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{formatRelativeTime(activity.time)}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
