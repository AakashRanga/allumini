import { Users, UserCheck, Briefcase, TrendingUp, ArrowUp, Activity, Award, Sparkles } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statsData = [
  { label: "Total Alumni", value: "1,248", icon: Users, gradient: "from-blue-500 to-cyan-500", change: "+12%", trend: "up" },
  { label: "Pending Requests", value: "23", icon: UserCheck, gradient: "from-amber-500 to-orange-500", change: "+5", trend: "up" },
  { label: "Jobs Posted", value: "87", icon: Briefcase, gradient: "from-green-500 to-emerald-500", change: "+8", trend: "up" },
  { label: "Active Users", value: "892", icon: TrendingUp, gradient: "from-purple-500 to-pink-500", change: "+18%", trend: "up" },
];

const growthData = [
  { month: "Jan", alumni: 980 },
  { month: "Feb", alumni: 1050 },
  { month: "Mar", alumni: 1120 },
  { month: "Apr", alumni: 1180 },
  { month: "May", alumni: 1248 },
];

const batchData = [
  { batch: "2020", count: 245 },
  { batch: "2021", count: 298 },
  { batch: "2022", count: 312 },
  { batch: "2023", count: 215 },
  { batch: "2024", count: 178 },
];

const recentActivity = [
  { action: "New registration", user: "Sarah Johnson", time: "2 minutes ago", type: "new", color: "bg-blue-500" },
  { action: "Post approved", user: "Michael Chen", time: "15 minutes ago", type: "approved", color: "bg-green-500" },
  { action: "Job posted", user: "Admin", time: "1 hour ago", type: "job", color: "bg-purple-500" },
  { action: "Alumni verified", user: "Emily Davis", time: "2 hours ago", type: "verified", color: "bg-emerald-500" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            Dashboard
            <Sparkles className="w-8 h-8 text-purple-500" />
          </h1>
          <p className="text-slate-600 text-lg">Overview of alumni network and platform activity</p>
        </div>
        <div className="glass px-6 py-3 rounded-full border border-white/20">
          <p className="text-sm text-slate-600">Last updated: <span className="font-semibold text-slate-900">Just now</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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
                <p className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</p>
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
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 rounded-xl transition-all duration-300 group border border-white/20"
            >
              <div className={`w-3 h-3 ${activity.color} rounded-full group-hover:scale-125 transition-transform`}></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {activity.user}
                </p>
                <p className="text-sm text-slate-600">{activity.action}</p>
              </div>
              <p className="text-xs text-slate-500 font-medium">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
