"use client";

import Link from "next/link";
import "../../lovable.css";

const SERIF = "'CameraPlainVariable', Georgia, serif";

export default function LeadsPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "oklch(98.5% .002 270)",
      backgroundImage: `
        radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.35), transparent 55%),
        radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.12), transparent 50%)
      `,
    }}>
      <style>{`
        @font-face {
          font-family: 'CameraPlainVariable';
          src: url('https://cdn.gpteng.co/mcp-widgets/v1/fonts/CameraPlainVariable.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

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
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Link href="/app" style={{ color: "oklch(52% .012 270)", textDecoration: "none", fontSize: 13 }}>
            Workspace
          </Link>
          <span style={{ color: "oklch(75% .008 270)" }}>›</span>
          <span style={{ fontSize: 13, color: "oklch(32% .012 275)", fontWeight: 500 }}>Leads</span>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 9999, background: "oklch(90% .04 295)",
            padding: "4px 10px", marginBottom: 16,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            color: "oklch(38% .095 295)", textTransform: "uppercase",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "oklch(70% .11 295)",
              boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)",
              display: "inline-block",
            }} />
            Coming Soon
          </div>
          <h1 style={{
            fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 40px)",
            fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1,
            color: "oklch(22% .012 270)", margin: "0 0 12px",
          }}>
            Lead Pipeline
          </h1>
          <p style={{
            fontSize: 16, color: "oklch(52% .012 270)", lineHeight: 1.65,
            margin: 0, maxWidth: 480,
          }}>
            Capture, qualify, and manage your leads. Track your pipeline from first contact to closed deal.
          </p>
        </div>

        {/* Placeholder cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Total Leads", value: "—", sub: "No leads yet" },
            { label: "Qualified", value: "—", sub: "Pipeline empty" },
            { label: "This Month", value: "—", sub: "No activity" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
              border: "1px solid oklch(92% .005 270 / 0.9)",
              borderRadius: 16,
              boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
              padding: "20px 24px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "oklch(52% .012 270)", textTransform: "uppercase", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, color: "oklch(22% .012 270)", lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "oklch(62% .010 270)", marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
          border: "1px solid oklch(92% .005 270 / 0.9)",
          borderRadius: 16,
          boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
          padding: "32px 28px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
          <h2 style={{
            fontFamily: SERIF, fontSize: 20, fontWeight: 400,
            color: "oklch(22% .012 270)", margin: "0 0 8px",
          }}>
            Lead management is coming
          </h2>
          <p style={{ fontSize: 14, color: "oklch(52% .012 270)", margin: "0 0 20px", lineHeight: 1.6 }}>
            Connect your first integration to start capturing leads automatically.
          </p>
          <Link href="/app" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: 10,
            background: "oklch(28% .015 280)",
            padding: "10px 20px",
            fontSize: 13, fontWeight: 500,
            color: "oklch(98% .003 270)",
            textDecoration: "none",
            boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
          }}>
            Back to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
