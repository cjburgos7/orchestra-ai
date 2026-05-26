"use client";

import Link from "next/link";
import type { SitePageId, StartupProject } from "@/lib/types/startup";
import { SITE_PAGES } from "@/lib/types/startup";
import { getDirectionLabel } from "@/lib/orchestration/directions";

export type SidebarPanel = "editor" | "pages" | "brand" | "directions" | "assets" | "settings";

type Props = {
  project: StartupProject;
  activePage: SitePageId;
  onPageChange: (page: SitePageId) => void;
  activePanel: SidebarPanel;
  onPanelChange: (panel: SidebarPanel) => void;
  editorOpen: boolean;
  onToggleEditor: () => void;
  onLaunch: () => void;
};

const NAV_ITEMS: { id: SidebarPanel; label: string; icon: string }[] = [
  { id: "pages", label: "Pages", icon: "M4 6h16M4 12h16M4 18h10" },
  { id: "brand", label: "Branding", icon: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" },
  { id: "directions", label: "Directions", icon: "M4 5h16v14H4z M8 9h8 M8 13h5" },
  { id: "editor", label: "Editor", icon: "M11 4H4v16h16v-7 M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" },
  { id: "assets", label: "Assets", icon: "M4 16l4-8 4 6 4-10 4 12H4z" },
  { id: "settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
];

export default function WorkspaceSidebar({
  project,
  activePage,
  onPageChange,
  activePanel,
  onPanelChange,
  editorOpen,
  onToggleEditor,
  onLaunch,
}: Props) {
  const direction = project.selectedDirection ?? "orchestra";

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-slate-100 bg-white/80 backdrop-blur-xl h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 group mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">O</span>
          </div>
          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
            Back to Orchestra
          </span>
        </Link>
        <p className="text-sm font-bold text-slate-900 truncate">{project.startupName}</p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{getDirectionLabel(direction)}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <Link
          href="/projects"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Projects
        </Link>

        <div className="pt-3 pb-1 px-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Workspace</p>
        </div>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onPanelChange(item.id);
              if (item.id === "editor") onToggleEditor();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activePanel === item.id || (item.id === "editor" && editorOpen)
                ? "bg-blue-50 text-blue-700 border border-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item.label}
          </button>
        ))}

        <div className="pt-4 pb-1 px-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Site pages</p>
        </div>

        {SITE_PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              onPageChange(p.id);
              onPanelChange("pages");
            }}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              activePage === p.id
                ? "text-blue-700 bg-blue-50/80"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 space-y-2">
        <span className="block text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2.5 py-1 text-center">
          Saved locally
        </span>
        <button
          type="button"
          onClick={onLaunch}
          className="w-full text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
        >
          Launch
        </button>
      </div>
    </aside>
  );
}
