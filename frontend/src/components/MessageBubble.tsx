import { motion } from "motion/react";
import { Cpu, User } from "lucide-react";
import { Message } from "../types";

interface MessageBubbleProps {
  key?: string | number;
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  // Simple, robust inline parser to format chat messages nicely with bullet points and bold headers
  const formatContent = (text: string) => {
    const paragraphs = text.split("\n");
    return paragraphs.map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return <div key={i} className="h-2" />;

      // Bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const itemText = trimmed.replace(/^[-*]\s*/, "");
        return (
          <li key={i} className="ml-4 list-disc text-xs leading-relaxed mb-1.5 text-slate-700 dark:text-slate-300">
            {parseBoldInline(itemText)}
          </li>
        );
      }

      // Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={i} className="font-sans font-bold text-xs mt-3 mb-1.5 text-slate-900 dark:text-white pb-0.5 border-b border-dashed border-slate-200 dark:border-slate-800">
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={i} className="font-sans font-extrabold text-sm mt-4 mb-2 text-slate-900 dark:text-white">
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      }

      return (
        <p key={i} className="text-xs leading-relaxed mb-2 text-slate-700 dark:text-slate-300">
          {parseBoldInline(para)}
        </p>
      );
    });
  };

  // Helper to parse **bold** words inline
  const parseBoldInline = (text: string) => {
    const pieces = text.split(/(\*\*.*?\*\*)/g);
    return pieces.map((piece, idx) => {
      if (piece.startsWith("**") && piece.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-slate-950 dark:text-white">
            {piece.slice(2, -2)}
          </strong>
        );
      }
      return piece;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 w-full max-w-full ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/10">
          <Cpu className="w-4 h-4" />
        </div>
      )}

      {/* Message Balloon */}
      <div
        className={`max-w-[82%] rounded-2xl p-4 shadow-sm border ${
          isAssistant
            ? "bg-white dark:bg-black border-slate-100 dark:border-zinc-900 text-slate-800 dark:text-slate-200"
            : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-500/10"
        }`}
      >
        {isAssistant ? (
          <div className="font-sans leading-relaxed">{formatContent(message.content)}</div>
        ) : (
          <p className="text-xs font-sans font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {/* Timestamp */}
        <span
          className={`block text-[8px] font-mono mt-2 text-right tracking-wide leading-none select-none uppercase ${
            isAssistant ? "text-slate-400" : "text-blue-100/70"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-black border border-slate-200/50 dark:border-zinc-900 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}
