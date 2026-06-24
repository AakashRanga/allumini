import { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Search
} from "lucide-react";
import {
  getAdminDegrees,
  addAdminDegree,
  updateAdminDegree,
  deleteAdminDegree,
  type AdminDegreeMapping
} from "@/lib/api";

export default function DegreesManagement() {
  const [mappings, setMappings] = useState<AdminDegreeMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [newDegree, setNewDegree] = useState({ degree_name: "", branch_name: "" });
  const [editingMapping, setEditingMapping] = useState<AdminDegreeMapping | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchDegrees();
  }, []);

  async function fetchDegrees() {
    setLoading(true);
    setError("");
    const response = await getAdminDegrees();
    if (response.success) {
      setMappings(response.data || []);
    } else {
      setError(response.error || "Failed to load degree mappings.");
    }
    setLoading(false);
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    const degName = newDegree.degree_name.trim();
    const branchName = newDegree.branch_name.trim() || null;

    if (!degName) {
      setError("Degree name is required.");
      return;
    }

    setSubmitting(true);
    const response = await addAdminDegree({
      degree_name: degName,
      branch_name: branchName,
    });

    if (response.success) {
      setIsAddModalOpen(false);
      setNewDegree({ degree_name: "", branch_name: "" });
      void fetchDegrees();
    } else {
      setError(response.error);
    }
    setSubmitting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMapping || submitting) return;

    setError("");
    const degName = editingMapping.degree_name.trim();
    const branchName = editingMapping.branch_name?.trim() || null;

    if (!degName) {
      setError("Degree name is required.");
      return;
    }

    setSubmitting(true);
    const response = await updateAdminDegree(editingMapping.id, {
      degree_name: degName,
      branch_name: branchName,
      is_hidden: editingMapping.is_hidden,
    });

    if (response.success) {
      setIsEditModalOpen(false);
      setEditingMapping(null);
      void fetchDegrees();
    } else {
      setError(response.error);
    }
    setSubmitting(false);
  };

  const handleToggleHide = async (mapping: AdminDegreeMapping) => {
    setError("");
    const updatedHidden = mapping.is_hidden === 1 ? 0 : 1;
    const response = await updateAdminDegree(mapping.id, {
      degree_name: mapping.degree_name,
      branch_name: mapping.branch_name,
      is_hidden: updatedHidden,
    });

    if (response.success) {
      setMappings(prev =>
        prev.map(m => m.id === mapping.id ? { ...m, is_hidden: updatedHidden } : m)
      );
    } else {
      setError(response.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this degree/branch mapping? Alumni who registered with this degree will retain their record, but new registrants won't be able to select it.")) {
      return;
    }

    setError("");
    const response = await deleteAdminDegree(id);
    if (response.success) {
      setMappings(prev => prev.filter(m => m.id !== id));
    } else {
      setError(response.error);
    }
  };

  const filteredMappings = mappings.filter((m) => {
    const q = searchQuery.toLowerCase();
    const degMatch = m.degree_name.toLowerCase().includes(q);
    const branchMatch = m.branch_name ? m.branch_name.toLowerCase().includes(q) : false;
    return degMatch || branchMatch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-purple-600" />
            Degree & Branch Configuration
          </h3>
          <p className="text-gray-600">
            Configure mapped degrees and branches presented on the alumni registration form.
          </p>
        </div>
        <button
          onClick={() => {
            setError("");
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-lg shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Degree Option
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by degree name or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm outline-none"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Table view */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-4 font-semibold">Loading degree configurations...</p>
        </div>
      ) : filteredMappings.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Degree Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Specialization Branch</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMappings.map((mapping) => (
                  <tr key={mapping.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{mapping.degree_name}</span>
                    </td>
                    <td className="p-4">
                      {mapping.branch_name ? (
                        <span className="text-gray-700">{mapping.branch_name}</span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">General (No Branch Required)</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {mapping.is_hidden === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <EyeOff className="w-3.5 h-3.5" />
                          Hidden (Disabled)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <Eye className="w-3.5 h-3.5" />
                          Active (Visible)
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleHide(mapping)}
                        title={mapping.is_hidden === 1 ? "Make visible" : "Hide from registry"}
                        className={`p-1.5 rounded-lg border transition-all ${
                          mapping.is_hidden === 1
                            ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                            : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                        }`}
                      >
                        {mapping.is_hidden === 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setError("");
                          setEditingMapping({ ...mapping });
                          setIsEditModalOpen(true);
                        }}
                        title="Edit mapping details"
                        className="p-1.5 rounded-lg border bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mapping.id)}
                        title="Delete mapping"
                        className="p-1.5 rounded-lg border bg-red-50 border-red-200 text-red-600 hover:bg-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center shadow-sm">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Degree Configurations Found</h3>
          <p className="text-gray-500">No options match your search criteria.</p>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/80">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Plus className="w-5 h-5 text-purple-600" />
                Add Degree Mapping
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Degree Option Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BDS, MDS, MS, B.Tech"
                  value={newDegree.degree_name}
                  onChange={(e) => setNewDegree({ ...newDegree, degree_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Specialization Branch <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Orthodontics, General Surgery"
                  value={newDegree.branch_name}
                  onChange={(e) => setNewDegree({ ...newDegree, branch_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave branch empty if this degree doesn't require choosing a branch (like BDS).
                </p>
              </div>

              <div className="flex gap-3 pt-2 justify-center">
                {submitting ? (
                  <div className="flex justify-center items-center py-2.5 flex-1 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                    >
                      Add Option
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingMapping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/80">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <Edit2 className="w-5 h-5 text-purple-600" />
                Edit Degree Mapping
              </h4>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingMapping(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Degree Option Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BDS, MDS, MS"
                  value={editingMapping.degree_name}
                  onChange={(e) => setEditingMapping({ ...editingMapping, degree_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Specialization Branch <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Orthodontics, General Surgery"
                  value={editingMapping.branch_name || ""}
                  onChange={(e) => setEditingMapping({ ...editingMapping, branch_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-sm"
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="is_hidden_checkbox"
                  checked={editingMapping.is_hidden === 1}
                  onChange={(e) => setEditingMapping({ ...editingMapping, is_hidden: e.target.checked ? 1 : 0 })}
                  className="w-4.5 h-4.5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="is_hidden_checkbox" className="text-sm text-gray-700 select-none cursor-pointer">
                  Hide this option from registration dropdown
                </label>
              </div>

              <div className="flex gap-3 pt-2 justify-center">
                {submitting ? (
                  <div className="flex justify-center items-center py-2.5 flex-1 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingMapping(null);
                      }}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
