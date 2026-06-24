import { useState } from "react";
import { useNavigate } from "react-router";
import { Trophy, Upload, ArrowLeft, Briefcase, MapPin, IndianRupee } from "lucide-react";
import { getAuthSession } from "@/lib/session";
import { validateJobPost, JobValidationError } from "@/utils/validation";
import { API_BASE_URL } from "@/lib/api";

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const getUserId = () => {
    const session = getAuthSession();
    return session ? parseInt(session.userId) : 1;
  };

  const [jobErrors, setJobErrors] = useState<JobValidationError>({});

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    
    // Frontend validation
    const validation = validateJobPost(jobFormData);
    if (!validation.isValid) {
      setJobErrors(validation.errors);
      return;
    }
    setJobErrors({});

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...jobFormData, user_id: getUserId() }),
      });
      if (response.ok) {
        navigate("/alumni/jobs");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to post job");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImages([file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews([reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/achievement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...achievementFormData,
          user_id: getUserId(),
          imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : ""
        }),
      });
      if (response.ok) {
        navigate("/alumni/achievements");
      } else {
        alert("Failed to post achievement");
      }
    } catch (error) {
      console.error(error);
      alert("Error posting achievement");
    } finally {
      setSubmitting(false);
    }
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {postType === "job" ? "Share Job Opportunity" : "Post Achievement"}
        </h3>
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
                  Company / Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobFormData.company}
                  onChange={(e) => setJobFormData({ ...jobFormData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  placeholder="Enter company or hospital name"
                  required
                />
                {jobErrors.company && <p className="text-xs text-red-500 mt-1">{jobErrors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title / Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobFormData.role}
                  onChange={(e) => setJobFormData({ ...jobFormData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                  placeholder="Enter job title or specialization"
                  required
                />
                {jobErrors.role && <p className="text-xs text-red-500 mt-1">{jobErrors.role}</p>}
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
                    placeholder="Enter location"
                    required
                  />
                </div>
                {jobErrors.location && <p className="text-xs text-red-500 mt-1">{jobErrors.location}</p>}
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
                  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jobFormData.salary}
                    onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                    placeholder="Enter salary (e.g., 10 or 12.5)"
                    required
                  />
                </div>
                {jobErrors.salary && <p className="text-xs text-red-500 mt-1">{jobErrors.salary}</p>}
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
                placeholder="Enter job description"
                required
              />
              {jobErrors.description && <p className="text-xs text-red-500 mt-1">{jobErrors.description}</p>}
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
                placeholder="Enter requirements & qualifications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Link
              </label>
              <input
                type="url"
                value={jobFormData.applyLink}
                onChange={(e) => setJobFormData({ ...jobFormData, applyLink: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent"
                placeholder="Enter application link (optional)"
              />
              {jobErrors.applyLink && <p className="text-xs text-red-500 mt-1">{jobErrors.applyLink}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your job posting will be immediately visible to other alumni, but is subject to admin moderation.
              </p>
            </div>

            <div className="flex gap-3">
              {submitting ? (
                <div className="flex justify-center items-center py-3.5 flex-1 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-[#0A66C2]"></div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="achievement-image-upload"
              />
              {imagePreviews.length === 0 ? (
                <label
                  htmlFor="achievement-image-upload"
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0A66C2] transition-colors cursor-pointer block"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative group max-w-sm">
                    <img
                      src={imagePreviews[0]}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Your achievement will be immediately visible to other alumni, but is subject to admin moderation.
              </p>
            </div>

            <div className="flex gap-3">
              {submitting ? (
                <div className="flex justify-center items-center py-3.5 flex-1 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-[#0A66C2]"></div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
