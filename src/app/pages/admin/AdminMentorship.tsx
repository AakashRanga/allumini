import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Video,
  Users,
  UserCheck,
  Plus,
  Trash2,
  Check,
  X,
  BookOpen,
  Eye,
  Laptop,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  getMentorshipSessions,
  createMentorshipSession,
  getMentorshipRequests,
  approveMentorshipRequest,
  rejectMentorshipRequest,
  deleteMentorshipSession,
  type MentorshipSession,
  type MentorshipRequest,
  API_BASE_URL,
} from "@/lib/api";

export default function AdminMentorship() {
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [duration, setDuration] = useState(60);
  const [mentorshipType, setMentorshipType] = useState<"online" | "offline">("online");
  const [targetAudience, setTargetAudience] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [details, setDetails] = useState("");
  const [creating, setCreating] = useState(false);

  // Requests modal state
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingReqId, setProcessingReqId] = useState<number | null>(null);

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

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date || !venue) {
      setError("Topic, Date, and Venue are required.");
      return;
    }

    setCreating(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("venue", venue);
      formData.append("duration", String(duration));
      formData.append("mentorship_type", mentorshipType);
      formData.append("target_audience", targetAudience);
      formData.append("max_attendees", maxAttendees);
      formData.append("meeting_link", meetingLink);
      formData.append("details", details);
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const res = await createMentorshipSession(formData);
      if (res.success) {
        setMessage("Mentorship session created successfully!");
        setIsCreateOpen(false);
        // Reset form
        setTopic("");
        setDescription("");
        setDate("");
        setVenue("");
        setDuration(60);
        setMentorshipType("online");
        setTargetAudience("");
        setMaxAttendees("");
        setMeetingLink("");
        setBannerFile(null);
        setDetails("");
        fetchSessions();
      } else {
        setError(res.error || "Failed to create session");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create session due to a network error.");
    } finally {
      setCreating(false);
    }
  };

  const handleOpenRequests = async (session: MentorshipSession) => {
    setSelectedSession(session);
    setRequests([]);
    setLoadingRequests(true);
    try {
      const res = await getMentorshipRequests(session.id);
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApproveRequest = async (reqId: number) => {
    setProcessingReqId(reqId);
    try {
      const res = await approveMentorshipRequest(reqId);
      if (res.success) {
        setMessage("Mentorship request approved and mentor assigned!");
        setSelectedSession(null);
        fetchSessions();
      } else {
        setError(res.error || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      setError("Approval failed.");
    } finally {
      setProcessingReqId(null);
    }
  };

  const handleRejectRequest = async (reqId: number) => {
    setProcessingReqId(reqId);
    try {
      const res = await rejectMentorshipRequest(reqId);
      if (res.success) {
        setMessage("Mentorship request rejected.");
        if (selectedSession) {
          handleOpenRequests(selectedSession);
        }
      } else {
        setError(res.error || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      setError("Rejection failed.");
    } finally {
      setProcessingReqId(null);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this mentorship session?")) return;
    try {
      const res = await deleteMentorshipSession(sessionId);
      if (res.success) {
        setMessage("Mentorship session deleted.");
        fetchSessions();
      } else {
        setError(res.error || "Failed to delete session");
      }
    } catch (err) {
      console.error(err);
      setError("Delete failed.");
    }
  };

  const totalSessions = sessions.length;
  const openSessions = sessions.filter((s) => s.status === "open").length;
  const assignedSessions = sessions.filter((s) => s.status === "assigned").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mentorship Management</h3>
          <p className="text-slate-500 text-sm mt-1">Host mentorship events and allocate alumni mentors.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create Session
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-purple-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl relative z-10 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Topics</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalSessions}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-amber-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl relative z-10 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open Sessions</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{openSessions}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl relative z-10 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Mentors</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{assignedSessions}</p>
          </div>
        </div>
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
          <p className="text-slate-400 text-sm font-semibold">No mentorship sessions yet</p>
          <p className="text-xs text-slate-400 mt-1">Get started by creating a new mentorship topic.</p>
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
            return (
              <div
                key={session.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Banner Section */}
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

                {/* Body Content */}
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
                  </div>

                  {/* Mentor Assignment display */}
                  {session.status === "assigned" ? (
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">
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
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Assigned Mentor</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{session.mentor_name}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Status</p>
                        <p className="text-xs font-black text-amber-700">Open for invitation</p>
                      </div>
                      <button
                        onClick={() => handleOpenRequests(session)}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Requests
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3.5 flex justify-end gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-105 cursor-pointer"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900">Create Mentorship Session</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Topic / Title *</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="e.g. Advancements in Endodontics Surgery"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none h-20"
                    placeholder="Brief description about what the mentorship covers..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Venue / Platform *</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="e.g. Dental Seminar Hall A or Google Meet"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Mentorship Format</label>
                  <select
                    value={mentorshipType}
                    onChange={(e) => setMentorshipType(e.target.value as "online" | "offline")}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-purple-400 focus:outline-none cursor-pointer"
                  >
                    <option value="online">Online (Google Meet/Zoom)</option>
                    <option value="offline">Offline (In-Person)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="e.g. MDS final year, MDS Orthodontics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Max Attendees</label>
                  <input
                    type="number"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Meeting / Streaming Link (Optional)</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none"
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Realtime Mentorship Details / Prerequisites</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-purple-400 focus:outline-none h-24"
                    placeholder="Instructions, reading materials, topics to review beforehand..."
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-semibold text-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests invitation overlay */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl relative p-6 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Applicant Invitations</h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs md:max-w-md">For topic: {selectedSession.topic}</p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
              {loadingRequests ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No request invitations from alumni yet.
                </div>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.request_id}
                    className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-start gap-4 hover:border-slate-200 transition-colors"
                  >
                    <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-600 text-sm shrink-0 overflow-hidden">
                      {req.alumni_image ? (
                        <img
                          src={`${API_BASE_URL}/profile-images/${req.alumni_image}`}
                          alt={req.alumni_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        req.alumni_name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-bold text-slate-800 truncate">{req.alumni_name}</h5>
                      <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-semibold font-mono mt-0.5">{req.alumni_specialization || "Registered Alumni"}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-1">{req.alumni_email}</p>

                      <div className="flex gap-2 justify-end mt-4">
                        <button
                          onClick={() => handleRejectRequest(req.request_id)}
                          disabled={processingReqId !== null}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveRequest(req.request_id)}
                          disabled={processingReqId !== null}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Approve & Assign
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
