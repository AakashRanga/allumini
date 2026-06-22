import { useEffect, useState } from "react";
import { Briefcase, MapPin, IndianRupee, ExternalLink, Clock, Filter, RotateCcw } from "lucide-react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { formatSalary } from "@/utils/validation";

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

  // Filter states
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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

  // Extract distinct values from database jobs
  const distinctRoles = Array.from(
    new Set(jobs.map((job) => job.role).filter(Boolean))
  ).sort();

  const distinctLocations = Array.from(
    new Set(jobs.map((job) => job.location).filter(Boolean))
  ).sort();

  const distinctSalaries = Array.from(
    new Set(jobs.map((job) => formatSalary(job.salary)).filter(Boolean))
  ).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) && isNaN(numB)) return 0;
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    return numA - numB;
  });

  const dateOptions = ["Today", "This Week", "This Month", "Last 6 Months", "This Year"];

  const handleResetFilters = () => {
    setSelectedRole("");
    setSelectedLocation("");
    setSelectedSalary("");
    setSelectedDate("");
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesRole = !selectedRole || job.role === selectedRole;
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesSalary = !selectedSalary || formatSalary(job.salary) === selectedSalary;
    
    let matchesDate = true;
    if (selectedDate) {
      const jobDate = new Date(job.created_at);
      const now = new Date();
      if (selectedDate === "Today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        matchesDate = jobDate >= startOfToday;
      } else if (selectedDate === "This Week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - 7);
        startOfWeek.setHours(0, 0, 0, 0);
        matchesDate = jobDate >= startOfWeek;
      } else if (selectedDate === "This Month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchesDate = jobDate >= startOfMonth;
      } else if (selectedDate === "Last 6 Months") {
        const startOf6Months = new Date();
        startOf6Months.setMonth(now.getMonth() - 6);
        startOf6Months.setHours(0, 0, 0, 0);
        matchesDate = jobDate >= startOf6Months;
      } else if (selectedDate === "This Year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        matchesDate = jobDate >= startOfYear;
      }
    }

    return matchesRole && matchesLocation && matchesSalary && matchesDate;
  });
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
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
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500">No job opportunities match your filter criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-[#0A66C2] text-white rounded-xl text-sm font-medium hover:bg-[#004182] transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
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
                          <IndianRupee className="w-4 h-4" />
                          {formatSalary(job.salary)}
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

        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm lg:sticky lg:top-6 z-30 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#0A66C2]" />
                Filter Jobs
              </h3>
              {(selectedRole || selectedLocation || selectedSalary || selectedDate) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0A66C2] hover:text-[#004182] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All
                </button>
              )}
            </div>

            <div className="space-y-5">
              <SearchableDropdown
                label="Job Title"
                options={distinctRoles}
                selectedValue={selectedRole}
                onChange={setSelectedRole}
                placeholder="All Job Titles"
                icon={<Briefcase className="w-3.5 h-3.5 text-gray-400" />}
              />

              <SearchableDropdown
                label="Location"
                options={distinctLocations}
                selectedValue={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="All Locations"
                icon={<MapPin className="w-3.5 h-3.5 text-gray-400" />}
              />

              <SearchableDropdown
                label="Salary Range"
                options={distinctSalaries}
                selectedValue={selectedSalary}
                onChange={setSelectedSalary}
                placeholder="All Salaries"
                icon={<IndianRupee className="w-3.5 h-3.5 text-gray-400" />}
              />

              <SearchableDropdown
                label="Date Posted"
                options={dateOptions}
                selectedValue={selectedDate}
                onChange={setSelectedDate}
                placeholder="All Dates"
                icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
