import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Sparkles, FileText, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

const messagesData = [
  {
    id: 1,
    title: "Welcome to SACRED Platform",
    content: "Dear Alumni, We are delighted to welcome you to the SACRED platform. This is your space to connect, collaborate, and grow together with fellow graduates from across all batches. We encourage you to actively participate, share your experiences, and support each other in your professional journeys. Together, we can build a strong and vibrant alumni community.",
    sender: "Dean, Alumni Relations",
    date: "2026-04-15",
    important: true,
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
    title: "Annual Alumni Reunion 2026 - Save the Date",
    content: "We are excited to announce our Annual Alumni Reunion scheduled for July 20-21, 2026. This year's theme is 'Innovation & Impact.' The event will feature keynote speeches from distinguished alumni, networking sessions, campus tours, and cultural performances. Mark your calendars and we look forward to welcoming you back to campus. Registration details will be shared soon.",
    sender: "Alumni Affairs Committee",
    date: "2026-04-10",
    important: true,
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
    title: "Career Development Workshop Series",
    content: "Join us for an exclusive career development workshop series featuring industry leaders and successful alumni entrepreneurs. Topics include leadership skills, entrepreneurship, AI & emerging technologies, and work-life balance. Sessions will be held virtually on the first Saturday of each month. Register through the platform to receive calendar invites and workshop materials.",
    sender: "Career Services Office",
    date: "2026-03-25",
    important: false,
    attachments: [
      {
        type: "pdf",
        name: "Workshop Details.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pages: 1,
      },
    ],
  },
  {
    id: 4,
    title: "Alumni Mentorship Program Launch",
    content: "We are launching a new Alumni Mentorship Program to connect experienced professionals with recent graduates. If you're interested in becoming a mentor or seeking guidance, please update your profile preferences. This initiative aims to strengthen our community bonds and support career growth across generations of alumni.",
    sender: "Mentorship Coordination Team",
    date: "2026-03-15",
    important: false,
  },
];

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleOpenViewer = (messageId: number) => {
    setSelectedMessage(messageId);
    setCurrentSlide(0);
  };

  const handleCloseViewer = () => {
    setSelectedMessage(null);
    setCurrentSlide(0);
  };

  const selectedMessageData = messagesData.find((m) => m.id === selectedMessage);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-[#0A66C2]" />
          Gurupadigam Messages
        </h1>
        <p className="text-gray-600">Important messages and announcements from the institution</p>
      </div>

      <div className="space-y-4">
        {messagesData.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${message.important
              ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{message.title}</h2>
                  {message.important && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      Important
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{message.sender}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(message.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{message.content}</p>

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
                  className="px-4 py-2 bg-[#0A66C2] text-white rounded-xl hover:bg-[#004182] transition-all text-sm font-medium"
                >
                  View Attachment
                </button>
              </div>
            )}
          </div>
        ))}
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#0A66C2]" />
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
                          <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-[#0A66C2]" />
                        </button>
                      )}

                      {currentSlide < totalSlides - 1 && (
                        <button
                          onClick={handleNextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all flex items-center justify-center group"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-[#0A66C2]" />
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
                            ? "bg-[#0A66C2] w-8"
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

      {messagesData.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
          <p className="text-gray-600">You'll receive important updates and announcements here</p>
        </div>
      )}
    </div>
  );
}
