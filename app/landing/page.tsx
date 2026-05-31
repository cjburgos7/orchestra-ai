"use client";

import Link from "next/link";
import "../lovable.css";
import FloatingAgent from "@/app/components/FloatingAgent";

const APP_URL = "/app";

/* ─── font constant — inline style applied directly on every display element ─── */
const SERIF = "var(--font-canela), 'Didot', 'Georgia', serif";

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
const Sparkles = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>
    <path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>
  </svg>
);
const ArrowRight = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const ArrowUpRight = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>
);
const Workflow = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>
  </svg>
);
const Activity = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>
  </svg>
);
const Rocket = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/>
    <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>
  </svg>
);
const Globe = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
  </svg>
);
const Zap = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
);
const Users = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <circle cx="9" cy="7" r="4"/>
  </svg>
);
const FileText = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
    <path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
  </svg>
);
const Mail = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>
  </svg>
);
const TrendingUp = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>
  </svg>
);
const Check = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
const Command = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
  </svg>
);
const CornerDownLeft = ({ size = 12 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/>
  </svg>
);
const Wand = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/>
    <path d="m14 7 3 3"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════ */

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-[22%]" style={{ background: "var(--gradient-silver)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9), 0 1px 2px oklch(20% .01 270 / 0.15)" }} />
      <div className="absolute inset-[18%] rounded-[12%]" style={{ background: "var(--gradient-lavender)", opacity: 0.9 }} />
      <div className="absolute inset-[32%] rounded-[8%]" style={{ background: "var(--gradient-platinum)" }} />
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--muted-foreground)", fontFamily: "var(--font-mono, monospace)" }}>
      <span style={{ color: "var(--lavender)" }}>{icon}</span>
      {children}
    </div>
  );
}

function CardLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)", fontFamily: "var(--font-mono, monospace)" }}>
      <span style={{ color: "var(--lavender)" }}>{icon}</span>
      {children}
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md px-2 py-1.5" style={{ border: "1px solid oklch(91% .005 270 / 0.6)", background: "oklch(99.5% .001 270 / 0.7)" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--graphite)" }}>{value}</div>
    </div>
  );
}

function PrimaryCTA({ label = "Start a company", href = "/app?generate=1" }: { label?: string; href?: string }) {
  return (
    <Link href={href} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      borderRadius: 10, background: "var(--graphite)",
      padding: "11px 22px", fontSize: 14, fontWeight: 500,
      color: "oklch(98% .003 270)", textDecoration: "none",
      boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
    }}>
      {label} <ArrowRight size={14} />
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEGRATIONS GRID
══════════════════════════════════════════════════════════ */
const INTEGRATIONS = [
  { name: "Stripe",    color: "#635BFF", desc: "Payments & billing",     detail: "Stripe powers your revenue rails. Orchestra wires checkout, subscriptions, and billing logic so you never touch payments code." },
  { name: "Resend",   color: "#000000", desc: "Transactional email",     detail: "Resend delivers every founder email that matters — welcome sequences, password resets, billing receipts — triggered automatically by Orchestra." },
  { name: "Supabase", color: "#3ECF8E", desc: "Database & auth",         detail: "Supabase is your startup's memory. Orchestra uses it to store customers, events, and state — with Row Level Security built in by default." },
  { name: "Higgsfield", color: "#FF4D00", desc: "Visual generation",    detail: "Higgsfield renders cinematic launch videos and brand visuals for your startup. Orchestra queues and generates them when your brand is ready." },
  { name: "Lovable",  color: "#7C3AED", desc: "Website generation",      detail: "Lovable turns your Orchestra brief into a live, editable website. One click — and your startup has a real URL with real UI." },
  { name: "Vercel",   color: "#000000", desc: "Deployment & hosting",    detail: "Vercel deploys your site globally with zero config. Orchestra triggers deployments automatically as your startup evolves." },
  { name: "Linear",   color: "#5E6AD2", desc: "Issue tracking",          detail: "Linear is your roadmap. Orchestra creates tickets from founder intent, keeps them prioritized, and closes them when shipped." },
  { name: "Slack",    color: "#4A154B", desc: "Team communication",       detail: "Slack keeps your team in sync. Orchestra surfaces signals — new customers, churn alerts, revenue milestones — directly into your channels." },
  { name: "GitHub",   color: "#24292F", desc: "Code & version control",  detail: "GitHub stores your codebase. Orchestra reads your repos to understand what's built, what's pending, and what needs product attention." },
  { name: "Loops",    color: "#000000", desc: "Marketing email",         detail: "Loops runs your founder-to-user email campaigns. Orchestra syncs your audience segments and triggers sequences on key lifecycle events." },
  { name: "Posthog",  color: "#F54E00", desc: "Product analytics",       detail: "PostHog tracks how real users behave. Orchestra surfaces the signals that matter — drop-offs, activation events, feature adoption." },
  { name: "Cal",      color: "#292929", desc: "Scheduling",              detail: "Cal handles every meeting link. Orchestra uses it to book demos, investor calls, and customer onboarding sessions without the back-and-forth." },
] as const;

function IntegrationCard({ name, color, desc, detail }: { name: string; color: string; desc: string; detail: string }) {
  return (
    <div
      style={{
        padding: "16px", borderRadius: 14,
        border: "1px solid oklch(91% .005 270 / 0.9)",
        background: "oklch(99.5% .001 270)",
        boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04)",
        cursor: "default", position: "relative",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "oklch(82% .06 295 / 0.6)";
        el.style.boxShadow = "0 4px 20px oklch(20% .01 270 / 0.08)";
        el.style.transform = "translateY(-2px)";
        const detail = el.querySelector("[data-detail]") as HTMLElement | null;
        const short = el.querySelector("[data-short]") as HTMLElement | null;
        if (detail) detail.style.opacity = "1";
        if (short) short.style.opacity = "0";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "oklch(91% .005 270 / 0.9)";
        el.style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04)";
        el.style.transform = "none";
        const detail = el.querySelector("[data-detail]") as HTMLElement | null;
        const short = el.querySelector("[data-short]") as HTMLElement | null;
        if (detail) detail.style.opacity = "0";
        if (short) short.style.opacity = "1";
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 9, marginBottom: 10, flexShrink: 0,
        background: `${color}18`,
        border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, background: color, opacity: 0.85 }} />
      </div>

      {/* Name + desc */}
      <div data-short style={{ transition: "opacity 0.18s" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "oklch(22% .012 270)", marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: "oklch(62% .010 270)" }}>{desc}</div>
      </div>

      {/* Hover detail */}
      <div data-detail style={{
        position: "absolute", inset: "50px 16px 16px",
        opacity: 0, transition: "opacity 0.18s",
        fontSize: 11, color: "oklch(42% .010 270)", lineHeight: 1.55,
        pointerEvents: "none",
      }}>
        {detail}
      </div>
    </div>
  );
}

function IntegrationGrid() {
  return (
    <>
      <style>{`
        .integ-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 32px; }
        @media(min-width:640px){ .integ-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(min-width:1024px){ .integ-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
      <div className="integ-grid">
        {INTEGRATIONS.map((item) => (
          <IntegrationCard key={item.name} {...item} />
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const generateUrl = "/app?generate=1";

  return (
    <>
      {/* Scroll animations */}
      <style>{`
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .lp-rise-1 { animation: lp-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .lp-rise-2 { animation: lp-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both; }
        .lp-rise-3 { animation: lp-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.32s both; }
        .lp-rise-4 { animation: lp-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .lp-rise-5 { animation: lp-rise 0.7s cubic-bezier(0.22,1,0.36,1) 0.58s both; }
        .lp-fade-in { animation: lp-fade 0.8s ease 0.1s both; }
        .surface-card {
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s;
        }
        .surface-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 24px oklch(20% .01 270 / 0.1), 0 1px 2px oklch(20% .01 270 / 0.05);
        }
        .arc-grid .surface-card {
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s, border-color 0.18s;
        }
        .arc-grid .surface-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 32px oklch(20% .01 270 / 0.12);
          border-color: oklch(82% .06 295 / 0.4) !important;
        }
        .pillars-grid .surface-card {
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
        }
        .pillars-grid .surface-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px oklch(20% .01 270 / 0.12);
        }
      `}</style>

      <div
        className="lovable-root grain relative min-h-screen overflow-x-hidden"
        style={{
          background: "oklch(97.8% .008 285)",
          color: "oklch(22% .012 270)",
        }}
      >
        {/* ── Lavender atmospheric wash — stronger to match Lovable ── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 90% 60% at 65% -5%, oklch(88% .09 295 / 0.55), transparent 58%)",
            "radial-gradient(ellipse 55% 35% at 0% 60%, oklch(86% .08 295 / 0.22), transparent 55%)",
            "radial-gradient(ellipse 40% 25% at 100% 80%, oklch(88% .07 295 / 0.15), transparent 50%)",
          ].join(", "),
        }} />

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <header className="sticky top-0 z-30 px-5 pt-4 sm:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between rounded-2xl px-4 py-2.5" style={{
            background: "oklch(99.5% .001 270 / 0.6)",
            border: "1px solid oklch(91% .005 270 / 0.7)",
            boxShadow: "0 1px 0 oklch(100% 0 0 / 0.6) inset, 0 8px 24px -12px oklch(20% .01 270 / 0.15)",
            backdropFilter: "blur(20px)",
          }}>
            <div className="flex items-center gap-2">
              <LogoMark />
              <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--graphite)" }}>Orchestra</span>
            </div>
            <nav className="hidden items-center gap-7 md:flex" style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
              {[["#workspace","Workspace"],["#leads","Leads & Outreach"],["#copilot","Orchestra AI"],["#integrations","Integrations"]].map(([href, label]) => (
                <a key={href} href={href} style={{ textDecoration: "none", color: "inherit" }}>{label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/projects" className="hidden sm:block" style={{ fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none" }}>My startups</Link>
              <Link href={APP_URL} className="hidden sm:block" style={{ fontSize: 13, color: "var(--muted-foreground)", textDecoration: "none" }}>Sign in</Link>
              <PrimaryCTA label="Get started" />
            </div>
          </div>
        </header>

        {/* ══ HERO ════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-[920px] px-6 pt-16 text-center sm:pt-24">
          <div className="lp-rise-1 mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{
            border: "1px solid var(--border)",
            background: "oklch(99.5% .001 270 / 0.7)",
            backdropFilter: "blur(8px)",
            fontSize: 12, color: "var(--muted-foreground)",
          }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--lavender)", boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)" }} />
            Now in private preview
          </div>

          <h1 className="lp-rise-2" style={{
            fontFamily: SERIF,
            fontSize: "clamp(52px, 9vw, 88px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: "var(--graphite)",
          }}>
            The founder<br />
            <span style={{
              fontStyle: "italic",
              background: "var(--gradient-text)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}>
              operating system
            </span>.
          </h1>

          <p className="lp-rise-3 mx-auto mt-6 max-w-[600px] leading-relaxed" style={{
            fontSize: "clamp(15px, 2vw, 17px)", color: "var(--muted-foreground)", marginTop: 24,
          }}>
            Orchestra takes a founder from idea to operating company. Not a website builder.
            A quiet workspace that names the company, ships the site, finds the customers,
            and runs the rails behind them.
          </p>

          <div className="lp-rise-4 mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full px-3 py-1.5" style={{
            border: "1px solid var(--border)",
            background: "oklch(99.5% .001 270 / 0.7)",
            backdropFilter: "blur(8px)",
            fontSize: 12, color: "var(--muted-foreground)", marginTop: 20,
          }}>
            {["Idea","Company","Website","Customers","Operations"].map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: "var(--lavender)" }}><ArrowRight /></span>}
                <span style={{ fontWeight: 500, color: "var(--graphite)" }}>{step}</span>
              </span>
            ))}
          </div>

          <div className="lp-rise-5 flex flex-wrap items-center justify-center gap-3" style={{ marginTop: 32 }}>
            <Link href={generateUrl} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 10, background: "var(--graphite)",
              padding: "13px 28px", fontSize: 14, fontWeight: 500,
              color: "oklch(98% .003 270)", textDecoration: "none",
              boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 8px 24px oklch(28% .015 280 / 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "";
                (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)";
              }}
            >
              Start a company <ArrowRight size={14} />
            </Link>
            <a href="#workspace" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              borderRadius: 10, padding: "13px 22px", fontSize: 14,
              color: "var(--muted-foreground)", border: "1px solid var(--border)", textDecoration: "none",
              transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(70% .11 295 / 0.5)";
                (e.currentTarget as HTMLElement).style.color = "var(--graphite)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
              }}
            >
              Watch the tour
            </a>
          </div>
        </section>

        {/* ══ WORKSPACE MOCKUP ════════════════════════════════ */}
        <section id="workspace" className="relative z-10 mt-12 px-5 sm:px-8 lg:mt-20">
          <div className="relative mx-auto w-full max-w-[1180px]">
            <div className="surface-panel grain relative overflow-hidden rounded-[24px] p-1.5">

              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  {[["oklch(82% .08 25)"],["oklch(85% .12 85)"],["oklch(80% .13 150)"]].map(([bg], i) => (
                    <span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: bg }} />
                  ))}
                </div>
                <div className="text-mono" style={{ fontSize: 11, letterSpacing: "-0.02em", color: "var(--muted-foreground)" }}>orchestra · workspace · loomly</div>
                <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ border: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99.5% .001 270 / 0.6)", fontSize: 10, color: "var(--muted-foreground)" }}>
                  <Command /> K
                </div>
              </div>

              {/* Dashboard inner */}
              <div className="rounded-[18px] p-4 sm:p-6" style={{ background: "linear-gradient(to bottom, oklch(99.5% .001 270 / 0.9), oklch(99.5% .001 270 / 0.4))" }}>

                {/* Dashboard header row */}
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--muted-foreground)" }}>
                      <span style={{ color: "var(--lavender)" }}><Sparkles /></span>
                      Founder workspace
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--graphite)", marginTop: 4 }}>
                      Loomly<span style={{ color: "var(--lavender)" }}>.</span>
                    </div>
                    <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--muted-foreground)", marginTop: 2 }}>Day 14 · Pre-launch · 8 integrations live</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "var(--lavender-soft)", fontSize: 11, fontWeight: 500, color: "oklch(38% .095 295)" }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--lavender)", boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)" }} />
                      All systems calm
                    </span>
                    <span className="inline-flex items-center rounded-full px-2.5 py-1" style={{ border: "1px solid var(--border)", background: "oklch(99.5% .001 270 / 0.7)", fontSize: 11, color: "var(--muted-foreground)" }}>Today</span>
                  </div>
                </div>

                {/* ── 12-col card grid — explicit CSS grid, no Tailwind dependency ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>

                  {/* Row 1: Health (5 cols) + Launch progress (7 cols) */}

                  {/* Card 1 — Startup health */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12", animationDelay: "0ms" }}
                    data-ws-health="true">
                    <style>{`
                      @media(min-width:1024px){ [data-ws-health] { grid-column: span 5 !important } }
                      @media(min-width:1024px){ [data-ws-launch] { grid-column: span 7 !important } }
                      @media(min-width:640px){  [data-ws-site]   { grid-column: span 6 !important } }
                      @media(min-width:1024px){ [data-ws-site]   { grid-column: span 4 !important } }
                      @media(min-width:640px){  [data-ws-auto]   { grid-column: span 6 !important } }
                      @media(min-width:1024px){ [data-ws-auto]   { grid-column: span 4 !important } }
                      @media(min-width:1024px){ [data-ws-leads]  { grid-column: span 4 !important } }
                      @media(min-width:1024px){ [data-ws-content]{ grid-column: span 6 !important } }
                      @media(min-width:640px){  [data-ws-email]  { grid-column: span 6 !important } }
                      @media(min-width:1024px){ [data-ws-email]  { grid-column: span 3 !important } }
                      @media(min-width:640px){  [data-ws-growth] { grid-column: span 6 !important } }
                      @media(min-width:1024px){ [data-ws-growth] { grid-column: span 3 !important } }
                    `}</style>
                    <CardLabel icon={<Activity />}>Startup health</CardLabel>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 400, lineHeight: 1, color: "var(--graphite)" }}>92</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4 }}>out of 100 · steady</div>
                      </div>
                      <svg viewBox="0 0 120 40" style={{ height: 48, width: 128, color: "var(--lavender)", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="1.5">
                        <defs>
                          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.7 0.11 295)" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="oklch(0.7 0.11 295)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0 30 L15 26 L28 28 L42 18 L58 22 L72 12 L88 16 L104 8 L120 10 L120 40 L0 40 Z" fill="url(#sparkFill)" stroke="none" />
                        <path d="M0 30 L15 26 L28 28 L42 18 L58 22 L72 12 L88 16 L104 8 L120 10" />
                      </svg>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 16 }}>
                      <MetricBox label="Clarity" value="A+" />
                      <MetricBox label="Momentum" value="A" />
                      <MetricBox label="Risk" value="Low" />
                    </div>
                  </div>

                  {/* Card 2 — Launch progress */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-launch="true">
                    <div className="flex items-center justify-between">
                      <CardLabel icon={<Rocket />}>Launch progress</CardLabel>
                      <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--muted-foreground)" }}>68%</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "oklch(95.5% .004 270)" }}>
                      <div className="h-full rounded-full" style={{ width: "68%", background: "var(--gradient-lavender)" }} />
                    </div>
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { week: "Week 1", task: "Identity & landing", done: true },
                        { week: "Week 2", task: "Invite 25 design partners", done: true },
                        { week: "Week 3", task: "Ship inbox triage v1", num: "03" },
                        { week: "Week 4", task: "Public launch on Product Hunt", num: "04" },
                      ].map((item) => (
                        <div key={item.week} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ border: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99.5% .001 270 / 0.7)" }}>
                          <div style={{ width: 58, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)", flexShrink: 0, fontFamily: "var(--font-mono, monospace)" }}>{item.week}</div>
                          <div style={{ flex: 1, fontSize: 13, color: "var(--graphite)" }}>{item.task}</div>
                          {item.done
                            ? <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "oklch(70% .11 295 / 0.3)", color: "oklch(38% .095 295)", flexShrink: 0 }}><Check /></div>
                            : <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, color: "oklch(52% .012 270 / 0.7)" }}>{item.num}</span>
                          }
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 2: Website (4) + Automations (4) + Leads (4) */}

                  {/* Card 3 — Website */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-site="true">
                    <CardLabel icon={<Globe />}>Website</CardLabel>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50" style={{ background: "var(--lavender)" }} />
                        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--lavender)" }} />
                      </span>
                      <span style={{ fontSize: 13, color: "var(--graphite)" }}>Live</span>
                      <span className="ml-auto" style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--muted-foreground)" }}>loomly.fm</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 12 }}>
                      <MetricBox label="Lighthouse" value="99" />
                      <MetricBox label="Uptime 30d" value="100%" />
                    </div>
                  </div>

                  {/* Card 4 — Active automations */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-auto="true">
                    <CardLabel icon={<Zap />}>Active automations</CardLabel>
                    <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 400, lineHeight: 1, color: "var(--graphite)", marginTop: 12 }}>12</div>
                    <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Lead → Resend welcome", "Signup → Stripe trial", "Reply → Linear ticket"].map((rule) => (
                        <li key={rule} className="flex items-center gap-2" style={{ fontSize: 12, color: "oklch(32% .012 275 / 0.85)" }}>
                          <svg width="6" height="6" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="5" fill="oklch(70% .11 295)" /></svg>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card 5 — Leads */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-leads="true">
                    <div className="flex items-center justify-between">
                      <CardLabel icon={<Users />}>Leads</CardLabel>
                      <span style={{ fontSize: 11, color: "oklch(40% .095 295)" }}>+18%</span>
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 400, lineHeight: 1, color: "var(--graphite)", marginTop: 12 }}>348</div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4 }}>this week · 41 qualified</div>
                    <div className="mt-3 flex" style={{ gap: -6, marginTop: 12 }}>
                      {[0,1,2,3,4].map((i) => (
                        <div key={i} className="h-6 w-6 rounded-full" style={{ background: "var(--gradient-platinum)", outline: "2px solid oklch(99.5% .001 270)", marginLeft: i === 0 ? 0 : -6, boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.8)" }} />
                      ))}
                      <div style={{ marginLeft: 8, alignSelf: "center", fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--muted-foreground)" }}>+343</div>
                    </div>
                  </div>

                  {/* Row 3: Content (6) + Email (3) + Growth (3) */}

                  {/* Card 6 — Content engine */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-content="true">
                    <CardLabel icon={<FileText />}>Content engine</CardLabel>
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { title: "Essay · Why inboxes scream", status: "Drafted" },
                        { title: "Landing rewrite · v3", status: "In review" },
                        { title: "Launch thread · Product Hunt", status: "Scheduled" },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ border: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99.5% .001 270 / 0.7)", fontSize: 13 }}>
                          <span style={{ color: "var(--graphite)" }}>{item.title}</span>
                          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 7 — Email campaigns */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-email="true">
                    <CardLabel icon={<Mail />}>Email campaigns</CardLabel>
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[["Open","62%"],["Reply","14%"],["Sent","2,108"]].map(([k,v]) => (
                        <div key={k} className="flex items-center justify-between" style={{ fontSize: 12.5 }}>
                          <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
                          <span style={{ fontWeight: 500, color: "var(--graphite)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg px-2.5 py-1.5" style={{ background: "oklch(90% .04 295 / 0.7)", fontSize: 11, color: "oklch(38% .1 295)", marginTop: 12 }}>
                      Next send · Tue 9:00
                    </div>
                  </div>

                  {/* Card 8 — Growth */}
                  <div className="surface-card relative rounded-2xl p-4" style={{ gridColumn: "span 12" }} data-ws-growth="true">
                    <CardLabel icon={<TrendingUp />}>Growth</CardLabel>
                    <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {["Partner with Linear", "Referral loop on seats", "Founder essays · 2 / wk"].map((item) => (
                        <li key={item} className="flex items-start gap-2" style={{ fontSize: 12.5, color: "oklch(32% .012 275 / 0.9)" }}>
                          <span style={{ marginTop: 2, flexShrink: 0, color: "var(--lavender)" }}><ArrowUpRight /></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>{/* /grid */}
              </div>{/* /dashboard inner */}
            </div>{/* /surface-panel */}
          </div>
        </section>

        {/* ══ THE ARC ═════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto mt-28 max-w-[1180px] px-6">
          <div aria-hidden="true" className="absolute -left-40 top-0 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--gradient-lavender)", opacity: 0.25 }} />
          <SectionLabel icon={<Sparkles />}>The arc</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12, maxWidth: 820 }}>
            From a sentence<br />
            to a <span style={{ fontStyle: "italic", background: "var(--gradient-text)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>running company</span>.
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.6, maxWidth: 560, marginTop: 16 }}>
            Most tools stop at the website. Orchestra keeps going — through customers,
            revenue, and the daily operations of the business you started.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginTop: 40 }}>
            <style>{`@media(min-width:768px){.arc-grid{grid-template-columns:repeat(5,1fr)!important}}`}</style>
            <div className="arc-grid" style={{ display: "contents" }}>
              {[
                { n: "01", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>, label: "Idea", desc: "One sentence is enough." },
                { n: "02", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>, label: "Company", desc: "Identity, model, positioning." },
                { n: "03", icon: <Globe size={16} />, label: "Website", desc: "Landing, waitlist, payments." },
                { n: "04", icon: <Users size={16} />, label: "Customers", desc: "Outbound, content, leads." },
                { n: "05", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>, label: "Operations", desc: "The rails behind it all." },
              ].map((step, i) => (
                <div key={step.n} className="surface-card relative rounded-2xl p-4">
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted-foreground)" }}>{step.n}</div>
                  <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-platinum)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9)", color: "var(--lavender)" }}>{step.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--graphite)", marginTop: 12 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.4, marginTop: 4 }}>{step.desc}</div>
                  {i < 4 && <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 md:block" style={{ color: "var(--lavender)" }}><ArrowRight size={14} /></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center" style={{ marginTop: 32 }}>
            <PrimaryCTA label="Start your arc" />
          </div>
        </section>

        {/* ══ THREE MOVEMENTS ═════════════════════════════════ */}
        <section id="pillars" className="relative z-10 mx-auto mt-28 max-w-[1180px] px-6">
          <SectionLabel icon={<Sparkles />}>Three movements</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12, maxWidth: 700 }}>
            A workspace that thinks<br />
            <span style={{ fontStyle: "italic", color: "var(--lavender)" }}>like a co-founder</span>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginTop: 40 }}>
            <style>{`@media(min-width:768px){.pillars-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
            <div className="pillars-grid" style={{ display: "contents" }}>
              {[
                { icon: <Wand />, label: "Generate", desc: "Identity, audience, positioning, pricing, and a roadmap — drafted in seconds with the taste of a senior operator.", cta: "Generate your startup", href: generateUrl },
                { icon: <Rocket size={16} />, label: "Launch", desc: "Site, waitlist, payments, and outbound wired together. Ship publicly without stitching ten tools yourself.", cta: "Launch your business", href: generateUrl },
                { icon: <Workflow size={16} />, label: "Operate", desc: "Stripe, Resend, Slack, GitHub and more plug in as native rails. Orchestra runs the loops, you make the calls.", cta: "View integrations", href: "#integrations" },
              ].map((pillar) => (
                <div key={pillar.label} className="surface-card group relative flex flex-col overflow-hidden rounded-2xl p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-platinum)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9), 0 1px 2px oklch(20% .01 270 / 0.1)", color: "var(--graphite)" }}>{pillar.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: "var(--graphite)", marginTop: 20 }}>{pillar.label}</h3>
                  <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: 8, flexGrow: 1 }}>{pillar.desc}</p>
                  <Link href={pillar.href} className="inline-flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 500, color: "var(--lavender)", textDecoration: "none", marginTop: 20 }}>
                    {pillar.cta} <ArrowRight />
                  </Link>
                  <div className="absolute inset-x-6 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "linear-gradient(to right, transparent, oklch(70% .11 295 / 0.4), transparent)" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ OPERATING PARTNER ═══════════════════════════════ */}
        <section id="copilot" className="relative z-10 mx-auto mt-28 max-w-[1180px] px-6">
          <div className="surface-panel relative overflow-hidden rounded-[28px] p-6 sm:p-10">
            <div aria-hidden="true" className="absolute -left-32 -top-32 h-80 w-80 rounded-full blur-3xl" style={{ background: "var(--gradient-lavender)", opacity: 0.5 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
              <style>{`@media(min-width:1024px){.copilot-grid{grid-template-columns:5fr 7fr!important}}`}</style>
              <div className="copilot-grid" style={{ display: "contents" }}>

                {/* Left — copy */}
                <div>
                  <SectionLabel icon={<Sparkles />}>Orchestra AI</SectionLabel>
                  <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12 }}>
                    Your<br />
                    <span style={{ fontStyle: "italic", background: "var(--gradient-text)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>operating partner</span>.
                  </h2>
                  <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.6, maxWidth: 420, marginTop: 20 }}>
                    A persistent copilot that lives across every surface of your workspace.
                    It thinks like a strategic co-founder — not a chatbot — and helps you
                    decide what to build, what to ship, and what to fix next.
                  </p>
                  <div className="mt-6 flex items-center gap-2" style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 24 }}>
                    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ border: "1px solid var(--border)", background: "oklch(99.5% .001 270 / 0.7)", fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: "var(--graphite)" }}>
                      <Command /> K
                    </span>
                    summons it from anywhere
                  </div>
                </div>

                {/* Right — chat UI */}
                <div>
                  <div className="surface-card rounded-2xl p-4 sm:p-5">

                    {/* Chat header */}
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "oklch(91% .005 270 / 0.6)" }}>
                      <div className="flex items-center gap-2">
                        <LogoMark size={28} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--graphite)" }}>Orchestra</div>
                          <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Operating partner · always on</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "var(--lavender-soft)", fontSize: 11, fontWeight: 500, color: "oklch(38% .095 295)" }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--lavender)" }} />
                        Listening
                      </span>
                    </div>

                    {/* Conversation */}
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div className="flex items-start gap-2">
                        <LogoMark size={24} />
                        <div style={{ maxWidth: "85%", borderRadius: "16px 16px 16px 4px", border: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99.5% .001 270 / 0.8)", padding: "8px 14px", fontSize: 13.5, color: "var(--graphite)", lineHeight: 1.6 }}>
                          You&apos;re 14 days in. Health is steady at 92. The two unlocks this week are{" "}
                          <em>shipping inbox triage v1</em> and <em>warming the launch list</em>. Want me to draft both?
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div style={{ maxWidth: "80%", borderRadius: "16px 16px 4px 16px", background: "var(--graphite)", color: "oklch(98% .003 270)", padding: "8px 14px", fontSize: 13.5, boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)" }}>
                          Draft the launch sequence first.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <LogoMark size={24} />
                        <div style={{ maxWidth: "85%", borderRadius: "16px 16px 16px 4px", border: "1px solid oklch(91% .005 270 / 0.7)", background: "oklch(99.5% .001 270 / 0.8)", padding: "8px 14px", fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6, fontStyle: "italic" }}>
                          Composing 4-email sequence · pulling tone from your essays …
                        </div>
                      </div>
                    </div>

                    {/* Suggested moves */}
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted-foreground)" }}>Suggested moves</div>
                      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {[
                          "What should I do next?",
                          "Generate launch assets",
                          "Create an email campaign",
                          "Analyze startup health",
                          "Suggest growth opportunities",
                          "Help launch the business",
                        ].map((chip) => (
                          <button key={chip} type="button" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors" style={{
                            border: "1px solid var(--border)",
                            background: "oklch(99.5% .001 270 / 0.8)",
                            fontSize: 12.5, color: "var(--graphite)", cursor: "pointer",
                          }}>
                            <span style={{ color: "var(--lavender)" }}><Sparkles /></span>
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-1 rounded-xl p-1" style={{ border: "1px solid var(--border)", background: "oklch(99.5% .001 270 / 0.8)", marginTop: 20 }}>
                      <input
                        className="flex-1 rounded-lg bg-transparent px-3 py-2 focus:outline-none"
                        placeholder="Ask your operating partner…"
                        style={{ fontSize: 13.5, color: "var(--graphite)" }}
                        readOnly
                      />
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2" style={{ background: "var(--graphite)", fontSize: 12, fontWeight: 500, color: "oklch(98% .003 270)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.14)", cursor: "pointer" }}>
                        Send <CornerDownLeft />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══ INTEGRATIONS ════════════════════════════════════ */}
        {/* ══ LEADS & OUTREACH ════════════════════════════════ */}
        <section id="leads" className="relative z-10 mx-auto mt-28 max-w-[1180px] px-6">
          <div aria-hidden="true" className="absolute -right-32 top-0 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--gradient-lavender)", opacity: 0.18 }} />
          <div className="relative">
            <SectionLabel icon={<Users size={12} />}>Client acquisition</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12, maxWidth: 700 }}>
              From zero to first client<br />
              in <span style={{ fontStyle: "italic" }}>one session</span>.
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: 16, maxWidth: 520 }}>
              Orchestra finds local businesses with weak websites, qualifies them, and drafts personalized outreach — so you go in with context, not cold.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 40 }}>
              {[
                { n: "01", icon: <Globe size={16} />, label: "Discover", desc: "Input a niche and city. Orchestra produces Google search queries, local directories, and a qualification checklist — all in under a minute." },
                { n: "02", icon: <FileText size={16} />, label: "Qualify", desc: "Score each lead by website quality, social presence, and fit. Flag the best opportunities automatically before you spend a single minute on outreach." },
                { n: "03", icon: <Mail size={16} />, label: "Outreach", desc: "3 personalized drafts per lead — email with opt-out, Instagram DM, in-person opener — referencing their specific website weakness. Founder approves, then sends." },
              ].map((step, i) => (
                <div key={i} className="surface-card rounded-2xl p-5">
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted-foreground)" }}>{step.n}</div>
                  <div className="mt-3 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-platinum)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9)", color: "var(--lavender)" }}>{step.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--graphite)", marginTop: 12 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5, marginTop: 4 }}>{step.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              {[
                { icon: <TrendingUp size={14} />, label: "Pipeline tracking", desc: "Move leads from contacted → demo → proposal → closed. Every stage persists. The agent knows where every prospect stands." },
                { icon: <Zap size={14} />, label: "7-day action plan", desc: "Orchestra generates a concrete daily plan starting with warm connections — family, school, local — before cold outreach. No generic advice." },
              ].map((item, i) => (
                <div key={i} className="surface-card rounded-2xl p-5 flex gap-4 items-start">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--gradient-platinum)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9)", color: "var(--lavender)" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--graphite)" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5, marginTop: 4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3" style={{ marginTop: 28 }}>
              <Link href="/app/leads" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, background: "var(--graphite)", padding: "11px 22px", fontSize: 14, fontWeight: 500, color: "oklch(98% .003 270)", textDecoration: "none", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)" }}>
                Open Leads <ArrowRight size={14} />
              </Link>
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Or ask the agent below ↓</span>
            </div>
          </div>
        </section>

        <section id="integrations" className="relative z-10 mx-auto mt-28 max-w-[1180px] px-6">
          <SectionLabel icon={<Workflow />}>Native rails</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12, maxWidth: 700 }}>
            Every tool a founder<br />
            actually <span style={{ fontStyle: "italic" }}>reaches for</span>.
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: 16, maxWidth: 540 }}>
            Orchestra plugs into the tools you already use. Hover to see what each one does inside your startup.
          </p>
          <IntegrationGrid />
        </section>

        {/* ══ CTA ═════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto mt-28 max-w-[820px] px-6 text-center">
          <div className="surface-panel relative overflow-hidden rounded-[28px] px-8 py-16">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--gradient-lavender)", opacity: 0.4 }} />
            <div className="relative">
              <SectionLabel icon={<Sparkles />}>What comes next</SectionLabel>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 0.95, color: "var(--graphite)", marginTop: 12 }}>
                Start the company<br />
                <span style={{ fontStyle: "italic", background: "var(--gradient-text)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>you keep describing</span>.
              </h2>
              <p style={{ fontSize: 15, color: "var(--muted-foreground)", lineHeight: 1.6, maxWidth: 480, margin: "20px auto 0" }}>
                Private preview is open to a small group of founders this quarter.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3" style={{ marginTop: 32 }}>
                <PrimaryCTA label="Generate my startup" />
                <Link href={APP_URL} style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, padding: "11px 22px", fontSize: 14, color: "var(--muted-foreground)", border: "1px solid var(--border)", textDecoration: "none" }}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer className="relative z-10 mx-auto max-w-[1180px] px-6 py-16">
          <div className="flex flex-col items-center gap-4 border-t pt-10 text-center" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <LogoMark />
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--graphite)" }}>Orchestra</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>The founder operating system · private preview</p>
          </div>
        </footer>

      </div>

      <FloatingAgent />
    </>
  );
}
