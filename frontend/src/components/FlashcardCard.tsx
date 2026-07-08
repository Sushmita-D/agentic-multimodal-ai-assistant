import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, ChevronLeft, ChevronRight, HelpCircle, 
  RefreshCw, Shuffle, RotateCcw, Sparkles, AlertTriangle
} from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardCardProps {
  flashcards: Flashcard[] | string;
  onClose: () => void;
}

// Robust JSON & Markdown Flashcards parser helper
function parseFlashcardData(input: Flashcard[] | string): Flashcard[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item: any) => ({
      front: item.question || item.front || item.term || item.concept || "",
      back: item.answer || item.back || item.definition || item.explanation || "",
    })).filter(c => c.front && c.back);
  }

  const cleanedText = input.replace(/```json|```markdown|```/g, "").trim();

  // Strategy 1: Attempt direct JSON parsing
  try {
    const parsed = JSON.parse(cleanedText);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => ({
        front: item.question || item.front || item.term || item.concept || "",
        back: item.answer || item.back || item.definition || item.explanation || "",
      })).filter(c => c.front && c.back);
    }
  } catch (e) {
    // Silent catch, try next strategies
  }

  // Strategy 2: Extract JSON-like array block via Regex
  try {
    const jsonArrayRegex = /\[\s*\{\s*"(?:question|front)"[\s\S]*\}\s*\]/;
    const match = cleanedText.match(jsonArrayRegex);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          front: item.question || item.front || item.term || item.concept || "",
          back: item.answer || item.back || item.definition || item.explanation || "",
        })).filter(c => c.front && c.back);
      }
    }
  } catch (e) {
    // Silent catch
  }

  // Strategy 3: Backward compatible split-line or block parser
  const parsedCards: Flashcard[] = [];
  const blocks = cleanedText.split(/(?=\n\s*\d+[\.\)]|\n\s*(?:Card|Flashcard|Concept)\s*\d+[:\.]|^Card\s*\d+[:\.]|^\s*\d+[\.\)])/i);
  
  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;

    let front = "";
    let back = "";

    const frontMatch = block.match(/(?:Concept|Front|Card|Question|Term)\s*[:\.-]?\s*(.*?)(?=\n\s*(?:Answer|Back|Definition|Explanation|Def)\s*[:\.-]|$)/is);
    if (frontMatch) {
      front = frontMatch[1].trim();
    }

    const backMatch = block.match(/(?:Answer|Back|Definition|Explanation|Def)\s*[:\.-]?\s*(.*?)(?=\n|$)/is);
    if (backMatch) {
      back = backMatch[1].trim();
    }

    if (!front || !back) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        const potentialFront = lines[0].replace(/^(?:\d+[\.\)]|Card\s*\d+[:\.]|Question:)\s*/i, "").trim();
        const potentialBack = lines.slice(1).join("\n").replace(/^(?:Answer|Back|Definition|Def):?\s*/i, "").trim();
        if (potentialFront && potentialBack && potentialFront.length < 120) {
          front = potentialFront;
          back = potentialBack;
        }
      }
    }

    front = front.replace(/^\*\*?|\*\*?$/g, "").trim();
    back = back.replace(/^\*\*?|\*\*?$/g, "").trim();

    if (front && back) {
      parsedCards.push({ front, back });
    }
  }

  // Strategy 4: Fallback markdown key-value parser (separator split)
  if (parsedCards.length === 0) {
    const lines = cleanedText.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("|---")) continue;

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const parts = trimmed.split("|").map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          parsedCards.push({ front: parts[0], back: parts[1] });
        }
        continue;
      }

      const parts = trimmed.split(/[:\-–=]/);
      if (parts.length >= 2) {
        const front = parts[0].replace(/^(?:\d+[\.\)]|[-*+•\s])\s*/, "").replace(/^\*\*?|\*\*?$/g, "").trim();
        const back = parts.slice(1).join(":").replace(/^\*\*?|\*\*?$/g, "").trim();
        if (front && back && front.length < 120 && back.length > 2) {
          parsedCards.push({ front, back });
        }
      }
    }
  }

  return parsedCards;
}

export default function FlashcardCard({ flashcards, onClose }: FlashcardCardProps) {
  const [originalDeck, setOriginalDeck] = useState<Flashcard[]>([]);
  const [activeDeck, setActiveDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize and parse data
  useEffect(() => {
    const parsed = parseFlashcardData(flashcards);
    setOriginalDeck(parsed);
    setActiveDeck([...parsed]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  // Handle empty / invalid state gracefully
  if (!activeDeck || activeDeck.length === 0) {
    return (
      <div 
        id="no-flashcards-card"
        className="text-center py-12 bg-white/5 dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/20 dark:border-zinc-800/40 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-5 border border-indigo-500/20">
          <AlertTriangle className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
        <h3 className="font-sans font-extrabold text-xl text-slate-800 dark:text-slate-100 mb-2">No Flashcards Available</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mb-6 max-w-sm mx-auto leading-relaxed">
          The AI response didn't contain a compatible flashcard schema or the structure is invalid. Please trigger a fresh deck generator.
        </p>
        <button 
          onClick={onClose} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-md shadow-indigo-600/10"
        >
          Return to Chat
        </button>
      </div>
    );
  }

  const activeCard = activeDeck[currentIndex];
  const totalCards = activeDeck.length;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1));
    }, 150);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...activeDeck].sort(() => Math.random() - 0.5);
      setActiveDeck(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  const handleRestart = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveDeck([...originalDeck]);
      setCurrentIndex(0);
    }, 150);
  };

  return (
    <motion.div
      id="flashcards-workspace"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="bg-white/10 dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/20 dark:border-zinc-800/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden w-full max-w-3xl mx-auto"
    >
      {/* Decorative colored strip at top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-violet-500" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100/10 dark:border-zinc-800/40">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer bg-slate-100/50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-850 px-3.5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Deck</span>
        </button>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/10 hover:bg-slate-100/20 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200/10 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Randomize deck order"
          >
            <Shuffle className="w-3.5 h-3.5 text-purple-400" />
            <span>Shuffle</span>
          </button>
          
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/10 hover:bg-slate-100/20 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200/10 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            title="Reset to original order"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Restart</span>
          </button>
          
          <div className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl">
            Card {currentIndex + 1} / {totalCards}
          </div>
        </div>
      </div>

      {/* Centered Large 3D Perspective Stage */}
      <div className="w-full max-w-xl mx-auto aspect-[16/10] min-h-[280px] md:min-h-[340px] perspective-1000 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            {/* Flippable card canvas container */}
            <div
              onClick={handleFlip}
              className={`relative w-full h-full duration-500 transform-style-3d cursor-pointer select-none transition-transform ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT SIDE (Question / Term) */}
              <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-200/30 dark:border-zinc-800/40 shadow-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center backface-hidden bg-white/10 dark:bg-zinc-950/50 backdrop-blur-md">
                {/* Visual glows */}
                <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-28 h-28 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

                {/* Concept Indicator Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Concept Definition</span>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center px-4 w-full overflow-y-auto custom-scrollbar">
                  <h3 className="font-sans font-extrabold text-lg md:text-2xl text-slate-900 dark:text-white leading-relaxed tracking-tight max-w-md">
                    {activeCard.front}
                  </h3>
                </div>

                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest animate-pulse flex items-center gap-1.5 mt-2">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-500 animate-spin-slow" />
                  <span>Click Card to Flip</span>
                </div>
              </div>

              {/* BACK SIDE (Answer / Explanation - Rotated 180deg) */}
              <div className="absolute inset-0 w-full h-full rounded-2xl border border-indigo-500/30 dark:border-indigo-500/20 shadow-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 overflow-hidden bg-gradient-to-tr from-zinc-950 via-slate-900 to-indigo-955 text-white">
                <div className="absolute top-4 left-4 bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                  Answer / Details
                </div>

                {/* Handles extremely long answer strings gracefully by scrolling natively */}
                <div className="flex-1 flex flex-col justify-center items-center w-full max-h-[80%] overflow-y-auto custom-scrollbar px-2 mt-4">
                  <p className="text-sm md:text-base font-sans font-semibold leading-relaxed text-slate-100 max-w-md">
                    {activeCard.back}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-indigo-300/85 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Click Card to Flip Back</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Bottom Deck Navigation Controls */}
      <div className="flex items-center justify-between max-w-sm mx-auto border-t border-slate-100/10 dark:border-zinc-800/40 pt-5">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl border border-slate-200/20 dark:border-zinc-800 hover:bg-white/5 text-slate-650 dark:text-slate-400 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-250"
          title="Previous Card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleFlip}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25 transition-all duration-250 hover:scale-[1.02] active:scale-95"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Flip Card</span>
        </button>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl border border-slate-200/20 dark:border-zinc-800 hover:bg-white/5 text-slate-650 dark:text-slate-400 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-250"
          title="Next Card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* CSS overrides to support 3D Flipping Transform perspective */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        /* Custom non-intrusive scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 99px;
        }
      `}</style>
    </motion.div>
  );
}
