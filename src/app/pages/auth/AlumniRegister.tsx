import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Building2,
} from "lucide-react";
import { registerAlumni } from "@/lib/api";

const DEGREE_OPTIONS = [
  "BDS",
  "MDS",
  "MS",
  "FDS",
  "DT",
  "MSC",
  "PHD",
];

const DEGREE_BRANCHES: Record<string, string[]> = {
  MDS: [
    "Orthodontics & Dentofacial Orthopaedics",
    "Oral & Maxillofacial Surgery",
    "Periodontics",
    "Endodontics",
    "Prosthodontics",
    "Oral Medicine & Radiology",
    "Pedodontics & Preventive Dentistry",
    "Conservative Dentistry & Endodontics",
    "Oral Pathology & Microbiology",
    "Public Health Dentistry",
  ],
  MS: [
    "General Surgery",
    "Orthopaedics",
    "ENT",
    "Ophthalmology",
    "Obstetrics & Gynaecology",
    "Paediatric Surgery",
    "Neurosurgery",
    "Plastic & Reconstructive Surgery",
    "Cardiothoracic Surgery",
    "Urology",
  ],
  FDS: [
    "Oral & Maxillofacial Surgery",
    "Orthodontics",
    "Periodontics",
    "Endodontics",
    "Prosthodontics",
    "Pedodontics",
  ],
  DT: [
    "Dental Prosthetics",
    "Orthodontic Technology",
    "Dental Ceramics",
    "Maxillofacial Technology",
    "Crown & Bridge Technology",
  ],
  MSC: [
    "Biochemistry",
    "Microbiology",
    "Anatomy",
    "Physiology",
    "Pharmacology",
    "Pathology",
    "Biotechnology",
    "Chemistry",
    "Zoology",
    "Botany",
  ],
  PHD: [
    "Dental Sciences",
    "Biochemistry",
    "Microbiology",
    "Pharmacology",
    "Physiology",
    "Anatomy",
    "Pathology",
    "Public Health",
    "Clinical Research",
    "Biotechnology",
  ],
};

export default function AlumniRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    password: "",
  });
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [joiningYears, setJoiningYears] = useState<Record<string, string>>({});
  const [collegeNames, setCollegeNames] = useState<Record<string, string>>({});
  const [selectedBranches, setSelectedBranches] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDegrees.length === 0) {
      setError("Please select at least one degree");
      return;
    }
    
    setError("");
    setLoading(true);

    const academic_details = selectedDegrees.map(deg => ({
      degree: deg,
      joining_year: joiningYears[deg] || "",
      college_name: collegeNames[deg] || "",
      branch: selectedBranches[deg] || ""
    }));

    try {
      const response = await registerAlumni({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        password: formData.password,
        academic_details
      });

      if (!response.success) {
        setError(response.error);
        setLoading(false);
        return;
      }
      
      // Navigate to waiting screen asking them to verify email
      navigate("/auth/waiting", { state: { email: formData.email } });
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleDegree = (degree: string) => {
    if (selectedDegrees.includes(degree)) {
      setSelectedDegrees(selectedDegrees.filter((d) => d !== degree));
      const updatedYears = { ...joiningYears };
      delete updatedYears[degree];
      setJoiningYears(updatedYears);
      const updatedColleges = { ...collegeNames };
      delete updatedColleges[degree];
      setCollegeNames(updatedColleges);
      const updatedBranches = { ...selectedBranches };
      delete updatedBranches[degree];
      setSelectedBranches(updatedBranches);
    } else {
      setSelectedDegrees([...selectedDegrees, degree]);
    }
  };

  const handleJoiningYear = (degree: string, year: string) => {
    setJoiningYears({ ...joiningYears, [degree]: year });
  };

  const handleCollegeName = (degree: string, college: string) => {
    setCollegeNames({ ...collegeNames, [degree]: college });
  };

  const handleBranch = (degree: string, branch: string) => {
    setSelectedBranches({ ...selectedBranches, [degree]: branch });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1985 + 1 },
    (_, i) => currentYear - i,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-[#0A66C2]" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Join SACRED
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Create your alumni account
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                  placeholder="e.g., Orthodontics, Periodontics"
                  required
                />
              </div>
            </div>

            {/* Degree multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
                <span className="text-gray-400 font-normal ml-1">
                  (select all that apply)
                </span>
              </label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-xl bg-gray-50 min-h-[52px]">
                {DEGREE_OPTIONS.map((degree) => (
                  <button
                    key={degree}
                    type="button"
                    onClick={() => toggleDegree(degree)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border-2 ${
                      selectedDegrees.includes(degree)
                        ? "bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    }`}
                  >
                    {degree}
                  </button>
                ))}
              </div>
              {selectedDegrees.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  Please select at least one degree
                </p>
              )}
            </div>

            {/* Per-degree joining year + college + branch */}
            {selectedDegrees.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-4">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0A66C2]" />
                  Year of Joining, College & Branch — per degree
                </p>
                {selectedDegrees.map((degree) => (
                  <div key={degree} className="bg-white border border-blue-100 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-bold text-[#0A66C2] uppercase tracking-wider">{degree}</p>
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Joining Year</label>
                        <select
                          value={joiningYears[degree] || ""}
                          onChange={(e) => handleJoiningYear(degree, e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all appearance-none bg-white text-sm"
                          required
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">College Name</label>
                        <input
                          type="text"
                          value={collegeNames[degree] || ""}
                          onChange={(e) => handleCollegeName(degree, e.target.value)}
                          placeholder="Enter college name"
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all bg-white text-sm"
                          required
                        />
                      </div>
                      {degree !== "BDS" && DEGREE_BRANCHES[degree] && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Branch</label>
                          <select
                            value={selectedBranches[degree] || ""}
                            onChange={(e) => handleBranch(degree, e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all appearance-none bg-white text-sm"
                            required
                          >
                            <option value="">Select branch</option>
                            {DEGREE_BRANCHES[degree].map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-all"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={selectedDegrees.length === 0 || loading}
              className="w-full py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex justify-center items-center gap-2"
            >
              {loading ? "Registering..." : "Submit Registration"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/alumni")}
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
