import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trophy, Briefcase, Sparkles, MapPin, DollarSign, ExternalLink, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { getJobs, getAchievements, JobPost, AchievementPost } from "@/lib/api";

type FeedItem = {
  id: number;
  type: "job" | "achievement";
  author: string;
  batch: string;
  avatar: string;
  time: string;
  company?: string;
  role?: string;
  location?: string;
  jobType?: string;
  salary?: string;
  description?: string;
  applyLink?: string;
  title?: string;
  content?: string;
  image?: string | null;
  likes: number;
  comments: number;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default function AlumniHome() {
  const [activeFilter, setActiveFilter] = useState<"all" | "job" | "achievement">("all");
  const [feedData, setFeedData] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [jobsResponse, achievementsResponse] = await Promise.all([
          getJobs(),
          getAchievements(),
        ]);

        console.log("Jobs response:", jobsResponse);
        console.log("Achievements response:", achievementsResponse);

        const items: FeedItem[] = [];

        if (jobsResponse.success && jobsResponse.data) {
          jobsResponse.data.forEach((job: JobPost) => {
            items.push({
              id: job.id,
              type: "job",
              author: job.poster_name || "Unknown",
              batch: "",
              avatar: getInitials(job.poster_name || "Unknown"),
              time: timeAgo(job.created_at),
              company: job.company,
              role: job.role,
              location: job.location,
              jobType: job.job_type,
              salary: job.salary,
              description: job.description,
              applyLink: job.apply_link,
              likes: 0,
              comments: 0,
            });
          });
        }

        if (achievementsResponse.success && achievementsResponse.data) {
          achievementsResponse.data.forEach((achievement: AchievementPost) => {
            items.push({
              id: achievement.id,
              type: "achievement",
              author: achievement.poster_name || "Unknown",
              batch: "",
              avatar: getInitials(achievement.poster_name || "Unknown"),
              time: timeAgo(achievement.created_at),
              title: achievement.title,
              content: achievement.description,
              image: achievement.image_url,
              likes: 0,
              comments: 0,
            });
          });
        }

        // Sort by time (newest first)
        items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setFeedData(items);
      } catch (err) {
        setError("Failed to load feed data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedData();
  }, []);

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
            <h3 className="text-xl font-bold text-gray-900">Home Feed</h3>
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

      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <Loader2 className="w-8 h-8 text-[#0A66C2] animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading feed...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
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
                      <p className="text-sm text-gray-500">{item.time}</p>
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
                      {item.location && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </span>
                      )}
                      {item.salary && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          {item.salary}
                        </span>
                      )}
                      {item.jobType && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          {item.jobType}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    )}
                    {item.applyLink && (
                      <div className="mt-3">
                        <a
                          href={item.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2.5 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all font-medium inline-flex items-center gap-2"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
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
                    {item.title && <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>}
                    {item.content && <p className="text-gray-700 leading-relaxed mb-4">{item.content}</p>}
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
      )}

      {!loading && !error && filteredFeed.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <p className="text-gray-500">
            No {activeFilter === "all" ? "items" : activeFilter === "job" ? "job opportunities" : "achievements"} to display
          </p>
        </div>
      )}
    </div>
  );
}