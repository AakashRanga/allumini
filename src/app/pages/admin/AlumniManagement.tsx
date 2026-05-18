import { useEffect, useState } from "react";
import { Search, Filter, Eye, Mail, Phone, GraduationCap, Calendar, CheckCircle, Clock } from "lucide-react";

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
}

export default function AlumniManagement() {
  const [alumniData, setAlumniData] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDegree, setFilterDegree] = useState("all");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch("http://localhost:5555/verification/all-alumni");
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Alumni Management</h3>
        <p className="text-gray-600">View and manage all registered alumni</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={filterDegree}
                onChange={(e) => setFilterDegree(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Degrees</option>
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
        <div className="grid gap-4">
          {filteredAlumni.map((alumni) => (
            <div
              key={alumni.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-semibold flex-shrink-0">
                  {alumni.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{alumni.name}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {alumni.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {alumni.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          alumni.status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {alumni.status === "Verified" ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedAlumni(selectedAlumni === alumni.id ? null : alumni.id)
                        }
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {selectedAlumni === alumni.id && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-3 grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Degree:</span>
                        <span className="font-medium text-gray-900">
                          {alumni.degree === "UG" ? "Undergraduate" : "Postgraduate"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Batch:</span>
                        <span className="font-medium text-gray-900">{alumni.batch}</span>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Specialization:</span>
                        <span className="font-medium text-gray-900">{alumni.specialization}</span>
                      </div>
                      {alumni.academic_details && (
                        <div className="md:col-span-2 mt-2 pt-2 border-t border-gray-200">
                          <span className="text-gray-600 block mb-1 text-sm">Full Academic Details:</span>
                          <pre className="text-xs bg-white p-3 rounded-lg border border-gray-100 overflow-x-auto text-gray-800">
                            {(() => {
                              try {
                                return JSON.stringify(
                                  typeof alumni.academic_details === 'string' 
                                    ? JSON.parse(alumni.academic_details) 
                                    : alumni.academic_details, 
                                  null, 
                                  2
                                );
                              } catch (e) {
                                return alumni.academic_details;
                              }
                            })()}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {!loading && filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No alumni found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
