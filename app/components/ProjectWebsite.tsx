"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectionId, GeneratedPages, GeneratedSections, SitePageId, StartupBrief } from "@/lib/types/startup";
import { resolveRenderDirection } from "@/lib/cinematic";
import { DIRECTION_THEMES } from "@/lib/orchestration/direction-themes";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import { WORLD_V2_ENABLED } from "@/lib/world-v2";
import SiteNavigation from "./SiteNavigation";
import { ProjectMotionStyles } from "./VisualMotion";
import { renderSitePage } from "./SitePageViews";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  pages?: GeneratedPages | null;
  direction: DirectionId;
  variant?: "preview" | "full";
  showOrchestraLinks?: boolean;
  projectSlug?: string;
  projectSeed?: string;
  activePage?: SitePageId;
  onPageChange?: (page: SitePageId) => void;
};

export default function ProjectWebsite({
  brief,
  sections,
  pages: pagesProp,
  direction,
  variant = "full",
  showOrchestraLinks = false,
  projectSlug,
  projectSeed,
  activePage: controlledPage,
  onPageChange,
}: Props) {
  const [internalPage, setInternalPage] = useState<SitePageId>("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activePage = controlledPage ?? internalPage;
  const setActivePage = onPageChange ?? setInternalPage;

  const renderDirection = resolveRenderDirection(direction);
  const theme = DIRECTION_THEMES[renderDirection];
  const isPreview = variant === "preview";
  const pages = pagesProp ?? generatePages(brief, sections);
  const accentColor =
    sections.worldV2?.accentColor ?? sections.visuals?.accentColor ?? "#2563eb";
  const logo = sections.visuals?.logo;
  const slug = brief.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    if (controlledPage === undefined) setInternalPage("home");
  }, [sections, direction, controlledPage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activePage]);

  const handleSectionJump = useCallback((sectionId: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector(`#section-${sectionId}`) ?? document.getElementById(`section-${sectionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isWorldV2Home = WORLD_V2_ENABLED && !!sections.worldV2 && activePage === "home";
  const isFoundationTemplate = !!(sections.foundation1Slots || sections.foundationId?.startsWith("foundation-"));
  const suppressShell = isWorldV2Home || isFoundationTemplate;
  const effectivePage: SitePageId = isFoundationTemplate ? "home" : activePage;

  const shell = isPreview
    ? "rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
    : "";

  const pageProps = {
    brief,
    sections,
    pages,
    theme,
    direction: renderDirection,
    isPreview,
    accentColor,
    onSectionJump: handleSectionJump,
    seed: projectSeed ?? brief.name,
  };

  return (
    <div className={shell}>
      <ProjectMotionStyles />
      {isPreview && (
        <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${theme.nav}`}>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-300" />
            <div className="w-2 h-2 rounded-full bg-amber-300" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <span className={`flex-1 text-center text-[10px] truncate ${theme.cardBody}`}>
            {slug}.orchestra.app
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        data-orchestra-scroll-root
        className={`${suppressShell ? "" : theme.page} ${isPreview ? "max-h-[640px] overflow-y-auto direction-scroll relative" : "min-h-screen"}`}
      >
        {!suppressShell && (
          <SiteNavigation
            brandLabel={sections.navbar.brandLabel}
            ctaLabel={sections.navbar.ctaLabel}
            logo={logo}
            theme={theme}
            activePage={activePage}
            onPageChange={setActivePage}
            onSectionJump={handleSectionJump}
            scrollContainerRef={scrollRef}
            showOrchestraLinks={showOrchestraLinks && !isPreview}
            projectSlug={projectSlug}
            embedded={isPreview || showOrchestraLinks}
          />
        )}

        <main className={suppressShell ? "" : "animate-fade-up"}>{renderSitePage(effectivePage, pageProps)}</main>

        {!suppressShell && (
          <footer className={`text-center text-xs py-8 border-t ${theme.footer}`}>
            {sections.footer.tagline}
            {!isPreview && (
              <p className="mt-2 opacity-60">
                Cinematic world · Orchestra workspace
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
