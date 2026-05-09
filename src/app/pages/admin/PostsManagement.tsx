import { useState } from "react";
import { CheckCircle, XCircle, Edit, Trash2, Trophy, FileText } from "lucide-react";

const postsData = [
  {
    id: 1,
    type: "post",
    author: "Sarah Johnson",
    authorBatch: "2020",
    content: "Excited to share that I've joined Google as a Senior Software Engineer! Grateful for the education and opportunities from our institution.",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "achievement",
    author: "Michael Chen",
    authorBatch: "2021",
    content: "Published my first research paper in Nature AI! Thank you to all my professors for their guidance.",
    timestamp: "5 hours ago",
    status: "approved",
  },
  {
    id: 3,
    type: "post",
    author: "Emily Davis",
    authorBatch: "2022",
    content: "Just completed my certification in Cloud Architecture. The fundamentals I learned during UG were incredibly helpful!",
    timestamp: "1 day ago",
    status: "approved",
  },
];

export default function PostsManagement() {
  const [posts, setPosts] = useState(postsData);
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "achievements">("all");

  const handleApprove = (id: number) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, status: "approved" } : post)));
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
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
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-500">Batch {post.authorBatch} • {post.timestamp}</p>
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
                        post.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.status === "approved" ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 ml-16">{post.content}</p>

            <div className="flex gap-3 ml-16">
              {post.status === "pending" && (
                <button
                  onClick={() => handleApprove(post.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-medium">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
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
