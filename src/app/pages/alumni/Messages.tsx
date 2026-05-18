import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Sparkles, FileText, Eye } from "lucide-react";
import { getGurupadigamMessages, type GurupadigamMessage } from "@/lib/api";
import DocumentViewer from "../../components/DocumentViewer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555";

export default function Messages() {
  const [messages, setMessages] = useState<GurupadigamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);

  useEffect(() => {
    void fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const response = await getGurupadigamMessages();
    if (response.success) {
      setMessages(response.data);
    }
    setLoading(false);
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-blue-600" />
          </div>
          Gurupadigam Messages
        </h3>
        <p className="text-slate-500 font-medium ml-16">Important institutional updates and announcements</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Fetching insights...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 border border-slate-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Inbox is Clear</h3>
            <p className="text-slate-500 font-medium">You're all caught up with the latest institutional news.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Highlight bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent group-hover:via-blue-500/40 transition-all duration-700" />

              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">{message.title}</h2>
                    {message.is_published === 1 && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        <Sparkles className="w-3 h-3" />
                        Official
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {message.admin_name?.[0]}
                       </div>
                       <span className="font-bold text-slate-700">{message.admin_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(message.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 text-lg font-medium whitespace-pre-wrap">{message.description}</p>

              {message.attachment_url && message.attachment_url.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/30 group-hover:border-blue-100 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {message.attachment_url.length === 1 
                          ? message.attachment_url[0].name 
                          : `${message.attachment_url.length} Files Attached`}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {message.attachment_url.length === 1 
                          ? message.attachment_url[0].type 
                          : "Document Package"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenViewer(message.id)}
                    className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-black text-sm uppercase tracking-wider shadow-sm flex items-center gap-3 border border-blue-100"
                  >
                    <Eye className="w-5 h-5" />
                    View Content
                  </button>
                </div>
              )}
            </div>
          ))
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
    </div>
  );
}
