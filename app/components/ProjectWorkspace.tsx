"use client";

import { useCallback, useEffect, useState } from "react";
import type { SitePageId, StartupProject } from "@/lib/types/startup";
import { SITE_PAGES } from "@/lib/types/startup";
import { briefFromProject } from "@/lib/types/startup";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import { migrateProject } from "@/lib/persistence/projects";
import ProjectWebsite from "./ProjectWebsite";
import LaunchModal from "./LaunchModal";
import AgentPanel from "./AgentPanel";
import FloatingAgent from "./FloatingAgent";

type Props = {
  initialProject: StartupProject;
};

export default function ProjectWorkspace({ initialProject }: Props) {
  const [project, setProject] = useState(() => migrateProject(initialProject));
  const [launchOpen, setLaunchOpen] = useState(false);
  const [activePage, setActivePage] = useState<SitePageId>("home");

  useEffect(() => {
    setProject(migrateProject(initialProject));
    setActivePage("home");
  }, [initialProject.slug, initialProject.updatedAt]);

  const handlePageChange = useCallback((page: SitePageId) => {
    setActivePage(page);
  }, []);

  const brief = briefFromProject(project);
  const sections = project.generatedSections;
  const direction = project.selectedDirection ?? "orchestra";

  // Foundation templates are single-page sites — hide multi-page tabs that would
  // render a completely different shell (SiteNavigation + generic page views)
  const isFoundationTemplate = !!(
    sections?.foundation1Slots ||
    sections?.foundationId?.startsWith("foundation-")
  );

  if (!sections) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "oklch(8.5% .018 280)" }}
      >
        <p style={{ color: "oklch(45% .015 280)", fontSize: 14 }}>
          This project is still being built.
        </p>
      </div>
    );
  }

  const pages = project.generatedPages ?? generatePages(brief, sections);

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ background: "oklch(8.5% .018 280)" }}
    >
      {/* Mobile header */}
      <header
        className="flex-shrink-0 lg:hidden"
        style={{
          background: "oklch(10% .02 280 / 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid oklch(16% .025 280)",
        }}
      >
        <div className="px-4 h-14 flex items-center justify-between gap-3">
          <span
            className="text-sm font-medium truncate"
            style={{ color: "oklch(88% .008 270)", letterSpacing: "-0.02em" }}
          >
            {project.startupName}
          </span>
          <button
            type="button"
            onClick={() => setLaunchOpen(true)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0"
            style={{ background: "oklch(70% .11 295)", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Launch
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Agent Panel — the center of the product */}
        <div className="hidden lg:flex flex-shrink-0">
          <AgentPanel
            project={project}
            activePage={activePage}
            onPageChange={handlePageChange}
            onLaunch={() => setLaunchOpen(true)}
          />
        </div>

        {/* Preview area */}
        <main
          className="flex-1 min-w-0 flex flex-col overflow-hidden"
          style={{ background: "oklch(9.5% .016 280)" }}
        >
          {/* Preview chrome — desktop */}
          <div
            className="hidden lg:flex flex-shrink-0 items-center gap-3"
            style={{
              padding: "8px 14px",
              borderBottom: "1px solid oklch(14% .02 280)",
              background: "oklch(10.5% .02 280)",
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
              {["oklch(62% .18 25)", "oklch(75% .18 85)", "oklch(68% .18 145)"].map((c, i) => (
                <div
                  key={i}
                  style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }}
                />
              ))}
            </div>

            {/* URL bar */}
            <div
              style={{
                height: 24, borderRadius: 5, flex: "0 0 300px",
                background: "oklch(13% .018 280)",
                border: "1px solid oklch(18% .022 280)",
                display: "flex", alignItems: "center", padding: "0 10px",
                fontSize: 10.5, color: "oklch(52% .012 270)", letterSpacing: "0.01em",
                overflow: "hidden",
              }}
            >
              {project.slug}.orchestra.ai{activePage !== "home" ? `/${activePage}` : ""}
            </div>

            {/* Page tabs — Foundation templates are single-page, only show Home */}
            <div style={{ display: "flex", gap: 1, marginLeft: "auto" }}>
              {(isFoundationTemplate ? SITE_PAGES.slice(0, 1) : SITE_PAGES.slice(0, 7)).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePageChange(p.id)}
                  style={{
                    fontSize: 10, fontWeight: 500, padding: "3px 8px",
                    borderRadius: 5, border: "none", cursor: "pointer",
                    background: activePage === p.id ? "oklch(70% .11 295 / 0.15)" : "none",
                    color: activePage === p.id ? "oklch(70% .11 295)" : "oklch(45% .015 280)",
                    transition: "all 0.1s",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile page tabs */}
          <div
            className="flex-shrink-0 px-3 py-2 lg:hidden"
            style={{ borderBottom: "1px solid oklch(14% .02 280)", background: "oklch(10% .02 280)" }}
          >
            <div className="flex gap-1 overflow-x-auto pb-0.5">
              {(isFoundationTemplate ? SITE_PAGES.slice(0, 1) : SITE_PAGES).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePageChange(p.id)}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap transition-all"
                  style={{
                    background: activePage === p.id ? "oklch(70% .11 295 / 0.15)" : "transparent",
                    color: activePage === p.id ? "oklch(70% .11 295)" : "oklch(45% .015 280)",
                    border: activePage === p.id ? "1px solid oklch(70% .11 295 / 0.3)" : "1px solid transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Site preview */}
          <div className="flex-1 overflow-y-auto">
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

      {/* Floating agent — mobile only (desktop has AgentPanel sidebar) */}
      <div className="lg:hidden">
        <FloatingAgent />
      </div>
    </div>
  );
}
