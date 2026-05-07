import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy, Upload, ArrowLeft, Briefcase, MapPin, DollarSign } from "lucide-react";

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<"job" | "achievement">("job");
  const [jobFormData, setJobFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    applyLink: "",
  });
  const [achievementFormData, setAchievementFormData] = useState({
    title: "",
    description: "",
  });

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/alumni");
  };

  const handleAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/alumni");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/alumni")}
        className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Feed
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {postType === "job" ? "Share Job Opportunity" : "Post Achievement"}
        </h1>
        <p className="text-gray-600">
          {postType === "job"
            ? "Help fellow alumni by sharing job openings"
            : "Celebrate your milestones with the community"}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPostType("job")}
            className={`px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
              postType === "job"
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Job Opportunity
          </button>
          <button
            onClick={() => setPostType("achievement")}
            className={`px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
              postType === "achievement"
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Trophy className="w-5 h-5" />
            Achievement
          </button>
        </div>
      </div>

      {postType === "job" ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <form onSubmit={handleJobSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobFormData.company}
                  onChange={(e) => setJobFormData({ ...jobFormData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  placeholder="e.g., Google, Microsoft, Startup Inc"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobFormData.role}
                  onChange={(e) => setJobFormData({ ...jobFormData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                    placeholder="San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={jobFormData.jobType}
                  onChange={(e) => setJobFormData({ ...jobFormData, jobType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary (LPA) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jobFormData.salary}
                    onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                    placeholder="10-15 LPA"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={jobFormData.description}
                onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements & Qualifications
              </label>
              <textarea
                value={jobFormData.requirements}
                onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent resize-none"
                rows={3}
                placeholder="List key requirements, skills, experience needed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={jobFormData.applyLink}
                onChange={(e) => setJobFormData({ ...jobFormData, applyLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                placeholder="https://company.com/careers/apply"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your job posting will be reviewed by admins before appearing on the platform.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Submit Job Posting
              </button>
              <button
                type="button"
                onClick={() => navigate("/alumni")}
                className="px-8 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <form onSubmit={handleAchievementSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={achievementFormData.title}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                placeholder="e.g., Published Research Paper in Nature AI"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={achievementFormData.description}
                onChange={(e) => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent resize-none"
                rows={8}
                placeholder="Share details about your achievement, what it means to you, and your journey..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0A66C2] transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your achievement will be reviewed by admins before appearing on the platform.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Submit Achievement
              </button>
              <button
                type="button"
                onClick={() => navigate("/alumni")}
                className="px-8 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
