"use client";

import Link from "next/link";
import "../../lovable.css";

const SERIF = "var(--font-canela), 'Didot', 'Georgia', serif";

const LAUNCH_STEPS = [
  { id: "identity", label: "Brand Identity", desc: "Name, tagline, positioning", done: false },
  { id: "website", label: "Website Generated", desc: "Landing page live via Lovable", done: false },
  { id: "visuals", label: "Visuals Generated", desc: "Hero image, product shots", done: false },
  { id: "domain", label: "Domain Connected", desc: "Custom domain pointing to your site", done: false },
  { id: "email", label: "Email Configured", desc: "Outreach-ready with Resend", done: false },
  { id: "payments", label: "Payments Enabled", desc: "Stripe connected and live", done: false },
  { id: "analytics", label: "Analytics Active", desc: "PostHog tracking users", done: false },
  { id: "leads", label: "First Lead Captured", desc: "Someone signed up or reached out", done: false },
  { id: "campaign", label: "First Campaign Sent", desc: "Outreach email delivered", done: false },
];

export default function LaunchPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "oklch(98.5% .002 270)",
      backgroundImage: `
        radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.35), transparent 55%),
        radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.12), transparent 50%)
      `,
    }}>

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
          <Link href="/app" style={{ color: "oklch(52% .012 270)", textDecoration: "none", fontSize: 13 }}>Workspace</Link>
          <span style={{ color: "oklch(75% .008 270)" }}>›</span>
          <span style={{ fontSize: 13, color: "oklch(32% .012 275)", fontWeight: 500 }}>Launch Center</span>
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            borderRadius: 9999, background: "oklch(90% .04 295)",
            padding: "4px 10px", marginBottom: 16,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            color: "oklch(38% .095 295)", textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(70% .11 295)", boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)", display: "inline-block" }} />
            Launch Checklist
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1, color: "oklch(22% .012 270)", margin: "0 0 12px" }}>
            Launch Center
          </h1>
          <p style={{ fontSize: 16, color: "oklch(52% .012 270)", lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
            Everything you need to go from idea to market. Track your launch readiness step by step.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
          border: "1px solid oklch(92% .005 270 / 0.9)",
          borderRadius: 16,
          boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
          padding: "20px 24px",
          marginBottom: 16,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "oklch(52% .012 270)", textTransform: "uppercase", marginBottom: 8 }}>
              Launch Progress
            </div>
            <div style={{ height: 6, background: "oklch(91% .005 270)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, oklch(70% .11 295), oklch(60% .13 295))", borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "oklch(22% .012 270)", lineHeight: 1 }}>0%</div>
            <div style={{ fontSize: 11, color: "oklch(62% .010 270)" }}>0 of {LAUNCH_STEPS.length}</div>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LAUNCH_STEPS.map((step, i) => (
            <div key={step.id} style={{
              background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
              border: "1px solid oklch(92% .005 270 / 0.9)",
              borderRadius: 12,
              boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04)",
              padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                border: "1.5px solid oklch(82% .008 270)",
                background: "oklch(97% .003 270)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 10, color: "oklch(62% .010 270)" }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "oklch(32% .012 275)", marginBottom: 2 }}>{step.label}</div>
                <div style={{ fontSize: 12, color: "oklch(62% .010 270)" }}>{step.desc}</div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: "oklch(62% .010 270)",
                letterSpacing: "0.08em",
              }}>
                Pending
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "oklch(62% .010 270)", margin: "0 0 12px" }}>
            Select a startup from your workspace to track its launch progress
          </p>
          <Link href="/app" style={{
            display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10,
            background: "oklch(28% .015 280)", padding: "10px 20px",
            fontSize: 13, fontWeight: 500, color: "oklch(98% .003 270)", textDecoration: "none",
            boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
          }}>
            Go to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
