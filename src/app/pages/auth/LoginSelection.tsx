import { useNavigate } from "react-router";
import { Shield, Users, ArrowLeft } from "lucide-react";

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Welcome Back</h3>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <RoleCard
            icon={<Shield className="w-12 h-12" />}
            title="Admin Login"
            description="Manage alumni, verify registrations, and oversee platform activities"
            onClick={() => navigate("/auth/admin")}
            color="purple"
          />
          <RoleCard
            icon={<Users className="w-12 h-12" />}
            title="Alumni Login"
            description="Connect with peers, share achievements, and explore opportunities"
            onClick={() => navigate("/auth/alumni")}
            color="blue"
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            New to SACRED?{" "}
            <button
              onClick={() => navigate("/auth/register")}
              className="text-[#0A66C2] hover:underline font-medium"
            >
              Register as Alumni
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: "purple" | "blue";
}) {
  const bgColor = color === "purple" ? "bg-purple-50" : "bg-blue-50";
  const textColor = color === "purple" ? "text-purple-600" : "text-[#0A66C2]";
  const borderColor = color === "purple" ? "hover:border-purple-600/20" : "hover:border-[#0A66C2]/20";

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${borderColor} text-left group`}
    >
      <div className={`w-16 h-16 ${bgColor} rounded-xl flex items-center justify-center ${textColor} mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}
