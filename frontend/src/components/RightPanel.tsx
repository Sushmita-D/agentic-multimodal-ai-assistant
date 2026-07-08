import { FileText, Cpu, BookOpen, Clock, Award, Layers } from "lucide-react";
import { DocumentStats } from "../types";

interface RightPanelProps {
  stats: DocumentStats | null;
}

export default function RightPanel({ stats }: RightPanelProps) {
  if (!stats) {
    return (
      <div
        id="right-panel-empty"
        className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
      >
        <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
        <h4 className="font-sans font-semibold text-slate-700 dark:text-slate-300 text-sm">
          No document active
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
          Upload a learning file to populate document metadata.
        </p>
      </div>
    );
  }

  return (
    <div
      id="right-panel-active"
      className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-6 flex flex-col gap-6 shadow-sm"
    >
      {/* Title */}
      <div>
        <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-tight">
          Knowledge Base
        </h3>
        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
          Metadata & AI Analytics
        </p>
      </div>

      {/* Active Document Meta Header */}
      <div className="flex items-start gap-3 bg-slate-50 dark:bg-black p-4 rounded-2xl border border-slate-100 dark:border-zinc-900">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <FileText className="w-5.5 h-5.5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-sans font-bold text-slate-800 dark:text-white text-sm truncate">
            {stats.name}
          </h4>
          <span className="inline-block mt-1 text-[9px] font-mono font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
            {stats.type} • {stats.size}
          </span>
        </div>
      </div>

      {/* Grid of Micro Statistics Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pages or Chapters */}
        <div className="bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
            <Layers className="w-3 h-3 text-slate-500" /> Pages
          </span>
          <span className="font-sans font-extrabold text-base text-slate-900 dark:text-white">
            {stats.pages}
          </span>
        </div>

        {/* Semantic Chunks */}
        <div className="bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
            <Layers className="w-3 h-3 text-slate-500" /> AI Chunks
          </span>
          <span className="font-sans font-extrabold text-base text-slate-900 dark:text-white">
            {stats.chunks}
          </span>
        </div>

        {/* Word Count */}
        <div className="bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
            <Layers className="w-3 h-3 text-slate-500" /> Words
          </span>
          <span className="font-sans font-extrabold text-base text-slate-900 dark:text-white">
            {stats.wordCount.toLocaleString()}
          </span>
        </div>

        {/* Reading Time */}
        <div className="bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-slate-500" /> Reading
          </span>
          <span className="font-sans font-extrabold text-base text-slate-900 dark:text-white">
            {stats.readingTime}
          </span>
        </div>
      </div>

      {/* AI Parsing Progress Bar */}
      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-500" /> Parser status
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {stats.status === "completed" ? "Completed" : "Processing"}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
            style={{ width: stats.status === "completed" ? "100%" : "70%" }}
          />
        </div>
      </div>

      {/* AI Confidence Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" /> Confidence Score
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {stats.confidence}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full"
            style={{ width: `${stats.confidence}%` }}
          />
        </div>
      </div>

      {/* Static Info Footer Card */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none justify-center">
        <span>Uploaded on {stats.uploadDate}</span>
      </div>
    </div>
  );
}
