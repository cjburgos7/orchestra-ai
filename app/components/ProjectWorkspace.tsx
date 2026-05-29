"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { SitePageId, StartupProject } from "@/lib/types/startup";
import { SITE_PAGES } from "@/lib/types/startup";
import { briefFromProject } from "@/lib/types/startup";
import { getDirectionLabel } from "@/lib/orchestration/directions";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import { migrateProject } from "@/lib/persistence/projects";
import ProjectWebsite from "./ProjectWebsite";
import GuidedEditor from "./GuidedEditor";
import LaunchModal from "./LaunchModal";
import WorkspaceSidebar, { type SidebarPanel } from "./WorkspaceSidebar";
import OrchestraAgent from "./OrchestraAgent";

type Props = {
  initialProject: StartupProject;
};

const PANEL_TO_EDITOR: Partial<Record<SidebarPanel, string>> = {
  brand: "brand",
  directions: "style",
  assets: "style",
  settings: "style",
  editor: "hero",
};

export default function ProjectWorkspace({ initialProject }: Props) {
  const [project, setProject] = useState(() => migrateProject(initialProject));
  const [launchOpen, setLaunchOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(true);
  const [activePage, setActivePage] = useState<SitePageId>("home");
  const [activePanel, setActivePanel] = useState<SidebarPanel>("editor");
  const [editorTab, setEditorTab] = useState("hero");

  useEffect(() => {
    setProject(migrateProject(initialProject));
    setActivePage("home");
  }, [initialProject.slug, initialProject.updatedAt]);

  const handleUpdate = useCallback((next: StartupProject) => {
    setProject(next);
  }, []);

  const handlePageChange = useCallback((page: SitePageId) => {
    setActivePage(page);
  }, []);

  const handlePanelChange = useCallback((panel: SidebarPanel) => {
    setActivePanel(panel);
    const tab = PANEL_TO_EDITOR[panel];
    if (tab) setEditorTab(tab);
    if (panel === "editor") setEditOpen(true);
    if (panel === "pages") setEditOpen(false);
  }, []);

  const brief = briefFromProject(project);
  const sections = project.generatedSections;
  const direction = project.selectedDirection ?? "orchestra";

  if (!sections) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "oklch(98.5% .002 270)" }}>
        <p style={{ color: "oklch(52% .012 270)", fontSize: 14 }}>This project is still being built.</p>
      </div>
    );
  }

  const pages = project.generatedPages ?? generatePages(brief, sections);

  return (
    <div className="min-h-screen" style={{ background: "oklch(98.5% .002 270)" }}>
      {/* Mobile header */}
      <header
        className="sticky top-0 z-50 lg:hidden"
        style={{
          background: "oklch(99.5% .001 270 / 0.9)",
          backdropFilter: "blur(20px) saturate(140%)",
          borderBottom: "1px solid oklch(91% .005 270 / 0.7)",
        }}
      >
        <div className="px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--gradient-silver, linear-gradient(135deg, oklch(88% .005 270), oklch(95% .002 270)))" }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "oklch(70% .11 295)" }} />
            </div>
            <span className="text-sm font-medium truncate" style={{ color: "oklch(22% .012 270)", letterSpacing: "-0.02em" }}>
              {project.startupName}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen((o) => !o)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "oklch(96% .002 270)",
                border: "1px solid oklch(88% .006 270)",
                color: "oklch(42% .012 270)",
              }}
            >
              {editOpen ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => setLaunchOpen(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "oklch(28% .015 280)", color: "oklch(98% .003 270)" }}
            >
              Launch
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1600px] mx-auto">
        <WorkspaceSidebar
          project={project}
          activePage={activePage}
          onPageChange={handlePageChange}
          activePanel={activePanel}
          onPanelChange={handlePanelChange}
          editorOpen={editOpen}
          onToggleEditor={() => setEditOpen((o) => !o)}
          onLaunch={() => setLaunchOpen(true)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-5 py-5">
          {/* Toolbar */}
          <div className="hidden lg:flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: "oklch(58% .010 270)" }}>
                Live preview
              </p>
              <p className="text-sm font-medium" style={{ color: "oklch(22% .012 270)", letterSpacing: "-0.02em" }}>
                {getDirectionLabel(direction)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditOpen((o) => !o);
                  setActivePanel("editor");
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: "oklch(96% .002 270)",
                  border: "1px solid oklch(88% .006 270)",
                  color: "oklch(42% .012 270)",
                }}
              >
                {editOpen ? "Hide editor" : "Show editor"}
              </button>
            </div>
          </div>

          {editOpen && (
            <GuidedEditor
              project={project}
              onUpdate={handleUpdate}
              activePage={activePage}
              onPageChange={handlePageChange}
              openPanel={editorTab}
              onPanelChange={setEditorTab}
            />
          )}

          {/* Preview frame */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid oklch(90% .005 270 / 0.9)",
              boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 32px -8px oklch(20% .01 270 / 0.08)",
            }}
          >
            {/* Mobile page tabs */}
            <div
              className="px-3 py-2 lg:hidden"
              style={{ borderBottom: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99% .001 270 / 0.8)" }}
            >
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {SITE_PAGES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePageChange(p.id)}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap transition-all"
                    style={{
                      background: activePage === p.id ? "oklch(90% .04 295)" : "transparent",
                      color: activePage === p.id ? "oklch(38% .095 295)" : "oklch(52% .010 270)",
                      border: activePage === p.id ? "1px solid oklch(82% .06 295)" : "1px solid transparent",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <ProjectWebsite
              brief={brief}
              sections={sections}
              pages={pages}
              direction={direction}
              variant="full"
              showOrchestraLinks
              projectSlug={project.slug}
              projectSeed={project.id}
              activePage={activePage}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>

      <LaunchModal
        open={launchOpen}
        onClose={() => setLaunchOpen(false)}
        projectName={project.startupName}
        projectSlug={project.slug}
        project={project}
      />

      <OrchestraAgent project={project} />
    </div>
  );
}
