import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  ShieldCheck,
  Hourglass,
} from "lucide-react";
import { API_BASE_URL, getAlumniProfileById, type UserProfile } from "@/lib/api";
import ProfileViewModal from "@/app/components/ProfileViewModal";

interface Alumni {
  id: number;
  name: string;
  email: string;
  phone: string;
  degree: string;
  specialization: string;
  batch: string;
  status: string;
  avatar: string;
  academic_details: any;
  profile_image: string | null;
}

export default function AlumniManagement() {
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumniMember, setSelectedAlumniMember] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingAlumniId, setFetchingAlumniId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDegree, setFilterDegree] = useState("all");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/verification/all-alumni`);
      const data = await response.json();
      if (data.success) {
        setAlumniData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDegree = filterDegree === "all" || alumni.degree === filterDegree;
    return matchesSearch && matchesDegree;
  });

  const totalCount = alumniData.length;
  const verifiedCount = alumniData.filter((a) => a.status === "Verified").length;
  const pendingCount = alumniData.filter((a) => a.status !== "Verified").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Alumni Management</h3>
        <p className="text-slate-500 text-sm mt-1">Monitor, verify, and examine alumni profiles and contributions.</p>
      </div>

      {/* KPI Overview row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-purple-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl relative z-10 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Alumni</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl relative z-10 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Members</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{verifiedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:border-amber-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl relative z-10 shrink-0">
            <Hourglass className="w-6 h-6" />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Verification</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Main search and card content container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        
        {/* Search & Filter row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50/50 text-sm text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="sm:w-60 relative">
            <Filter className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterDegree}
              onChange={(e) => setFilterDegree(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-50/50 text-sm text-slate-700 transition-all appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Degrees</option>
              <option value="UG">Undergraduate</option>
              <option value="PG">Postgraduate</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dynamic content rendering */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <p className="text-slate-400 text-sm font-semibold">No alumni members found</p>
            <p className="text-xs text-slate-400 mt-1">Try modifying your query or degree selection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumni) => {
              const hasImage = !!alumni.profile_image;
              return (
                <div
                  key={alumni.id}
                  className="bg-white border border-slate-100 rounded-3xl p-5 hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Header Card */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center bg-gradient-to-tr from-purple-50 to-indigo-50 text-purple-600 font-extrabold text-lg">
                        {hasImage ? (
                          <img
                            src={`${API_BASE_URL}/profile-images/${alumni.profile_image}`}
                            alt={alumni.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          alumni.avatar
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-800 truncate text-base leading-snug group-hover:text-purple-600 transition-colors">
                          {alumni.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5 font-semibold uppercase tracking-wider font-mono">
                          {alumni.specialization || "Registered Alumni"}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {alumni.degree && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100/80 rounded-lg px-2.5 py-1">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          {alumni.degree === "UG" ? "Undergraduate" : "Postgraduate"}
                        </span>
                      )}
                      {alumni.batch && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100/80 rounded-lg px-2.5 py-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Batch {alumni.batch}
                        </span>
                      )}
                    </div>

                    {/* Contact details */}
                    <div className="space-y-2 mb-5 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2.5 text-xs text-slate-600 min-w-0">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{alumni.email}</span>
                      </div>
                      {alumni.phone && (
                        <div className="flex items-center gap-2.5 text-xs text-slate-600 min-w-0">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{alumni.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer status row */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-50 pt-4 mt-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        alumni.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {alumni.status === "Verified" ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          Pending
                        </>
                      )}
                    </span>

                    <button
                      onClick={async () => {
                        setFetchingAlumniId(alumni.id);
                        const res = await getAlumniProfileById(alumni.id);
                        if (res.success) {
                          setSelectedAlumniMember(res.data);
                          setIsModalOpen(true);
                        }
                        setFetchingAlumniId(null);
                      }}
                      disabled={fetchingAlumniId !== null}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white transition-all text-xs font-black cursor-pointer disabled:opacity-50"
                    >
                      {fetchingAlumniId === alumni.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-purple-600"></div>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Profile Viewer */}
      <ProfileViewModal
        member={selectedAlumniMember}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlumniMember(null);
        }}
      />
    </div>
  );
}
