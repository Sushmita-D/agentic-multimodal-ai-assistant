import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, File, Image as ImageIcon, Music, Video, AlertCircle, CheckCircle } from "lucide-react";
import { DocumentData } from "../types";
import { api } from "../services/api";

interface UploadCardProps {
  onUploadSuccess: (data: DocumentData) => void;
}

export default function UploadCard({ onUploadSuccess }: UploadCardProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    // Supported mime types
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "video/mp4",
      "video/mpeg",
    ];

    if (!validTypes.some(type => selectedFile.type === type || selectedFile.name.endsWith(".pdf"))) {
      setErrorMessage("Unsupported file type. Please upload a PDF, Image, Audio, or Video file.");
      setUploadStatus("error");
      return;
    }

    // Size limit check (max 20MB for direct Gemini processing)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setErrorMessage("File is too large (Max 20MB allowed for real-time AI processing).");
      setUploadStatus("error");
      return;
    }

    setFile(selectedFile);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    // Create preview if image
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }

    // Simulate file reading/upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          submitToServer(selectedFile);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const submitToServer = async (fileToUpload: File) => {
    setUploadStatus("processing");
    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Construct a valid DocumentData from the FastAPI response
      const uploadedDoc: DocumentData = {
        document_id: String(response.data.document_id),
        fileName: response.data.filename || fileToUpload.name,
        fileType: response.data.file_type || (fileToUpload.name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"),
        fileSize: fileToUpload.size,
        summary: "", // Will be filled dynamically by agent QA
        notes: "", // Will be filled dynamically by agent QA
        quiz: [], // Will be filled dynamically by agent QA
        flashcards: [], // Will be filled dynamically by agent QA
        stats: {
          name: response.data.filename || fileToUpload.name,
          type: (response.data.file_type || "pdf").toUpperCase(),
          pages: Math.max(1, Math.ceil((response.data.chunks || 0) / 5)),
          chunks: response.data.chunks || 0,
          wordCount: response.data.characters || 0,
          readingTime: `${Math.max(1, Math.ceil((response.data.characters || 0) / 1000))} min`,
          confidence: 98,
          status: "completed",
          size: `${(fileToUpload.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toLocaleDateString(),
        }
      };

      setUploadStatus("success");
      
      // Small success animation delay before triggering callback
      setTimeout(() => {
        onUploadSuccess(uploadedDoc);
      }, 800);
    } catch (err: any) {
      console.error("Upload Submit Error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message || "Failed to process document. Please try again.";
      setErrorMessage(errorMsg);
      setUploadStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) return <ImageIcon className="w-10 h-10 text-emerald-500 animate-pulse" />;
    if (["mp3", "wav", "m4a", "ogg"].includes(ext || "")) return <Music className="w-10 h-10 text-rose-500 animate-bounce" />;
    if (["mp4", "mov", "avi", "webm"].includes(ext || "")) return <Video className="w-10 h-10 text-purple-500 animate-pulse" />;
    return <File className="w-10 h-10 text-blue-500 animate-pulse" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative px-4">
      {/* Decorative Floating Blobs (Background) */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-400/20 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Upload Frame */}
      <div
        id="uploader-main-container"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative z-10 bg-white dark:bg-slate-900 border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 shadow-xl dark:shadow-none ${
          isDragActive
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01] ring-4 ring-blue-500/10"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-900/80"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/*,audio/*,video/*"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {uploadStatus === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center py-6"
            >
              {/* Premium Animated Icon Holder */}
              <div
                onClick={triggerFileInput}
                className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-6 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Upload className="w-7 h-7" />
              </div>

              <h3 className="font-sans font-bold text-slate-900 dark:text-white text-xl tracking-tight mb-2">
                Drag & drop learning material
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Analyze document files, beautiful imagery, lectures or video transcripts.
              </p>

              <button
                id="uploader-browse-btn"
                onClick={triggerFileInput}
                className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-medium text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Browse Files
              </button>

              {/* Supported Tech Specs */}
              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 w-full text-slate-400 dark:text-slate-500 font-mono text-[10px] tracking-wider uppercase">
                <span className="flex items-center gap-1.5"><File className="w-3.5 h-3.5" /> PDF</span>
                <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> IMAGE</span>
                <span className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> AUDIO</span>
                <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> VIDEO</span>
              </div>
            </motion.div>
          )}

          {uploadStatus === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center"
            >
              {file && getFileIcon(file.name)}
              
              <h4 className="font-sans font-semibold text-slate-800 dark:text-white mt-4 max-w-md truncate text-sm">
                Uploading: {file?.name}
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {(file && (file.size / 1024 / 1024).toFixed(2)) || "0"} MB
              </p>

              {/* Progress Bar */}
              <div className="w-64 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-6">
                <div
                  className="bg-gradient-to-r from-blue-500 to-violet-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 mt-2">
                {uploadProgress}%
              </span>
            </motion.div>
          )}

          {uploadStatus === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center"
            >
              {/* Spinning AI Core Indicator */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-violet-600 border-r-blue-500 rounded-full animate-spin" />
                <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>

              {previewUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <img
                    src={previewUrl}
                    alt="File Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <h4 className="font-sans font-bold text-slate-800 dark:text-white text-lg tracking-tight">
                AI Agent is parsing material
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mx-auto leading-relaxed">
                Scanning structure, creating quizzes, notebook notes, and dynamic flashcards...
              </p>
              
              <div className="flex items-center gap-1.5 mt-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                LUMINA_INTELLIGENCE_LAYER_STREAMING
              </div>
            </motion.div>
          )}

          {uploadStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center"
            >
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h4 className="font-sans font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Processing complete!
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Workspace is ready. Redirecting...
              </p>
            </motion.div>
          )}

          {uploadStatus === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center"
            >
              <AlertCircle className="w-14 h-14 text-rose-500 mb-4 animate-bounce" />
              <h4 className="font-sans font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Upload failed
              </h4>
              <p className="text-xs text-rose-500 dark:text-rose-400 max-w-md mx-auto mt-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/30 dark:border-rose-900/30 px-4 py-2.5 rounded-xl leading-relaxed">
                {errorMessage}
              </p>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setUploadStatus("idle")}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={triggerFileInput}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
                >
                  Choose Another File
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
