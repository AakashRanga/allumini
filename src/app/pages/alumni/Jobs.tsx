import { Briefcase, MapPin, DollarSign, ExternalLink, Clock } from "lucide-react";
import JobBot from "../../components/JobBot";

const jobsData = [
  {
    id: 1,
    company: "Google",
    logo: "G",
    role: "Senior Software Engineer",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Join our team to build the next generation of cloud infrastructure tools. We're looking for experienced engineers with expertise in distributed systems.",
    postedDate: "2026-04-25",
    applyLink: "https://careers.google.com/apply",
  },
  {
    id: 2,
    company: "Microsoft",
    logo: "M",
    role: "Product Manager",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$130k - $180k",
    description: "Lead product strategy for Azure AI services. Work with cross-functional teams to deliver innovative cloud solutions.",
    postedDate: "2026-04-26",
    applyLink: "https://careers.microsoft.com/apply",
  },
  {
    id: 3,
    company: "Meta",
    logo: "M",
    role: "Data Scientist",
    location: "Menlo Park, CA",
    type: "Full-time",
    salary: "$140k - $190k",
    description: "Analyze user behavior and build ML models to improve platform engagement. Work with billions of data points daily.",
    postedDate: "2026-04-24",
    applyLink: "https://metacareers.com/apply",
  },
  {
    id: 4,
    company: "Startup Inc",
    logo: "SI",
    role: "Full Stack Developer",
    location: "Remote",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Build innovative fintech solutions in a fast-paced startup environment. Ground floor opportunity with equity options.",
    postedDate: "2026-04-27",
    applyLink: "https://startupinc.com/careers",
  },
  {
    id: 5,
    company: "Amazon",
    logo: "A",
    role: "Machine Learning Engineer",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$145k - $195k",
    description: "Develop ML models for Alexa's natural language processing. Work on cutting-edge AI research and production systems.",
    postedDate: "2026-04-23",
    applyLink: "https://amazon.jobs/apply",
  },
];

export default function ViewJobs() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Opportunities</h1>
            <p className="text-gray-600">Explore career opportunities shared by our community</p>
          </div>

          <div className="grid gap-5">
            {jobsData.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-[#0A66C2]">{job.logo}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{job.role}</h3>
                    <p className="text-[#0A66C2] font-semibold mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24))}d ago
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <JobBot />
        </div>
      </div>
    </div>
  );
}
