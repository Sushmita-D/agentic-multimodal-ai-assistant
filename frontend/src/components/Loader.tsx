import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

interface LoaderProps {
  message?: string;
  subMessage?: string;
}

export default function Loader({ message = "Analyzing material", subMessage }: LoaderProps) {
  const [dots, setDots] = useState("");
  const [currentTip, setCurrentTip] = useState(0);

  const learningTips = [
    "Did you know? Active recall via flashcards is 150% more effective than passive reading.",
    "Lumina is reading every paragraph of your file to generate custom, context-aware notes.",
    "Almost ready! Creating challenging quizzes to test your factual and conceptual memory.",
    "Multimodal parsing active: analyzing text layouts, audio frequencies, and visual elements.",
    "Connecting to the server. Your learning profile is updated completely locally.",
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const tipsInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length);
    }, 4000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(tipsInterval);
    };
  }, []);

  return (
    <div
      id="lumina-global-loader"
      className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-md mx-auto"
    >
      {/* Spinning Outer Ring */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-violet-500 animate-spin" />
        
        {/* Pulsing Core */}
        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="font-sans font-semibold text-lg text-slate-900 dark:text-white mb-2 tracking-tight">
        {message}
        <span className="inline-block w-6 text-left">{dots}</span>
      </h3>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-mono">
        {subMessage || "LUMINA_CORE_PARSING_ACTIVE"}
      </p>

      {/* Rotating Reassurance Card */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-4 shadow-sm backdrop-blur-sm transition-all duration-500 min-h-[70px] flex items-center justify-center">
        <p className="text-xs text-slate-600 dark:text-slate-300 italic font-sans leading-relaxed animate-fade-in">
          {learningTips[currentTip]}
        </p>
      </div>
    </div>
  );
}
