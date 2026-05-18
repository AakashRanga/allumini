import { useEffect, useState } from "react";
import { Trophy, Calendar, Heart, MessageCircle } from "lucide-react";

interface Achievement {
  id: number;
  user_id: number;
  poster_name: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function ViewAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("http://localhost:5555/posts/achievements");
        const data = await response.json();
        if (Array.isArray(data)) {
          setAchievements(data);
        } else if (data.success) {
          setAchievements(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Achievements
          </h3>
          <p className="text-gray-600">Celebrate success stories from our alumni community</p>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-amber-200">
            <p className="text-gray-500">No achievements posted yet.</p>
          </div>
        ) : (
        achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white rounded-2xl p-6 border-2 border-amber-200 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full"></div>
            <Trophy className="w-6 h-6 text-amber-500 absolute top-4 right-4" />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-semibold flex-shrink-0">
                {achievement.poster_name ? achievement.poster_name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.poster_name}</h3>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{achievement.description}</p>
            {achievement.image_url && (
              <img src={achievement.image_url} alt="Achievement" className="w-full max-h-96 object-cover rounded-xl mb-4" />
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(achievement.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">0</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">0</span>
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}
