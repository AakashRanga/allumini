import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Mail, Phone, GraduationCap, Calendar, Search, Filter, UserCheck, Users } from "lucide-react";

const pendingRequests = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex.t@email.com",
    phone: "+1 234 567 8905",
    degree: "UG",
    specialization: "Electrical Engineering",
    batch: "2024",
    submittedDate: "2026-04-25",
  },
  {
    id: 2,
    name: "Sophia Martinez",
    email: "sophia.m@email.com",
    phone: "+1 234 567 8906",
    degree: "PG",
    specialization: "Artificial Intelligence",
    batch: "2023",
    submittedDate: "2026-04-26",
  },
  {
    id: 3,
    name: "David Kim",
    email: "david.k@email.com",
    phone: "+1 234 567 8907",
    degree: "UG",
    specialization: "Civil Engineering",
    batch: "2022",
    submittedDate: "2026-04-27",
  },
];

const authorizedAlumni = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@college.edu",
    degree: "UG",
    specialization: "Computer Science",
    batch: "2020",
    rollNumber: "20CS001",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@college.edu",
    degree: "PG",
    specialization: "Data Science",
    batch: "2021",
    rollNumber: "21DS001",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@college.edu",
    degree: "UG",
    specialization: "Mechanical Engineering",
    batch: "2022",
    rollNumber: "22ME001",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.w@college.edu",
    degree: "PG",
    specialization: "Business Analytics",
    batch: "2023",
    rollNumber: "23BA001",
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.t@college.edu",
    degree: "UG",
    specialization: "Electrical Engineering",
    batch: "2024",
    rollNumber: "24EE001",
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya.s@college.edu",
    degree: "UG",
    specialization: "Computer Science",
    batch: "2020",
    rollNumber: "20CS002",
  },
  {
    id: 7,
    name: "Robert Martinez",
    email: "robert.m@college.edu",
    degree: "PG",
    specialization: "Artificial Intelligence",
    batch: "2023",
    rollNumber: "23AI001",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    email: "sophia.m@college.edu",
    degree: "PG",
    specialization: "Artificial Intelligence",
    batch: "2023",
    rollNumber: "23AI002",
  },
];

export default function VerificationRequests() {
  const [requests, setRequests] = useState(pendingRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
    setSelectedRequest(null);
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id));
    setSelectedRequest(null);
  };

  const filteredAlumni = authorizedAlumni.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = batchFilter === "all" || alumni.batch === batchFilter;
    const matchesDegree = degreeFilter === "all" || alumni.degree === degreeFilter;
    return matchesSearch && matchesBatch && matchesDegree;
  });

  const findMatchingAlumni = (request: typeof pendingRequests[0]) => {
    return authorizedAlumni.find(
      (alumni) =>
        alumni.name.toLowerCase() === request.name.toLowerCase() &&
        alumni.batch === request.batch &&
        alumni.specialization === request.specialization
    );
  };

  const batches = Array.from(new Set(authorizedAlumni.map((a) => a.batch))).sort();
  const degrees = Array.from(new Set(authorizedAlumni.map((a) => a.degree)));

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

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending verification requests at the moment</p>
            </div>
          ) : (
            requests.map((request) => {
              const matchingAlumni = findMatchingAlumni(request);
              const isSelected = selectedRequest === request.id;

              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(isSelected ? null : request.id)}
                  className={`bg-white rounded-2xl p-6 border-2 hover:shadow-lg transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-400 shadow-lg ring-2 ring-purple-200"
                      : matchingAlumni
                      ? "border-green-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-semibold flex-shrink-0 ${
                      matchingAlumni ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
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
                          {matchingAlumni && (
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
                            className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(request.id);
                            }}
                            className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
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
              {filteredAlumni.map((alumni) => (
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
                            {alumni.rollNumber}
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
              ))}
            </div>

            {filteredAlumni.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-gray-500">No matching records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
