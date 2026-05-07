import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Users, Lock, Mail } from "lucide-react";
import { loginUser, loginWithFirebase } from "@/lib/api";
import { createAuthSession, setFirebaseUser } from "@/lib/session";
import {
  loginWithGoogle,
  loginWithEmailPassword as firebaseLoginWithEmail,
} from "@/lib/firebase-auth";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try Firebase authentication first
      const firebaseResult = await firebaseLoginWithEmail(email, password);

      // Send Firebase token to backend for verification
      const response = await loginWithFirebase({ idToken: firebaseResult.idToken });
      setLoading(false);

      if (!response.success) {
        setFailedAttempts(prev => prev + 1);
        // Redirect to waiting page for both verification and approval cases
        if (response.status === 403) {
          const userEmail = firebaseResult.user?.email || email;
          sessionStorage.setItem("pending_email", userEmail);
          navigate("/auth/waiting", { state: { email: userEmail } });
          return;
        }
        setError(response.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Reset failed attempts on successful login
      setFailedAttempts(0);

      // Store Firebase user in localStorage
      setFirebaseUser(firebaseResult.user);

      createAuthSession({
        userId: response.data.userId,
        role: response.data.role as "admin" | "alumni",
        approved: response.data.approved,
      });

      if (response.data.role === "admin") {
        navigate("/admin");
        return;
      }

      // Redirect to waiting page for both verification and approval cases
      if (!response.data.email_verified || !response.data.approved) {
        const userEmail = firebaseResult.user?.email || email;
        sessionStorage.setItem("pending_email", userEmail);
        navigate("/auth/waiting", { state: { email: userEmail } });
        return;
      }

      navigate("/alumni");
    } catch (err) {
      setLoading(false);
      // Fallback to API login if Firebase fails
      const response = await loginUser({ email, password });

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

      createAuthSession({
        userId: response.data.userId,
        role: response.data.role as "admin" | "alumni",
        approved: response.data.approved,
      });

      if (response.data.role === "admin") {
        navigate("/admin");
        return;
      }

      // Redirect to waiting page for both verification and approval cases
      if (!response.data.email_verified || !response.data.approved) {
        sessionStorage.setItem("pending_email", email);
        navigate("/auth/waiting", { state: { email } });
        return;
      }

      navigate("/alumni");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoadingGoogle(true);

    try {
      const firebaseResult = await loginWithGoogle();

      const response = await loginWithFirebase({ idToken: firebaseResult.idToken });
      setLoadingGoogle(false);

      if (!response.success) {
        // Redirect to waiting page for both verification and approval cases
        if (response.status === 403) {
          const userEmail = firebaseResult.user?.email || email;
          sessionStorage.setItem("pending_email", userEmail);
          navigate("/auth/waiting", { state: { email: userEmail } });
          return;
        }
        setError(response.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setFirebaseUser(firebaseResult.user);

      createAuthSession({
        userId: response.data.userId,
        role: response.data.role as "admin" | "alumni",
        approved: response.data.approved,
      });

      if (response.data.role === "admin") {
        navigate("/admin");
        return;
      }

      // Redirect to waiting page for both verification and approval cases
      if (!response.data.email_verified || !response.data.approved) {
        const userEmail = firebaseResult.user?.email || email;
        sessionStorage.setItem("pending_email", userEmail);
        navigate("/auth/waiting", { state: { email: userEmail } });
        return;
      }

      navigate("/alumni");
    } catch (err) {
      setLoadingGoogle(false);
      setError("Google sign-in failed. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Sign in to SACRED</h1>
          <p className="text-gray-600 text-center mb-8">Access your dashboard using your email and password.</p>

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full py-3.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loadingGoogle ? "Signing in with Google..." : "Continue with Google"}
          </button>

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
              <>Not registered yet? <button onClick={() => navigate("/auth/register")} className="text-[#0A66C2] hover:underline font-medium">Create an account</button></>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
