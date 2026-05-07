import { useState, useEffect } from "react";
import { Send, History, Users, Calendar, Upload, FileText, X, ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";

const messageHistory = [
  {
    id: 1,
    title: "Welcome Message 2026",
    content: "Dear Alumni, We are delighted to welcome you to the SACRED platform...",
    sentDate: "2026-01-15",
    recipients: 1248,
    attachments: [
      {
        type: "pdf",
        name: "Welcome Guide.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pages: 1,
      },
    ],
  },
  {
    id: 2,
    title: "Annual Reunion Announcement",
    content: "We are excited to announce our annual alumni reunion scheduled for March 2026...",
    sentDate: "2026-02-20",
    recipients: 1180,
    attachments: [
      {
        type: "ppt",
        name: "Reunion Schedule.pptx",
        slides: [
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=675&fit=crop",
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=675&fit=crop",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=675&fit=crop",
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=675&fit=crop",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Career Development Workshop",
    content: "Join us for an exclusive career development workshop featuring industry leaders...",
    sentDate: "2026-03-10",
    recipients: 892,
    attachments: [
      {
        type: "pdf",
        name: "Workshop Details.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pages: 1,
      },
    ],
  },
];

export default function GurupadigamMessages() {
  const [showComposer, setShowComposer] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ title: "", content: "" });
    setUploadedFile(null);
    setShowComposer(false);
  };

  const handleOpenViewer = (messageId: number) => {
    setSelectedMessage(messageId);
    setCurrentSlide(0);
  };

  const handleCloseViewer = () => {
    setSelectedMessage(null);
    setCurrentSlide(0);
  };

  const selectedMessageData = messageHistory.find((m) => m.id === selectedMessage);
  const attachment = selectedMessageData?.attachments?.[0];
  const totalSlides = attachment?.type === "ppt" ? attachment.slides.length : attachment?.pages || 1;

  const handleNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMessage || !attachment) return;

      if (e.key === "Escape") {
        handleCloseViewer();
      } else if (e.key === "ArrowLeft" && attachment.type === "ppt") {
        handlePrevSlide();
      } else if (e.key === "ArrowRight" && attachment.type === "ppt") {
        handleNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMessage, currentSlide, attachment]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gurupadigam Messages</h1>
          <p className="text-gray-600">Send important messages and announcements to all alumni</p>
        </div>
        <button
          onClick={() => setShowComposer(!showComposer)}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        >
          <Send className="w-5 h-5" />
          Compose Message
        </button>
      </div>

      {showComposer && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">New Gurupadigam Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={8}
                placeholder="Write your message to alumni..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">This message will be sent to all verified alumni via email and platform notification.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Upload PDF, PPT, or Document</span>
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-medium mb-1">Recipients</p>
                  <p className="text-sm text-blue-800">This message will be sent to <span className="font-semibold">1,248 verified alumni</span></p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send to All Alumni
              </button>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Message History</h2>
        </div>

        <div className="space-y-4">
          {messageHistory.map((message) => (
            <div
              key={message.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{message.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(message.sentDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{message.content}</p>

              <div className="flex items-center gap-2 text-sm mb-4 pb-4 border-b border-gray-200">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Sent to <span className="font-medium text-gray-900">{message.recipients} alumni</span>
                </span>
              </div>

              {message.attachments && message.attachments.length > 0 && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{message.attachments[0].name}</p>
                    <p className="text-xs text-gray-500">
                      {message.attachments[0].type === "ppt"
                        ? `${message.attachments[0].slides.length} slides`
                        : `${message.attachments[0].pages} page${message.attachments[0].pages > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenViewer(message.id)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-sm font-medium"
                  >
                    View Attachment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedMessage && attachment && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={handleCloseViewer}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-slideInRight">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{attachment.name}</h3>
                      <p className="text-sm text-gray-500">
                        {attachment.type === "ppt" ? "Presentation" : "PDF Document"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseViewer}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 relative bg-gray-100 overflow-hidden">
                  {attachment.type === "pdf" ? (
                    <iframe
                      src={attachment.url}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <img
                        src={attachment.slides[currentSlide]}
                        alt={`Slide ${currentSlide + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg animate-fadeIn"
                      />
                    </div>
                  )}

                  {attachment.type === "ppt" && (
                    <>
                      {currentSlide > 0 && (
                        <button
                          onClick={handlePrevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all flex items-center justify-center group"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-purple-600" />
                        </button>
                      )}

                      {currentSlide < totalSlides - 1 && (
                        <button
                          onClick={handleNextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all flex items-center justify-center group"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-purple-600" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {attachment.type === "ppt" ? (
                      <span>
                        Slide {currentSlide + 1} of {totalSlides}
                      </span>
                    ) : (
                      <span>PDF Document</span>
                    )}
                  </div>

                  {attachment.type === "ppt" && totalSlides > 1 && (
                    <div className="flex gap-2">
                      {attachment.slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                            ? "bg-purple-600 w-8"
                            : "bg-gray-300 hover:bg-gray-400"
                            }`}
                        />
                      ))}
                    </div>
                  )}

                  <a
                    href={attachment.type === "pdf" ? attachment.url : attachment.slides[currentSlide]}
                    download
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
