import { useNavigate } from "react-router";
import { Users, Briefcase, MessageSquare, GraduationCap, Sparkles, TrendingUp, Award } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import logoSrc from "../../imports/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <nav className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 animate-slideUp">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 p-0.5 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <ImageWithFallback
                  src={logoSrc}
                  alt="SACRED Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-wide gradient-text">
                SACRED
              </span>
              <span className="text-xs text-slate-600 tracking-wider font-medium">
                SDC ALUMNI CONNECT
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/auth/login")}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="text-center py-20 md:py-32 animate-slideUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Welcome to the Future of Alumni Networking</span>
          </div>

          <h3 className="text-xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Connect. Collaborate.
            <br />
            <span className="gradient-text">Grow Together.</span>
          </h3>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join our vibrant alumni community to network with fellow graduates, discover opportunities,
            and celebrate achievements together.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/auth/register")}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg font-semibold group"
            >
              Join as Alumni
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="px-10 py-4 bg-white text-slate-900 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-semibold border-2 border-slate-200"
            >
              Sign In
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">1,248+</div>
              <div className="text-slate-600 text-sm">Alumni Connected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">87</div>
              <div className="text-slate-600 text-sm">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">450+</div>
              <div className="text-slate-600 text-sm">Achievements Shared</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Network & Connect"
            description="Build meaningful connections with alumni across batches and specializations"
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Career Opportunities"
            description="Discover job openings and career guidance from experienced professionals"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Share & Engage"
            description="Post updates, celebrate achievements, and stay connected with your community"
            gradient="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<Award className="w-8 h-8" />}
            title="Gurupadigam Messages"
            description="Receive wisdom and guidance from the institution and senior alumni"
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      </main>

      <footer className="glass border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600">
          <p className="font-medium">&copy; 2026 SACRED - SDC Alumni Connect. Reunite • Engage • Discover.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="group glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 card-hover animate-slideUp">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
