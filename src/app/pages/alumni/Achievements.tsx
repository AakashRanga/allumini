import { Trophy, Calendar, Heart, MessageCircle } from "lucide-react";

const achievementsData = [
  {
    id: 1,
    author: "Michael Chen",
    batch: "2021",
    avatar: "MC",
    title: "Research Paper Published in Nature AI",
    content: "Published my first research paper in Nature AI! This achievement wouldn't have been possible without the strong foundation and mentorship I received.",
    date: "2026-04-22",
    likes: 78,
    comments: 23,
  },
  {
    id: 2,
    author: "James Wilson",
    batch: "2023",
    avatar: "JW",
    title: "Startup Selected for Y Combinator",
    content: "Proud to announce that our startup has been selected for Y Combinator's accelerator program! The entrepreneurship courses played a crucial role.",
    date: "2026-04-20",
    likes: 156,
    comments: 45,
  },
  {
    id: 3,
    author: "Priya Sharma",
    batch: "2019",
    avatar: "PS",
    title: "Won Best Speaker Award at Tech Conference",
    content: "Honored to receive the Best Speaker Award at the Global Tech Summit 2026. Presented on AI Ethics and Responsible Innovation.",
    date: "2026-04-15",
    likes: 92,
    comments: 18,
  },
  {
    id: 4,
    author: "Robert Martinez",
    batch: "2020",
    avatar: "RM",
    title: "PhD Defense Successfully Completed",
    content: "Successfully defended my PhD in Quantum Computing at MIT! Grateful for the academic rigor that prepared me for this journey.",
    date: "2026-04-10",
    likes: 134,
    comments: 37,
  },
];

export default function ViewAchievements() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Achievements
          </h1>
          <p className="text-gray-600">Celebrate success stories from our alumni community</p>
        </div>
      </div>

      <div className="grid gap-6">
        {achievementsData.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white rounded-2xl p-6 border-2 border-amber-200 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full"></div>
            <Trophy className="w-6 h-6 text-amber-500 absolute top-4 right-4" />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-semibold flex-shrink-0">
                {achievement.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.author}</h3>
                <p className="text-sm text-gray-500">Batch {achievement.batch}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{achievement.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(achievement.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{achievement.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{achievement.comments}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
