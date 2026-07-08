import { motion } from "motion/react";
import { Sparkles, Copy, Check, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface SummaryCardProps {
  summary: string;
  onClose: () => void;
}

export default function SummaryCard({ summary, onClose }: SummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      id="summary-card-viewer"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden"
    >
      {/* Decorative Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chat</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
            title="Copy Summary"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
            Executive Summary
          </h3>
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            LUMINA_AI_SUMMARY_COMPILATION
          </p>
        </div>
      </div>

      {/* Summary Content Body */}
      <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl p-6 mb-4 min-h-[220px]">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
          {summary}
        </p>
      </div>

      {/* Bottom Insights */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-500/5 to-violet-500/5 dark:from-blue-500/10 dark:to-violet-500/10 border border-blue-500/10 rounded-2xl">
        <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
        <span className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">
          Key themes, terms, and statistical insights have been auto-extracted and organized in your study notes.
        </span>
      </div>
    </motion.div>
  );
}
