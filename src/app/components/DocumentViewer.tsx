import { X, ChevronLeft, ChevronRight, Download, FileText, Maximize2, Minimize2, ZoomIn, ZoomOut, Rows, Columns, File } from "lucide-react";
import { useState, useEffect } from "react";

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface DocumentViewerProps {
  attachments: Attachment[];
  selectedIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
  baseUrl: string;
  attachmentBasePath?: string;
}

export default function DocumentViewer({
  attachments,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
  onSelect,
  baseUrl,
  attachmentBasePath = "gurupadigam-attachments"
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageMode, setPageMode] = useState<"single" | "multiple">("single");
  const current = attachments[selectedIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onClose, onNext, onPrev]);

  useEffect(() => {
    setZoom(100);
  }, [selectedIndex]);

  if (!current) return null;

  const getFileUrl = (url: string) => `${baseUrl}/${attachmentBasePath}/${url}`;
  const isImage = (type: string) => ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(type.toLowerCase());
  const isPdf = (type: string) => type.toLowerCase() === "pdf";
  const isOffice = (type: string) => ["ppt", "pptx", "doc", "docx", "xls", "xlsx"].includes(type.toLowerCase());

  const getOfficeUrl = (url: string) => {
    const fullUrl = getFileUrl(url);
    if (fullUrl.includes("localhost") || fullUrl.includes("127.0.0.1")) {
      return null;
    }
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
  };

  const officeUrl = isOffice(current.type) ? getOfficeUrl(current.url) : null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[200] bg-slate-900 animate-fadeIn"
    : "relative w-full max-w-6xl h-[90vh] bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-scaleIn";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className={`flex items-center justify-between px-8 py-5 border-b border-white/20 ${isFullscreen ? "bg-slate-900/90 backdrop-blur" : "bg-white/40"}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isFullscreen ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold truncate max-w-[200px] sm:max-w-md ${isFullscreen ? "text-white" : "text-slate-800"}`}>
              {current.name}
            </h3>
            <p className={`text-sm font-medium uppercase tracking-wider ${isFullscreen ? "text-slate-400" : "text-slate-500"}`}>
              {current.type} Document • {selectedIndex + 1} of {attachments.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className={`flex items-center gap-1 px-3 py-2 rounded-xl ${isFullscreen ? "bg-slate-800" : "bg-white/80"} border border-slate-200`}>
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className={`p-1 rounded-lg hover:bg-slate-100 transition-colors ${isFullscreen ? "text-slate-400 hover:text-white" : "text-slate-600"}`}
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={`text-sm font-bold min-w-[3rem] text-center ${isFullscreen ? "text-white" : "text-slate-600"}`}>{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className={`p-1 rounded-lg hover:bg-slate-100 transition-colors ${isFullscreen ? "text-slate-400 hover:text-white" : "text-slate-600"}`}
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Page Mode Toggle */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-xl ${isFullscreen ? "bg-slate-800" : "bg-white/80"} border border-slate-200`}>
            <button
              onClick={() => setPageMode("single")}
              className={`p-2 rounded-lg transition-colors ${pageMode === "single" ? "bg-blue-600 text-white" : isFullscreen ? "text-slate-400 hover:text-white" : "text-slate-600 hover:bg-slate-100"}`}
              title="Single Page"
            >
              <File className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPageMode("multiple")}
              className={`p-2 rounded-lg transition-colors ${pageMode === "multiple" ? "bg-blue-600 text-white" : isFullscreen ? "text-slate-400 hover:text-white" : "text-slate-600 hover:bg-slate-100"}`}
              title="Multiple Pages"
            >
              {pageMode === "multiple" ? <Columns className="w-4 h-4" /> : <Rows className="w-4 h-4" />}
            </button>
          </div>

          {/* Download */}
          <a
            href={getFileUrl(current.url)}
            download={current.name}
            className={`p-3 rounded-2xl transition-all border ${isFullscreen ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700" : "bg-white/80 text-slate-700 hover:text-blue-600 hover:bg-white border-slate-200"}`}
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-3 rounded-2xl transition-all ${isFullscreen ? "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700" : "bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600 border border-slate-200 shadow-lg"}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className={`p-3 rounded-2xl transition-all ${isFullscreen ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-slate-800 text-white hover:bg-slate-900"}`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${isFullscreen ? "bg-slate-900" : "bg-slate-50/50"}`}>

        {/* Navigation Arrows */}
        {attachments.length > 1 && (
          <>
            <button
              onClick={onPrev}
              disabled={selectedIndex === 0}
              className={`absolute left-6 z-10 p-4 rounded-full backdrop-blur shadow-xl border transition-all ${
                selectedIndex === 0
                  ? "opacity-0 cursor-default"
                  : isFullscreen
                  ? "bg-slate-800/90 text-white hover:bg-slate-700 border-slate-700 hover:scale-110"
                  : "bg-white/90 border-white/50 hover:scale-110 hover:bg-white text-slate-800"
              }`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={onNext}
              disabled={selectedIndex === attachments.length - 1}
              className={`absolute right-6 z-10 p-4 rounded-full backdrop-blur shadow-xl border transition-all ${
                selectedIndex === attachments.length - 1
                  ? "opacity-0 cursor-default"
                  : isFullscreen
                  ? "bg-slate-800/90 text-white hover:bg-slate-700 border-slate-700 hover:scale-110"
                  : "bg-white/90 border-white/50 hover:scale-110 hover:bg-white text-slate-800"
              }`}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Document Renderer */}
        <div className={`w-full h-full flex items-center justify-center p-4 sm:p-10 ${pageMode === "multiple" ? "overflow-auto" : ""}`}>
          {isImage(current.type) ? (
            <div className="relative group max-w-full max-h-full">
              <img
                src={getFileUrl(current.url)}
                alt={current.name}
                style={{ transform: `scale(${zoom / 100})` }}
                className={`max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 ease-out ${pageMode === "multiple" ? "max-h-none" : ""}`}
              />
            </div>
          ) : isPdf(current.type) ? (
            <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white ${pageMode === "multiple" ? "h-auto min-h-[80vh]" : ""}`}>
              <iframe
                src={`${getFileUrl(current.url)}#toolbar=0&navpanes=0&scrollbar=0`}
                className={`w-full border-none ${pageMode === "multiple" ? "h-[80vh]" : "h-full"}`}
                title="PDF Preview"
              />
            </div>
          ) : isOffice(current.type) && officeUrl ? (
            <div className={`w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white ${pageMode === "multiple" ? "h-auto min-h-[80vh]" : ""}`}>
              <iframe
                src={officeUrl}
                className={`w-full border-none ${pageMode === "multiple" ? "h-[80vh]" : "h-full"}`}
                title="Office Preview"
              />
            </div>
          ) : (
            <div className={`max-w-lg w-full bg-white rounded-[32px] p-10 text-center shadow-2xl border border-slate-100 relative overflow-hidden group ${isFullscreen ? "bg-slate-800 border-slate-700" : ""}`}>
              <div className={`absolute top-0 left-0 w-full h-2 ${isFullscreen ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" : ""}`} style={!isFullscreen ? { background: "linear-gradient(to right, #3b82f6, #6366f1, #a855f7)" } : undefined} />

              <div className="mb-8 relative">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 ${isFullscreen ? "bg-slate-700" : "bg-blue-50"}`}>
                  <FileText className={`w-12 h-12 ${isFullscreen ? "text-blue-400" : "text-blue-600"}`} />
                </div>
                {isOffice(current.type) && (
                  <div className={`absolute -bottom-2 -right-2 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg ${isFullscreen ? "bg-orange-500" : ""}`} style={!isFullscreen ? { background: "#f97316" } : undefined}>
                    OFFICE
                  </div>
                )}
              </div>
              <h4 className={`text-2xl font-black mb-3 ${isFullscreen ? "text-white" : "text-slate-800"}`}>{current.name}</h4>
              <p className={`mb-8 leading-relaxed ${isFullscreen ? "text-slate-400" : "text-slate-500"}`}>
                This {current.type.toUpperCase()} document is ready for review. Since you are in a local environment,
                please download the file to view it with your preferred application.
              </p>
              <div className="space-y-4">
                <a
                  href={getFileUrl(current.url)}
                  download={current.name}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all ${isFullscreen ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/20" : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/20 hover:shadow-blue-500/40"}`}
                >
                  <Download className="w-5 h-5" />
                  Download and View
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Footer */}
      {attachments.length > 1 && (
        <div className={`px-8 py-6 border-t flex items-center justify-center gap-3 overflow-x-auto no-scrollbar ${isFullscreen ? "bg-slate-900/90 border-slate-700" : "bg-white/40 border-white/20"}`}>
          {attachments.map((att, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all overflow-hidden ${
                idx === selectedIndex
                ? "border-blue-500 scale-110 shadow-lg ring-4 ring-blue-500/10"
                : isFullscreen
                ? "border-transparent hover:border-slate-600 opacity-60 hover:opacity-100"
                : "border-transparent hover:border-slate-300 opacity-60 hover:opacity-100"
              }`}
            >
              {isImage(att.type) ? (
                <img src={getFileUrl(att.url)} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold flex-col gap-1 ${isFullscreen ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  <FileText className="w-5 h-5" />
                  {att.type.toUpperCase()}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}