import { useNavigate } from "react-router";
import { CheckCircle, Sparkles } from "lucide-react";

export default function ApprovalSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <Sparkles className="w-5 h-5 text-green-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Welcome to SACRED! 🎉</h3>
          <p className="text-lg text-gray-700 mb-6">Your account has been approved</p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-900 font-medium mb-3">You now have access to:</p>
            <ul className="text-sm text-green-800 space-y-2 text-left max-w-sm mx-auto">
              <li>✓ Connect with alumni across batches</li>
              <li>✓ Share posts and celebrate achievements</li>
              <li>✓ Explore career opportunities</li>
              <li>✓ Receive Gurupadigam messages</li>
            </ul>
          </div>

          <button
            onClick={() => navigate("/auth/login")}
            className="px-8 py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Sign In to Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
