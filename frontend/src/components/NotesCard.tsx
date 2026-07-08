import { motion } from "motion/react";
import { ArrowLeft, Copy, Check, BookOpen, Download } from "lucide-react";
import { useState } from "react";

interface NotesCardProps {
  notes: string;
  onClose: () => void;
  onExport: (format: "PDF" | "DOCX", type: "notes") => void;
}

export default function NotesCard({ notes, onClose, onExport }: NotesCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, ultra-robust inline Markdown renderer for study notes
  const renderNotebookContent = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Check for Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={index} className="font-sans font-bold text-slate-900 dark:text-white text-base mt-5 mb-2 flex items-center gap-1.5 border-b border-dashed border-slate-200 dark:border-slate-800 pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={index} className="font-sans font-bold text-slate-900 dark:text-white text-lg mt-6 mb-3 leading-tight border-b-2 border-slate-200 dark:border-slate-800 pb-1">
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={index} className="font-sans font-black text-slate-900 dark:text-white text-xl mt-8 mb-4 tracking-tight">
            {trimmed.replace(/^#\s*/, "")}
          </h2>
        );
      }

      // Check for bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const text = trimmed.replace(/^[-*]\s*/, "");
        // Basic bold parsing inside bullet
        return (
          <li key={index} className="ml-5 list-disc text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
            {parseBoldText(text)}
          </li>
        );
      }

      // Numbered lists
      if (/^\d+\./.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s*/, "");
        const num = trimmed.match(/^\d+/)?.[0] || "1";
        return (
          <div key={index} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300 mb-2 leading-relaxed ml-5">
            <span className="font-mono font-bold text-blue-500">{num}.</span>
            <div>{parseBoldText(text)}</div>
          </div>
        );
      }

      // Code blocks or equation lines
      if (trimmed.startsWith("```")) {
        return null; // Ignore tag lines
      }

      if (line.includes("  ") && (trimmed.startsWith("const") || trimmed.startsWith("let") || trimmed.startsWith("function") || trimmed.includes("="))) {
        return (
          <div key={index} className="bg-slate-100 dark:bg-slate-950 font-mono text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 my-1 max-w-full overflow-x-auto text-blue-600 dark:text-blue-400 pl-4">
            {line}
          </div>
        );
      }

      // Empty line
      if (trimmed === "") {
        return <div key={index} className="h-3" />;
      }

      // Standard text line
      return (
        <p key={index} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans mb-3 pl-1">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  // Basic markdown regex bold **text** -> JSX bold elements helper
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      id="notes-card-viewer"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative"
    >
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

      {/* Header controls */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chat</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Export PDF */}
          <button
            onClick={() => onExport("PDF", "notes")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200"
            title="Download PDF Study Guide"
          >
            <Download className="w-3 h-3" />
            <span>PDF</span>
          </button>
          
          {/* Export DOCX */}
          <button
            onClick={() => onExport("DOCX", "notes")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all duration-200"
            title="Download MS Word DOCX"
          >
            <Download className="w-3 h-3" />
            <span>DOCX</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
            title="Copy Notes"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Title & Spiral Binding Design */}
      <div className="relative flex items-center gap-3 mb-8">
        {/* Metal spiral wire visual on the left (Super artistic and beautiful!) */}
        <div className="absolute -left-10 top-0 bottom-0 w-4 flex flex-col justify-around pointer-events-none gap-2 py-4 select-none">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-4.5 h-2 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm" />
              <div className="w-2 h-1 bg-slate-200 dark:bg-slate-900 -ml-1 border-y border-slate-300 dark:border-slate-700" />
            </div>
          ))}
        </div>

        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400 ml-1">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
            Comprehensive Study Notes
          </h3>
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            LUMINA_NOTEBOOK_PARSER_ACTIVE
          </p>
        </div>
      </div>

      {/* Notebook-styled content space */}
      <div
        id="physical-notebook-content-wrapper"
        className="relative bg-[#FAF9F5] dark:bg-[#131926] border border-amber-100 dark:border-slate-800/80 rounded-2xl p-8 shadow-inner overflow-hidden min-h-[350px]"
        style={{
          backgroundImage: "linear-gradient(#E8E7E3 1px, transparent 1px)",
          backgroundSize: "100% 28px",
          lineHeight: "28px",
        }}
      >
        {/* Vertical Notebook Pink Margin Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-rose-400/40 dark:bg-rose-500/20 mr-4" />

        {/* Notes list parsed */}
        <div className="pl-4 font-sans text-slate-800 dark:text-slate-300 relative z-10 leading-[28px]">
          {renderNotebookContent(notes)}
        </div>
      </div>
    </motion.div>
  );
}
