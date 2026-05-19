import { useState, useEffect } from "react";
import { Mail, Calendar, Search, BookOpen, Download, Eye, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { getNewsletters, type NewsletterItem } from "@/lib/api";
import DocumentViewer from "../../components/DocumentViewer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] = useState<NewsletterItem | null>(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  async function fetchNewsletters() {
    setLoading(true);
    const response = await getNewsletters();
    if (response.success) {
      setNewsletters(response.data || []);
    }
    setLoading(false);
  }

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesSearch =
      newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenNewsletter = (newsletter: NewsletterItem) => {
    setSelectedNewsletter(newsletter);
    setSelectedAttachmentIndex(0);
  };

  const handleCloseNewsletter = () => {
    setSelectedNewsletter(null);
    setSelectedAttachmentIndex(0);
    setViewerOpen(false);
  };

  const handleOpenViewer = () => {
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const attachments = selectedNewsletter?.attachment_url || [];
  const hasAttachments = attachments.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-700 rounded-[24px] flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">Newsletter</h3>
            <p className="text-slate-500 font-medium">Stay connected with the latest updates and announcements from your alma mater.</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search newsletters..."
            className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-sky-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Newsletter Grid */}
      {loading ? (
        <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-6" />
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading newsletters...</p>
        </div>
      ) : filteredNewsletters.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No Newsletters Found</h3>
          <p className="text-slate-500 font-medium">Check back later for new content or try a different search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredNewsletters.map((newsletter) => (
            <div
              key={newsletter.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer"
              onClick={() => handleOpenNewsletter(newsletter)}
            >
              {/* Thumbnail Image */}
              <div className="relative h-56 overflow-hidden">
                {newsletter.thumbnail ? (
                  <img
                    src={`${API_BASE_URL}/newsletter-attachments/${newsletter.thumbnail}`}
                    alt={newsletter.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
                    <Mail className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {newsletter.attachment_url && newsletter.attachment_url.length > 0 && (
                    <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-slate-900 rounded-lg text-sm font-semibold shadow-lg flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      PDF
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                      {newsletter.admin_name?.[0] || "A"}
                    </div>
                    <span className="font-medium">{newsletter.admin_name || "Admin"}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(newsletter.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {newsletter.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {newsletter.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">Read more</span>
                  <button className="px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all flex items-center gap-2 text-sm font-semibold shadow-lg shadow-sky-600/20">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Newsletter Modal */}
      {selectedNewsletter && !viewerOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 animate-fadeIn"
            onClick={handleCloseNewsletter}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-slideUp flex flex-col">
              {/* Modal Header with Thumbnail */}
              <div className="relative h-72 flex-shrink-0 overflow-hidden">
                {selectedNewsletter.thumbnail ? (
                  <img
                    src={`${API_BASE_URL}/newsletter-attachments/${selectedNewsletter.thumbnail}`}
                    alt={selectedNewsletter.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center">
                    <Mail className="w-20 h-20 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={handleCloseNewsletter}
                  className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-4xl font-black text-white mb-3 leading-tight">
                    {selectedNewsletter.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black text-white">
                        {selectedNewsletter.admin_name?.[0] || "A"}
                      </div>
                      <span className="font-medium">{selectedNewsletter.admin_name || "Admin"}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedNewsletter.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 min-h-0">
                <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                  {selectedNewsletter.description}
                </p>

                {/* Document Preview Button */}
                {hasAttachments && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="w-7 h-7 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900">
                            {attachments.length === 1 ? attachments[0].name : `${attachments.length} documents attached`}
                          </p>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            {attachments.length === 1 ? attachments[0].type.toUpperCase() : "Document Bundle"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleOpenViewer}
                        className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20"
                      >
                        <Eye className="w-5 h-5" />
                        Read Document
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 p-6 bg-slate-50 flex-shrink-0">
                <div className="flex items-center justify-end">
                  <button
                    onClick={handleCloseNewsletter}
                    className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Document Viewer Modal */}
      {selectedNewsletter && viewerOpen && (
        <DocumentViewer
          attachments={attachments}
          selectedIndex={selectedAttachmentIndex}
          onClose={handleCloseViewer}
          onNext={() => setSelectedAttachmentIndex((prev) => Math.min(prev + 1, attachments.length - 1))}
          onPrev={() => setSelectedAttachmentIndex((prev) => Math.max(prev - 1, 0))}
          onSelect={(idx) => setSelectedAttachmentIndex(idx)}
          baseUrl={API_BASE_URL}
          attachmentBasePath="newsletter-attachments"
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}