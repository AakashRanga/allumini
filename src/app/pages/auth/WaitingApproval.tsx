import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Clock, Mail, AlertCircle, CheckCircle, Lock, RefreshCw, UserCheck } from "lucide-react";
import { verifyOtp, resendOtp, getUserStatus } from "@/lib/api";

export default function WaitingApproval() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    // Get email from location state or session storage
    const stateEmail = location.state?.email;
    const storedEmail = sessionStorage.getItem("pending_email");
    if (stateEmail) {
      setEmail(stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location.state]);

  // Fetch user status from database
  useEffect(() => {
    const fetchStatus = async () => {
      if (!email) return;

      const response = await getUserStatus(email);
      setLoading(false);

      if (response.success) {
        setEmailVerified(response.data.email_verified);
        setIsApproved(response.data.is_approved);

        // If already approved, redirect to alumni
        if (response.data.email_verified && response.data.is_approved) {
          navigate("/alumni");
          return;
        }

        // If email already verified, mark success
        if (response.data.email_verified) {
          setSuccess(true);
        }
      }
    };

    fetchStatus();
  }, [email, navigate]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setVerifying(true);
    setError("");

    const response = await verifyOtp(email, otp);

    setVerifying(false);

    if (!response.success) {
      setError(response.error);
      return;
    }

    setSuccess(true);
    setEmailVerified(true);
    setError("");
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setLoading(true);
    setError("");

    const response = await resendOtp(email);

    setLoading(false);

    if (!response.success) {
      setError(response.error);
      return;
    }

    setResendDisabled(true);
    setResendCountdown(60);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // If email is verified but waiting for admin approval
  if (success || emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
            <p className="text-lg text-gray-700 mb-6">Your email has been verified successfully.</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3 text-left">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 font-medium mb-2">Waiting for Admin Approval</p>
                  <ul className="text-sm text-amber-800 space-y-2">
                    <li>• Your account is pending admin approval</li>
                    <li>• This typically takes 1-2 business days</li>
                    <li>• You'll be notified once approved</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email not verified - show verification form
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Mail className="w-10 h-10 text-amber-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Your Email</h1>
          <p className="text-lg text-gray-700 mb-2">We've sent an OTP to your email</p>
          <p className="text-gray-500 mb-6">{email}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-medium mb-2">Step 1: Email Verification</p>
                <p className="text-sm text-blue-800">
                  Enter the 6-digit OTP sent to your email to verify your email address.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] border-2 border-gray-300 rounded-xl focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 outline-none transition-all"
                placeholder="------"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || otp.length !== 6}
              className="w-full py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <RefreshCw className="w-5 h-5" />
            <p>
              Didn't receive OTP?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className="text-[#0A66C2] hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
              >
                {resendDisabled ? `Resend in ${resendCountdown}s` : "Resend OTP"}
              </button>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-medium mb-2">Step 2: Admin Approval</p>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li>• After email verification, admin will review your application</li>
                  <li>• This typically takes 1-2 business days</li>
                  <li>• You'll receive an email notification once approved</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}