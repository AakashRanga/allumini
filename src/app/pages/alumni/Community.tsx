import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Briefcase,
  Trophy,
  Sparkles,
  BookOpen,
  X,
  MapPin,
  ChevronRight,
  Globe,
} from "lucide-react";
import { getCommunityMembers, type UserProfile, API_BASE_URL } from "@/lib/api";
import ProfileViewModal from "../../components/ProfileViewModal";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Community() {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);
      const response = await getCommunityMembers();
      if (response.success) {
        setMembers(response.data);
      } else {
        setError(response.error || "Failed to load community members");
      }
      setLoading(false);
    }
    void fetchMembers();
  }, []);

  // Compute filters list
  const uniqueDegrees = Array.from(
    new Set(
      members.flatMap((m) =>
        m.academic_details ? m.academic_details.map((edu) => edu.degree) : []
      )
    )
  ).filter(Boolean);

  const uniqueBatches = Array.from(
    new Set(
      members.flatMap((m) =>
        m.academic_details ? m.academic_details.map((edu) => edu.joining_year) : []
      )
    )
  ).filter(Boolean).sort((a, b) => b.localeCompare(a)); // Sort batches descending

  // Filter logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.specialization &&
        member.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDegree =
      selectedDegree === "all" ||
      (member.academic_details &&
        member.academic_details.some((edu) => edu.degree === selectedDegree));

    const matchesBatch =
      selectedBatch === "all" ||
      (member.academic_details &&
        member.academic_details.some((edu) => edu.joining_year === selectedBatch));

    return matchesSearch && matchesDegree && matchesBatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-xl" />
        <div className="relative max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Alumni Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Connect with the Sacred Community
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            Network with fellow alumni, discover mentors, explore career opportunities, and collaborate with peers across the globe.
          </p>
        </div>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or specialization..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 text-sm"
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none appearance-none transition-all cursor-pointer font-medium"
              >
                <option value="all">All Degrees</option>
                {uniqueDegrees.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative min-w-[140px] flex-1 sm:flex-initial">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none appearance-none transition-all cursor-pointer font-medium"
              >
                <option value="all">All Batches</option>
                {uniqueBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    Class of {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center">
          <p className="font-semibold">{error}</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-500">
          <p className="text-lg font-medium">No community members match your search criteria.</p>
          <p className="text-sm mt-1">Try adjusting your filters or typing different keywords.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => {
            const hasImage = !!member.profile_image;
            const initials = getInitials(member.name || "Alumni");
            const primaryEdu = member.academic_details?.[0];

            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Visual gradient top bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                
                <div>
                  {/* Card Header Profile Info */}
                  <div className="flex items-center gap-4 mb-4 mt-2">
                    <div className="relative w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden border border-blue-100/50 shadow-inner shrink-0 transition-transform group-hover:scale-105">
                      {hasImage ? (
                        <img
                          src={`${API_BASE_URL}/profile-images/${member.profile_image}`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h3>
                      {member.specialization ? (
                        <p className="text-xs text-blue-600 font-semibold truncate bg-blue-50/50 px-2 py-0.5 rounded-md inline-block">
                          {member.specialization}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No specialization listed</p>
                      )}
                    </div>
                  </div>

                  {/* Summary / Education */}
                  {primaryEdu && (
                    <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-3.5 mb-4 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">
                          {primaryEdu.degree} {primaryEdu.branch ? `— ${primaryEdu.branch}` : ""}
                        </span>
                      </div>
                      <div className="text-gray-500 font-medium pl-6 truncate">
                        {primaryEdu.college_name}
                      </div>
                      {primaryEdu.joining_year && (
                        <div className="text-gray-400 font-semibold pl-6">
                          Class of {primaryEdu.joining_year}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Previous Experience Snapshot */}
                  {member.previous_experience && member.previous_experience.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 px-1">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate font-medium">
                        Previously: {member.previous_experience[0].role} at{" "}
                        <strong className="text-gray-700 font-semibold">
                          {member.previous_experience[0].company}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Button */}
                <button
                  onClick={() => setSelectedMember(member)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-transparent text-gray-700 font-bold py-2.5 px-4 rounded-2xl text-xs transition-all duration-300 group/btn"
                >
                  View Full Profile
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Profile Viewer */}
      <ProfileViewModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
