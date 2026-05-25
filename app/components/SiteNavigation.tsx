"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { SitePageId, StartupLogo } from "@/lib/types/startup";
import { SITE_PAGES } from "@/lib/types/startup";
import StartupLogoMark from "./StartupLogoMark";

type Props = {
  brandLabel: string;
  ctaLabel: string;
  theme: DirectionTheme;
  logo?: StartupLogo | null;
  activePage: SitePageId;
  onPageChange: (page: SitePageId) => void;
  onSectionJump?: (sectionId: string) => void;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  showOrchestraLinks?: boolean;
  projectSlug?: string;
  embedded?: boolean;
};

const HOME_SECTIONS = [
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

const PRIMARY_IDS: SitePageId[] = ["home", "features", "pricing", "about", "contact"];
const MORE_IDS: SitePageId[] = ["blog", "dashboard", "login"];

export default function SiteNavigation({
  brandLabel,
  ctaLabel,
  theme,
  logo,
  activePage,
  onPageChange,
  onSectionJump,
  scrollContainerRef,
  showOrchestraLinks = false,
  projectSlug,
  embedded = false,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navBusy = useRef(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [activePage]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const scrollTop = useCallback(() => {
    const el = scrollContainerRef?.current;
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollContainerRef]);

  const handleNav = useCallback(
    (page: SitePageId) => {
      if (navBusy.current || page === activePage) return;
      navBusy.current = true;
      onPageChange(page);
      setMobileOpen(false);
      setMoreOpen(false);
      requestAnimationFrame(() => {
        scrollTop();
        setTimeout(() => {
          navBusy.current = false;
        }, 200);
      });
    },
    [activePage, onPageChange, scrollTop]
  );

  const handleSection = useCallback(
    (id: string) => {
      if (activePage !== "home") {
        onPageChange("home");
        setTimeout(() => onSectionJump?.(id), 150);
      } else {
        onSectionJump?.(id);
      }
      setMobileOpen(false);
    },
    [activePage, onPageChange, onSectionJump]
  );

  const mobileZ = embedded ? "z-30" : "z-50";
  const mobilePosition = embedded ? "absolute" : "fixed";

  return (
    <>
      {showOrchestraLinks && (
        <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0 font-medium"
            >
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center text-white text-[9px] font-bold">
                O
              </span>
              <span className="hidden sm:inline">Orchestra</span>
            </Link>
            <span className="text-slate-600">→</span>
            <Link href="/projects" className="hover:text-white transition-colors">
              Projects
            </Link>
            {projectSlug && (
              <>
                <span className="text-slate-600">→</span>
                <span className="text-slate-400 truncate max-w-[120px]">{brandLabel}</span>
              </>
            )}
          </div>
          <Link
            href="/projects"
            className="text-slate-400 hover:text-white text-[10px] font-medium whitespace-nowrap hidden sm:inline"
          >
            ← All projects
          </Link>
        </div>
      )}

      <header className={`sticky top-0 z-20 border-b ${theme.nav}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button type="button" onClick={() => handleNav("home")} className="min-w-0 flex-shrink">
            {logo ? (
              <StartupLogoMark logo={logo} size="sm" showWordmark className={theme.navText} />
            ) : (
              <span className={`text-sm font-bold tracking-tight truncate ${theme.navText}`}>
                {brandLabel}
              </span>
            )}
          </button>

          <nav className="hidden md:flex items-center gap-0.5">
            {SITE_PAGES.filter((p) => PRIMARY_IDS.includes(p.id)).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleNav(p.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  activePage === p.id
                    ? `${theme.navText} opacity-100 ring-1 ring-black/5`
                    : `${theme.navText} opacity-45 hover:opacity-80`
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreOpen((o) => !o);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  MORE_IDS.includes(activePage)
                    ? `${theme.navText} opacity-100 ring-1 ring-black/5`
                    : `${theme.navText} opacity-45 hover:opacity-80`
                }`}
              >
                More ▾
              </button>
              {moreOpen && (
                <div
                  className={`absolute right-0 top-full mt-1 rounded-xl border shadow-xl py-1 min-w-[150px] z-40 ${theme.card}`}
                >
                  {SITE_PAGES.filter((p) => MORE_IDS.includes(p.id)).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleNav(p.id)}
                      className={`block w-full text-left text-xs px-4 py-2.5 hover:bg-black/5 ${theme.cardTitle} ${
                        activePage === p.id ? "font-bold" : ""
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleNav("login")}
              className={`hidden sm:inline text-xs font-medium opacity-50 hover:opacity-90 px-2 py-1 ${theme.navText}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => handleNav("dashboard")}
              className={`text-xs font-bold px-3 py-2 rounded-xl ${theme.navCta}`}
            >
              {ctaLabel}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={`md:hidden p-2 rounded-lg ${theme.navText}`}
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {activePage === "home" && (
          <div className={`hidden sm:flex items-center justify-center gap-5 pb-2 border-t border-black/5 ${theme.nav}`}>
            {HOME_SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSection(s.id)}
                className={`text-[10px] font-medium uppercase tracking-wider opacity-35 hover:opacity-70 py-1.5 transition-opacity ${theme.navText}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {activePage !== "home" && (
          <div className={`px-4 sm:px-6 pb-2.5 ${theme.nav}`}>
            <div className="max-w-6xl mx-auto flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleNav("home")}
                className={`opacity-45 hover:opacity-80 transition-opacity ${theme.navText}`}
              >
                ← Home
              </button>
              <span className={`opacity-20 ${theme.navText}`}>/</span>
              <span className={`font-semibold ${theme.navText}`}>
                {SITE_PAGES.find((p) => p.id === activePage)?.label}
              </span>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className={`${mobilePosition} inset-0 ${mobileZ} md:hidden`}>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-[min(100%,280px)] shadow-2xl p-5 overflow-y-auto ${theme.page} border-l ${theme.border}`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 opacity-40 ${theme.navText}`}>
              Site pages
            </p>
            <div className="space-y-0.5">
              {SITE_PAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleNav(p.id)}
                  className={`block w-full text-left text-sm py-2.5 px-3 rounded-xl transition-all ${
                    activePage === p.id ? `${theme.card} font-bold` : `opacity-70 ${theme.navText}`
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {showOrchestraLinks && (
              <div className={`mt-5 pt-5 border-t space-y-2 ${theme.border}`}>
                <Link href="/projects" className={`block text-sm py-2 ${theme.navText} opacity-60`}>
                  ← Back to Projects
                </Link>
                <Link href="/" className={`block text-sm py-2 ${theme.navText} opacity-60`}>
                  Orchestra home
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
