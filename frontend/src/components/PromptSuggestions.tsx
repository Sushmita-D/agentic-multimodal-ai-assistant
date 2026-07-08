import { Sparkles } from "lucide-react";

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptSuggestions({ onSelectPrompt }: PromptSuggestionsProps) {
  const suggestions = [
    {
      text: "Summarize this document",
      desc: "Provide an executive high-level summary.",
    },
    {
      text: "What are the key takeaways?",
      desc: "Highlight 5 crucial themes of the file.",
    },
    {
      text: "Generate study study notes",
      desc: "Format dense notebook notes.",
    },
    {
      text: "Explain the complex terms used",
      desc: "Break down jargon simply.",
    },
  ];

  return (
    <div id="prompt-suggestions-container" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl mx-auto my-4">
      {suggestions.map((sug, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(sug.text)}
          className="group p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-white/40 dark:bg-black/40 hover:bg-white dark:hover:bg-zinc-900 hover:border-blue-500/30 text-left transition-all duration-300 cursor-pointer hover:shadow-sm"
        >
          <div className="flex items-center gap-1.5 font-sans font-bold text-xs text-slate-850 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{sug.text}</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed pl-5 font-sans">
            {sug.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
