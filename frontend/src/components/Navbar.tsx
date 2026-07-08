import { useState } from "react";
import { Cpu, Github, Check, Sparkles, User, Smile } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  userAvatar: string;
  onChangeAvatar: (avatarUrl: string) => void;
}

const AVATAR_OPTIONS = [
  {
    category: "Female",
    label: "👩 Female Avatar",
    items: [
      { name: "Luna", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=b6e3f4&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=bob" },
      { name: "Emma", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=bun" },
      { name: "Sophia", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=c0aede&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=straight01" },
    ],
  },
  {
    category: "Male",
    label: "👨 Male Avatar",
    items: [
      { name: "Jack", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=d1f4ff&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=shortFlat" },
      { name: "Felix", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffd5d5&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=shortRound" },
      { name: "Oliver", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=e8ffdb&accessoriesProbability=0&facialHairProbability=0&mouth=smile&eyes=default&top=side" },
    ],
  },
  {
    category: "Pets",
    label: "🐱 Cute Pets",
    items: [
      { name: "Pusheen Cat", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Pusheen&backgroundColor=b6e3f4" },
      { name: "Happy Shiba", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Shiba&backgroundColor=ffdfbf" },
      { name: "Sleeping Koala", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Koala&backgroundColor=c0aede" },
    ],
  },
  {
    category: "Fantasy",
    label: "👾 Fantasy",
    items: [
      { name: "Cute Ghost", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost&backgroundColor=b6e3f4" },
      { name: "Friendly Slime", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Slime&backgroundColor=ffdfbf" },
      { name: "Bouncing Slime", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bouncer&backgroundColor=c0aede" }
    ],
  },
];

export default function Navbar({
  isDark,
  onToggleTheme,
  userAvatar,
  onChangeAvatar,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Female");

  const handleSelectAvatar = (url: string) => {
    onChangeAvatar(url);
    setIsOpen(false);
  };

  return (
    <nav
      id="lumina-navbar"
      className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-900 bg-white/90 dark:bg-black/90 backdrop-blur-md px-6 py-3 flex items-center justify-between transition-colors duration-300"
    >
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 animate-spin-slow">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-sans font-bold tracking-tight text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
            Lumina AI <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-mono tracking-normal leading-none font-bold uppercase">Pro</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Learn anything
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 relative">
        {/* Theme Toggle */}
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

        {/* GitHub link */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-300 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <Github className="w-5 h-5" />
        </a>

        {/* Interactive User Profile avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800 relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[1.5px] cursor-pointer hover:scale-110 active:scale-90 hover:rotate-3 transition-all duration-300 shadow-md hover:shadow-indigo-500/20 focus:outline-none flex items-center justify-center group"
            title="Choose Your Animated Avatar"
          >
            <img
              src={userAvatar}
              alt="Profile"
              className="w-full h-full rounded-[10px] object-cover bg-slate-900 transition-all duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Pulsing indicator dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce" />
          </button>
        </div>

        {/* Dropdown Card for Avatar Selection */}
        {isOpen && (
          <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-black border border-slate-200 dark:border-slate-900 rounded-2xl shadow-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-900">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Smile className="w-4 h-4 text-violet-500" /> Choose Your Avatar
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-mono text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Selection Tabs */}
            <div className="flex gap-1 overflow-x-auto py-2.5 no-scrollbar">
              {AVATAR_OPTIONS.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                    activeCategory === cat.category
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List of avatars in current tab */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {AVATAR_OPTIONS.find((c) => c.category === activeCategory)?.items.map((item) => {
                const isSelected = userAvatar === item.url;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelectAvatar(item.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border p-[1.5px] cursor-pointer hover:scale-105 transition-all duration-200 ${
                      isSelected
                        ? "border-violet-500 bg-violet-500/20 ring-2 ring-violet-500/20 scale-105"
                        : "border-slate-200 dark:border-slate-900"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-[10px]"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-violet-600/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 text-center mt-3 uppercase tracking-wider">
              Selected avatar syncs instantly
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
