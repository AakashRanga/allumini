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
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-all scale-100 flex flex-col">
            
            {/* Sticky Header Actions */}
            <div className="sticky top-0 right-0 left-0 bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center z-10">
              <h2 className="text-lg font-black text-gray-900">Alumnus Profile</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close profile modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="flex-1 p-6 space-y-6">
              
              {/* Profile Top Card Banner */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border border-white/20 bg-white/10 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl overflow-hidden shrink-0">
                    {selectedMember.profile_image ? (
                      <img
                        src={`${API_BASE_URL}/profile-images/${selectedMember.profile_image}`}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(selectedMember.name || "Alumni")
                    )}
                  </div>
                  <div className="space-y-2 min-w-0 flex-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                      {selectedMember.name}
                    </h3>
                    <p className="text-blue-100 font-semibold text-sm sm:text-base">
                      {selectedMember.specialization || "Registered Alumni"}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                      {selectedMember.academic_details?.[0] && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                          <GraduationCap className="w-3.5 h-3.5 text-white" />
                          Batch {selectedMember.academic_details[0].joining_year || "N/A"}
                        </span>
                      )}
                      {selectedMember.previous_experience?.[0] && (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                          <Briefcase className="w-3.5 h-3.5 text-white" />
                          {selectedMember.previous_experience[0].role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid: Details Layout */}
              <div className="grid gap-6 md:grid-cols-3">
                
                {/* Left Side: Snapshot details */}
                <div className="space-y-6 md:col-span-1">
                  
                  {/* Contact details */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">
                      Contact Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Email
                          </p>
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="text-xs text-blue-600 hover:underline font-semibold block truncate"
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 min-w-0">
                        <Phone className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="text-xs text-gray-700 font-semibold block truncate">
                            {selectedMember.contact_number || "Not disclosed"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Timeline details */}
                <div className="space-y-6 md:col-span-2">
                  
                  {/* Education details */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                      Academic Pathways
                    </h4>
                    {!selectedMember.academic_details || selectedMember.academic_details.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No academic details added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedMember.academic_details.map((edu, idx) => (
                          <div
                            key={`edu-modal-${idx}`}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                {edu.degree || "DEG"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5 className="text-xs font-bold text-gray-800">
                                  {edu.degree} {edu.branch ? `— ${edu.branch}` : ""}
                                </h5>
                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                  {edu.college_name}
                                </p>
                                {edu.joining_year && (
                                  <span className="inline-block mt-2 px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-bold">
                                    Class of {edu.joining_year}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Previous Experience Timeline */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                      Experience History
                    </h4>
                    {!selectedMember.previous_experience || selectedMember.previous_experience.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No professional experience listed.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedMember.previous_experience.map((exp, idx) => (
                          <div
                            key={`exp-modal-${idx}`}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-2"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h5 className="text-xs font-bold text-gray-900">
                                  {exp.role}
                                </h5>
                                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                  {exp.company}
                                </p>
                              </div>
                              <span className="shrink-0 px-2 py-0.5 bg-indigo-50/50 text-indigo-600 rounded text-[9px] font-bold">
                                {exp.duration}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-[11px] text-gray-600 leading-relaxed pt-1.5 border-t border-gray-100">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Accolades & Accoutrements */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">
                      Accolades & Achievements
                    </h4>
                    
                    {/* Awards list */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                        <Trophy className="w-4 h-4 text-amber-500" /> Awards
                      </div>
                      {!selectedMember.awards || selectedMember.awards.filter(Boolean).length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic pl-5">None added</p>
                      ) : (
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {selectedMember.awards.filter(Boolean).map((award, idx) => (
                            <li key={`aw-${idx}`}>{award}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Honorary Degrees list */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" /> Honorary Degrees
                      </div>
                      {!selectedMember.honorary_degrees || selectedMember.honorary_degrees.filter(Boolean).length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic pl-5">None added</p>
                      ) : (
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {selectedMember.honorary_degrees.filter(Boolean).map((deg, idx) => (
                            <li key={`hd-${idx}`}>{deg}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Books authored list */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                        <BookOpen className="w-4 h-4 text-purple-500" /> Books Published
                      </div>
                      {!selectedMember.books_authored || selectedMember.books_authored.filter(Boolean).length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic pl-5">None added</p>
                      ) : (
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {selectedMember.books_authored.filter(Boolean).map((book, idx) => (
                            <li key={`bk-${idx}`}>{book}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Other Accolades */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                        <Globe className="w-4 h-4 text-blue-500" /> Other Accolades
                      </div>
                      {!selectedMember.other_accolades || selectedMember.other_accolades.filter(Boolean).length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic pl-5">None added</p>
                      ) : (
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {selectedMember.other_accolades.filter(Boolean).map((acc, idx) => (
                            <li key={`oth-${idx}`}>{acc}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
