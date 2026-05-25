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

type Props = {
  initialProject: StartupProject;
};

export default function ProjectWorkspace({ initialProject }: Props) {
  const [project, setProject] = useState(() => migrateProject(initialProject));
  const [launchOpen, setLaunchOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(true);
  const [activePage, setActivePage] = useState<SitePageId>("home");

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">O</span>
              </div>
              <span className="text-sm font-bold text-slate-900 hidden sm:inline">Orchestra</span>
            </Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <Link href="/projects" className="text-sm font-semibold text-slate-500 hover:text-slate-800 truncate hidden sm:inline">
              Projects
            </Link>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-sm font-semibold text-slate-700 truncate">{project.startupName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5"
            >
              ← Projects
            </Link>
            <button
              type="button"
              onClick={() => setEditOpen((o) => !o)}
              className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              {editOpen ? "Hide editor" : "Edit"}
            </button>
            <button
              type="button"
              onClick={() => setLaunchOpen(true)}
              className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700"
            >
              Launch
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {editOpen && (
          <GuidedEditor
            project={project}
            onUpdate={handleUpdate}
            activePage={activePage}
            onPageChange={handlePageChange}
          />
        )}

        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500">
                Live preview · {getDirectionLabel(direction)}
              </span>
              <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                Saved locally
              </span>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5 direction-scroll">
              {SITE_PAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePageChange(p.id)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                    activePage === p.id
                      ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
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
            activePage={activePage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <LaunchModal
        open={launchOpen}
        onClose={() => setLaunchOpen(false)}
        projectName={project.startupName}
      />
    </div>
  );
}
