import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword } from "@/lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const code = searchParams.get("token");
    if (code) {
      setToken(code);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);
      if (!response.success) {
        throw new Error(response.error);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password";
      if (errorMessage.includes("expired")) {
        setError("Reset link has expired. Please request a new password reset.");
      } else if (errorMessage.includes("invalid")) {
        setError("Invalid reset link. Please request a new password reset.");
      } else {
        setError(errorMessage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Password Reset!</h1>
            <p className="text-gray-600 text-center mb-8">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <button
              onClick={() => navigate("/auth/login")}
              className="w-full py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/auth/login")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#0A66C2]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Reset Password</h1>
          <p className="text-gray-600 text-center mb-8">Enter your new password</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 shadow-sm">
                <span className="font-semibold">Error:</span> {error}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}