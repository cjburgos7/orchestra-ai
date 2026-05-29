"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "../lovable.css";
import { listProjects } from "@/lib/persistence/projects";
import type { StartupProject } from "@/lib/types/startup";
import GenerateModal from "@/app/components/GenerateModal";
import OrchestraAgent from "@/app/components/OrchestraAgent";
import {
  buildStartupContext,
  buildRecommendations,
} from "@/lib/agent";

/* ─── Design tokens ──────────────────────────────────────────────── */
const SERIF = "'CameraPlainVariable', Georgia, serif";

/* ─── Icons ──────────────────────────────────────────────────────── */
const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ─── Business OS modules ────────────────────────────────────────── */
const MODULES = [
  { id: "leads",     label: "Leads",         desc: "Pipeline & contacts",      href: "/app/leads",    icon: "◎" },
  { id: "campaigns", label: "Campaigns",     desc: "Email & outreach",         href: "/app/campaigns", icon: "◈" },
  { id: "growth",    label: "Growth",        desc: "Opportunities & metrics",  href: "/app/growth",   icon: "◇" },
  { id: "customers", label: "Customers",     desc: "Know your users",          href: "/app/customers", icon: "◉" },
  { id: "analytics", label: "Analytics",     desc: "Business intelligence",    href: "/app/analytics", icon: "◑" },
  { id: "payments",  label: "Payments",      desc: "Revenue & billing",        href: "/app/payments",  icon: "◐" },
  { id: "launch",    label: "Launch Center", desc: "Your launch checklist",    href: "/app/launch",   icon: "◬" },
] as const;

/* ─── Logo mark ──────────────────────────────────────────────────── */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "22%",
        background: "var(--gradient-silver)",
        boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9), 0 1px 2px oklch(20% .01 270 / 0.15)",
      }} />
      <div style={{
        position: "absolute", inset: "18%", borderRadius: "12%",
        background: "var(--gradient-lavender)", opacity: 0.9,
      }} />
      <div style={{
        position: "absolute", inset: "32%", borderRadius: "8%",
        background: "var(--gradient-platinum)",
      }} />
    </div>
  );
}

/* ─── Project card ───────────────────────────────────────────────── */
function ProjectCard({ project }: { project: StartupProject }) {
  const date = new Date(project.updatedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={{
        display: "block",
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid oklch(91% .005 270)",
        background: "oklch(99.5% .001 270)",
        boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04)",
        textDecoration: "none",
        transition: "box-shadow 0.18s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px oklch(20% .01 270 / 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "none";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "oklch(70% .11 295)",
            marginBottom: 4,
          }}>
            {project.startupCategory || "Startup"}
            {project.generatedSections && (
              <span style={{ marginLeft: 6, color: "oklch(60% .09 150)" }}>· Ready</span>
            )}
          </div>
          <div style={{
            fontFamily: SERIF, fontSize: 17, fontWeight: 400,
            letterSpacing: "-0.02em", color: "oklch(22% .012 270)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {project.startupName}
          </div>
          <div style={{
            fontSize: 12, color: "oklch(52% .012 270)",
            marginTop: 2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {project.tagline}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: "oklch(70% .11 295 / 0.7)", fontWeight: 500 }}>
            Open →
          </span>
          <span style={{ fontSize: 10, color: "oklch(65% .012 270)" }}>{date}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Inner workspace (uses useSearchParams) ─────────────────────── */
function WorkspaceInner() {
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(listProjects());
    setLoaded(true);

    if (searchParams.get("generate") === "1") {
      setModalOpen(true);
      window.history.replaceState({}, "", "/app");
    }
  }, [searchParams]);

  const mostRecentProject = projects[0] ?? null;
  const startupContext = mostRecentProject ? buildStartupContext(mostRecentProject) : null;
  const recommendations = buildRecommendations(startupContext);

  return (
    <div className="lovable-root grain" style={{ minHeight: "100vh", position: "relative" }}>
      <style>{`
        @font-face {
          font-family: 'CameraPlainVariable';
          src: url('https://cdn.gpteng.co/mcp-widgets/v1/fonts/CameraPlainVariable.woff2') format('woff2');
          font-weight: 100 900; font-style: normal; font-display: swap;
        }
      `}</style>

      {/* Page background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: [
          "radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.25), transparent 55%)",
          "radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.08), transparent 50%)",
        ].join(", "),
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "oklch(99.5% .001 270 / 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid oklch(91% .005 270 / 0.8)",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark size={28} />
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.02em", color: "oklch(22% .012 270)" }}>
              Orchestra
            </span>
            <span style={{ fontSize: 13, color: "oklch(80% .005 270)", margin: "0 2px" }}>/</span>
            <span style={{ fontSize: 13, color: "oklch(52% .012 270)" }}>Workspace</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ fontSize: 13, color: "oklch(52% .012 270)", textDecoration: "none" }}>
              Home
            </Link>
            <Link href="/projects" style={{ fontSize: 13, color: "oklch(52% .012 270)", textDecoration: "none" }}>
              All projects
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "oklch(28% .015 280)", color: "oklch(98% .003 270)",
                border: "none", borderRadius: 8, padding: "7px 16px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)",
              }}
            >
              <Plus /> New startup
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ position: "relative", zIndex: 10, maxWidth: 1180, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% .11 295)", marginBottom: 8 }}>
            Orchestra · Workspace
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05, color: "oklch(22% .012 270)", margin: 0 }}>
            {loaded && projects.length > 0
              ? projects.length === 1 ? "Your startup." : "Your startups."
              : "Welcome to Orchestra."}
          </h1>
          {loaded && (
            <p style={{ fontSize: 14, color: "oklch(52% .012 270)", marginTop: 8, lineHeight: 1.5 }}>
              {projects.length > 0
                ? `${projects.length} startup${projects.length !== 1 ? "s" : ""} — click to continue building.`
                : "Describe an idea and Orchestra builds the company."}
            </p>
          )}
        </div>

        {/* Layout: left = projects, right = modules */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <style>{`@media(min-width:900px){ [data-layout-grid] { grid-template-columns: 3fr 2fr !important; } }`}</style>
          <div data-layout-grid="true" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>

            {/* Projects column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% .012 270)", margin: 0 }}>
                  Your startups
                </h2>
                {projects.length > 0 && (
                  <Link href="/projects" style={{ fontSize: 11, color: "oklch(70% .11 295)", textDecoration: "none", fontWeight: 500 }}>
                    View all →
                  </Link>
                )}
              </div>

              {!loaded ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: "1.5px solid oklch(91% .005 270)",
                    borderTop: "1.5px solid oklch(70% .11 295)",
                    animation: "ws-spin 1.2s linear infinite",
                  }} />
                  <style>{`@keyframes ws-spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : projects.length === 0 ? (
                <div style={{
                  borderRadius: 16,
                  border: "1px dashed oklch(88% .005 270)",
                  background: "oklch(99% .001 270 / 0.5)",
                  padding: "36px 24px",
                  textAlign: "center",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "oklch(95% .005 270)",
                    border: "1px solid oklch(91% .005 270)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 14px", fontSize: 18,
                  }}>
                    ◎
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "oklch(32% .012 275)", marginBottom: 4 }}>
                    No startups yet
                  </p>
                  <p style={{ fontSize: 12, color: "oklch(52% .012 270)", marginBottom: 16 }}>
                    Describe an idea and Orchestra builds the company.
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    style={{
                      background: "oklch(28% .015 280)", color: "oklch(98% .003 270)",
                      border: "none", borderRadius: 8, padding: "9px 20px",
                      fontSize: 13, fontWeight: 500, cursor: "pointer",
                    }}
                  >
                    Start a company →
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {projects.slice(0, 8).map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                  {projects.length > 8 && (
                    <Link
                      href="/projects"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px", borderRadius: 12,
                        border: "1px solid oklch(91% .005 270)",
                        fontSize: 12, color: "oklch(52% .012 270)", textDecoration: "none",
                        background: "oklch(98.5% .002 270)",
                      }}
                    >
                      View all {projects.length} startups <ChevronRight />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Business OS modules column */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% .012 270)", margin: 0 }}>
                  Business modules
                </h2>
              </div>

              <div style={{
                borderRadius: 16,
                border: "1px solid oklch(91% .005 270)",
                background: "oklch(99.5% .001 270)",
                overflow: "hidden",
              }}>
                {MODULES.map((mod, i) => (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px",
                      borderBottom: i < MODULES.length - 1 ? "1px solid oklch(93% .005 270)" : "none",
                      textDecoration: "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "oklch(97% .003 270)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "oklch(95% .005 270)",
                        border: "1px solid oklch(91% .005 270)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "oklch(52% .012 270)", flexShrink: 0,
                      }}>
                        {mod.icon}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "oklch(22% .012 270)", letterSpacing: "-0.01em" }}>
                          {mod.label}
                        </div>
                        <div style={{ fontSize: 11, color: "oklch(62% .012 270)" }}>
                          {mod.desc}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: "oklch(75% .005 270)" }}>
                      <ChevronRight />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Agent recommendations */}
              {recommendations.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(52% .012 270)", margin: "0 0 10px" }}>
                    Recommended now
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {recommendations.slice(0, 3).map((action) => (
                      <div
                        key={action.id}
                        style={{
                          padding: "10px 12px", borderRadius: 10,
                          border: "1px solid oklch(91% .005 270)",
                          background: "oklch(99.5% .001 270)",
                          display: "flex", alignItems: "flex-start", gap: 8,
                        }}
                      >
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 4,
                          background: action.priority === "critical" ? "oklch(70% .11 295)"
                            : action.priority === "high" ? "oklch(72% .15 150)"
                            : "oklch(65% .012 270)",
                          boxShadow: action.priority === "critical" ? "0 0 6px oklch(70% .11 295 / 0.6)" : "none",
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "oklch(22% .012 270)", marginBottom: 2 }}>
                            {action.label}
                          </div>
                          {action.ctaHref ? (
                            <Link
                              href={action.ctaHref}
                              style={{
                                fontSize: 11, color: "oklch(70% .11 295)",
                                textDecoration: "none", fontWeight: 500,
                                display: "inline-flex", alignItems: "center", gap: 3,
                              }}
                            >
                              {action.ctaLabel} <ArrowRight />
                            </Link>
                          ) : (
                            <span style={{ fontSize: 11, color: "oklch(70% .11 295)", fontWeight: 500 }}>
                              {action.ctaLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ marginTop: 48, textAlign: "center", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(75% .005 270)" }}>
          Orchestra · Founder Operating System
        </p>
      </main>

      {/* Generation modal */}
      <GenerateModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Agent */}
      <OrchestraAgent project={mostRecentProject} />
    </div>
  );
}

/* ─── Page export with Suspense boundary ─────────────────────────── */
export default function AppPage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceInner />
    </Suspense>
  );
}
