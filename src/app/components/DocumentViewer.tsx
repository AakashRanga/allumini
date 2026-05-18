import { X, ChevronLeft, ChevronRight, Download, FileText, ExternalLink, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
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
}
export default function DocumentViewer({
  attachments,
  selectedIndex,
  onClose,
  onNext,
  onPrev,
  onSelect,
  baseUrl
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const current = attachments[selectedIndex];
  
  if (!current) return null;
  const getFileUrl = (url: string) => `${baseUrl}/gurupadigam-attachments/${url}`;
  const isImage = (type: string) => ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(type.toLowerCase());
  const isPdf = (type: string) => type.toLowerCase() === "pdf";
  const isOffice = (type: string) => ["ppt", "pptx", "doc", "docx", "xls", "xlsx"].includes(type.toLowerCase());
  const getOfficeUrl = (url: string) => {
    // Note: This requires a public URL. For local dev, we show a professional placeholder with download.
    const fullUrl = getFileUrl(url);
    if (fullUrl.includes("localhost") || fullUrl.includes("127.0.0.1")) {
      return null; // Local URLs won't work with Office Viewer
    }
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
  };
  const officeUrl = isOffice(current.type) ? getOfficeUrl(current.url) : null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Premium Blur Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      {/* Main Container */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-scaleIn">
        
        {/* Glassmorphic Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/20 bg-white/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 truncate max-w-[200px] sm:max-w-md">
                {current.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {current.type} Document • {selectedIndex + 1} of {attachments.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={getFileUrl(current.url)}
              download={current.name}
              className="p-3 bg-white/80 text-slate-700 rounded-2xl hover:bg-white hover:text-blue-600 transition-all border border-slate-200 shadow-sm group"
              title="Download"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <button
              onClick={onClose}
              className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/20"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-50/50 flex items-center justify-center">
          
          {/* Navigation Arrows */}
          {attachments.length > 1 && (
            <>
              <button
                onClick={onPrev}
                disabled={selectedIndex === 0}
                className={`absolute left-6 z-10 p-4 rounded-full bg-white/90 backdrop-blur shadow-xl border border-white/50 transition-all ${
                  selectedIndex === 0 ? "opacity-0 cursor-default" : "hover:scale-110 hover:bg-white text-slate-800"
                }`}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={onNext}
                disabled={selectedIndex === attachments.length - 1}
                className={`absolute right-6 z-10 p-4 rounded-full bg-white/90 backdrop-blur shadow-xl border border-white/50 transition-all ${
                  selectedIndex === attachments.length - 1 ? "opacity-0 cursor-default" : "hover:scale-110 hover:bg-white text-slate-800"
                }`}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          {/* Document Renderer */}
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-10">
            {isImage(current.type) ? (
              <div className="relative group max-w-full max-h-full">
                <img
                  src={getFileUrl(current.url)}
                  alt={current.name}
                  style={{ transform: `scale(${zoom / 100})` }}
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 ease-out"
                />
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl border border-slate-200 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 hover:text-blue-600 transition-colors"><ZoomOut className="w-5 h-5"/></button>
                   <span className="text-sm font-bold text-slate-600 min-w-[3rem] text-center">{zoom}%</span>
                   <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1 hover:text-blue-600 transition-colors"><ZoomIn className="w-5 h-5"/></button>
                </div>
              </div>
            ) : isPdf(current.type) ? (
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <iframe
                  src={`${getFileUrl(current.url)}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>
            ) : isOffice(current.type) && officeUrl ? (
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <iframe
                  src={officeUrl}
                  className="w-full h-full border-none"
                  title="Office Preview"
                />
              </div>
            ) : (
              /* Premium PPT/Other Fallback Template */
              <div className="max-w-lg w-full bg-white rounded-[32px] p-10 text-center shadow-2xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                
                <div className="mb-8 relative">
                   <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                      <FileText className="w-12 h-12 text-blue-600" />
                   </div>
                   {isOffice(current.type) && (
                     <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                       OFFICE
                     </div>
                   )}
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-3">{current.name}</h4>
                <p className="text-slate-500 mb-8 leading-relaxed">
                   This {current.type.toUpperCase()} document is ready for review. Since you are in a local environment, 
                   please download the file to view it with your preferred application.
                </p>
                <div className="space-y-4">
                  <a
                    href={getFileUrl(current.url)}
                    download={current.name}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download and View
                  </a>
                  
                  <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-4">
                    <span className="w-8 h-[1px] bg-slate-200"></span>
                    Secure Transfer
                    <span className="w-8 h-[1px] bg-slate-200"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Thumbnails Footer */}
        {attachments.length > 1 && (
          <div className="px-8 py-6 border-t border-white/20 bg-white/40 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
            {attachments.map((att, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all overflow-hidden ${
                  idx === selectedIndex 
                  ? "border-blue-500 scale-110 shadow-lg ring-4 ring-blue-500/10" 
                  : "border-transparent hover:border-slate-300 opacity-60 hover:opacity-100"
                }`}
              >
                {isImage(att.type) ? (
                  <img src={getFileUrl(att.url)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-col gap-1">
                    <FileText className="w-5 h-5" />
                    {att.type.toUpperCase()}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
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
