import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Calendar, Plus, X, Menu, FolderOpen, Clock,
  Image as ImageIcon, Music, Video, File
} from "lucide-react";
import { DocumentItem } from "../types";

interface MyDocumentsSidebarProps {
  documents: DocumentItem[];
  selectedDocId: string | number | null;
  onSelectDocument: (docId: string | number) => void;
  onNewDocumentClick: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MyDocumentsSidebar({
  documents,
  selectedDocId,
  onSelectDocument,
  onNewDocumentClick,
  isOpen,
  setIsOpen,
}: MyDocumentsSidebarProps) {
  const [lastOpenedMap, setLastOpenedMap] = useState<Record<string | number, string>>({});

  useEffect(() => {
    const map: Record<string | number, string> = {};
    documents.forEach((doc) => {
      const stored = localStorage.getItem(`last_opened_${doc.id}`);
      if (stored) {
        map[doc.id] = stored;
      }
    });
    setLastOpenedMap(map);
  }, [documents, selectedDocId]);

  const getFileIcon = (fileType: string, filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const type = fileType?.toLowerCase();
    
    if (type?.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
      return <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
    }
    if (type?.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg"].includes(ext || "")) {
      return <Music className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
    }
    if (type?.startsWith("video/") || ["mp4", "mov", "avi", "webm"].includes(ext || "")) {
      return <Video className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />;
    }
    return <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
  };

  const formatLastOpened = (isoString?: string) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return null;
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-zinc-900 shadow-2xl lg:shadow-none p-5 text-slate-900 dark:text-slate-100 relative">
      {/* Upper line accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-extrabold text-sm leading-none text-slate-900 dark:text-white">
              My Documents
            </h3>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 block">
              {documents.length} files loaded
            </span>
          </div>
        </div>

        {/* Close/Collapse toggle for tablet & desktop */}
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          title="Collapse Sidebar"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* + New Document Button */}
      <button
        id="sidebar-new-document-btn"
        onClick={onNewDocumentClick}
        className="w-full mb-5 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold transition-all duration-300 shadow-md shadow-blue-500/10 cursor-pointer hover:scale-[1.02] active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>New Document</span>
      </button>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 custom-scrollbar">
        {documents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-3 border border-slate-100 dark:border-zinc-900/60">
              <File className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">
              No documents uploaded yet.
            </p>
          </div>
        ) : (
          documents.map((doc) => {
            const isSelected = String(doc.id) === String(selectedDocId);
            const lastOpened = lastOpenedMap[doc.id] || doc.last_opened;

            return (
              <button
                key={doc.id}
                id={`sidebar-doc-item-${doc.id}`}
                onClick={() => onSelectDocument(doc.id)}
                className={`group w-full flex items-start gap-3.5 p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-blue-500/80 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm"
                    : "border-slate-100/50 dark:border-zinc-900/40 hover:border-slate-250 dark:hover:border-zinc-800 bg-white/40 dark:bg-black/40 hover:bg-white dark:hover:bg-zinc-900"
                }`}
              >
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected 
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 scale-105" 
                    : "bg-slate-50 dark:bg-zinc-900/60 text-slate-400 dark:text-slate-500 group-hover:bg-slate-100 dark:group-hover:bg-zinc-900"
                }`}>
                  {getFileIcon(doc.file_type, doc.filename)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h4 className={`font-sans font-bold text-xs truncate leading-snug ${
                    isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"
                  }`}>
                    {doc.filename}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-3 h-3" />
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString([], { month: "short", day: "numeric" }) : "Today"}
                    </span>
                    {lastOpened && (
                      <span className="flex items-center gap-0.5 text-slate-400/80 dark:text-slate-500/80">
                        <Clock className="w-3 h-3" />
                        {formatLastOpened(lastOpened)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE DRAWER Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* MOBILE & TABLET DRAWER / SIDEBAR CONTAINER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="documents-sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-45 lg:z-30 lg:left-24 lg:top-[68px] lg:bottom-0 flex flex-col"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING COLLAPSE TRIGGER BUTTON (Shown when sidebar is closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="sidebar-trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed left-4 lg:hidden top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-10 h-10 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            title="Open My Documents"
          >
            <Menu className="w-4.5 h-4.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
