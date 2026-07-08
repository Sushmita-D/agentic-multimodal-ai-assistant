import { Cpu } from "lucide-react";

interface TypingIndicatorProps {
  message?: string;
}

export default function TypingIndicator({ message = "Thinking" }: TypingIndicatorProps) {
  return (
    <div id="ai-typing-indicator" className="flex items-start gap-3 w-full">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/10">
        <Cpu className="w-4 h-4 animate-spin-slow" />
      </div>

      {/* Bubble */}
      <div className="bg-white dark:bg-black border border-slate-100 dark:border-zinc-900 rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">
          {message}
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
