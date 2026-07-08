import { Home, BookOpen, Settings, HelpCircle, FileText, Menu } from "lucide-react";
import { ActiveTab } from "../types";

interface FloatingSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasDocument: boolean;
  onOpenDocs: () => void;
  onOpenHelp: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function FloatingSidebar({
  activeTab,
  setActiveTab,
  hasDocument,
  onOpenDocs,
  onOpenHelp,
  isSidebarOpen,
  setIsSidebarOpen,
}: FloatingSidebarProps) {
  const menuItems = [
    {
      id: "home" as ActiveTab,
      label: "Home",
      icon: Home,
      disabled: false,
      tooltip: "Return to landing page and file upload",
    },
    {
      id: "workspace" as ActiveTab,
      label: "Workspace",
      icon: BookOpen,
      disabled: !hasDocument,
      tooltip: hasDocument
        ? "Go to learning workspace"
        : "Upload a file first to unlock the learning workspace",
    },
  ];

  return (
    <div
      id="floating-sidebar-rail"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-5 bg-white/75 dark:bg-black/75 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-900 py-6 px-3.5 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none transition-all duration-300"
    >
      {/* Sidebar Items */}
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              id={`sidebar-item-${item.id}`}
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              disabled={item.disabled}
              className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 cursor-pointer ${
                item.disabled
                  ? "opacity-30 cursor-not-allowed text-slate-400"
                  : isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[9px] font-medium tracking-tight mt-1">
                {item.label}
              </span>

              {/* Tooltip */}
              <div className="absolute left-18 scale-0 origin-left group-hover:scale-100 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-1.5 px-3 rounded-lg shadow-lg font-medium whitespace-nowrap transition-all duration-200 pointer-events-none border border-slate-800 dark:border-slate-200">
                {item.tooltip}
              </div>
            </button>
          );
        })}

        {/* Toggle My Documents Sidebar */}
        <button
          id="sidebar-item-documents"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 cursor-pointer ${
            isSidebarOpen
              ? "bg-blue-50 dark:bg-zinc-900/60 text-blue-600 dark:text-blue-400 border border-slate-200/40 dark:border-zinc-800"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Menu className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-[9px] font-medium tracking-tight mt-1">
            Docs
          </span>

          {/* Tooltip */}
          <div className="absolute left-18 scale-0 origin-left group-hover:scale-100 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-1.5 px-3 rounded-lg shadow-lg font-medium whitespace-nowrap transition-all duration-200 pointer-events-none border border-slate-800 dark:border-slate-200 z-50">
            {isSidebarOpen ? "Hide My Documents" : "Show My Documents"}
          </div>
        </button>
      </div>

      <div className="w-8 h-[1px] bg-slate-200 dark:bg-zinc-900 my-2" />

      {/* Info items */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenDocs}
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer animate-pulse"
          title="Lumina Documentation"
        >
          <FileText className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onOpenHelp}
          className="group relative flex items-center justify-center w-10 h-10 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer"
          title="AI Assistance Info"
        >
          <HelpCircle className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
