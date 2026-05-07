import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (!response.success) {
        throw new Error(response.error);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      // Show generic message for security
      if (errorMessage.includes("user-not-found")) {
        setError("If an account exists with this email, you will receive password reset instructions");
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
          <button
            onClick={() => navigate("/auth/login")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Check Your Email</h1>
            <p className="text-gray-600 text-center mb-8">
              We've sent password reset instructions to <span className="font-semibold">{email}</span>
            </p>

            <div className="rounded-3xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
              <p>Click the link in the email to reset your password. The link will redirect you to set a new password.</p>
            </div>

            <button
              onClick={() => navigate("/auth/login")}
              className="w-full mt-6 py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              Back to Login
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
            <KeyRound className="w-8 h-8 text-[#0A66C2]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Forgot Password</h1>
          <p className="text-gray-600 text-center mb-8">Enter your email to reset your password</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 shadow-sm">
                <span className="font-semibold">Error:</span> {error}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/auth/login")}
                className="text-[#0A66C2] hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}