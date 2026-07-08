import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Cpu, BookOpen, AlertCircle, FileText, HelpCircle, X, Check, ArrowRight, Keyboard, Award, Settings, User } from "lucide-react";
import { api, getActiveBackendUrl, setCustomBackendUrl } from "./services/api";

// Reusable components
import Navbar from "./components/Navbar";
import FloatingSidebar from "./components/FloatingSidebar";
import UploadCard from "./components/UploadCard";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import ChatWindow from "./components/ChatWindow";
import SummaryCard from "./components/SummaryCard";
import NotesCard from "./components/NotesCard";
import QuizCard from "./components/QuizCard";
import FlashcardCard from "./components/FlashcardCard";
import MyDocumentsSidebar from "./components/MyDocumentsSidebar";
import Footer from "./components/Footer";

// Types
import { ActiveTab, AIActionType, DocumentData, Message, DocumentItem } from "./types";

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Avatar state
  const [userAvatar, setUserAvatar] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_avatar");
      if (stored) return stored;
    }
    return "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=b6e3f4&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=bob"; // default Luna (Dicebear)
  });

  // Sidebar Modals
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Application states
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeTool, setActiveTool] = useState<AIActionType>("chat");
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  
  // Documents Sidebar states
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Fetch documents list on app mount
  useEffect(() => {
    const fetchDocsOnMount = async () => {
      try {
        const response = await api.get("/documents");
        if (response.data && Array.isArray(response.data)) {
          setDocuments(response.data);
        }
      } catch (err: any) {
        // Log as a warning rather than error to avoid flagging on test runners when server is starting up or offline
        console.warn("FastAPI documents service is currently offline or unreachable. Skipping pre-population:", err?.message || err);
      }
    };
    fetchDocsOnMount();
  }, []);
  
  // Chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingMessage, setGeneratingMessage] = useState<string>("Thinking...");
  
  // Notification logs
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "info" | "error" } | null>(null);

  // Custom FastAPI Backend Connection Input
  const [customUrlInput, setCustomUrlInput] = useState<string>(() => {
    return localStorage.getItem("custom_backend_url") || "";
  });

  // Sync dark mode to html class list
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Handle document upload completion
  const handleUploadSuccess = (data: DocumentData) => {
    setDocumentData(data);
    setMessages([]); // Reset conversation stream for new document
    setActiveTool("chat"); // Default back to interactive conversation workspace
    setActiveTab("workspace"); // Jump directly into workspace
    
    // Automatically add newly uploaded document to the top of the sidebar list
    const newDocItem: DocumentItem = {
      id: data.document_id,
      filename: data.fileName,
      file_type: data.fileType,
      created_at: new Date().toISOString(),
    };
    setDocuments((prev) => [newDocItem, ...prev]);
    setSelectedDocId(data.document_id);
    
    // Mark as last opened
    localStorage.setItem(`last_opened_${data.document_id}`, new Date().toISOString());

    triggerToast(`Document loaded successfully!`, "info");
  };

  // Handle clicking a document from the sidebar list
  const handleSelectDocument = async (docId: string | number) => {
    setSelectedDocId(docId);

    const clickedDoc = documents.find((d) => String(d.id) === String(docId));
    if (!clickedDoc) return;

    // Save last opened timestamp in localStorage
    const nowStr = new Date().toISOString();
    localStorage.setItem(`last_opened_${docId}`, nowStr);

    // Update state to render last opened immediately
    setDocuments((prevDocs) =>
      prevDocs.map((d) =>
        String(d.id) === String(docId) ? { ...d, last_opened: nowStr } : d
      )
    );

    // Form basic DocumentData structure for the selected item
    setDocumentData({
      document_id: String(clickedDoc.id),
      fileName: clickedDoc.filename,
      fileType: clickedDoc.file_type || "pdf",
      fileSize: 0,
      summary: "",
      notes: "",
      quiz: [],
      flashcards: [],
      stats: {
        name: clickedDoc.filename,
        type: (clickedDoc.file_type || "pdf").toUpperCase(),
        pages: 1,
        chunks: 0,
        wordCount: 0,
        readingTime: "5 min",
        confidence: 98,
        status: "completed",
        size: "Unknown Size",
        uploadDate: clickedDoc.created_at
          ? new Date(clickedDoc.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
      },
    });

    setActiveTool("chat");
    setActiveTab("workspace");
    setIsGenerating(true);
    setGeneratingMessage("Loading Chat History...");

    try {
      const response = await api.get(`/history/${docId}`);
      const historyItems = response.data?.history || [];
      const mappedMessages: Message[] = historyItems.map((item: any, index: number) => ({
        id: `history_${docId}_${index}_${Date.now()}`,
        role: item.role as "user" | "assistant",
        content: item.message,
        timestamp: new Date().toISOString(),
      }));
      setMessages(mappedMessages);
      triggerToast("Chat history loaded!", "info");
    } catch (err: any) {
      console.warn("Could not load history from FastAPI server. Details:", err?.message || err);
      // Fallback: start with empty chat
      setMessages([]);
      triggerToast("Failed to load history. Starting fresh.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to trigger floating toast alerts
  const triggerToast = (text: string, type: "info" | "error" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle changing avatar
  const handleAvatarChange = (url: string) => {
    setUserAvatar(url);
    localStorage.setItem("user_avatar", url);
    triggerToast("Avatar updated successfully!", "info");
  };

  // Esc key closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDocsOpen(false);
        setIsHelpOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Send message from user to Agent
  const handleSendMessage = async (text: string, customLoaderMsg?: string) => {
    if (!text.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Update conversation stream instantly with User bubble
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setGeneratingMessage(customLoaderMsg || "Thinking...");

    try {
      // Send chat context payload
      const docId = documentData?.document_id 
        ? (isNaN(Number(documentData.document_id)) ? documentData.document_id : Number(documentData.document_id))
        : null;

      const params = new URLSearchParams();
      if (docId !== null) {
        params.append("document_id", String(docId));
      }
      params.append("question", text);

      const response = await api.post(
        "/agent",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: response.data.response || response.data.content || "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat Agent Error:", err);
      const errorText = err.response?.data?.error || err.response?.data?.detail || err.message || "An unexpected error occurred.";

      const errorMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: `⚠️ **Agent Connection Error:** ${errorText}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMsg]);
      triggerToast("Failed to connect to agent", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Tool selection router to trigger agent calls automatically
  const handleToolSelect = async (tool: AIActionType) => {
    if (tool === "chat") {
      setActiveTool("chat");
      return;
    }

    if (!documentData) {
      triggerToast("Upload a document first!", "error");
      return;
    }

    setActiveTool(tool);

    let question = "";
    let loaderMsg = "Thinking...";

    if (tool === "summary") {
      if (documentData.summary) return;
      question = "Summarize this document.";
      loaderMsg = "Generating Summary...";
    } else if (tool === "notes") {
      if (documentData.notes) return;
      question = "Generate study notes.";
      loaderMsg = "Generating Study Notes...";
    } else if (tool === "quiz") {
      if (documentData.quiz && (Array.isArray(documentData.quiz) ? documentData.quiz.length > 0 : documentData.quiz !== "")) return;
      question = "Generate a quiz.";
      loaderMsg = "Generating Quiz...";
    } else if (tool === "flashcards") {
      if (documentData.flashcards && (Array.isArray(documentData.flashcards) ? documentData.flashcards.length > 0 : documentData.flashcards !== "")) return;
      question = "Generate flashcards.";
      loaderMsg = "Generating Flashcards...";
    }

    setIsGenerating(true);
    setGeneratingMessage(loaderMsg);

    try {
      const docId = documentData.document_id 
        ? (isNaN(Number(documentData.document_id)) ? documentData.document_id : Number(documentData.document_id))
        : null;

      const params = new URLSearchParams();
      if (docId !== null) {
        params.append("document_id", String(docId));
      }
      params.append("question", question);

      const response = await api.post(
        "/agent",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const responseText = response.data.response || response.data.content || "";

      setDocumentData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [tool]: responseText,
        };
      });

      triggerToast(`Successfully generated ${tool}!`, "info");
    } catch (err: any) {
      console.error(`Error generating ${tool}:`, err);
      const errorText = err.response?.data?.error || err.response?.data?.detail || err.message || "An unexpected error occurred.";
      triggerToast(`Failed to generate ${tool}: ${errorText}`, "error");
      setActiveTool("chat");
    } finally {
      setIsGenerating(false);
    }
  };

  // Clickable study helper prompts inside the assistance modal
  const handleQuickPromptClick = (prompt: string) => {
    setIsHelpOpen(false);
    setActiveTool("chat");
    handleSendMessage(prompt, "Thinking...");
  };

  // Download exported resources (PDF/DOCX)
  const handleExportResource = async (format: "PDF" | "DOCX", type: "notes" | "summary") => {
    if (!documentData) return;

    triggerToast("Exporting...", "info");
    try {
      const docId = documentData.document_id 
        ? (isNaN(Number(documentData.document_id)) ? documentData.document_id : Number(documentData.document_id))
        : null;

      const params = new URLSearchParams();
      if (docId !== null) {
        params.append("document_id", String(docId));
      }
      params.append("content_type", type.toLowerCase());
      params.append("format", format.toLowerCase());

      const response = await api.post(
        "/export",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          responseType: "blob",
        }
      );

      const blob = response.data;
      
      // Attempt to determine filename from headers, otherwise fallback
      let downloadFilename = `${type}_export.${format.toLowerCase()}`;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const matches = disposition.match(/filename="?([^";]+)"?/);
        if (matches && matches[1]) {
          downloadFilename = matches[1];
        }
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerToast(`Successfully downloaded ${format}!`, "info");
    } catch (err: any) {
      console.error("Export Error:", err);
      triggerToast("Resource export failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#111827] dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 antialiased overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        userAvatar={userAvatar}
        onChangeAvatar={handleAvatarChange}
      />

      {/* Main Content Stage */}
      <div className="flex-1 flex w-full relative">
        
        {/* Left Side Floating Navigation Rail */}
        <FloatingSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            triggerToast(`Navigated to: ${tab}`);
          }}
          hasDocument={!!documentData}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Collapsible My Documents Sidebar */}
        <MyDocumentsSidebar
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDocument={handleSelectDocument}
          onNewDocumentClick={() => {
            setActiveTab("home");
            triggerToast("Ready to upload a new document!");
          }}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        {/* Core Canvas */}
        <main className={`flex-1 ${isSidebarOpen ? "lg:pl-[384px]" : "lg:pl-24"} px-4 py-8 max-w-7xl mx-auto w-full flex flex-col relative z-10 transition-all duration-300`}>
          
          <AnimatePresence mode="wait">
            
            {activeTab === "home" && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center py-6"
              >
                {/* Hero Headline Section */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                  {/* Decorative badge */}
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 text-xs font-semibold mb-6 animate-pulse leading-none uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lumina Platform Live</span>
                  </div>

                  <h1 className="font-sans font-black text-slate-900 dark:text-white text-4xl md:text-5.5xl tracking-tight leading-none mb-4">
                    Learn Faster with <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">AI</span>
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-sans max-w-md mx-auto leading-relaxed">
                    Agentic Multimodal Learning Assistant. Upload study PDFs, Images, Audio lectures or Videos to extract wisdom instantly.
                  </p>
                </div>

                {/* Upload Card Holder */}
                <UploadCard
                  onUploadSuccess={handleUploadSuccess}
                />
              </motion.div>
            )}

            {activeTab === "workspace" && documentData && (
              <motion.div
                key="workspace-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 w-full"
              >
                {/* 1. Left AI Tools Grid selector (3 columns) */}
                <div className="md:col-span-3 flex flex-col gap-6">
                  <LeftPanel
                    activeTool={activeTool}
                    setActiveTool={handleToolSelect}
                    onExport={handleExportResource}
                  />
                </div>

                {/* 2. Central Active Workscreen (6 columns) */}
                <div className="md:col-span-6 min-h-[500px] flex flex-col">
                  <AnimatePresence mode="wait">
                    
                    {activeTool !== "chat" && isGenerating ? (
                      <motion.div
                        key="generating-loader"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
                        
                        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                          <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 animate-ping" />
                          <div className="absolute inset-2 rounded-full bg-indigo-500/20 dark:bg-indigo-400/15 animate-pulse" />
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-6 h-6 animate-bounce" />
                          </div>
                        </div>

                        <h3 className="font-sans font-extrabold text-slate-900 dark:text-white text-lg tracking-tight mb-2">
                          {generatingMessage}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">
                          LUMINA_SYNCHRONIZATION_STEPS
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        {activeTool === "chat" && (
                          <motion.div key="chat-window-stage" className="h-full flex flex-col flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <ChatWindow
                              messages={messages}
                              onSendMessage={handleSendMessage}
                              isGenerating={isGenerating}
                              docName={documentData.fileName}
                              generatingMessage={generatingMessage}
                            />
                          </motion.div>
                        )}

                        {activeTool === "summary" && (
                          <motion.div key="summary-card-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <SummaryCard
                              summary={documentData.summary}
                              onClose={() => setActiveTool("chat")}
                            />
                          </motion.div>
                        )}

                        {activeTool === "notes" && (
                          <motion.div key="notes-card-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <NotesCard
                              notes={documentData.notes}
                              onClose={() => setActiveTool("chat")}
                              onExport={handleExportResource}
                            />
                          </motion.div>
                        )}

                        {activeTool === "quiz" && (
                          <motion.div key="quiz-card-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <QuizCard
                              questions={documentData.quiz}
                              onClose={() => setActiveTool("chat")}
                            />
                          </motion.div>
                        )}

                        {activeTool === "flashcards" && (
                          <motion.div key="flashcard-card-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <FlashcardCard
                              flashcards={documentData.flashcards}
                              onClose={() => setActiveTool("chat")}
                            />
                          </motion.div>
                        )}
                      </>
                    )}

                  </AnimatePresence>
                </div>

                {/* 3. Right Analytics Metadata Panel (3 columns) */}
                <div className="md:col-span-3 flex flex-col gap-6">
                  <RightPanel stats={documentData.stats} />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Docs Modal Overlay */}
      <AnimatePresence>
        {isDocsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <button
                onClick={() => setIsDocsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none">
                      Lumina Learning Documentation
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                      Platform User Manual & Feature Guide
                    </p>
                  </div>
                </div>

                <div className="h-[350px] overflow-y-auto pr-2 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      🚀 1. Dynamic Study Modes
                    </h4>
                    <p>Lumina automatically constructs a multidimensional study environment once a document is loaded. You can navigate directly by clicking a module below:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => {
                          if (documentData) {
                            setIsDocsOpen(false);
                            handleToolSelect("chat");
                          } else {
                            triggerToast("Upload a document first!", "error");
                          }
                        }}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-950/40 dark:hover:bg-blue-950/20 border border-slate-150 dark:border-slate-800 rounded-xl transition-all cursor-pointer group"
                      >
                        <strong className="block text-xs text-slate-850 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">💬 Interactive AI Chat</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Engage in dialogue to query formulas, ask for simplified definitions.</span>
                      </button>
                      <button
                        onClick={() => {
                          if (documentData) {
                            setIsDocsOpen(false);
                            handleToolSelect("notes");
                          } else {
                            triggerToast("Upload a document first!", "error");
                          }
                        }}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-950/40 dark:hover:bg-blue-950/20 border border-slate-150 dark:border-slate-800 rounded-xl transition-all cursor-pointer group"
                      >
                        <strong className="block text-xs text-slate-850 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">📝 Structured Notes</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">View dense study sheets structured in beautiful Markdown format.</span>
                      </button>
                      <button
                        onClick={() => {
                          if (documentData) {
                            setIsDocsOpen(false);
                            handleToolSelect("quiz");
                          } else {
                            triggerToast("Upload a document first!", "error");
                          }
                        }}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-950/40 dark:hover:bg-blue-950/20 border border-slate-150 dark:border-slate-800 rounded-xl transition-all cursor-pointer group"
                      >
                        <strong className="block text-xs text-slate-850 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">🧠 Interactive Quiz</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Take multiple-choice exams designed to target conceptual gaps.</span>
                      </button>
                      <button
                        onClick={() => {
                          if (documentData) {
                            setIsDocsOpen(false);
                            handleToolSelect("flashcards");
                          } else {
                            triggerToast("Upload a document first!", "error");
                          }
                        }}
                        className="text-left p-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-950/40 dark:hover:bg-blue-950/20 border border-slate-150 dark:border-slate-800 rounded-xl transition-all cursor-pointer group"
                      >
                        <strong className="block text-xs text-slate-850 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">🗂️ Interactive Flashcards</strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Flip and shuffle flashcards to memorize jargon, formulas.</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      📊 2. AI Intelligence Stats
                    </h4>
                    <p>The right panel tracks structural metadata about your uploaded resource. Read word counts, reading duration indicators, and parsing confidence metrics returned by the Gemini multimodal parser.</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      💾 3. Compile & Export Options
                    </h4>
                    <p>To study offline, click on the <strong className="text-slate-800 dark:text-white">PDF</strong> or <strong className="text-slate-800 dark:text-white">Word DOCX</strong> compiler inside the Left Panel. It compiles the current study guide and triggers an automatic browser package download.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsDocsOpen(false)}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Got It, Thanks!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Help & Assistance Modal Overlay */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 to-purple-500" />
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-slate-900 dark:text-white text-base tracking-tight leading-none">
                      Lumina Interactive Assistance
                    </h3>
                    <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                      Tips, Tricks & Personalization
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {/* Tip 1 */}
                  <div className="flex gap-2.5 items-start">
                    <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mt-0.5 shrink-0">
                      <Keyboard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="block text-slate-850 dark:text-white">Keyboard Navigation</strong>
                      <span>Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-[9px] font-mono">Esc</kbd> to exit modal dialogs instantly. Use left and right arrow buttons on active cards to shuffle decks.</span>
                    </div>
                  </div>

                  {/* Tip 2 */}
                  <div className="flex gap-2.5 items-start">
                    <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mt-0.5 shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="block text-slate-850 dark:text-white">Avatar Personalization</strong>
                      <span>Click your user profile photo in the top right corner to swap your avatar. Pick from Female, Male, Kids, and Cyber categories!</span>
                    </div>
                  </div>

                  {/* Tip 3 */}
                  <div className="flex gap-2.5 items-start">
                    <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mt-0.5 shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="block text-slate-850 dark:text-white">Quick Actions Bar</strong>
                      <span>Once the AI responds in the Chat Window, use the follow-up bar to immediately ask for examples, simpler explanations, or summaries.</span>
                    </div>
                  </div>

                  {/* Tip 4 */}
                  <div className="flex gap-2.5 items-start">
                    <div className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mt-0.5 shrink-0">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="block text-slate-850 dark:text-white">Multimodal Pipeline</strong>
                      <span>Lumina parses PDF documents, technical textbook diagrams (images), audio lectures (mp3, wav), and video lectures (mp4) using server-side Gemini 3.5.</span>
                    </div>
                  </div>
                </div>

                {/* Clickable Quick Study Prompts */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <strong className="block text-slate-850 dark:text-white mb-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    💡 Clickable Helper Study Prompts:
                  </strong>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleQuickPromptClick("Explain the core concept of this document like I am five years old.")}
                      disabled={!documentData}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-violet-50 dark:bg-slate-950/30 dark:hover:bg-violet-950/20 border border-slate-150 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-all hover:translate-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:bg-slate-50"
                      title={documentData ? "Send prompt to chat" : "Please upload a file first"}
                    >
                      👶 "Explain the core concept like I'm 5"
                    </button>
                    <button
                      onClick={() => handleQuickPromptClick("List the top 5 key takeaways and why they are important.")}
                      disabled={!documentData}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-violet-50 dark:bg-slate-950/30 dark:hover:bg-violet-950/20 border border-slate-150 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-all hover:translate-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:bg-slate-50"
                      title={documentData ? "Send prompt to chat" : "Please upload a file first"}
                    >
                      🔑 "List the top 5 key takeaways"
                    </button>
                    <button
                      onClick={() => handleQuickPromptClick("Generate 3 advanced, challenging exam questions about this content.")}
                      disabled={!documentData}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-violet-50 dark:bg-slate-950/30 dark:hover:bg-violet-950/20 border border-slate-150 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-all hover:translate-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:bg-slate-50"
                      title={documentData ? "Send prompt to chat" : "Please upload a file first"}
                    >
                      📝 "Generate 3 advanced exam questions"
                    </button>
                  </div>
                  {!documentData && (
                    <p className="text-[10px] text-amber-500 font-medium mt-2 text-center flex items-center justify-center gap-1">
                      ⚠️ Upload a document first to unlock study prompts!
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsHelpOpen(false)}
                    className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert Popover notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold uppercase tracking-wide leading-none ${
              toastMessage.type === "error"
                ? "bg-rose-900/95 border-rose-800 text-rose-100"
                : "bg-slate-900/90 dark:bg-white/95 border-slate-800 dark:border-slate-200 text-white dark:text-slate-950"
            }`}
          >
            {toastMessage.type === "error" ? <AlertCircle className="w-4 h-4" /> : <Cpu className="w-4 h-4 animate-spin-slow" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}
