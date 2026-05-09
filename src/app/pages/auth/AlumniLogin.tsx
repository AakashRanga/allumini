import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, Lock, Mail } from "lucide-react";
import { loginUser } from "@/lib/api";
import { createAuthSession } from "@/lib/session";

export default function AlumniLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await loginUser({ email, password });

    setLoading(false);

    if (!response.success) {
      setFailedAttempts(prev => prev + 1);
      // Redirect to waiting page for both verification and approval cases
      if (response.status === 403) {
        sessionStorage.setItem("pending_email", email);
        navigate("/auth/waiting", { state: { email } });
        return;
      }
      setError(response.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Reset failed attempts on successful login
    setFailedAttempts(0);

    // Create auth session
    createAuthSession({
      userId: response.data.userId,
      role: "alumni",
      approved: response.data.approved,
    });

    // Redirect to waiting page for both verification and approval cases
    const data = response.data;
    if (data.email_verified === false || !data.approved) {
      sessionStorage.setItem("pending_email", email);
      navigate("/auth/waiting", { state: { email } });
      return;
    }

    navigate("/alumni");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-[#0A66C2]" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">SACRED Alumni Login</h3>
          <p className="text-gray-600 text-center mb-8">Welcome back to your community</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 shadow-sm">
                <span className="font-semibold">Login failed:</span> {error}
              </div>
            ) : null}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            {failedAttempts >= 2 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-amber-800 text-sm">
                  Having trouble signing in?{" "}
                  <button
                    onClick={() => navigate("/auth/forgot-password")}
                    className="text-[#0A66C2] hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </p>
              </div>
            )}
            <p className="text-gray-600">
              Not registered yet?{" "}
              <button
                onClick={() => navigate("/auth/register")}
                className="text-[#0A66C2] hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
