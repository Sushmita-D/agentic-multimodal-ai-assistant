import { Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="lumina-footer"
      className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20 py-6 px-6 text-center transition-colors duration-300 relative z-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shrink-0">
            <Cpu className="w-3 h-3" />
          </div>
          <span className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 leading-none">
            Lumina AI
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            v1.4.0
          </span>
        </div>

        {/* Tagline */}
        <p className="text-[10px] font-sans font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm">
          Learn Anything. Understand Everything. Agentic Multimodal Assistant.
        </p>

        {/* Technical Logs indicator */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Local AI nodes initialized</span>
        </div>
      </div>
    </footer>
  );
}
