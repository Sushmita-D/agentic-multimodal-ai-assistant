import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, CheckCircle2, XCircle, HelpCircle, ChevronRight, 
  ChevronLeft, RefreshCw, Trophy, Award, Sparkles, Check, Play,
  AlertTriangle, BookOpen, ThumbsUp, ShieldCheck
} from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizCardProps {
  questions: QuizQuestion[] | string;
  onClose: () => void;
}

// Robust JSON & Markdown Quiz parser helper
function parseQuizData(input: QuizQuestion[] | string): QuizQuestion[] {
  if (!input) return [];
  
  if (Array.isArray(input)) {
    return input.map((item: any) => ({
      question: item.question || item.text || "",
      options: Array.isArray(item.options) ? item.options : [],
      answer: item.answer || item.correct_answer || item.correctAnswer || "",
      explanation: item.explanation || item.reason || "",
    })).filter(q => q.question && q.options.length > 0);
  }

  const cleanedText = input.replace(/```json|```markdown|```/g, "").trim();

  // Strategy 1: Attempt direct JSON parsing
  try {
    const parsed = JSON.parse(cleanedText);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => ({
        question: item.question || item.text || "",
        options: Array.isArray(item.options) ? item.options.map((o: any) => String(o)) : [],
        answer: String(item.answer || item.correct_answer || item.correctAnswer || ""),
        explanation: item.explanation || item.reason || "",
      })).filter(q => q.question && q.options.length > 0);
    }
  } catch (e) {
    // Silent catch, try next strategies
  }

  // Strategy 2: Extract JSON-like array blocks via Regex if nested inside prose
  try {
    const jsonArrayRegex = /\[\s*\{\s*"question"[\s\S]*\}\s*\]/;
    const match = cleanedText.match(jsonArrayRegex);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          question: item.question || item.text || "",
          options: Array.isArray(item.options) ? item.options.map((o: any) => String(o)) : [],
          answer: String(item.answer || item.correct_answer || item.correctAnswer || ""),
          explanation: item.explanation || item.reason || "",
        })).filter(q => q.question && q.options.length > 0);
      }
    }
  } catch (e) {
    // Silent catch
  }

  // Strategy 3: Backward compatible parser for markdown quizzes
  const parsedQuestions: QuizQuestion[] = [];
  const blocks = cleanedText.split(/(?=\n\s*\d+[\.\)]|\n\s*Question\s*\d+[:\.]|\n\s*\*\*?\d+[\.\)]|\n\s*\*\*?Question\s*\d+[:\.]|^Question\s*\d+[:\.]|^\s*\d+[\.\)])/i);
  
  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;
    
    let questionText = "";
    const qMatch = block.match(/^(?:(?:\*\*?)?\d+[\.\)](?:\*\*?)?|(?:\*\*?)?Question\s*\d+[:\.]?(?:\*\*?)?)\s*(.*?)(?=\n\s*[*_]?[A-D][\).:\-])/i);
    if (qMatch) {
      questionText = qMatch[1].trim();
    } else {
      const firstOptIndex = block.search(/\n\s*[*_]?[A-D][\).:\-]/i);
      if (firstOptIndex !== -1) {
        questionText = block.substring(0, firstOptIndex).replace(/^(?:(?:\*\*?)?\d+[\.\)](?:\*\*?)?|(?:\*\*?)?Question\s*\d+[:\.]?(?:\*\*?)?)\s*/i, "").trim();
      } else {
        continue;
      }
    }
    
    questionText = questionText.replace(/^\s*\*\*?|\*\*?\s*$/g, "").trim();
    if (!questionText) continue;

    const options: string[] = [];
    const optionLines = block.split("\n");
    for (const line of optionLines) {
      const optMatch = line.match(/^\s*[*_]?([A-D])[\).:\-]\s*(.*?)$/i);
      if (optMatch) {
        options.push(optMatch[2].replace(/\*\*?/g, "").trim());
      }
    }
    
    let correctAnswer = "";
    const ansMatch = block.match(/(?:Correct\s*Answer|Answer|Correct|Key|Key\s*Answer):\s*[*_]?([A-D])[\).:\-]?\s*(.*?)(?=\n|$)/i);
    if (ansMatch) {
      const letter = ansMatch[1].trim().toUpperCase();
      const textAfterLetter = ansMatch[2]?.trim();
      const letterCode = letter.charCodeAt(0) - 65;
      if (letterCode >= 0 && letterCode < options.length) {
        correctAnswer = options[letterCode];
      } else if (textAfterLetter) {
        correctAnswer = textAfterLetter;
      } else {
        correctAnswer = letter;
      }
    }
    
    let explanation = "";
    const expMatch = block.match(/(?:Explanation|Reason|Exp|Why):\s*(.*?)(?=\n\s*(?:Correct\s*Answer|Answer|Correct|Key):|\n\s*(?:\*\*?)?\d+[\.\)]|$)/is);
    if (expMatch) {
      explanation = expMatch[1].trim().replace(/\*\*?/g, "");
    }
    
    if (questionText && options.length > 0) {
      parsedQuestions.push({
        question: questionText,
        options: options.slice(0, 4),
        answer: correctAnswer || options[0],
        explanation: explanation || undefined
      });
    }
  }

  return parsedQuestions;
}

export default function QuizCard({ questions, onClose }: QuizCardProps) {
  const [questionsList, setQuestionsList] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);

  // Parse questions when component loads or prop updates
  useEffect(() => {
    const parsed = parseQuizData(questions);
    setQuestionsList(parsed);
    setCurrentIndex(0);
    setUserSelections({});
    setIsSubmitted(false);
    setShowScorecard(false);
  }, [questions]);

  // Graceful state check
  if (!questionsList || questionsList.length === 0) {
    return (
      <div 
        id="no-quiz-card"
        className="text-center py-12 bg-white/5 dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/20 dark:border-zinc-800/40 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
          <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <h3 className="font-sans font-extrabold text-xl text-slate-800 dark:text-slate-100 mb-2">No Quiz Available</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mb-6 max-w-sm mx-auto leading-relaxed">
          The AI response didn't contain a compatible quiz schema or the structure is invalid. Please request a fresh quiz generator.
        </p>
        <button 
          onClick={onClose} 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer shadow-md shadow-blue-600/10"
        >
          Return to Chat
        </button>
      </div>
    );
  }

  const activeQuestion = questionsList[currentIndex];
  const totalQuestions = questionsList.length;

  // Running calculations
  const totalAnswered = Object.keys(userSelections).length;
  
  // Calculate final counts
  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    questionsList.forEach((q, idx) => {
      const selected = userSelections[idx];
      if (selected) {
        if (selected.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    
    let rating: "Excellent" | "Good" | "Needs Improvement" = "Needs Improvement";
    if (percentage >= 90) rating = "Excellent";
    else if (percentage >= 70) rating = "Good";

    return { correct, wrong, percentage, rating };
  };

  const { correct, wrong, percentage, rating } = calculateResults();

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return; // Frozen after submitting
    setUserSelections(prev => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setShowScorecard(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserSelections({});
    setIsSubmitted(false);
    setShowScorecard(false);
  };

  return (
    <div id="quiz-workspace" className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!showScorecard ? (
          <motion.div
            key="quiz-main-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/10 dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/30 dark:border-zinc-800/50 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            {/* Ambient neon gradient strip top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100/10 dark:border-zinc-800/40">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer bg-slate-100/50 dark:bg-zinc-900 border border-slate-200/20 dark:border-zinc-850 px-3.5 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Quiz</span>
              </button>

              {/* Running metrics display */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100/5 dark:bg-zinc-900/60 border border-slate-250/15 dark:border-zinc-800 px-3 py-1.5 rounded-xl">
                  Answered: {totalAnswered} / {totalQuestions}
                </div>
                {isSubmitted && (
                  <>
                    <div className="text-[11px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Correct: {correct}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Wrong: {wrong}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Active Question Panel */}
            <div className="flex flex-col">
              {/* Progress bar */}
              <div className="w-full bg-slate-100/10 dark:bg-zinc-900/40 h-1.5 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Card Meta details */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/25 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block leading-none">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 block">
                      {isSubmitted ? "🔒 Locked Mode (Review)" : "⚡ Practice Mode"}
                    </span>
                  </div>
                </div>

                {isSubmitted && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans ${
                    userSelections[currentIndex]?.toLowerCase().trim() === activeQuestion.answer.toLowerCase().trim()
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25" 
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                  }`}>
                    {userSelections[currentIndex]?.toLowerCase().trim() === activeQuestion.answer.toLowerCase().trim() ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span>{userSelections[currentIndex]?.toLowerCase().trim() === activeQuestion.answer.toLowerCase().trim() ? "Correct" : "Incorrect"}</span>
                  </div>
                )}
              </div>

              {/* Question Statement Card */}
              <div className="bg-slate-50/5 dark:bg-zinc-900/20 border border-slate-100/5 dark:border-zinc-800/40 rounded-2xl p-5 md:p-6 mb-6">
                <h3 className="font-sans font-extrabold text-slate-900 dark:text-white text-base md:text-lg leading-relaxed">
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Question Options (4 Choices) */}
              <div className="flex flex-col gap-3 mb-6">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = userSelections[currentIndex] === option;
                  const isCorrectAnswer = option.toLowerCase().trim() === activeQuestion.answer.toLowerCase().trim();
                  
                  let optionStyles = "border-slate-200/10 dark:border-zinc-800/60 bg-white/5 dark:bg-zinc-900/20 hover:bg-white/10 dark:hover:bg-zinc-900/40 text-slate-800 dark:text-slate-300";
                  
                  if (isSelected && !isSubmitted) {
                    // Standard selection in practice mode (Blue theme)
                    optionStyles = "border-blue-500 dark:border-blue-500 bg-blue-500/10 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 ring-2 ring-blue-500/20";
                  } else if (isSubmitted) {
                    if (isCorrectAnswer) {
                      // Correct option turns GREEN
                      optionStyles = "border-emerald-500 dark:border-emerald-500 bg-emerald-500/15 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-bold";
                    } else if (isSelected) {
                      // Selected wrong option turns RED
                      optionStyles = "border-rose-500 dark:border-rose-500 bg-rose-500/15 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20";
                    } else {
                      // Other options are dimmed
                      optionStyles = "border-slate-100/5 dark:border-zinc-900/40 opacity-40 text-slate-400 dark:text-slate-600";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isSubmitted}
                      className={`group w-full flex items-center justify-between p-4 rounded-xl border text-left text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${optionStyles}`}
                    >
                      <span className="flex items-center gap-3.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0 transition-all ${
                          isSelected && !isSubmitted
                            ? "bg-blue-600 text-white"
                            : isSubmitted && isCorrectAnswer
                            ? "bg-emerald-500 text-white"
                            : isSubmitted && isSelected
                            ? "bg-rose-500 text-white"
                            : "bg-slate-100/10 dark:bg-zinc-800/60 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/20 dark:group-hover:bg-zinc-700"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </span>

                      <div className="shrink-0 pl-2">
                        {/* Radio Check Indicator */}
                        {!isSubmitted && (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? "border-blue-500 bg-blue-500/10" 
                              : "border-slate-300/30 dark:border-zinc-700 group-hover:border-slate-400/40"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                        )}
                        
                        {isSubmitted && isCorrectAnswer && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        {isSubmitted && isSelected && !isCorrectAnswer && (
                          <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanations shown only in submission mode */}
              <AnimatePresence>
                {isSubmitted && activeQuestion.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-500/5 dark:bg-zinc-900/40 border border-slate-200/10 dark:border-zinc-800/40 rounded-2xl p-4.5 mb-6 text-slate-700 dark:text-slate-300 text-xs leading-relaxed"
                  >
                    <strong className="flex items-center gap-1.5 text-slate-900 dark:text-white mb-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin-slow" />
                      <span>Lumina Explanation:</span>
                    </strong>
                    <p>{activeQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer navigation */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between pt-5 border-t border-slate-100/10 dark:border-zinc-800/40">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      currentIndex === 0
                        ? "border-slate-100/5 text-slate-300 dark:text-slate-700 cursor-not-allowed bg-transparent"
                        : "border-slate-200/20 dark:border-zinc-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer hover:bg-white/5"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === totalQuestions - 1}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      currentIndex === totalQuestions - 1
                        ? "border-slate-100/5 text-slate-300 dark:text-slate-700 cursor-not-allowed bg-transparent"
                        : "border-slate-200/20 dark:border-zinc-800 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer hover:bg-white/5"
                    }`}
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2.5 bg-slate-100/10 hover:bg-slate-100/20 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200/10 text-slate-750 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Restart Quiz
                  </button>

                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/25 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit Quiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowScorecard(true)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center gap-1"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Show Scorecard</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-score-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-10 px-6 md:px-12 text-center max-w-xl mx-auto flex flex-col items-center bg-white/10 dark:bg-zinc-950/40 backdrop-blur-xl border border-slate-200/30 dark:border-zinc-800/50 rounded-3xl shadow-2xl relative"
          >
            {/* Celebration elements */}
            {rating === "Excellent" && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl animate-pulse" />
              </div>
            )}

            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center shadow-lg mb-6 ${
              rating === "Excellent" 
                ? "bg-gradient-to-tr from-yellow-400 to-amber-500 text-white shadow-amber-500/20 animate-bounce" 
                : rating === "Good"
                ? "bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-blue-500/20"
                : "bg-gradient-to-tr from-slate-500 to-zinc-600 text-white shadow-slate-500/20"
            }`}>
              <Trophy className="w-10 h-10" />
            </div>

            <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              rating === "Excellent" 
                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" 
                : rating === "Good"
                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                : "bg-slate-400/10 text-slate-400 border border-slate-400/20"
            }`}>
              {rating}
            </span>

            <h3 className="font-sans font-black text-2xl md:text-3xl text-slate-900 dark:text-white mt-4 tracking-tight">
              {rating === "Excellent" ? "Outstanding Performance!" : rating === "Good" ? "Great Job!" : "Keep Practicing!"}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 mb-8 max-w-sm leading-relaxed">
              {rating === "Excellent" 
                ? "You've fully mastered this document content. High cognitive accuracy!" 
                : rating === "Good"
                ? "Excellent progress. You understand the foundational and complex concepts thoroughly."
                : "Review the generated study notes and attempt the quiz deck once more to boost your retention."}
            </p>

            {/* Radial score dial */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-8">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-slate-200/10 dark:stroke-zinc-800/40"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-indigo-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - percentage / 100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-mono text-slate-900 dark:text-white leading-none">
                  {percentage}%
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mt-1">
                  Correct Rate
                </span>
              </div>
            </div>

            {/* Dashboard detail strip */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8">
              <div className="bg-slate-100/5 dark:bg-zinc-900/20 border border-slate-200/10 rounded-2xl p-3.5 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Score</span>
                <span className="text-sm font-mono font-black text-slate-900 dark:text-white">{correct} / {totalQuestions}</span>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-3.5 flex flex-col items-center">
                <span className="text-[10px] text-emerald-500/80 font-medium uppercase tracking-wider mb-1">Correct</span>
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">{correct}</span>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-3.5 flex flex-col items-center">
                <span className="text-[10px] text-rose-500/80 font-medium uppercase tracking-wider mb-1">Wrong</span>
                <span className="text-sm font-mono font-black text-rose-600 dark:text-rose-400">{wrong}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={handleRestart}
                className="w-full sm:flex-1 py-3 bg-slate-100/10 hover:bg-slate-100/20 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 border border-slate-200/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restart Quiz</span>
              </button>
              <button
                onClick={() => setShowScorecard(false)}
                className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/10"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Review Answers</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
