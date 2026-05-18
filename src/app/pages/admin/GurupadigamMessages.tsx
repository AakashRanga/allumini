import { useState, useEffect } from "react";
import { Send, History, Calendar, Upload, FileText, X, Trash2, Eye, Edit, Plus, Sparkles } from "lucide-react";
import {
  getGurupadigamMessages,
  createGurupadigamMessage,
  updateGurupadigamMessage,
  deleteGurupadigamMessage,
  type GurupadigamMessage,
} from "@/lib/api";
import DocumentViewer from "../../components/DocumentViewer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export default function GurupadigamMessages() {
  const [messages, setMessages] = useState<GurupadigamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_published: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  useEffect(() => {
    void fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const response = await getGurupadigamMessages();
    if (response.success) {
      setMessages(response.data || []);
    }
    setLoading(false);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setUploadedFiles(files);
  };

  const handleRemoveFile = () => {
    setUploadedFiles([]);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const response = editingId
      ? await updateGurupadigamMessage(editingId, {
          title: formData.title,
          description: formData.description,
          is_published: formData.is_published,
          attachments: uploadedFiles,
        })
      : await createGurupadigamMessage({
          title: formData.title,
          description: formData.description,
          is_published: formData.is_published,
          attachments: uploadedFiles,
        });

    if (response.success) {
      setMessage(editingId ? "Message updated successfully." : "Message created successfully.");
      setFormData({ title: "", description: "", is_published: true });
      setUploadedFiles([]);
      setShowComposer(false);
      setEditingId(null);
      void fetchMessages();
    } else {
      setError(response.error || "Unable to save message.");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    const response = await deleteGurupadigamMessage(id);
    if (response.success) {
      setMessage("Message deleted successfully.");
      void fetchMessages();
    } else {
      setError(response.error || "Unable to delete message.");
    }
  }

  function handleEdit(msg: GurupadigamMessage) {
    setFormData({
      title: msg.title,
      description: msg.description || "",
      is_published: msg.is_published === 1,
    });
    setEditingId(msg.id);
    setUploadedFiles([]);
    setShowComposer(true);
  }

  const handleOpenViewer = (messageId: number) => {
    setSelectedMessageId(messageId);
    setSelectedAttachmentIndex(0);
  };

  const handleCloseViewer = () => {
    setSelectedMessageId(null);
    setSelectedAttachmentIndex(0);
  };

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);
  const attachments = selectedMessage?.attachment_url || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <History className="w-8 h-8 text-white" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-slate-900">Communication Center</h3>
              <p className="text-slate-500 font-medium">Manage institutional broadcast and documents</p>
           </div>
        </div>
        <button
          onClick={() => {
            setFormData({ title: "", description: "", is_published: true });
            setUploadedFiles([]);
            setEditingId(null);
            setShowComposer(!showComposer);
          }}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 shadow-xl ${
            showComposer 
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
          }`}
        >
          {showComposer ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showComposer ? "Discard" : "Compose Broadcast"}
        </button>
      </div>

      {message && <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-slideIn"><Sparkles className="w-5 h-5"/>{message}</div>}
      {error && <div className="text-sm font-bold text-red-600 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-slideIn">{error}</div>}

      {showComposer && (
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl animate-scaleIn relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600" />
          
          <h2 className="text-3xl font-black text-slate-900 mb-8">
            {editingId ? "Refine Message" : "New Broadcast"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Broadcast Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="The headline of your message"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content Body</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-300 resize-none"
                  rows={8}
                  placeholder="Share the details with your alumni community..."
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Attachments & Documents</label>
              <div className="relative group">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-4 w-full p-12 border-4 border-dashed border-slate-100 rounded-[40px] hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer group"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                     <Upload className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-black text-slate-800 mb-1">Drag and Drop Files</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">PDF, PNG, JPG, PPT, DOC, XLS</span>
                  </div>
                </label>
              </div>

              {uploadedFiles.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm animate-slideIn">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{file.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="col-span-full text-center text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors pt-2"
                  >
                    Clear All Files
                  </button>
                </div>
              ) : editingId && selectedMessage?.attachment_url && selectedMessage.attachment_url.length > 0 ? (
                <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Existing Attachments</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedMessage.attachment_url.map((att, index) => (
                      <div key={index} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 shadow-sm border border-slate-200">
                        {att.name}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 mt-6 uppercase tracking-widest italic flex items-center gap-2">
                    <Sparkles className="w-3 h-3"/> New uploads will override existing files
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl w-fit">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-6 h-6 text-indigo-600 rounded-lg border-slate-200 focus:ring-indigo-500 transition-all cursor-pointer"
              />
              <label htmlFor="is_published" className="text-lg font-black text-slate-700 cursor-pointer">Live Broadcast</label>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <Send className="w-6 h-6" />
                {saving ? "Transmitting..." : editingId ? "Update Broadcast" : "Launch Broadcast"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowComposer(false);
                  setEditingId(null);
                  setUploadedFiles([]);
                }}
                className="px-10 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Grid */}
      <div className="space-y-6">
         <div className="flex items-center gap-4 ml-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Broadcast Logs</h2>
            <div className="flex-1 h-[2px] bg-slate-100" />
         </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Scanning Network...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 border-dashed">
            <Send className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No history found. Ready for your first transmission.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white border border-slate-100 rounded-[40px] p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent group-hover:via-indigo-500/40 transition-all duration-700" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{msg.title}</h3>
                      {msg.is_published === 0 && (
                        <span className="px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Draft</span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span>{msg.admin_name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleEdit(msg)}
                      className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed mb-8 text-lg font-medium line-clamp-3">{msg.description}</p>

                {msg.attachment_url && msg.attachment_url.length > 0 && (
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-all group-hover:bg-indigo-50/50 group-hover:border-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                        {msg.attachment_url.length} Document Package
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenViewer(msg.id)}
                      className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2 border border-indigo-100"
                    >
                      <Eye className="w-5 h-5" />
                      Inspect Files
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMessageId && (
        <DocumentViewer
          attachments={attachments}
          selectedIndex={selectedAttachmentIndex}
          onClose={handleCloseViewer}
          onNext={() => setSelectedAttachmentIndex(prev => prev + 1)}
          onPrev={() => setSelectedAttachmentIndex(prev => prev - 1)}
          onSelect={(idx) => setSelectedAttachmentIndex(idx)}
          baseUrl={API_BASE_URL}
        />
      )}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}