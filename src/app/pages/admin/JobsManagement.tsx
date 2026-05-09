import { useState } from "react";
import { Plus, Edit, Trash2, Briefcase, MapPin, DollarSign, ExternalLink } from "lucide-react";

const jobsData = [
  {
    id: 1,
    company: "Google",
    role: "Senior Software Engineer",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Join our team to build the next generation of cloud infrastructure tools.",
    applyLink: "https://careers.google.com/apply",
    postedDate: "2026-04-25",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Product Manager",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130k - $180k",
    description: "Lead product strategy for Azure AI services.",
    applyLink: "https://careers.microsoft.com/apply",
    postedDate: "2026-04-26",
  },
  {
    id: 3,
    company: "Startup Inc",
    role: "Full Stack Developer",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Build innovative fintech solutions in a fast-paced startup environment.",
    applyLink: "https://startupinc.com/careers",
    postedDate: "2026-04-27",
  },
];

export default function JobsManagement() {
  const [jobs, setJobs] = useState(jobsData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    applyLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      id: jobs.length + 1,
      ...formData,
      postedDate: new Date().toISOString().split("T")[0],
    };
    setJobs([newJob, ...jobs]);
    setFormData({
      company: "",
      role: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      applyLink: "",
    });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
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
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </p>
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="flex gap-3">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View Application
              </a>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium">
                <Edit className="w-4 h-4" />
                Edit
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
