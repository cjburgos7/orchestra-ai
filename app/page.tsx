"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Palette & Design Tokens ──────────────────────────────────────────────────
   Blue  : #3B82F6 (accent), #EFF6FF (tint), #DBEAFE (border)
   Green : #22C55E (positive), #F0FDF4 (tint), #DCFCE7 (border)
   Purple: #A78BFA (orchestra glow — used sparingly), #F5F3FF (tint)
   Neutral: #0F172A (headings), #475569 (body), #94A3B8 (muted), #F8FAFC (bg)
─────────────────────────────────────────────────────────────────────────────── */

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOGOS = ["Accel", "Sequoia", "Y Combinator", "a16z", "First Round", "Kleiner"];

const FRAGMENTED_TOOLS = [
  { name: "Vercel", role: "Hosting", icon: "▲", color: "blue" as const },
  { name: "Supabase", role: "Database", icon: "⚡", color: "green" as const },
  { name: "GitHub", role: "Code", icon: "◆", color: "blue" as const },
  { name: "Stripe", role: "Payments", icon: "◈", color: "purple" as const },
  { name: "APIs", role: "Integrations", icon: "◎", color: "green" as const },
  { name: "Deploy", role: "Infrastructure", icon: "↗", color: "blue" as const },
];

const ORCHESTRA_WORKFLOW = [
  { label: "Pick a template", sub: "Your idea, ready to go", color: "blue" as const },
  { label: "Configure once", sub: "Stack wired automatically", color: "green" as const },
  { label: "Launch live", sub: "Hosting, DB, payments", color: "purple" as const },
  { label: "Grow", sub: "Analytics & scale built in", color: "blue" as const },
];

const FEATURES = [
  {
    icon: "✦",
    color: "blue",
    title: "Choose a template",
    body: "Pick from beautifully crafted startup blueprints. No code required to get started.",
  },
  {
    icon: "◎",
    color: "green",
    title: "Configure in plain English",
    body: "Tell Orchestra what your startup does. It handles the technical decisions for you.",
  },
  {
    icon: "⟡",
    color: "purple",
    title: "Launch with one click",
    body: "Your startup goes live instantly. Hosting, scaling, and security — all taken care of.",
  },
];

const TEMPLATES = [
  {
    id: "1",
    emoji: "🧠",
    name: "AI Writing Assistant",
    tagline: "Help people write better, faster.",
    time: "Ready in 3 min",
    category: "Content",
    color: "blue",
  },
  {
    id: "2",
    emoji: "📊",
    name: "Smart Analytics Tool",
    tagline: "Turn data into decisions, automatically.",
    time: "Ready in 4 min",
    category: "Analytics",
    color: "green",
  },
  {
    id: "3",
    emoji: "🎯",
    name: "Customer Support AI",
    tagline: "Delight customers at any scale.",
    time: "Ready in 3 min",
    category: "Support",
    color: "blue",
  },
  {
    id: "4",
    emoji: "🔍",
    name: "Document Intelligence",
    tagline: "Search and understand any document.",
    time: "Ready in 5 min",
    category: "Productivity",
    color: "purple",
  },
  {
    id: "5",
    emoji: "🛒",
    name: "AI Shopping Assistant",
    tagline: "Personalize every customer journey.",
    time: "Ready in 4 min",
    category: "E-commerce",
    color: "green",
  },
  {
    id: "6",
    emoji: "📚",
    name: "Learning Platform",
    tagline: "Adaptive courses that fit every learner.",
    time: "Ready in 5 min",
    category: "EdTech",
    color: "blue",
  },
];

const STEPS = [
  {
    num: "1",
    color: "blue",
    title: "Pick your idea",
    body: "Browse templates or describe your startup idea in a sentence. Orchestra finds the perfect starting point.",
  },
  {
    num: "2",
    color: "green",
    title: "Customize without code",
    body: "Use our visual editor to add your branding, tweak features, and make it yours — no technical knowledge needed.",
  },
  {
    num: "3",
    color: "purple",
    title: "Launch & grow",
    body: "Go live with one click. Orchestra handles infrastructure, payments, and analytics so you can focus on customers.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "Free",
    sub: "No credit card needed",
    cta: "Start for free",
    primary: false,
    features: [
      "3 projects",
      "Up to 500 users",
      "Community templates",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    sub: "per month",
    cta: "Start free trial",
    primary: true,
    features: [
      "Unlimited projects",
      "Up to 50,000 users",
      "All 40+ templates",
      "Advanced analytics",
      "Custom domain",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "$149",
    sub: "per month",
    cta: "Talk to us",
    primary: false,
    features: [
      "Everything in Growth",
      "Unlimited users",
      "White-label option",
      "Dedicated account manager",
      "SLA guarantee",
      "Team collaboration",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I launched my first AI startup in an afternoon. I kept waiting for it to get complicated — it never did.",
    name: "Sarah Chen",
    role: "Founder, Scribe AI",
    initials: "SC",
    color: "blue",
  },
  {
    quote:
      "Orchestra made me feel like I actually knew what I was doing. Now I have 800 paying customers.",
    name: "Marcus Webb",
    role: "Solo Founder",
    initials: "MW",
    color: "green",
  },
  {
    quote:
      "I was terrified of the technical side. Orchestra removed that fear completely. Couldn't have done it without it.",
    name: "Priya Nair",
    role: "Founder, LensAI",
    initials: "PN",
    color: "purple",
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
    dot: "bg-blue-500",
    ring: "ring-blue-200",
    btn: "bg-blue-600 hover:bg-blue-700 text-white",
    pill: "bg-blue-50 text-blue-700",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    badge: "bg-green-50 text-green-700 border-green-100",
    dot: "bg-green-500",
    ring: "ring-green-200",
    btn: "bg-green-600 hover:bg-green-700 text-white",
    pill: "bg-green-50 text-green-700",
  },
  purple: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    text: "text-violet-500",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
    dot: "bg-violet-400",
    ring: "ring-violet-200",
    btn: "bg-violet-600 hover:bg-violet-700 text-white",
    pill: "bg-violet-50 text-violet-600",
  },
};

// ─── Components ───────────────────────────────────────────────────────────────

function Nav({ onSection }: { onSection: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_#e2e8f0]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <span className="text-[17px] font-bold text-slate-900 tracking-tight">Orchestra</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {[
            ["How it works", "steps"],
            ["Templates", "templates"],
            ["Pricing", "pricing"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => onSection(id)}
              className="text-[14px] text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="text-[14px] text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors">
            Sign in
          </button>
          <button className="text-[14px] bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-200">
            Get started free
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ id }: { id: string }) {
  const [typed, setTyped] = useState("");
  const phrases = ["writing tool", "analytics platform", "customer support bot", "learning app"];
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let i = 0;
    let dir = 1;
    const tick = setInterval(
      () => {
        if (dir === 1) {
          i++;
          setTyped(phrase.slice(0, i));
          if (i === phrase.length) {
            dir = -1;
            clearInterval(tick);
            setTimeout(() => {
              const erase = setInterval(() => {
                i--;
                setTyped(phrase.slice(0, i));
                if (i === 0) {
                  clearInterval(erase);
                  setPhraseIdx((p) => (p + 1) % phrases.length);
                }
              }, 40);
            }, 1600);
          }
        }
      },
      60
    );
    return () => clearInterval(tick);
  }, [phraseIdx]);

  return (
    <section id={id} className="relative pt-36 pb-24 overflow-hidden bg-white">
      {/* Soft background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-gradient-to-b from-blue-50 to-transparent opacity-80" />
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-60" />
        <div className="absolute top-60 -right-20 w-72 h-72 rounded-full bg-violet-50 blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          2,800+ startups launched · now in public beta
        </div>

        <h1 className="text-[56px] md:text-[72px] font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
          Launch your AI{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              {typed}
              <span className="animate-blink border-r-2 border-blue-500 ml-0.5">&nbsp;</span>
            </span>
          </span>
          <br />
          without writing code.
        </h1>

        <p className="text-[18px] text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 font-normal">
          Orchestra gives non-technical founders everything they need to build, launch, and grow
          an AI startup — in minutes, not months.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200">
            Start for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-[15px] hover:border-slate-300 hover:bg-slate-50 transition-all duration-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
            </svg>
            Watch 2-min demo
          </button>
        </div>

        {/* Social proof */}
        <p className="text-[12px] text-slate-400 uppercase tracking-widest font-medium mb-5">
          Trusted by founders backed by
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {LOGOS.map((l) => (
            <span key={l} className="text-[13px] font-bold text-slate-300 tracking-tight">
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Hero dashboard preview */}
      <div className="relative max-w-5xl mx-auto px-6 mt-16">
        <div className="rounded-3xl border border-slate-100 shadow-[0_24px_80px_-12px_rgba(59,130,246,0.12)] overflow-hidden bg-white">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-amber-300" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-4 py-1 text-[12px] text-slate-400 font-medium shadow-sm">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#22c55e" strokeWidth="1.5" />
                  <path d="M3 5l1.5 1.5L7 3.5" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                app.orchestra.ai/dashboard
              </div>
            </div>
          </div>
          {/* Dashboard body */}
          <div className="p-6 bg-[#FAFBFC]">
            <div className="flex gap-4 mb-5">
              {[
                { label: "Active users", val: "1,284", delta: "+24%", c: "green" },
                { label: "Revenue / mo", val: "$4,820", delta: "+18%", c: "blue" },
                { label: "AI requests", val: "82K", delta: "+41%", c: "blue" },
                { label: "Uptime", val: "99.99%", delta: "All systems go", c: "green" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm"
                >
                  <div className="text-[11px] text-slate-400 font-medium mb-1">{m.label}</div>
                  <div className="text-xl font-bold text-slate-900 mb-1">{m.val}</div>
                  <div
                    className={`text-[11px] font-semibold ${
                      m.c === "green" ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {m.delta}
                  </div>
                </div>
              ))}
            </div>
            {/* Fake chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[13px] font-semibold text-slate-700">User growth</span>
                <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1">
                  Last 30 days
                </span>
              </div>
              <svg viewBox="0 0 600 90" className="w-full h-20">
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,75 C40,70 80,65 120,58 C160,50 190,55 230,44 C270,33 300,28 340,22 C380,16 420,18 460,12 C500,6 540,8 600,4"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <path
                  d="M0,75 C40,70 80,65 120,58 C160,50 190,55 230,44 C270,33 300,28 340,22 C380,16 420,18 460,12 C500,6 540,8 600,4 L600,90 L0,90Z"
                  fill="url(#blueGrad)"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Glow under dashboard */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-violet-300/20 blur-2xl rounded-full pointer-events-none" />
      </div>
    </section>
  );
}

function UnifiedPlatformSection({ id }: { id: string }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id={id} className="py-28 bg-white border-t border-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            One platform, not twelve tabs
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4 max-w-3xl mx-auto">
            Everything founders usually stitch together — in one simple workflow.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Instead of juggling Vercel, Supabase, GitHub, Stripe, hosting, APIs, deployment tools,
            and infrastructure separately — Orchestra combines everything into one simple workflow.
          </p>
        </div>

        {/* Before vs after */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Before — fragmented */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Before
              </span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
                12+ tools · constant context switching
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm mb-4">
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-slate-100 bg-slate-50 overflow-x-auto">
                {["Vercel", "Supabase", "GitHub", "Stripe", "DNS", "API", "Logs", "Deploy"].map(
                  (tab, i) => (
                    <div
                      key={tab}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                        i === 2
                          ? "bg-white border-slate-200 text-slate-700 shadow-sm"
                          : "bg-transparent border-transparent text-slate-400"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {tab}
                    </div>
                  )
                )}
              </div>
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className="h-2 rounded-full bg-slate-100"
                    style={{ width: `${90 - row * 18}%` }}
                  />
                ))}
                <p className="text-[12px] text-slate-400 pt-2 font-medium">
                  Config here, deploy there, debug somewhere else…
                </p>
              </div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              More tabs, more logins, more things to break before you ship.
            </p>
          </div>

          {/* After — unified */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-violet-50/40 p-6 shadow-md shadow-blue-100/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-5 relative">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                With Orchestra
              </span>
              <span className="text-[11px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-soft" />
                1 workflow · 1 dashboard
              </span>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm mb-4 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center shadow-md shadow-blue-200">
                  <span className="text-white text-sm font-bold">O</span>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-slate-900">Orchestra workspace</div>
                  <div className="text-[12px] text-slate-400">Build → configure → launch</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ORCHESTRA_WORKFLOW.map((step, i) => {
                  const c = colorMap[step.color];
                  return (
                    <div key={step.label} className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}
                      >
                        <span className={`text-[11px] font-black ${c.text}`}>{i + 1}</span>
                      </div>
                      {i < ORCHESTRA_WORKFLOW.length - 1 && (
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 via-green-200 to-violet-200 min-w-[8px] workflow-line" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[12px] text-slate-500 mt-4 font-medium">
                Hosting, database, payments, and deploy — handled in one place.
              </p>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed relative">
              Fewer tabs. Less overwhelm. One streamlined path from idea to live product.
            </p>
          </div>
        </div>

        {/* Tool cards — what Orchestra replaces */}
        <div
          className={`mb-14 transition-all duration-700 delay-150 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-center text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Replaces the usual stack
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FRAGMENTED_TOOLS.map((tool, i) => {
              const c = colorMap[tool.color];
              return (
                <div
                  key={tool.name}
                  className={`group rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5 ${
                    visible ? "animate-fade-up" : ""
                  }`}
                  style={{ animationDelay: visible ? `${i * 80}ms` : undefined }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <span className={`text-lg ${c.text}`}>{tool.icon}</span>
                  </div>
                  <div className="text-[13px] font-bold text-slate-900 mb-0.5">{tool.name}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{tool.role}</div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[14px] text-slate-500 mt-6 max-w-lg mx-auto">
            <span className="text-blue-600 font-semibold">Orchestra</span> wires them together so you
            never manage the puzzle yourself.
          </p>
        </div>

        {/* Workflow visualization */}
        <div
          className={`rounded-3xl border border-slate-100 bg-[#FAFBFC] p-8 md:p-10 shadow-sm transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="text-center mb-10">
            <h3 className="text-[22px] font-extrabold text-slate-900 mb-2">
              One streamlined workflow
            </h3>
            <p className="text-[14px] text-slate-500 max-w-md mx-auto">
              From scattered tools to a single calm path — built for founders who want to ship, not
              configure.
            </p>
          </div>

          <div className="hidden md:flex items-stretch justify-between gap-0 relative">
            {ORCHESTRA_WORKFLOW.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <div key={step.label} className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 flex flex-col items-center text-center px-2">
                    <div
                      className={`workflow-dot w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-3 shadow-sm`}
                      style={{ animationDelay: `${i * 0.35}s` }}
                    >
                      <span className={`text-sm font-black ${c.text}`}>{i + 1}</span>
                    </div>
                    <div className="text-[14px] font-bold text-slate-900 mb-1">{step.label}</div>
                    <div className="text-[12px] text-slate-400 leading-snug">{step.sub}</div>
                  </div>
                  {i < ORCHESTRA_WORKFLOW.length - 1 && (
                    <div className="flex-shrink-0 w-8 lg:w-12 flex items-center justify-center pb-10">
                      <svg width="32" height="12" viewBox="0 0 32 12" fill="none" className="workflow-arrow">
                        <path
                          d="M0 6h24M20 2l6 4-6 4"
                          stroke="#CBD5E1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {ORCHESTRA_WORKFLOW.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <div
                  key={step.label}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                >
                  <div
                    className={`workflow-dot w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <span className={`text-xs font-black ${c.text}`}>{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-900">{step.label}</div>
                    <div className="text-[12px] text-slate-400">{step.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[12px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
              <span className="text-slate-300 line-through">8 browser tabs</span>
              <span className="text-slate-300">→</span>
              <span className="text-green-600 font-semibold">1 Orchestra tab</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm">
              <span className="text-slate-300 line-through">Days of setup</span>
              <span className="text-slate-300">→</span>
              <span className="text-blue-600 font-semibold">Minutes to launch</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ id }: { id: string }) {
  return (
    <section id={id} className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
            The Orchestra way
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Launching a startup has never felt this simple.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed">
            No engineering degree required. No confusing jargon. Just your idea — and us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const c = colorMap[f.color as keyof typeof colorMap];
            return (
              <div
                key={i}
                className={`group rounded-3xl p-7 border ${c.border} ${c.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 shadow-sm`}
                >
                  <span className={`text-xl ${c.text}`}>{f.icon}</span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TemplatesSection({ id }: { id: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [done, setDone] = useState(false);

  const handleDeploy = () => {
    setDeploying(true);
    setDone(false);
    setTimeout(() => {
      setDeploying(false);
      setDone(true);
    }, 2400);
  };

  return (
    <section id={id} className="py-28 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-green-700 bg-green-50 border border-green-100 rounded-full px-4 py-1.5 mb-5">
            40+ templates
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Your idea, already half-built.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed">
            Every template is production-ready, customizable, and designed to impress your first
            customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TEMPLATES.map((t) => {
            const c = colorMap[t.color as keyof typeof colorMap];
            const isSelected = selected === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelected(isSelected ? null : t.id)}
                className={`group rounded-2xl border bg-white cursor-pointer transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? `border-blue-300 shadow-lg shadow-blue-100 ring-2 ring-blue-100`
                    : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center text-2xl`}
                    >
                      {t.emoji}
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}
                    >
                      {t.category}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-[13px] text-slate-500 mb-3">{t.tagline}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <span className="text-[12px] text-slate-400 font-medium">{t.time}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="px-5 pb-4 border-t border-slate-50 pt-4 bg-slate-50/50 flex gap-2">
                    {done ? (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold text-[13px] py-2.5 rounded-xl">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill="#22c55e" />
                          <path d="M4.5 7l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Launched! 🎉
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeploy();
                        }}
                        disabled={deploying}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] py-2.5 rounded-xl transition-colors disabled:opacity-70"
                      >
                        {deploying ? (
                          <>
                            <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                              <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Launching…
                          </>
                        ) : (
                          "Launch this startup →"
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-white font-medium transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button className="text-[14px] text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl transition-colors">
            View all 40+ templates →
          </button>
        </div>
      </div>
    </section>
  );
}

function StepsSection({ id }: { id: string }) {
  return (
    <section id={id} className="py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 mb-5">
            How it works
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Three steps. One launch.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed">
            We've removed every unnecessary step so all you need to do is show up with an idea.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, i) => {
            const c = colorMap[s.color as keyof typeof colorMap];
            return (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 h-px bg-slate-200 -translate-y-0 z-0" style={{ width: "calc(100% - 2rem)", left: "80%" }} />
                )}
                <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-5 shadow-sm`}>
                  <span className={`text-lg font-black ${c.text}`}>{s.num}</span>
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20">
          {TESTIMONIALS.map((t, i) => {
            const c = colorMap[t.color as keyof typeof colorMap];
            return (
              <div
                key={i}
                className="bg-[#FAFBFC] rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 14 14" fill="#FBBF24">
                      <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3l-3.2 1.6.6-3.6L1.8 4.8l3.6-.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full ${c.bg} border ${c.border} flex items-center justify-center`}
                  >
                    <span className={`text-[11px] font-bold ${c.text}`}>{t.initials}</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">{t.name}</div>
                    <div className="text-[12px] text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ id }: { id: string }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id={id} className="py-28 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
            Pricing
          </div>
          <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
            Start free. Scale when you're ready.
          </h2>
          <p className="text-[16px] text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
            No surprise bills, no contracts, no technical setup costs.
          </p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-2 py-2 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                !annual ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${
                annual ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 transition-all duration-200 hover:-translate-y-0.5 ${
                plan.primary
                  ? "bg-blue-600 text-white shadow-2xl shadow-blue-200/60 border border-blue-500"
                  : "bg-white border border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="mb-6">
                <div
                  className={`text-[12px] font-bold uppercase tracking-widest mb-2 ${
                    plan.primary ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-[36px] font-black ${plan.primary ? "text-white" : "text-slate-900"}`}>
                    {plan.price === "Free"
                      ? plan.price
                      : annual
                      ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}`
                      : plan.price}
                  </span>
                  {plan.price !== "Free" && (
                    <span className={`text-[13px] font-medium ${plan.primary ? "text-blue-200" : "text-slate-400"}`}>
                      /{annual ? "mo, billed annually" : "mo"}
                    </span>
                  )}
                </div>
                <p className={`text-[13px] ${plan.primary ? "text-blue-200" : "text-slate-400"}`}>
                  {plan.sub}
                </p>
              </div>

              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        fill={plan.primary ? "rgba(255,255,255,0.15)" : "#F0FDF4"}
                      />
                      <path
                        d="M5 8l2 2 4-4"
                        stroke={plan.primary ? "white" : "#22c55e"}
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={`text-[13px] font-medium ${
                        plan.primary ? "text-white/90" : "text-slate-600"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-2xl font-bold text-[14px] transition-all duration-200 ${
                  plan.primary
                    ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[13px] text-slate-400 mt-8">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Purple orchestra glow — the signature accent */}
        <div className="relative inline-block mb-8">
          <div className="absolute -inset-8 bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-400 to-blue-400 flex items-center justify-center shadow-xl shadow-violet-200 mx-auto">
            <span className="text-white text-2xl font-black">O</span>
          </div>
        </div>

        <h2 className="text-[42px] font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          Your startup is ready to be born.
        </h2>
        <p className="text-[17px] text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          Thousands of founders have taken the first step. Yours takes about 90 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-[15px] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200">
            Start building for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="w-full sm:w-auto text-[14px] text-slate-500 hover:text-slate-800 font-medium transition-colors py-4">
            Talk to a founder success coach →
          </button>
        </div>

        <p className="text-[12px] text-slate-400 mt-5">
          No credit card · No technical skills required · Cancel anytime
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center">
                <span className="text-white text-sm font-bold">O</span>
              </div>
              <span className="text-[17px] font-bold text-white tracking-tight">Orchestra</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed font-light">
              The platform that makes building an AI startup feel possible for everyone.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-10 text-[13px]">
            {[
              { heading: "Product", links: ["How it works", "Templates", "Pricing", "Roadmap"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { heading: "Support", links: ["Help Center", "Contact", "Status", "Security"] },
            ].map((col) => (
              <div key={col.heading}>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                  {col.heading}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-600">© 2025 Orchestra AI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[12px] text-slate-500 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *, body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
        html { scroll-behavior: smooth; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(0.92); }
        }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        @keyframes workflow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.08); }
        }
        .workflow-dot { animation: workflow-pulse 2.5s ease-in-out infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.5s ease both; }
        .workflow-line {
          background-size: 200% 100%;
          animation: workflow-shimmer 3s ease-in-out infinite;
        }
        @keyframes workflow-shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <Nav onSection={scrollTo} />
      <main>
        <HeroSection id="hero" />
        <UnifiedPlatformSection id="unified" />
        <FeaturesSection id="features" />
        <TemplatesSection id="templates" />
        <StepsSection id="steps" />
        <PricingSection id="pricing" />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
