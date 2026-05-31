"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import "../../lovable.css";
import type { OutreachPlan, PipelineLead } from "@/lib/outreach";
import {
  STAGES,
  loadOutreachPlans,
  loadPipelineLeads,
  addPipelineLead,
  updateLeadStage,
} from "@/lib/outreach";

const SERIF = "var(--font-canela), 'Didot', 'Georgia', serif";
type Tab = "research" | "outreach" | "pipeline";
type DraftTab = "email" | "dm" | "inPerson";

/* ─── Logo mark ───────────────────────────────────────────── */
function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "22%", background: "var(--gradient-silver)", boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.9)" }} />
      <div style={{ position: "absolute", inset: "18%", borderRadius: "12%", background: "var(--gradient-lavender)", opacity: 0.9 }} />
      <div style={{ position: "absolute", inset: "32%", borderRadius: "8%", background: "var(--gradient-platinum)" }} />
    </div>
  );
}

/* ─── Stage pill ──────────────────────────────────────────── */
function StagePill({ stage }: { stage: PipelineLead["stage"] }) {
  const s = STAGES.find((x) => x.id === stage)!;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "2px 8px", borderRadius: 9999,
      background: `${s.color}18`, color: s.color,
      border: `1px solid ${s.color}30`,
    }}>
      {s.label}
    </span>
  );
}

/* ─── Copy button ─────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "4px 10px", borderRadius: 6, cursor: "pointer",
        background: copied ? "oklch(90% .04 295)" : "oklch(96% .004 270)",
        border: `1px solid ${copied ? "oklch(70% .11 295 / 0.4)" : "oklch(91% .005 270)"}`,
        color: copied ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
        transition: "all 0.15s",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function LeadsPage() {
  const [tab, setTab] = useState<Tab>("research");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<OutreachPlan | null>(null);
  const [plans, setPlans] = useState<OutreachPlan[]>([]);
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [draftTab, setDraftTab] = useState<DraftTab>("email");
  const [addingLead, setAddingLead] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBiz, setNewBiz] = useState("");
  const [loadedPlans, setLoadedPlans] = useState(false);

  /* Load persisted data on mount */
  useEffect(() => {
    const p = loadOutreachPlans();
    const l = loadPipelineLeads();
    setPlans(p);
    setLeads(l);
    if (p.length > 0) setPlan(p[0]);
    setLoadedPlans(true);
  }, []);

  /* Generate research plan */
  const generate = useCallback(async () => {
    const q = niche.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: q }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Generation failed"); return; }
      const newPlan = data.plan as OutreachPlan;
      setPlan(newPlan);
      setPlans(loadOutreachPlans());
      setTab("research");
    } catch {
      setError("Could not reach the server. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, [niche, loading]);

  /* Add lead to pipeline */
  const handleAddLead = useCallback(() => {
    const name = newName.trim();
    const biz = newBiz.trim();
    if (!name || !biz) return;
    addPipelineLead(name, biz, plan?.id);
    setLeads(loadPipelineLeads());
    setNewName("");
    setNewBiz("");
    setAddingLead(false);
  }, [newName, newBiz, plan]);

  /* Advance pipeline stage */
  const advance = useCallback((leadId: string, dir: 1 | -1) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const idx = STAGES.findIndex((s) => s.id === lead.stage);
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= STAGES.length) return;
    updateLeadStage(leadId, STAGES[nextIdx].id);
    setLeads(loadPipelineLeads());
  }, [leads]);

  const card = {
    background: "linear-gradient(rgba(255,255,255,0.92), rgba(244,245,248,0.75))",
    border: "1px solid oklch(92% .005 270 / 0.9)",
    borderRadius: 16,
    boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08)",
  };

  return (
    <div className="lovable-root grain" style={{ minHeight: "100vh", background: "oklch(98.5% .002 270)" }}>
      <style>{`
        .leads-tab { transition: color 0.15s, border-color 0.15s; }
        .leads-tab:hover { color: oklch(32% .012 275) !important; }
        .leads-scroll { scrollbar-width: thin; scrollbar-color: oklch(88% .005 270) transparent; }
        .leads-scroll::-webkit-scrollbar { width: 4px; }
        .leads-scroll::-webkit-scrollbar-thumb { background: oklch(88% .005 270); border-radius: 9999px; }
        .stage-btn { transition: background 0.12s, color 0.12s; }
        .stage-btn:hover { background: oklch(96% .005 270) !important; }
      `}</style>

      {/* Background wash */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: [
          "radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.28), transparent 55%)",
          "radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.10), transparent 50%)",
        ].join(", "),
      }} />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "oklch(99.5% .001 270 / 0.88)",
        backdropFilter: "blur(20px) saturate(140%)",
        borderBottom: "1px solid oklch(91% .005 270 / 0.8)",
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark />
            <Link href="/app" style={{ color: "oklch(52% .012 270)", textDecoration: "none", fontSize: 13 }}>Workspace</Link>
            <span style={{ color: "oklch(75% .008 270)" }}>›</span>
            <span style={{ fontSize: 13, color: "oklch(32% .012 275)", fontWeight: 600 }}>Leads & Outreach</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "3px 9px", borderRadius: 9999,
              background: "oklch(90% .04 295)", color: "oklch(38% .095 295)",
            }}>
              {leads.length} {leads.length === 1 ? "lead" : "leads"} tracked
            </span>
          </div>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1140, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(70% .11 295)", marginBottom: 6 }}>
            Orchestra · Client Acquisition
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05, color: "oklch(22% .012 270)", margin: "0 0 10px" }}>
            Leads & Outreach
          </h1>
          <p style={{ fontSize: 14, color: "oklch(52% .012 270)", lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
            Describe a niche and Orchestra generates a research strategy, outreach scripts, and a 7-day action plan. Everything persists — reload and pick up where you left off.
          </p>
        </div>

        {/* Generate input */}
        <div style={{ ...card, padding: "20px 24px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "oklch(52% .012 270)", marginBottom: 10 }}>
            Find prospects
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder='e.g. "florists in Indianapolis" or "plumbers near me"'
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10,
                border: "1px solid oklch(91% .005 270)",
                background: "oklch(99.5% .001 270)",
                fontSize: 14, color: "oklch(22% .012 270)",
                outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={generate}
              disabled={!niche.trim() || loading}
              style={{
                padding: "10px 22px", borderRadius: 10, border: "none", cursor: niche.trim() && !loading ? "pointer" : "default",
                background: niche.trim() && !loading ? "oklch(28% .015 280)" : "oklch(91% .005 270)",
                color: niche.trim() && !loading ? "oklch(98% .003 270)" : "oklch(65% .012 270)",
                fontSize: 13, fontWeight: 600,
                boxShadow: niche.trim() && !loading ? "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 14px oklch(28% .015 280 / 0.25)" : "none",
                transition: "all 0.15s", flexShrink: 0,
              }}
            >
              {loading ? "Generating…" : "Generate plan →"}
            </button>
          </div>
          {error && (
            <p style={{ marginTop: 10, fontSize: 12, color: "oklch(45% .12 25)" }}>{error}</p>
          )}

          {/* Past plans selector */}
          {loadedPlans && plans.length > 1 && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "oklch(62% .012 270)" }}>Past plans:</span>
              {plans.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p)}
                  style={{
                    fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 9999, cursor: "pointer",
                    border: `1px solid ${plan?.id === p.id ? "oklch(70% .11 295 / 0.5)" : "oklch(91% .005 270)"}`,
                    background: plan?.id === p.id ? "oklch(93% .04 295 / 0.5)" : "oklch(98% .001 270)",
                    color: plan?.id === p.id ? "oklch(38% .095 295)" : "oklch(42% .012 270)",
                  }}
                >
                  {p.niche}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        {plan && (
          <>
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid oklch(91% .005 270)", marginBottom: 20 }}>
              {([
                { id: "research" as Tab, label: "Research Strategy" },
                { id: "outreach" as Tab, label: "Outreach Drafts" },
                { id: "pipeline" as Tab, label: `Pipeline (${leads.length})` },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="leads-tab"
                  style={{
                    padding: "10px 18px", fontSize: 12, fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    color: tab === t.id ? "oklch(38% .095 295)" : "oklch(52% .012 270)",
                    borderBottom: tab === t.id ? "2px solid oklch(70% .11 295)" : "2px solid transparent",
                    letterSpacing: "0.03em",
                    marginBottom: -1,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ─── RESEARCH STRATEGY ─── */}
            {tab === "research" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <style>{`@media(max-width:768px){.leads-grid{grid-template-columns:1fr!important}}`}</style>
                <div className="leads-grid" style={{ display: "contents" }}>

                  {/* ICP */}
                  <div style={{ ...card, padding: "20px 24px", gridColumn: "span 2" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% .11 295)", marginBottom: 12 }}>
                      Ideal Customer Profile — {plan.icp.businessType}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", marginBottom: 6 }}>Pain points</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                          {plan.icp.painPoints.map((p, i) => (
                            <li key={i} style={{ fontSize: 12, color: "oklch(32% .012 275)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                              <span style={{ color: "oklch(70% .11 295)", flexShrink: 0 }}>·</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", marginBottom: 6 }}>Buying triggers</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                          {plan.icp.idealTriggers.map((p, i) => (
                            <li key={i} style={{ fontSize: 12, color: "oklch(32% .012 275)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                              <span style={{ color: "oklch(70% .11 295)", flexShrink: 0 }}>·</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", marginBottom: 6 }}>Budget signals</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                          {plan.icp.budgetSignals.map((p, i) => (
                            <li key={i} style={{ fontSize: 12, color: "oklch(32% .012 275)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                              <span style={{ color: "oklch(70% .11 295)", flexShrink: 0 }}>·</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Research checklist */}
                  <div style={{ ...card, padding: "20px 24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% .11 295)", marginBottom: 14 }}>
                      Research checklist — execute today
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {plan.researchChecklist.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 10 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                            border: "1.5px solid oklch(70% .11 295 / 0.4)",
                            background: "oklch(96% .004 295 / 0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: 10, color: "oklch(62% .10 295)", fontWeight: 700 }}>{i + 1}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, color: "oklch(22% .012 270)", margin: "0 0 3px", lineHeight: 1.5 }}>{item.task}</p>
                            <p style={{ fontSize: 11, color: "oklch(62% .012 270)", margin: 0 }}>
                              {item.sources.join(" · ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ marginTop: 14, fontSize: 11, color: "oklch(65% .012 270)", fontStyle: "italic" }}>
                      Note: these are manual search tasks — no scraping or fake data. Find real prospects yourself using these sources.
                    </p>
                  </div>

                  {/* 7-day action plan */}
                  <div style={{ ...card, padding: "20px 24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% .11 295)", marginBottom: 14 }}>
                      7-day action plan
                    </p>
                    <div className="leads-scroll" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
                      {plan.actionPlan.map((day) => (
                        <div key={day.day} style={{
                          padding: "12px 14px", borderRadius: 10,
                          background: "oklch(99% .001 270)",
                          border: "1px solid oklch(91% .005 270)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                              padding: "2px 6px", borderRadius: 4,
                              background: "oklch(90% .04 295 / 0.4)", color: "oklch(38% .095 295)",
                            }}>
                              Day {day.day}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "oklch(22% .012 270)" }}>{day.label}</span>
                          </div>
                          <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                            {day.tasks.map((task, i) => (
                              <li key={i} style={{ fontSize: 12, color: "oklch(42% .012 270)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                                <span style={{ color: "oklch(70% .11 295)", flexShrink: 0 }}>→</span> {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── OUTREACH DRAFTS ─── */}
            {tab === "outreach" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <style>{`@media(max-width:768px){.outreach-grid{grid-template-columns:1fr!important}}`}</style>
                <div className="outreach-grid" style={{ display: "contents" }}>

                  {/* Draft selector + content */}
                  <div style={{ ...card, padding: "20px 24px", gridColumn: "span 2" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% .11 295)", margin: 0 }}>
                        Outreach drafts — {plan.niche}
                      </p>
                      <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid oklch(91% .005 270)" }}>
                        {([
                          { id: "email" as DraftTab, label: "Email" },
                          { id: "dm" as DraftTab, label: "DM" },
                          { id: "inPerson" as DraftTab, label: "In-Person" },
                        ] as const).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setDraftTab(t.id)}
                            style={{
                              padding: "6px 14px", fontSize: 11, fontWeight: 600,
                              background: draftTab === t.id ? "oklch(28% .015 280)" : "transparent",
                              color: draftTab === t.id ? "oklch(98% .003 270)" : "oklch(52% .012 270)",
                              border: "none", cursor: "pointer", transition: "all 0.12s",
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {draftTab === "email" && (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", margin: 0 }}>
                            Subject: <span style={{ color: "oklch(22% .012 270)" }}>{plan.outreachDrafts.emailSubject}</span>
                          </p>
                          <CopyBtn text={`Subject: ${plan.outreachDrafts.emailSubject}\n\n${plan.outreachDrafts.email}`} />
                        </div>
                        <div style={{
                          background: "oklch(99% .001 270)", border: "1px solid oklch(91% .005 270)",
                          borderRadius: 10, padding: "14px 16px",
                        }}>
                          <p style={{ fontSize: 14, color: "oklch(22% .012 270)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                            {plan.outreachDrafts.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {draftTab === "dm" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", margin: 0 }}>Instagram · Facebook · LinkedIn DM</p>
                          <CopyBtn text={plan.outreachDrafts.dm} />
                        </div>
                        <div style={{
                          background: "oklch(99% .001 270)", border: "1px solid oklch(91% .005 270)",
                          borderRadius: 10, padding: "14px 16px",
                        }}>
                          <p style={{ fontSize: 14, color: "oklch(22% .012 270)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                            {plan.outreachDrafts.dm}
                          </p>
                        </div>
                      </div>
                    )}

                    {draftTab === "inPerson" && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(42% .012 270)", margin: 0 }}>In-person conversation starter</p>
                          <CopyBtn text={plan.outreachDrafts.inPerson} />
                        </div>
                        <div style={{
                          background: "oklch(99% .001 270)", border: "1px solid oklch(91% .005 270)",
                          borderRadius: 10, padding: "14px 16px",
                        }}>
                          <p style={{ fontSize: 14, color: "oklch(22% .012 270)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                            {plan.outreachDrafts.inPerson}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to pipeline */}
                  <div style={{ ...card, padding: "20px 24px", gridColumn: "span 2" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "oklch(70% .11 295)", margin: 0 }}>
                        Track a prospect
                      </p>
                      <button
                        onClick={() => setAddingLead((v) => !v)}
                        style={{
                          fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                          background: "oklch(28% .015 280)", color: "oklch(98% .003 270)", border: "none",
                          boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)",
                        }}
                      >
                        + Add prospect
                      </button>
                    </div>

                    {addingLead && (
                      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Contact name"
                          style={{
                            flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 8,
                            border: "1px solid oklch(91% .005 270)",
                            background: "oklch(99.5% .001 270)",
                            fontSize: 13, color: "oklch(22% .012 270)", outline: "none", fontFamily: "inherit",
                          }}
                        />
                        <input
                          value={newBiz}
                          onChange={(e) => setNewBiz(e.target.value)}
                          placeholder="Business name"
                          style={{
                            flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 8,
                            border: "1px solid oklch(91% .005 270)",
                            background: "oklch(99.5% .001 270)",
                            fontSize: 13, color: "oklch(22% .012 270)", outline: "none", fontFamily: "inherit",
                          }}
                        />
                        <button
                          onClick={handleAddLead}
                          disabled={!newName.trim() || !newBiz.trim()}
                          style={{
                            padding: "8px 18px", borderRadius: 8, border: "none", cursor: newName.trim() && newBiz.trim() ? "pointer" : "default",
                            background: newName.trim() && newBiz.trim() ? "oklch(65% .15 150)" : "oklch(91% .005 270)",
                            color: newName.trim() && newBiz.trim() ? "#fff" : "oklch(65% .012 270)",
                            fontSize: 13, fontWeight: 600, flexShrink: 0, transition: "all 0.12s",
                          }}
                        >
                          Save to pipeline
                        </button>
                      </div>
                    )}

                    <p style={{ fontSize: 12, color: "oklch(62% .012 270)", margin: 0 }}>
                      {leads.length === 0
                        ? "No prospects tracked yet. Add one above after doing your research."
                        : `${leads.length} prospect${leads.length !== 1 ? "s" : ""} in pipeline. Go to Pipeline tab to track progress.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PIPELINE ─── */}
            {tab === "pipeline" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <p style={{ fontSize: 12, color: "oklch(52% .012 270)", margin: 0 }}>
                    Click a stage button to advance or retreat a lead.
                  </p>
                  <button
                    onClick={() => { setTab("outreach"); setAddingLead(true); }}
                    style={{
                      fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                      background: "oklch(28% .015 280)", color: "oklch(98% .003 270)", border: "none",
                      boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)",
                    }}
                  >
                    + Add prospect
                  </button>
                </div>

                {leads.length === 0 ? (
                  <div style={{ ...card, padding: "40px 28px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
                    <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 400, color: "oklch(22% .012 270)", margin: "0 0 8px" }}>
                      Pipeline is empty
                    </p>
                    <p style={{ fontSize: 13, color: "oklch(52% .012 270)", marginBottom: 16 }}>
                      Go to Research tab, generate a plan, find prospects, then add them here.
                    </p>
                    <button
                      onClick={() => setTab("outreach")}
                      style={{
                        fontSize: 13, fontWeight: 500, padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                        background: "oklch(28% .015 280)", color: "oklch(98% .003 270)", border: "none",
                        boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)",
                      }}
                    >
                      Add first prospect →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Stage summary */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      {STAGES.map((s) => {
                        const count = leads.filter((l) => l.stage === s.id).length;
                        return (
                          <div key={s.id} style={{
                            flex: 1, minWidth: 100, padding: "10px 14px", borderRadius: 10,
                            background: "oklch(99% .001 270)",
                            border: `1px solid ${s.color}22`,
                            textAlign: "center",
                          }}>
                            <p style={{ fontSize: 22, fontFamily: SERIF, fontWeight: 400, color: s.color, margin: "0 0 2px" }}>{count}</p>
                            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(62% .012 270)", margin: 0 }}>{s.label}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Lead rows */}
                    {leads.map((lead) => {
                      const stageIdx = STAGES.findIndex((s) => s.id === lead.stage);
                      return (
                        <div key={lead.id} style={{
                          ...card,
                          padding: "14px 18px",
                          display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                        }}>
                          <div style={{ flex: 1, minWidth: 160 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "oklch(22% .012 270)", margin: "0 0 2px" }}>{lead.name}</p>
                            <p style={{ fontSize: 12, color: "oklch(52% .012 270)", margin: 0 }}>{lead.business}</p>
                          </div>
                          <StagePill stage={lead.stage} />
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            {stageIdx > 0 && (
                              <button
                                className="stage-btn"
                                onClick={() => advance(lead.id, -1)}
                                style={{
                                  fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                                  border: "1px solid oklch(91% .005 270)", background: "oklch(98% .001 270)",
                                  color: "oklch(52% .012 270)",
                                }}
                              >
                                ← Back
                              </button>
                            )}
                            {stageIdx < STAGES.length - 1 && (
                              <button
                                className="stage-btn"
                                onClick={() => advance(lead.id, 1)}
                                style={{
                                  fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                                  border: "none", background: "oklch(28% .015 280)",
                                  color: "oklch(98% .003 270)",
                                  boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12)",
                                }}
                              >
                                {STAGES[stageIdx + 1].label} →
                              </button>
                            )}
                            {stageIdx === STAGES.length - 1 && (
                              <span style={{ fontSize: 11, color: "oklch(65% .15 150)", fontWeight: 600 }}>✓ Closed</span>
                            )}
                          </div>
                          <p style={{ fontSize: 10, color: "oklch(70% .008 270)", flexShrink: 0, margin: 0 }}>
                            {new Date(lead.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state — no plan yet */}
        {!plan && loadedPlans && (
          <div style={{ ...card, padding: "48px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 400, color: "oklch(22% .012 270)", margin: "0 0 10px" }}>
              Ready to find your first client
            </h2>
            <p style={{ fontSize: 14, color: "oklch(52% .012 270)", maxWidth: 460, margin: "0 auto 20px", lineHeight: 1.6 }}>
              Type a business type and location above. Orchestra generates a research strategy, outreach scripts, and a concrete 7-day plan — all based on your specific niche.
            </p>
            <p style={{ fontSize: 11, color: "oklch(65% .012 270)", fontStyle: "italic" }}>
              Example: "pizza restaurants near Chicago" · "nail salons in Austin" · "local gyms without websites"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
