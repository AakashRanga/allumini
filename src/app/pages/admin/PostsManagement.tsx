import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Edit, Trash2, Trophy, FileText, ShieldAlert, ShieldCheck } from "lucide-react";

interface Achievement {
  id: number;
  type: string;
  poster_name: string;
  batch: string;
  title: string;
  description: string;
  created_at: string;
  is_blocked: number;
}

export default function PostsManagement() {
  const [posts, setPosts] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "achievements">("all");

  const fetchAchievements = async () => {
    try {
      const response = await fetch("http://localhost:5555/posts/admin/achievements");
      const data = await response.json();
      if (data.success) {
        // Map achievements to the shape expected by the UI
        const mapped = data.data.map((item: any) => ({
          ...item,
          type: "achievement",
        }));
        setPosts(mapped);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);
  const handleToggleBlock = async (id: number, currentStatus: number, type: string) => {
    try {
      const response = await fetch(`http://localhost:5555/posts/admin/${type}/${id}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_blocked: !currentStatus }),
      });
      if (response.ok) {
        fetchAchievements();
      }
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const response = await fetch(`http://localhost:5555/posts/admin/${type}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "all") return true;
    return post.type === (activeTab === "posts" ? "post" : "achievement");
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Posts & Achievements</h3>
        <p className="text-gray-600">Manage alumni posts and achievements</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-medium ${
              activeTab === "all"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
              activeTab === "posts"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
              activeTab === "achievements"
                ? "bg-purple-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Achievements
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold flex-shrink-0">
                {post.poster_name
                  ? post.poster_name.split(" ").map((n) => n[0]).join("")
                  : "A"}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.poster_name}</h3>
                    <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
                        post.type === "achievement"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {post.type === "achievement" ? (
                        <>
                          <Trophy className="w-3 h-3" />
                          Achievement
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          Post
                        </>
                      )}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        post.is_blocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {post.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-gray-900 ml-16 mb-1">{post.title}</h4>
            <p className="text-gray-700 mb-4 ml-16">{post.description}</p>

            <div className="flex gap-3 ml-16">
              <button
                onClick={() => handleToggleBlock(post.id, post.is_blocked, post.type)}
                className={`px-4 py-2 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                  post.is_blocked ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {post.is_blocked ? (
                  <><ShieldCheck className="w-4 h-4" /> Unblock</>
                ) : (
                  <><ShieldAlert className="w-4 h-4" /> Block</>
                )}
              </button>
              <button
                onClick={() => handleDelete(post.id, post.type)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <p className="text-gray-500">No {activeTab === "all" ? "posts or achievements" : activeTab} found</p>
        </div>
      )}
    </div>
  );
}
