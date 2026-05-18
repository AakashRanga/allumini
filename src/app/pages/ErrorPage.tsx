import { useRouteError, useNavigate } from "react-router";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  console.error(error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error?.statusText || error?.message || "An unexpected error occurred. Our team has been notified."}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#0A66C2] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#004182] transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            If the problem persists, please contact support with the error details.
          </p>
        </div>
      </div>
    </div>
  );
}
