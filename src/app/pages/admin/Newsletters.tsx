import { useState, useEffect } from "react";
import { Send, History, Calendar, Upload, FileText, X, Trash2, Eye, Edit, Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import {
  getNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  type NewsletterItem,
} from "@/lib/api";
import DocumentViewer from "../../components/DocumentViewer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
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
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<number | null>(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  useEffect(() => {
    void fetchNewsletters();
  }, []);

  async function fetchNewsletters() {
    setLoading(true);
    const response = await getNewsletters();
    if (response.success) {
      setNewsletters(response.data || []);
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

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload: any = {
      title: formData.title,
      description: formData.description,
      is_published: formData.is_published,
      attachments: uploadedFiles,
      thumbnail: thumbnail,
    };

    const response = editingId
      ? await updateNewsletter(editingId, payload)
      : await createNewsletter(payload);

    if (response.success) {
      setMessage(editingId ? "Newsletter updated successfully." : "Newsletter created successfully.");
      setFormData({ title: "", description: "", is_published: true });
      setUploadedFiles([]);
      setThumbnail(null);
      setShowComposer(false);
      setEditingId(null);
      void fetchNewsletters();
    } else {
      setError(response.error || "Unable to save newsletter.");
    }

    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this newsletter?")) return;

    const response = await deleteNewsletter(id);
    if (response.success) {
      setMessage("Newsletter deleted successfully.");
      void fetchNewsletters();
    } else {
      setError(response.error || "Unable to delete newsletter.");
    }
  }

  function handleEdit(newsletter: NewsletterItem) {
    setFormData({
      title: newsletter.title,
      description: newsletter.description || "",
      is_published: newsletter.is_published === 1,
    });
    setEditingId(newsletter.id);
    setUploadedFiles([]);
    setThumbnail(null);
    setShowComposer(true);
  }

  const handleOpenViewer = (newsletterId: number) => {
    setSelectedNewsletterId(newsletterId);
    setSelectedAttachmentIndex(0);
  };

  const handleCloseViewer = () => {
    setSelectedNewsletterId(null);
    setSelectedAttachmentIndex(0);
  };

  const selectedNewsletter = newsletters.find((item) => item.id === selectedNewsletterId);
  const attachments = selectedNewsletter?.attachment_url || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-700 rounded-[24px] flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Send className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">Newsletter Studio</h3>
            <p className="text-slate-500 font-medium">Publish admin newsletters with PDF content and custom reading previews.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({ title: "", description: "", is_published: true });
            setUploadedFiles([]);
            setThumbnail(null);
            setEditingId(null);
            setShowComposer(!showComposer);
          }}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 shadow-xl ${
            showComposer
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none"
              : "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/20"
          }`}
        >
          {showComposer ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showComposer ? "Cancel" : "New Newsletter"}
        </button>
      </div>

      {message && <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-slideIn"><Sparkles className="w-5 h-5" />{message}</div>}
      {error && <div className="text-sm font-bold text-red-600 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-slideIn">{error}</div>}

      {showComposer && (
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl animate-scaleIn relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 to-blue-600" />
          <h2 className="text-3xl font-black text-slate-900 mb-8">{editingId ? "Edit Newsletter" : "Create Newsletter"}</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Newsletter Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="Headline for the newsletter"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Newsletter Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-sky-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-300 resize-none"
                  rows={8}
                  placeholder="Summary and context for the newsletter"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Newsletter Thumbnail</label>
              <div className="relative group">
                <input type="file" id="newsletter-thumbnail-upload" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                <label htmlFor="newsletter-thumbnail-upload" className="flex flex-col items-center justify-center gap-4 w-full p-8 border-4 border-dashed border-slate-100 rounded-[40px] hover:border-sky-500 hover:bg-sky-50/30 transition-all duration-500 cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-8 h-8 text-sky-600" />
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-black text-slate-800 mb-1">Choose thumbnail image</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">PNG, JPG, WEBP</span>
                  </div>
                </label>
              </div>

              {thumbnail ? (
                <div className="mt-4 flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm animate-slideIn">
                  <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{thumbnail.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(thumbnail.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button type="button" onClick={handleRemoveThumbnail} className="p-2 text-red-500 hover:text-red-700 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : editingId && selectedNewsletter?.thumbnail ? (
                <div className="mt-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Current Thumbnail</p>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-slate-200 rounded-xl overflow-hidden">
                      <img src={`${API_BASE_URL}/newsletter-attachments/${selectedNewsletter.thumbnail}`} alt="Current thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Uploading a new image will replace the current thumbnail.</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Upload Document</label>
              <div className="relative group">
                <input type="file" id="newsletter-file-upload" multiple onChange={handleFileUpload} className="hidden" />
                <label htmlFor="newsletter-file-upload" className="flex flex-col items-center justify-center gap-4 w-full p-12 border-4 border-dashed border-slate-100 rounded-[40px] hover:border-sky-500 hover:bg-sky-50/30 transition-all duration-500 cursor-pointer group">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-sky-600" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-black text-slate-800 mb-1">Choose PDF or document</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">PDF, DOC, PPT, XLS</span>
                  </div>
                </label>
              </div>

              {uploadedFiles.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-sm animate-slideIn">
                      <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-sky-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">{file.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={handleRemoveFile} className="col-span-full text-center text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors pt-2">
                    Clear All Files
                  </button>
                </div>
              ) : editingId && selectedNewsletter?.attachment_url && selectedNewsletter.attachment_url.length > 0 ? (
                <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Existing Attachments</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedNewsletter.attachment_url.map((att, index) => (
                      <div key={index} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-700 shadow-sm border border-slate-200">
                        {att.name}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-sky-400 mt-6 uppercase tracking-widest italic flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Uploading new files will replace the current attachment.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl w-fit">
              <input
                type="checkbox"
                id="newsletter-is-published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-6 h-6 text-sky-600 rounded-lg border-slate-200 focus:ring-sky-500 transition-all cursor-pointer"
              />
              <label htmlFor="newsletter-is-published" className="text-sm font-bold text-slate-700">Publish newsletter now</label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full text-center bg-sky-600 text-white uppercase font-black tracking-widest py-4 rounded-3xl hover:bg-sky-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : editingId ? "Update Newsletter" : "Publish Newsletter"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-sky-600 mx-auto mb-6"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading newsletters...</p>
          </div>
        ) : newsletters.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No newsletters yet</h3>
            <p className="text-slate-500 font-medium">Use the composer above to publish the first newsletter.</p>
          </div>
        ) : (
          newsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent transition-all duration-700" />
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">{newsletter.title}</h2>
                    {newsletter.is_published === 1 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
                        <Sparkles className="w-3 h-3" /> Published
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">{newsletter.admin_name?.[0]}</div>
                      <span>{newsletter.admin_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(newsletter.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleEdit(newsletter)}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-100 rounded-2xl text-slate-700 hover:bg-slate-200 transition-all"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(newsletter.id)}
                    className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl text-red-600 border border-red-100 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mt-6 mb-8 text-lg font-medium whitespace-pre-wrap">{newsletter.description}</p>

              {newsletter.thumbnail && (
                <div className="mb-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Thumbnail</p>
                  <div className="w-full max-w-md h-40 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={`${API_BASE_URL}/newsletter-attachments/${newsletter.thumbnail}`} alt={newsletter.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {newsletter.attachment_url && newsletter.attachment_url.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {newsletter.attachment_url.length === 1 ? newsletter.attachment_url[0].name : `${newsletter.attachment_url.length} files attached`}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {newsletter.attachment_url.length === 1 ? newsletter.attachment_url[0].type : "Document Bundle"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenViewer(newsletter.id)}
                    className="px-8 py-3 bg-white text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all duration-300 font-black text-sm uppercase tracking-wider shadow-sm border border-sky-100"
                  >
                    <Eye className="w-5 h-5" /> Preview
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedNewsletterId && (
        <DocumentViewer
          attachments={attachments}
          selectedIndex={selectedAttachmentIndex}
          onClose={handleCloseViewer}
          onNext={() => setSelectedAttachmentIndex((prev) => prev + 1)}
          onPrev={() => setSelectedAttachmentIndex((prev) => prev - 1)}
          onSelect={(idx) => setSelectedAttachmentIndex(idx)}
          baseUrl={API_BASE_URL}
          attachmentBasePath="/newsletter-attachments"
        />
      )}
    </div>
  );
}
