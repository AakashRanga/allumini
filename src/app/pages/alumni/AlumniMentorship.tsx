import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Video,
  Laptop,
  CheckCircle,
  Hourglass,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  UserCheck,
} from "lucide-react";
import {
  getMentorshipSessions,
  requestMentorship,
  type MentorshipSession,
  API_BASE_URL,
} from "@/lib/api";

export default function AlumniMentorship() {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [requestingSessionId, setRequestingSessionId] = useState<number | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await getMentorshipSessions();
      if (res.success) {
        setSessions(res.data);
      } else {
        setError(res.error || "Failed to load mentorship sessions");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (sessionId: number) => {
    setRequestingSessionId(sessionId);
    setError("");
    setMessage("");
    try {
      const res = await requestMentorship(sessionId);
      if (res.success) {
        setMessage("Request to mentor submitted successfully! Pending admin approval.");
        fetchSessions();
      } else {
        setError(res.error || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error while submitting request.");
    } finally {
      setRequestingSessionId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header section */}
      <div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mentorship Hub</h3>
        <p className="text-slate-500 text-sm mt-1">
          Explore upcoming sessions, apply to be a mentor, and review assigned sessions.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
          {error}
        </div>
      )}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-2xl">
          {message}
        </div>
      )}

      {/* Main Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
          <p className="text-slate-400 text-sm font-semibold">No mentorship sessions scheduled</p>
          <p className="text-xs text-slate-400 mt-1">Check back later for new mentorship opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const hasBanner = !!session.banner_image;
            const parsedDate = new Date(session.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const isAssignedToMe = session.mentor_id !== null && session.user_request_status === "approved";
            const isRequestPending = session.user_request_status === "pending";
            const isRequestRejected = session.user_request_status === "rejected";

            return (
              <div
                key={session.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner Header */}
                <div className="relative h-40 bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white p-4">
                  {hasBanner ? (
                    <img
                      src={`${API_BASE_URL}/mentorship-banners/${session.banner_image}`}
                      alt={session.topic}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 opacity-90" />
                  )}
                  <div className="relative z-10 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white border border-white/10 mb-2">
                      {session.mentorship_type === "online" ? (
                        <>
                          <Laptop className="w-3 h-3" /> Online
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" /> Offline
                        </>
                      )}
                    </span>
                    <h4 className="font-extrabold text-lg line-clamp-2 text-white drop-shadow-md">
                      {session.topic}
                    </h4>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4 flex-1">
                  {session.description && (
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  )}

                  <div className="space-y-2.5 border-t border-slate-50 pt-3.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{parsedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{session.venue}</span>
                    </div>
                    {session.target_audience && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{session.target_audience}</span>
                      </div>
                    )}
                    {session.max_attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Max {session.max_attendees} student slots</span>
                      </div>
                    )}
                  </div>

                  {/* Realtime assignments & details block */}
                  {isAssignedToMe ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        Assigned To You
                      </div>
                      
                      {session.meeting_link && (
                        <div className="text-xs pt-1 border-t border-emerald-100">
                          <p className="font-bold text-slate-400 text-[9px] uppercase tracking-wider mb-1">Session Link</p>
                          <a
                            href={session.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-semibold flex items-center gap-1 min-w-0"
                          >
                            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{session.meeting_link}</span>
                          </a>
                        </div>
                      )}

                      {session.details && (
                        <div className="text-xs pt-1 border-t border-emerald-100">
                          <p className="font-bold text-slate-400 text-[9px] uppercase tracking-wider mb-1">Prerequisites / Details</p>
                          <p className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">{session.details}</p>
                        </div>
                      )}
                    </div>
                  ) : session.mentor_id !== null ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {session.mentor_image ? (
                          <img
                            src={`${API_BASE_URL}/profile-images/${session.mentor_image}`}
                            alt={session.mentor_name || "Mentor"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "M"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" /> Assigned Mentor
                        </p>
                        <p className="text-xs font-bold text-slate-800 truncate mt-0.5">{session.mentor_name}</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Footer Apply action button */}
                {session.mentor_id === null && (
                  <div className="bg-slate-50 border-t border-slate-100 px-5 py-4 flex items-center justify-end shrink-0">
                    {isRequestPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-wider">
                        <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        Application Pending
                      </span>
                    ) : isRequestRejected ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider">
                        Application Rejected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(session.id)}
                        disabled={requestingSessionId !== null}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-black uppercase tracking-wider transition-all hover:shadow-md cursor-pointer"
                      >
                        {requestingSessionId === session.id ? "Submitting..." : "Apply as Mentor"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
