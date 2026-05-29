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
  { id: "pages",      label: "Pages",      icon: "M4 6h16M4 12h16M4 18h10" },
  { id: "brand",      label: "Branding",   icon: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" },
  { id: "directions", label: "Directions", icon: "M4 5h16v14H4z M8 9h8 M8 13h5" },
  { id: "editor",     label: "Editor",     icon: "M11 4H4v16h16v-7 M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" },
  { id: "assets",     label: "Assets",     icon: "M4 16l4-8 4 6 4-10 4 12H4z" },
  { id: "settings",   label: "Settings",   icon: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
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
    <aside
      className="hidden lg:flex flex-col w-52 flex-shrink-0 h-screen sticky top-0"
      style={{
        background: "oklch(99% .001 270)",
        borderRight: "1px solid oklch(91% .005 270 / 0.7)",
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 16px 14px", borderBottom: "1px solid oklch(91% .005 270 / 0.6)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, textDecoration: "none" }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
            background: "linear-gradient(oklch(88% .005 270), oklch(94% .003 270))",
            border: "1px solid oklch(86% .006 270)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: "oklch(70% .11 295)" }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: "oklch(42% .012 270)" }}>Orchestra</span>
        </Link>
        <p style={{ fontSize: 13, fontWeight: 500, color: "oklch(22% .012 270)", letterSpacing: "-0.02em", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {project.startupName}
        </p>
        <p style={{ fontSize: 10, color: "oklch(58% .010 270)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {getDirectionLabel(direction)}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        <Link
          href="/projects"
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
            borderRadius: 8, fontSize: 11, fontWeight: 500,
            color: "oklch(52% .012 270)", textDecoration: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All projects
        </Link>

        <div style={{ padding: "12px 10px 6px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(62% .010 270)", margin: 0 }}>
            Workspace
          </p>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activePanel === item.id || (item.id === "editor" && editorOpen);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onPanelChange(item.id);
                if (item.id === "editor") onToggleEditor();
              }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "7px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                cursor: "pointer", textAlign: "left",
                background: isActive ? "oklch(90% .04 295)" : "transparent",
                color: isActive ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
                border: isActive ? "1px solid oklch(82% .06 295)" : "1px solid transparent",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item.label}
            </button>
          );
        })}

        <div style={{ padding: "14px 10px 6px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(62% .010 270)", margin: 0 }}>
            Pages
          </p>
        </div>

        {SITE_PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              onPageChange(p.id);
              onPanelChange("pages");
            }}
            style={{
              width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 6,
              fontSize: 11, fontWeight: 500, cursor: "pointer",
              color: activePage === p.id ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
              background: activePage === p.id ? "oklch(90% .04 295)" : "transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: "10px 8px 12px", borderTop: "1px solid oklch(91% .005 270 / 0.6)", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{
          display: "block", fontSize: 9, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.14em", textAlign: "center",
          borderRadius: 9999, padding: "4px 10px",
          background: "oklch(90% .05 155)", color: "oklch(38% .10 155)",
          border: "1px solid oklch(82% .08 155)",
        }}>
          Saved locally
        </span>
        <button
          type="button"
          onClick={onLaunch}
          style={{
            width: "100%", fontSize: 12, fontWeight: 500, padding: "9px",
            borderRadius: 10, cursor: "pointer",
            background: "oklch(28% .015 280)", color: "oklch(98% .003 270)",
            border: "none",
            boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.10), 0 2px 8px oklch(28% .015 280 / 0.2)",
          }}
        >
          Launch →
        </button>
      </div>
    </aside>
  );
}
