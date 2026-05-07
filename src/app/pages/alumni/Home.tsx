import { useState } from "react";
import { Heart, MessageCircle, Trophy, Briefcase, Sparkles, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const feedData = [
  {
    id: 1,
    type: "job",
    author: "Sarah Johnson",
    batch: "2020",
    avatar: "SJ",
    time: "2 hours ago",
    company: "Google",
    role: "Senior Software Engineer",
    location: "Mountain View, CA",
    jobType: "Full-time",
    salary: "25-35 LPA",
    description: "We're looking for an experienced software engineer to join our cloud infrastructure team. Work on cutting-edge distributed systems and build tools used by millions.",
    applyLink: "https://careers.google.com/jobs/apply/123456",
    likes: 45,
    comments: 12,
  },
  {
    id: 2,
    type: "achievement",
    author: "Michael Chen",
    batch: "2021",
    avatar: "MC",
    time: "5 hours ago",
    title: "Published Research Paper in Nature AI",
    content: "Published my first research paper in Nature AI! This achievement wouldn't have been possible without the strong foundation and mentorship I received. Thank you to all my professors for their guidance.",
    image: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800&h=400&fit=crop",
    likes: 78,
    comments: 23,
  },
  {
    id: 3,
    type: "job",
    author: "Emily Davis",
    batch: "2022",
    avatar: "ED",
    time: "1 day ago",
    company: "Microsoft",
    role: "Product Manager - Azure AI",
    location: "Seattle, WA",
    jobType: "Full-time",
    salary: "22-30 LPA",
    description: "Lead product strategy for Azure AI services. Work with cross-functional teams to deliver innovative cloud solutions. Perfect for someone with strong technical background and product vision.",
    applyLink: "https://careers.microsoft.com/apply/456789",
    likes: 32,
    comments: 8,
  },
  {
    id: 4,
    type: "achievement",
    author: "James Wilson",
    batch: "2023",
    avatar: "JW",
    time: "2 days ago",
    title: "Startup Selected for Y Combinator",
    content: "Proud to announce that our startup has been selected for Y Combinator's accelerator program! The entrepreneurship courses and innovation mindset instilled during college played a crucial role in getting here.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    likes: 156,
    comments: 45,
  },
  {
    id: 5,
    type: "job",
    author: "Priya Sharma",
    batch: "2019",
    avatar: "PS",
    time: "3 days ago",
    company: "Meta",
    role: "Data Scientist",
    location: "Menlo Park, CA",
    jobType: "Full-time",
    salary: "28-38 LPA",
    description: "Analyze user behavior and build ML models to improve platform engagement. Work with billions of data points daily and make impact at scale.",
    applyLink: "https://metacareers.com/jobs/987654",
    likes: 67,
    comments: 15,
  },
];

export default function AlumniHome() {
  const [activeFilter, setActiveFilter] = useState<"all" | "job" | "achievement">("all");

  const filteredFeed = feedData.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#0A66C2]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Home Feed</h1>
            <p className="text-gray-600">Stay connected with your alumni community</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-2 border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
              activeFilter === "all"
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("job")}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeFilter === "job"
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs
          </button>
          <button
            onClick={() => setActiveFilter("achievement")}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              activeFilter === "achievement"
                ? "bg-[#0A66C2] text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Achievements
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredFeed.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-6 border-2 hover:shadow-lg transition-all ${
              item.type === "achievement" ? "border-amber-200" : "border-blue-200"
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#0A66C2] font-semibold flex-shrink-0">
                {item.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.author}</h3>
                    <p className="text-sm text-gray-500">Batch {item.batch} • {item.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                    item.type === "achievement"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {item.type === "achievement" ? (
                      <>
                        <Trophy className="w-3 h-3" />
                        Achievement
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3 h-3" />
                        Job Opportunity
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {item.type === "job" ? (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{item.role}</h2>
                  <p className="text-lg text-[#0A66C2] font-semibold mb-3">{item.company}</p>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      {item.salary}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      {item.jobType}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <a
                    href={item.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all font-medium flex items-center gap-2"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.comments}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{item.content}</p>
                  {item.image && (
                    <div className="rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={`Achievement by ${item.author}`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.comments}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredFeed.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <p className="text-gray-500">
            No {activeFilter === "all" ? "items" : activeFilter === "job" ? "job opportunities" : "achievements"} to display
          </p>
        </div>
      )}
    </div>
  );
}
