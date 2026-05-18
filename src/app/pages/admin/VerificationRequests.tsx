import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Mail, Phone, GraduationCap, Calendar, Search, Filter, UserCheck, Users, Loader } from "lucide-react";
import { apiCall } from "@/lib/api";

interface VerificationRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  degree: string;
  specialization: string;
  batch: string;
  submittedDate: string;
}

interface AlumniRecord {
  id: number;
  name: string;
  email: string;
  degree: string;
  specialization: string;
  batch: string;
  roll_number: string;
}

interface MatchInfo {
  [key: number]: {
    has_match: boolean;
    matches: AlumniRecord[];
  };
}

export default function VerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [authorizedAlumni, setAuthorizedAlumni] = useState<AlumniRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<string[]>([]);
  const [degrees, setDegrees] = useState<string[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({});
  const [approveRejectLoading, setApproveRejectLoading] = useState<number | null>(null);

  // Fetch verification requests on mount
  useEffect(() => {
    fetchRequests();
    fetchFilters();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/verification/requests", "GET");
      if (response.success) {
        const actualData = response.data?.data || [];
        setRequests(actualData);
        // Check matches for each request
        actualData.forEach((req: VerificationRequest) => {
          checkMatch(req.id);
        });
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [batchesRes, degreesRes] = await Promise.all([
        apiCall("/verification/get-batches", "GET"),
        apiCall("/verification/get-degrees", "GET"),
      ]);
      
      if (batchesRes.success) {
        setBatches(batchesRes.data?.data || []);
      }
      if (degreesRes.success) {
        setDegrees(degreesRes.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const checkMatch = async (userId: number) => {
    try {
      const response = await apiCall("/verification/check-match", "POST", { user_id: userId });
      if (response.success) {
        setMatchInfo((prev) => ({
          ...prev,
          [userId]: {
            has_match: response.data?.has_match || false,
            matches: response.data?.matches || [],
          },
        }));
      }
    } catch (error) {
      console.error("Error checking match:", error);
    }
  };

  const searchAlumni = async () => {
    try {
      const response = await apiCall("/verification/search", "POST", {
        query: searchQuery,
        batch: batchFilter,
        degree: degreeFilter,
      });
      
      if (response.success) {
        setAuthorizedAlumni(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error searching alumni:", error);
    }
  };

  // Search whenever filters change
  useEffect(() => {
    searchAlumni();
  }, [searchQuery, batchFilter, degreeFilter]);

  const handleApprove = async (id: number) => {
    try {
      setApproveRejectLoading(id);
      const response = await apiCall("/verification/approve", "POST", { user_id: id });
      if (response.success) {
        setRequests(requests.filter((req) => req.id !== id));
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error approving user:", error);
    } finally {
      setApproveRejectLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setApproveRejectLoading(id);
      const response = await apiCall("/verification/reject", "POST", {
        user_id: id,
        reason: "Rejected by admin",
      });
      if (response.success) {
        setRequests(requests.filter((req) => req.id !== id));
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
    } finally {
      setApproveRejectLoading(null);
    }
  };

  const filteredAlumni = authorizedAlumni;

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Requests</h3>
          <p className="text-gray-600">Cross-verify and approve pending alumni registrations</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {requests.length} Pending
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">{/* Left Panel - Pending Requests */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
            </div>
            <p className="text-sm text-gray-600">Click on a request to cross-verify with authorized alumni database</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <Loader className="w-8 h-8 text-amber-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading verification requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending verification requests at the moment</p>
            </div>
          ) : (
            requests.map((request) => {
              const match = matchInfo[request.id];
              const isSelected = selectedRequest === request.id;
              const isProcessing = approveRejectLoading === request.id;

              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(isSelected ? null : request.id)}
                  className={`bg-white rounded-2xl p-6 border-2 hover:shadow-lg transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-400 shadow-lg ring-2 ring-purple-200"
                      : match?.has_match
                      ? "border-green-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-semibold flex-shrink-0 ${
                        match?.has_match ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{request.name}</h3>
                          <p className="text-sm text-gray-500">
                            Submitted on {new Date(request.submittedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending Review
                          </span>
                          {match?.has_match && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Match Found
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{request.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Degree:</span>
                          <span className="font-medium text-gray-900">
                            {request.degree === "UG" ? "Undergraduate" : "Postgraduate"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Batch:</span>
                          <span className="font-medium text-gray-900">{request.batch}</span>
                        </div>
                        <div className="md:col-span-2 flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Specialization:</span>
                          <span className="font-medium text-gray-900">{request.specialization}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(request.id);
                            }}
                            disabled={isProcessing}
                            className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                          >
                            {isProcessing ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            {isProcessing ? "Processing..." : "Approve"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(request.id);
                            }}
                            disabled={isProcessing}
                            className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                          >
                            {isProcessing ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                            {isProcessing ? "Processing..." : "Reject"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Panel - Authorized Alumni Database */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Authorized Alumni Database</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Search and verify student records</p>

            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or roll number..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value="all">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch} value={batch}>
                        Batch {batch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={degreeFilter}
                    onChange={(e) => setDegreeFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value="all">All Degrees</option>
                    {degrees.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree === "UG" ? "Undergraduate" : "Postgraduate"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                <span>{filteredAlumni.length} records found</span>
                {(searchQuery || batchFilter !== "all" || degreeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setBatchFilter("all");
                      setDegreeFilter("all");
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 max-h-[600px] overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {filteredAlumni.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No matching records found</p>
                </div>
              ) : (
                filteredAlumni.map((alumni) => (
                  <div
                    key={alumni.id}
                    className="p-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold flex-shrink-0 text-sm">
                        {alumni.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{alumni.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="truncate">{alumni.email}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {alumni.roll_number}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              {alumni.batch}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                              {alumni.degree}
                            </span>
                          </div>
                          <p className="text-xs">{alumni.specialization}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
