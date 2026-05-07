import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, Filter, MapPin, DollarSign, Calendar } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Job {
  title: string;
  company: string;
  skills: string[];
  location: string;
  salary: string;
  postedDate: string;
}

const jobSuggestions: Job[] = [
  {
    title: "Software Engineer",
    company: "Tech Corp",
    skills: ["javascript", "react", "nodejs", "programming", "software", "developer"],
    location: "Remote",
    salary: "$80k - $120k",
    postedDate: "2026-04-20",
  },
  {
    title: "Data Scientist",
    company: "Analytics Inc",
    skills: ["python", "machine learning", "data", "analytics", "ai", "statistics"],
    location: "New York",
    salary: "$90k - $140k",
    postedDate: "2026-04-25",
  },
  {
    title: "Product Manager",
    company: "Innovation Labs",
    skills: ["management", "product", "strategy", "leadership", "agile"],
    location: "San Francisco",
    salary: "$100k - $150k",
    postedDate: "2026-04-22",
  },
  {
    title: "UX Designer",
    company: "Design Studio",
    skills: ["design", "ui", "ux", "figma", "creative", "user experience"],
    location: "Remote",
    salary: "$70k - $110k",
    postedDate: "2026-04-28",
  },
  {
    title: "Marketing Manager",
    company: "Brand Co",
    skills: ["marketing", "branding", "social media", "content", "strategy"],
    location: "Los Angeles",
    salary: "$75k - $115k",
    postedDate: "2026-04-18",
  },
  {
    title: "Backend Engineer",
    company: "Cloud Systems",
    skills: ["java", "spring", "aws", "backend", "api", "microservices"],
    location: "Remote",
    salary: "$85k - $125k",
    postedDate: "2026-04-26",
  },
  {
    title: "DevOps Engineer",
    company: "Infrastructure Co",
    skills: ["docker", "kubernetes", "ci/cd", "devops", "terraform"],
    location: "Boston",
    salary: "$90k - $135k",
    postedDate: "2026-04-24",
  },
];

export default function JobBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Job Assistant 🤖 Use the filters below or tell me about your skills to find the perfect job!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    jobTitle: "",
    location: "",
    salaryRange: "",
    datePosted: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMatchingJobs = (userInput: string, appliedFilters?: typeof filters) => {
    const input = userInput.toLowerCase();
    let matches = jobSuggestions;

    // Apply text search if input exists
    if (input) {
      matches = matches.filter(
        (job) =>
          job.skills.some((skill) => input.includes(skill)) ||
          job.title.toLowerCase().includes(input) ||
          job.company.toLowerCase().includes(input)
      );
    }

    // Apply filters
    if (appliedFilters) {
      if (appliedFilters.jobTitle) {
        matches = matches.filter((job) =>
          job.title.toLowerCase().includes(appliedFilters.jobTitle.toLowerCase())
        );
      }
      if (appliedFilters.location) {
        matches = matches.filter((job) =>
          job.location.toLowerCase().includes(appliedFilters.location.toLowerCase())
        );
      }
      if (appliedFilters.salaryRange) {
        matches = matches.filter((job) => job.salary.includes(appliedFilters.salaryRange));
      }
      if (appliedFilters.datePosted) {
        const daysAgo = parseInt(appliedFilters.datePosted);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        matches = matches.filter((job) => new Date(job.postedDate) >= cutoffDate);
      }
    }

    if (matches.length > 0) {
      const jobList = matches
        .map(
          (job) =>
            `\n📌 ${job.title} at ${job.company}\n📍 ${job.location} | 💰 ${job.salary}\n📅 Posted: ${new Date(job.postedDate).toLocaleDateString()}`
        )
        .join("\n\n");
      return `Great! I found ${matches.length} matching job${matches.length > 1 ? "s" : ""}:${jobList}\n\nWould you like to know more?`;
    } else {
      return "I couldn't find jobs matching your criteria. Try adjusting your filters or search terms!";
    }
  };

  const handleApplyFilters = () => {
    const hasFilters = Object.values(filters).some((val) => val !== "");
    if (!hasFilters) {
      return;
    }

    const botResponse: Message = {
      id: messages.length + 1,
      text: findMatchingJobs("", filters),
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      jobTitle: "",
      location: "",
      salaryRange: "",
      datePosted: "",
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: findMatchingJobs(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isMinimized) {
    return (
      <div className="lg:sticky lg:top-6 mb-6 lg:mb-0">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3"
        >
          <Bot className="w-8 h-8" />
          <div className="text-left">
            <p className="font-bold">Job Assistant</p>
            <p className="text-xs text-purple-100">Click to open</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-6 h-auto lg:h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col mb-6 lg:mb-0">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-white">Job Assistant</h3>
            <p className="text-xs text-purple-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-white hover:bg-white/20 p-2 rounded-lg transition-all ${showFilters ? "bg-white/20" : ""}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 bg-purple-50 border-b border-gray-200 space-y-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Jobs
          </h4>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Job Title</label>
            <input
              type="text"
              value={filters.jobTitle}
              onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
              placeholder="e.g., Software Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="e.g., Remote, New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Salary Range
            </label>
            <select
              value={filters.salaryRange}
              onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="$70k">$70k+</option>
              <option value="$80k">$80k+</option>
              <option value="$90k">$90k+</option>
              <option value="$100k">$100k+</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Date Posted
            </label>
            <select
              value={filters.datePosted}
              onChange={(e) => setFilters({ ...filters, datePosted: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Any time</option>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white max-h-[400px] lg:max-h-none">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-line break-words">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-purple-100" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me your skills or interests..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by AI · Try: "I know Python and data analysis"
        </p>
      </div>
    </div>
  );
}
