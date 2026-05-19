from pathlib import Path
content = '''import { useState, useEffect } from "react";
import { Mail, Calendar, Search, Eye, BookOpen } from "lucide-react";
import { getNewsletters, type NewsletterItem } from "@/lib/api";
import DocumentViewer from "../../components/DocumentViewer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<number | null>(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    void fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    setLoading(true);
    const response = await getNewsletters();
    if (response.success) {
      setNewsletters(response.data || []);
    }
    setLoading(false);
  };

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const query = searchQuery.toLowerCase();
    return (
      newsletter.title.toLowerCase().includes(query) ||
      (newsletter.description || "").toLowerCase().includes(query) ||
      newsletter.admin_name.toLowerCase().includes(query)
    );
  });

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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-[24px] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">Newsletters</h3>
            <p className="text-slate-500 font-medium">Browse the latest admin newsletters and open PDF reading previews.</p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Search newsletters</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 pl-12 pr-5 py-4 rounded-3xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading newsletters...</p>
        </div>
      ) : filteredNewsletters.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No newsletters found</h3>
          <p className="text-slate-500 font-medium">Try another search or check back later for the latest updates.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNewsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transition-all duration-700" />
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{newsletter.title}</h2>
                    {newsletter.is_published === 1 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        Published
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black">{newsletter.admin_name?.[0] || "A"}</span>
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
                <button
                  onClick={() => handleOpenViewer(newsletter.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-3xl bg-white text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
              </div>

              <p className="mt-6 text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">{newsletter.description}</p>

              {newsletter.attachment_url && newsletter.attachment_url.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{newsletter.attachment_url.length === 1 ? newsletter.attachment_url[0].name : `${newsletter.attachment_url.length} documents attached`}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{newsletter.attachment_url.length === 1 ? newsletter.attachment_url[0].type : "Document Bundle"}</p>
                    </div>
                  </div>
                  <span className="inline-flex px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest">Ready to read</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedNewsletterId && (
        <DocumentViewer
          attachments={attachments}
          selectedIndex={selectedAttachmentIndex}
          onClose={handleCloseViewer}
          onNext={() => setSelectedAttachmentIndex((prev) => prev + 1)}
          onPrev={() => setSelectedAttachmentIndex((prev) => prev - 1)}
          onSelect={(idx) => setSelectedAttachmentIndex(idx)}
          baseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}
'''
Path('src/app/pages/alumni/Newsletter.tsx').write_text(content, encoding='utf-8')
print('Newsletter page rewritten')
