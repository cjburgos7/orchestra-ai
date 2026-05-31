"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../lovable.css";
import { listProjects } from "@/lib/persistence/projects";
import type { StartupProject } from "@/lib/types/startup";

const SERIF = "var(--font-canela), 'Didot', 'Georgia', serif";

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "22%", background: "var(--gradient-silver)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9), 0 1px 2px oklch(20% .01 270 / 0.15)" }} />
      <div style={{ position: "absolute", inset: "18%", borderRadius: "12%", background: "var(--gradient-lavender)", opacity: 0.9 }} />
      <div style={{ position: "absolute", inset: "32%", borderRadius: "8%", background: "var(--gradient-platinum)" }} />
    </div>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: 9999, background: "oklch(90% .04 295)",
      padding: "2px 8px",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
      color: "oklch(38% .095 295)", textTransform: "uppercase", flexShrink: 0,
    }}>
      {category}
    </span>
  );
}

function ProjectCard({ p }: { p: StartupProject }) {
  const date = new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const hasWorld = !!p.generatedSections;

  return (
    <Link
      href={`/projects/${p.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "16px 20px",
        borderRadius: 16,
        background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
        border: "1px solid oklch(92% .005 270 / 0.9)",
        boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
        transition: "border-color 0.15s, box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "oklch(82% .012 290)";
        e.currentTarget.style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04), 0 12px 32px -8px oklch(20% .01 270 / 0.12)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "oklch(92% .005 270 / 0.9)";
        e.currentTarget.style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CategoryBadge category={p.startupCategory} />
            {hasWorld && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: "oklch(50% .13 155)", letterSpacing: "0.08em" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(58% .15 155)", display: "inline-block" }} />
                Ready
              </span>
            )}
          </div>
          <h2 style={{
            fontFamily: SERIF, fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 400,
            letterSpacing: "-0.02em", lineHeight: 1.1,
            color: "oklch(22% .012 270)", margin: "0 0 4px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {p.startupName}
          </h2>
          <p style={{
            fontSize: 13, color: "oklch(52% .012 270)", lineHeight: 1.4,
            margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {p.tagline}
          </p>
        </div>

        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "oklch(52% .012 270)", marginBottom: 4 }}>Open →</div>
          <div style={{ fontSize: 11, color: "oklch(65% .010 270)" }}>{date}</div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(listProjects());
    setLoaded(true);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "oklch(98.5% .002 270)",
      backgroundImage: `
        radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.35), transparent 55%),
        radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.12), transparent 50%)
      `,
    }}>
      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "oklch(99.5% .001 270 / 0.6)",
        backdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid oklch(91% .005 270 / 0.7)",
      }}>
        <div style={{
          maxWidth: 1180, margin: "0 auto",
          padding: "0 24px", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <LogoMark size={28} />
            <span style={{ fontSize: 15, fontWeight: 500, color: "oklch(32% .012 275)" }}>Orchestra</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/app" style={{ fontSize: 13, color: "oklch(52% .012 270)", textDecoration: "none" }}>
              Workspace
            </Link>
            <Link
              href="/app?generate=1"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                borderRadius: 10, background: "oklch(28% .015 280)",
                padding: "8px 16px", fontSize: 13, fontWeight: 500,
                color: "oklch(98% .003 270)", textDecoration: "none",
                boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
              }}
            >
              + New startup
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 9999, background: "oklch(90% .04 295)",
            padding: "4px 10px", marginBottom: 16,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            color: "oklch(38% .095 295)", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(70% .11 295)", boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)", display: "inline-block" }} />
            Startup Vault
          </div>
          <h1 style={{
            fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1,
            color: "oklch(22% .012 270)", margin: "0 0 12px",
          }}>
            Your startups.
          </h1>
          {loaded && (
            <p style={{ fontSize: 15, color: "oklch(52% .012 270)", lineHeight: 1.6, margin: 0 }}>
              {projects.length > 0
                ? `${projects.length} startup${projects.length !== 1 ? "s" : ""} — click any to continue building.`
                : "Generate your first startup to see it here."}
            </p>
          )}
        </div>

        {!loaded ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "1.5px solid oklch(88% .04 295)",
              borderTop: "1.5px solid oklch(70% .11 295)",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
            border: "1px solid oklch(92% .005 270 / 0.9)",
            borderRadius: 20,
            boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
            padding: "48px 28px",
            textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, margin: "0 auto 16px",
              background: "oklch(90% .04 295)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>◎</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: "oklch(22% .012 270)", margin: "0 0 8px" }}>
              No startups yet
            </h2>
            <p style={{ fontSize: 13, color: "oklch(52% .012 270)", margin: "0 0 20px", lineHeight: 1.6 }}>
              Generate your first startup to see it here.
            </p>
            <Link href="/app?generate=1" style={{
              display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10,
              background: "oklch(28% .015 280)", padding: "10px 20px",
              fontSize: 13, fontWeight: 500, color: "oklch(98% .003 270)", textDecoration: "none",
              boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
            }}>
              Generate my startup
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
