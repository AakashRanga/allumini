import { useState } from "react";
import { Edit, Mail, Phone, GraduationCap, Calendar, MapPin, Briefcase, Trophy, FileText } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    degree: "Undergraduate",
    specialization: "Computer Science",
    batch: "2020",
    location: "San Francisco, CA",
    company: "Tech Corp",
    position: "Software Engineer",
  });

  const userPosts = [
    {
      id: 1,
      type: "job",
      content: "Software Engineer at Tech Corp - Remote opportunity",
      date: "2026-04-20",
      likes: 24,
    },
    {
      id: 2,
      type: "achievement",
      content: "Completed AWS Solutions Architect certification!",
      date: "2026-04-10",
      likes: 45,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="relative flex items-start gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-bold flex-shrink-0 shadow-xl">
            {profileData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
            <p className="text-blue-100 mb-4">
              {profileData.position} at {profileData.company}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                Batch {profileData.batch}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                {profileData.specialization}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{profileData.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Degree</p>
                <p className="font-medium">{profileData.degree}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium">{profileData.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Batch Year</p>
                <p className="font-medium">{profileData.batch}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{profileData.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{profileData.position}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Jobs Shared</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        post.type === "achievement"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {post.type === "achievement" ? (
                        <>
                          <Trophy className="w-3 h-3 inline mr-1" />
                          Achievement
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 inline mr-1" />
                          Job Post
                        </>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{post.content}</p>
                </div>
                <span className="text-sm text-gray-500">{post.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
