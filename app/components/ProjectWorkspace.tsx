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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <p className="text-slate-500">This project is still being built.</p>
      </div>
    );
  }

  const pages = project.generatedPages ?? generatePages(brief, sections);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 lg:hidden">
        <div className="px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-sm font-bold text-slate-900 truncate">{project.startupName}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen((o) => !o)}
              className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg"
            >
              {editOpen ? "Preview" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => setLaunchOpen(true)}
              className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-xl"
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

        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">
          <div className="hidden lg:flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-400">Live preview</p>
              <p className="text-sm font-bold text-slate-800">{getDirectionLabel(direction)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/projects" className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5">
                All projects
              </Link>
              <button
                type="button"
                onClick={() => {
                  setEditOpen((o) => !o);
                  setActivePanel("editor");
                }}
                className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white"
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

          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 space-y-2 lg:hidden">
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {SITE_PAGES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePageChange(p.id)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap ${
                      activePage === p.id
                        ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
                        : "text-slate-500"
                    }`}
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
      />
    </div>
  );
}
