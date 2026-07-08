import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300 text-slate-600 dark:text-slate-300 cursor-pointer focus:outline-none"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600" />
      )}
    </button>
  );
}
