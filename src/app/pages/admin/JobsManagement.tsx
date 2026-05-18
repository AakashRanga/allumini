import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Briefcase, MapPin, DollarSign, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { getAuthSession } from "@/lib/session";

interface Job {
  id: number;
  company: string;
  role: string;
  location: string;
  job_type: string;
  salary: string;
  description: string;
  requirements: string;
  apply_link: string;
  created_at: string;
  is_blocked: number;
  poster_name: string;
}

export default function JobsManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    applyLink: "",
  });

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5555/posts/admin/jobs");
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = getAuthSession();
      const userId = session?.userId || "1";
      const response = await fetch("http://localhost:5555/posts/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          jobType: formData.type,
          user_id: userId,
        }),
      });
      if (response.ok) {
        fetchJobs();
        setFormData({
          company: "",
          role: "",
          location: "",
          type: "Full-time",
          salary: "",
          description: "",
          requirements: "",
          applyLink: "",
        });
        setShowForm(false);
      } else {
        alert("Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const response = await fetch(`http://localhost:5555/posts/admin/job/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== id));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleToggleBlock = async (id: number, currentStatus: number) => {
    try {
      const response = await fetch(`http://localhost:5555/posts/admin/job/${id}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_blocked: !currentStatus }),
      });
      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Job Management</h3>
          <p className="text-gray-600">Post and manage career opportunities for alumni</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Post New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="$100k - $150k"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements & Qualifications</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="List skills, experience, or certifications..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Link</label>
              <input
                type="url"
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium"
              >
                Post Job
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.role}</h3>
                  <p className="text-purple-600 font-medium mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      {job.job_type}
                    </span>
                    {job.is_blocked === 1 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400">By: {job.poster_name}</p>
              </div>
            </div>

            <p className="text-gray-700 mb-2">{job.description}</p>
            
            {job.requirements && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Requirements:</h4>
                <p className="text-gray-600 text-sm">{job.requirements}</p>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              {job.apply_link && (
              <a
                href={job.apply_link.startsWith("http") ? job.apply_link : `http://${job.apply_link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View Application
              </a>
              )}
              <button 
                onClick={() => handleToggleBlock(job.id, job.is_blocked)}
                className={`px-4 py-2 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                  job.is_blocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {job.is_blocked ? (
                  <><ShieldCheck className="w-4 h-4" /> Unblock</>
                ) : (
                  <><ShieldAlert className="w-4 h-4" /> Block</>
                )}
              </button>
              <button
                onClick={() => handleDelete(job.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
