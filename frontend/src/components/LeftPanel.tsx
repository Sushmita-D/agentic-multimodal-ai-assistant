import { FileText, BookOpen, HelpCircle, LayoutGrid, Download, ArrowRight } from "lucide-react";
import { AIActionType } from "../types";

interface LeftPanelProps {
  activeTool: AIActionType;
  setActiveTool: (tool: AIActionType) => void;
  onExport: (format: "PDF" | "DOCX", type: "notes" | "summary") => void;
}

export default function LeftPanel({ activeTool, setActiveTool, onExport }: LeftPanelProps) {
  const tools = [
    {
      id: "chat" as AIActionType,
      title: "Interactive AI Chat",
      description: "Ask questions, explore formulas, and query document specifics.",
      icon: BookOpen,
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      id: "summary" as AIActionType,
      title: "Executive Summary",
      description: "Read a dense, high-level structural summary of your material.",
      icon: FileText,
      colorClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
      id: "notes" as AIActionType,
      title: "Notebook Notes",
      description: "Review beautifully formatted structured markdown study notes.",
      icon: LayoutGrid,
      colorClass: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },
    {
      id: "quiz" as AIActionType,
      title: "Interactive Quiz",
      description: "Test your learning comprehension with challenging MCQs.",
      icon: HelpCircle,
      colorClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      id: "flashcards" as AIActionType,
      title: "Dynamic Flashcards",
      description: "Flip visual cards to memorize terms, formulas, and concepts.",
      icon: HelpCircle,
      colorClass: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    },
  ];

  return (
    <div
      id="left-tools-panel"
      className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200/50 dark:border-zinc-900 rounded-3xl p-6 flex flex-col gap-5 shadow-sm"
    >
      <div>
        <h3 className="font-sans font-bold text-slate-900 dark:text-white text-base leading-tight">
          AI Study Tools
        </h3>
        <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
          Select learning modality
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="flex flex-col gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              id={`tool-card-${tool.id}`}
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`group flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "border-blue-500/80 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm"
                  : "border-slate-100 dark:border-zinc-900/50 hover:border-slate-200 dark:hover:border-zinc-800 bg-white/40 dark:bg-black/40 hover:bg-white dark:hover:bg-zinc-900"
              }`}
            >
              <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${tool.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`font-sans font-bold text-xs leading-snug flex items-center gap-1 ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"
                }`}>
                  <span>{tool.title}</span>
                  {isActive && <ArrowRight className="w-3.5 h-3.5" />}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-[1px] bg-slate-100 dark:bg-zinc-900 my-1" />

      {/* Quick Export Panel Card */}
      <div className="bg-slate-50/50 dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-2xl p-4">
        <h4 className="font-sans font-bold text-xs text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5 leading-none">
          <Download className="w-3.5 h-3.5" /> Export Resources
        </h4>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3">
          Download compile packages for offline review.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onExport("PDF", "notes")}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900 cursor-pointer transition-all duration-200 leading-none"
          >
            <span>PDF File</span>
          </button>
          <button
            onClick={() => onExport("DOCX", "notes")}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900 cursor-pointer transition-all duration-200 leading-none"
          >
            <span>Word DOCX</span>
          </button>
        </div>
      </div>
    </div>
  );
}
