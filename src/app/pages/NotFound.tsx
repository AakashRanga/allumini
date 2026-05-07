import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#0A66C2] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-600 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border-2 border-[#0A66C2] text-[#0A66C2] rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
