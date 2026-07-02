import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Briefcase,
  Trophy,
  Sparkles,
  BookOpen,
  Globe,
  MapPin,
  FileText,
  Clock,
  Sparkle,
  ExternalLink,
} from "lucide-react";
import { getUserActivity, type UserProfile, type JobPost, type AchievementPost, API_BASE_URL } from "@/lib/api";
import { formatSalary } from "@/utils/validation";

interface ProfileViewModalProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileViewModal({ member, isOpen, onClose }: ProfileViewModalProps) {
  const [activeTab, setActiveTab] = useState<"about" | "activity">("about");
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [achievements, setAchievements] = useState<AchievementPost[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && member) {
      setActiveTab("about");
      setJobs([]);
      setAchievements([]);
      
      const fetchActivity = async () => {
        setLoadingActivity(true);
        const response = await getUserActivity(member.id);
        if (response.success && response.data) {
          // Compatibility with both {"success": true, "data": {jobs, achievements}} and {"success": true, "jobs", "achievements"}
          const data = response.data as any;
          if (data.jobs && data.achievements) {
            setJobs(data.jobs);
            setAchievements(data.achievements);
          } else if (response.data.jobs && response.data.achievements) {
            setJobs(response.data.jobs);
            setAchievements(response.data.achievements);
          }
        } else {
          // Fallback if data is returned directly on response object
          const rawResponse = response as any;
          if (rawResponse.jobs && rawResponse.achievements) {
            setJobs(rawResponse.jobs);
            setAchievements(rawResponse.achievements);
          }
        }
        setLoadingActivity(false);
      };
      void fetchActivity();
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const initials = getInitials(member.name || "Alumni");
  const hasImage = !!member.profile_image;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative transform transition-all scale-100 flex flex-col">
        
        {/* Header Action Bar */}
        <div className="sticky top-0 bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center z-20">
          <h2 className="text-lg font-black text-gray-900">Alumnus Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-6 space-y-6">
          
          {/* Profile Card Banner */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border border-white/20 bg-white/10 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl overflow-hidden shrink-0">
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
              <div className="space-y-2 min-w-0 flex-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                  {member.name}
                </h3>
                <p className="text-blue-100 font-semibold text-sm sm:text-base">
                  {member.specialization || "Registered Alumni"}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  {member.academic_details?.[0] && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                      <GraduationCap className="w-3.5 h-3.5 text-white" />
                      Batch {member.academic_details[0].joining_year || "N/A"}
                    </span>
                  )}
                  {member.previous_experience?.[0] && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                      <Briefcase className="w-3.5 h-3.5 text-white" />
                      {member.previous_experience[0].role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Tab Bar */}
          <div className="flex border-b border-gray-150 gap-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`pb-3 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === "about"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`pb-3 font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "activity"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              Activity Feed
              {(jobs.length > 0 || achievements.length > 0) && (
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {jobs.length + achievements.length}
                </span>
              )}
            </button>
          </div>

          {/* Tabs Content */}
          {activeTab === "about" ? (
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Left Side: Contact card & Links */}
              <div className="space-y-6 md:col-span-1">
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">
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
                          href={`mailto:${member.email}`}
                          className="text-xs text-blue-600 hover:underline font-semibold block truncate"
                        >
                          {member.email}
                        </a>
                      </div>
                    </div>
                    {member.contact_number && member.contact_number.trim() && (
                      <div className="flex items-start gap-3 min-w-0">
                        <Phone className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="text-xs text-gray-700 font-semibold block truncate">
                            {member.contact_number}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* External Links */}
                {member.external_links && member.external_links.filter(link => link && link.title?.trim() && link.url?.trim()).length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">
                      External Links
                    </h4>
                    <div className="space-y-3">
                      {member.external_links.filter(link => link && link.title?.trim() && link.url?.trim()).map((link, idx) => (
                        <div key={`ext-link-${idx}`} className="flex items-start gap-3 min-w-0">
                          <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline font-semibold inline-flex items-center gap-1 block truncate"
                            >
                              {link.title}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Resume elements */}
              <div className="space-y-6 md:col-span-2">
                
                {/* Academic Pathways */}
                {member.academic_details && member.academic_details.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                      Academic Pathways
                    </h4>
                    <div className="space-y-3">
                      {member.academic_details.map((edu, idx) => (
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
                  </div>
                )}

                {/* Experience Timeline */}
                {member.previous_experience && member.previous_experience.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                      Experience History
                    </h4>
                    <div className="space-y-4">
                      {member.previous_experience.map((exp, idx) => (
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
                  </div>
                )}

                {/* Publications & Research Areas */}
                {((member.publications && member.publications.filter(Boolean).length > 0) ||
                  (member.research && member.research.filter(Boolean).length > 0)) && (
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2 mb-2">
                      Publications & Research
                    </h4>
                    
                    {/* Publications */}
                    {member.publications && member.publications.filter(Boolean).length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                          <FileText className="w-4 h-4 text-indigo-500" /> Publications
                        </div>
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {member.publications.filter(Boolean).map((pub, idx) => (
                            <li key={`pub-${idx}`}>{pub}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Research Areas */}
                    {member.research && member.research.filter(Boolean).length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                          <Sparkles className="w-4 h-4 text-teal-500" /> Research Areas
                        </div>
                        <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                          {member.research.filter(Boolean).map((res, idx) => (
                            <li key={`res-${idx}`}>{res}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Accolades & Accoutrements */}
                {(() => {
                  const hasAwards = member.awards && member.awards.filter(Boolean).length > 0;
                  const hasDegrees = member.honorary_degrees && member.honorary_degrees.filter(Boolean).length > 0;
                  const hasBooks = member.books_authored && (member.books_authored as any[]).filter(b => {
                    if (!b) return false;
                    if (typeof b === "string") return b.trim().length > 0;
                    return b.title?.trim().length > 0;
                  }).length > 0;
                  const hasAccolades = member.other_accolades && member.other_accolades.filter(Boolean).length > 0;

                  if (!hasAwards && !hasDegrees && !hasBooks && !hasAccolades) return null;

                  return (
                    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-2">
                        Accolades & Achievements
                      </h4>
                      
                      {/* Awards */}
                      {hasAwards && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                            <Trophy className="w-4 h-4 text-amber-500" /> Awards
                          </div>
                          <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                            {member.awards.filter(Boolean).map((award, idx) => (
                              <li key={`aw-${idx}`}>{award}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Honorary Degrees */}
                      {hasDegrees && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                            <Sparkles className="w-4 h-4 text-emerald-500" /> Honorary Degrees
                          </div>
                          <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                            {member.honorary_degrees.filter(Boolean).map((deg, idx) => (
                              <li key={`hd-${idx}`}>{deg}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Books Published */}
                      {hasBooks && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 text-purple-500" /> Books Published
                          </div>
                          <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                            {(member.books_authored as any[]).filter(Boolean).map((book, idx) => (
                              <li key={`bk-${idx}`}>
                                {typeof book === "string" ? (
                                  book
                                ) : book.link ? (
                                  <a
                                    href={book.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1"
                                  >
                                    {book.title}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  book.title
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Other Accolades */}
                      {hasAccolades && (
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2">
                            <Globe className="w-4 h-4 text-blue-500" /> Other Accolades
                          </div>
                          <ul className="list-disc pl-9 text-[11px] text-gray-600 space-y-1">
                            {member.other_accolades.filter(Boolean).map((acc, idx) => (
                              <li key={`oth-${idx}`}>{acc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {loadingActivity ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : jobs.length === 0 && achievements.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
                  <p className="text-sm font-semibold">No recent activity found.</p>
                  <p className="text-xs mt-1">This alumnus hasn't posted any jobs or achievements yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Job Openings posted by user */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-150 pb-2">
                      <Briefcase className="w-4 h-4 text-blue-600" /> Posted Jobs ({jobs.length})
                    </h4>
                    {jobs.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No job postings shared yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {jobs.map((job) => (
                          <div
                            key={`job-${job.id}`}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3"
                          >
                            <div>
                              <h5 className="text-xs font-bold text-gray-900">{job.role}</h5>
                              <p className="text-[11px] text-gray-500 font-semibold">{job.company}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-gray-500">
                              <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {job.job_type}
                              </span>
                              {job.salary && (
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                                  {formatSalary(job.salary)}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed pt-2 border-t border-gray-50">
                              {job.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Achievements shared by user */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-150 pb-2">
                      <Trophy className="w-4 h-4 text-amber-500" /> Shared Achievements ({achievements.length})
                    </h4>
                    {achievements.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No achievements shared yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {achievements.map((ach) => (
                          <div
                            key={`ach-${ach.id}`}
                            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3"
                          >
                            <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
                              {ach.title}
                            </h5>
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              {ach.description}
                            </p>
                            {ach.image_url && (
                              <div className="rounded-xl overflow-hidden max-h-48 border border-gray-100">
                                <img
                                  src={ach.image_url}
                                  alt={ach.title}
                                  onClick={() => setSelectedImage(ach.image_url)}
                                  className="w-full h-full object-cover cursor-zoom-in hover:opacity-95 transition-all duration-300"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none">
            <img
              src={selectedImage}
              alt="Fullscreen Achievement"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl pointer-events-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors pointer-events-auto cursor-pointer"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
