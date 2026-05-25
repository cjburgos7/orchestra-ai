"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DirectionId, GeneratedPages, GeneratedSections, SitePageId, StartupBrief } from "@/lib/types/startup";
import { DIRECTION_THEMES } from "@/lib/orchestration/direction-themes";
import { getDirectionLabel } from "@/lib/orchestration/directions";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import SiteNavigation from "./SiteNavigation";
import { renderSitePage } from "./SitePageViews";

type Props = {
  brief: StartupBrief;
  sections: GeneratedSections;
  pages?: GeneratedPages | null;
  direction: DirectionId;
  variant?: "preview" | "full";
  showOrchestraLinks?: boolean;
  projectSlug?: string;
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
  activePage: controlledPage,
  onPageChange,
}: Props) {
  const [internalPage, setInternalPage] = useState<SitePageId>("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activePage = controlledPage ?? internalPage;
  const setActivePage = onPageChange ?? setInternalPage;

  const theme = DIRECTION_THEMES[direction];
  const isPreview = variant === "preview";
  const pages = pagesProp ?? generatePages(brief, sections);
  const accentColor = sections.visuals?.accentColor ?? "#2563eb";
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

  const shell = isPreview
    ? "rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
    : "";

  const pageProps = {
    brief,
    sections,
    pages,
    theme,
    direction,
    isPreview,
    accentColor,
    onSectionJump: handleSectionJump,
  };

  return (
    <div className={shell}>
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
        className={`${theme.page} ${isPreview ? "max-h-[640px] overflow-y-auto direction-scroll relative" : "min-h-0"}`}
      >
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

        <main className="animate-fade-up">{renderSitePage(activePage, pageProps)}</main>

        <footer className={`text-center text-xs py-8 border-t ${theme.footer}`}>
          {sections.footer.tagline}
          {!isPreview && (
            <p className="mt-2 opacity-60">
              {getDirectionLabel(direction)} · Orchestra workspace
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
