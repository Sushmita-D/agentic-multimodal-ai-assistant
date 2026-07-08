import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Cpu, Sparkles, AlertCircle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import PromptSuggestions from "./PromptSuggestions";
import { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  docName?: string;
  generatingMessage?: string;
}

export default function ChatWindow({ messages, onSendMessage, isGenerating, docName, generatingMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const [showVoiceBanner, setShowVoiceBanner] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleVoicePlaceholder = () => {
    setShowVoiceBanner(true);
    setTimeout(() => setShowVoiceBanner(false), 3000);
  };

  const lastMessage = messages[messages.length - 1];
  const showQuickActions = lastMessage && lastMessage.role === "assistant" && !isGenerating;

  const quickActions = [
    { label: "🔍 Explain this concept", prompt: "Can you explain the main concept in your last response in simpler terms with a brief summary?" },
    { label: "💡 Provide examples", prompt: "Can you provide concrete, real-world examples of the concepts you just described?" },
    { label: "📝 Summarize response", prompt: "Can you summarize the response you just gave in 3 short, highly-scannable bullet points?" },
    { label: "🧠 Test me on this", prompt: "Based on your last answer, please ask me a challenging practice question to test my understanding." },
  ];

  return (
    <div
      id="lumina-chat-window"
      className="flex flex-col h-full bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200/50 dark:border-zinc-900 rounded-3xl overflow-hidden relative shadow-sm"
    >
      {/* Active doc header */}
      {docName && (
        <div className="bg-slate-50/80 dark:bg-black border-b border-slate-100 dark:border-zinc-900 px-5 py-3 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider truncate">
            ACTIVE WORKSPACE: {docName.toUpperCase()}
          </span>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 flex flex-col justify-between">
        {messages.length === 0 ? (
          /* Blank / Empty State */
          <div className="my-auto flex flex-col items-center text-center max-w-lg mx-auto py-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/10 mb-6">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight leading-none">
              Lumina AI Agent
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 max-w-sm leading-relaxed">
              Learn anything. Understand everything. Ask questions, explore code equations, or request detailed summaries.
            </p>

            {/* Quick Suggestions Cards */}
            <div className="w-full mt-8">
              <PromptSuggestions onSelectPrompt={(p) => onSendMessage(p)} />
            </div>
          </div>
        ) : (
          /* Chat Bubbles List */
          <div className="space-y-5 w-full flex-1">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing status dots */}
            {isGenerating && <TypingIndicator message={generatingMessage} />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Voice Placeholder Toast */}
      {showVoiceBanner && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 text-[10px] py-1.5 px-3.5 rounded-xl border border-slate-800 dark:border-slate-200 font-mono tracking-wide shadow-lg uppercase leading-none animate-bounce">
          🎙️ VOICE RECALL MODULE ACTIVE
        </div>
      )}

      {/* Floating Entry Input Panel + Quick Actions Bar */}
      <div className="p-4 bg-transparent border-t border-slate-100 dark:border-slate-850/60 flex flex-col gap-3">
        {/* Quick Follow-up Action Chips Bar */}
        {showQuickActions && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
            <span className="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-spin-slow" /> Follow Up:
            </span>
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(action.prompt)}
                className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-black hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 text-[10.5px] font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xs"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="relative bg-white dark:bg-black border border-slate-200/80 dark:border-zinc-900 rounded-2xl p-2.5 flex items-center gap-2 shadow-sm focus-within:shadow-md focus-within:border-slate-300 dark:focus-within:border-zinc-800 transition-all duration-300"
        >
          {/* Vocal Dictate Trigger */}
          <button
            type="button"
            onClick={handleVoicePlaceholder}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-all duration-200 shrink-0"
            title="Dictate with voice"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isGenerating}
            placeholder={isGenerating ? "Agent is typing..." : "Ask Lumina a question..."}
            className="flex-1 bg-transparent border-none text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 py-1.5"
          />

          {/* Send Action */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isGenerating}
            className={`p-2 rounded-xl flex items-center justify-center shrink-0 transition-all duration-250 cursor-pointer ${
              inputValue.trim() && !isGenerating
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95"
                : "text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-900/40 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
