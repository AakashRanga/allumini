import { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign, ExternalLink, Clock } from "lucide-react";
import JobBot from "../../components/JobBot";

interface Job {
  id: number;
  user_id: number;
  poster_name: string;
  company: string;
  role: string;
  location: string;
  job_type: string;
  salary: string;
  description: string;
  requirements: string;
  apply_link: string;
  created_at: string;
}

export default function ViewJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5555/posts/jobs");
        const data = await response.json();
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.success) {
          setJobs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Job Opportunities</h3>
            <p className="text-gray-600">Explore career opportunities shared by our community</p>
          </div>

          <div className="grid gap-5">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A66C2]"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500">No job opportunities posted yet.</p>
              </div>
            ) : (
              jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#0A66C2]">
                      {job.company ? job.company.charAt(0).toUpperCase() : "C"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.role}</h3>
                    <p className="text-[#0A66C2] font-semibold mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        {job.job_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <span className="text-xs">Posted by {job.poster_name}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                {job.requirements && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{job.requirements}</p>
                  </div>
                )}

                {job.apply_link && (
                <a
                  href={job.apply_link.startsWith("http") ? job.apply_link : `http://${job.apply_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </a>
                )}
              </div>
            )))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <JobBot />
        </div>
      </div>
    </div>
  );
}
