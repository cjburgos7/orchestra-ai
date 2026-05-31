"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SitePageId, StartupProject } from "@/lib/types/startup";
import { SITE_PAGES } from "@/lib/types/startup";
import type { OutreachPlan, PipelineLead } from "@/lib/outreach";
import { STAGES, loadOutreachPlans, loadPipelineLeads, addPipelineLead, updateLeadStage } from "@/lib/outreach";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  ts: number;
};

type Tab = "chat" | "pages" | "clients";
type DraftTab = "email" | "dm" | "inPerson";

type Props = {
  project: StartupProject | null;
  activePage: SitePageId;
  onPageChange: (page: SitePageId) => void;
  onLaunch: () => void;
};

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "oklch(70% .11 295)",
            animation: `agent-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AgentMessage({ msg }: { msg: Message }) {
  const isAgent = msg.role === "agent";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAgent ? "flex-start" : "flex-end",
        marginBottom: "0.75rem",
        animation: "agent-msg-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      {isAgent && (
        <div style={{
          fontSize: "9px", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.7)",
          marginBottom: "0.3rem", paddingLeft: "0.1rem",
        }}>
          Orchestra
        </div>
      )}
      <div
        style={{
          maxWidth: "88%",
          padding: isAgent ? "0.75rem 1rem" : "0.7rem 1rem",
          borderRadius: isAgent ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          background: isAgent
            ? "oklch(15% .02 280)"
            : "oklch(70% .11 295 / 0.15)",
          border: isAgent
            ? "1px solid oklch(25% .025 280)"
            : "1px solid oklch(70% .11 295 / 0.25)",
          fontSize: "12.5px",
          lineHeight: 1.65,
          color: isAgent ? "oklch(88% .008 270)" : "oklch(92% .005 270)",
          letterSpacing: "-0.005em",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function AgentPanel({ project, activePage, onPageChange, onLaunch }: Props) {
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Clients tab state
  const [outreachInput, setOutreachInput] = useState("");
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [outreachPlan, setOutreachPlan] = useState<OutreachPlan | null>(null);
  const [plans, setPlans] = useState<OutreachPlan[]>([]);
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [draftTab, setDraftTab] = useState<DraftTab>("email");
  const [addingLead, setAddingLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadBiz, setNewLeadBiz] = useState("");

  // Load persisted outreach data
  useEffect(() => {
    setPlans(loadOutreachPlans());
    setLeads(loadPipelineLeads());
  }, []);

  const generatePlan = useCallback(async () => {
    const niche = outreachInput.trim();
    if (!niche || outreachLoading) return;
    setOutreachLoading(true);
    try {
      const res = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });
      const data = await res.json();
      if (data.plan) {
        setOutreachPlan(data.plan);
        setPlans(loadOutreachPlans());
      }
    } catch {
      // silent — user sees nothing loaded
    } finally {
      setOutreachLoading(false);
    }
  }, [outreachInput, outreachLoading]);

  const handleAddLead = useCallback(() => {
    const name = newLeadName.trim();
    const business = newLeadBiz.trim();
    if (!name || !business) return;
    addPipelineLead(name, business, outreachPlan?.id);
    setLeads(loadPipelineLeads());
    setNewLeadName("");
    setNewLeadBiz("");
    setAddingLead(false);
  }, [newLeadName, newLeadBiz, outreachPlan]);

  const handleStageChange = useCallback((leadId: string, stage: PipelineLead["stage"]) => {
    updateLeadStage(leadId, stage);
    setLeads(loadPipelineLeads());
  }, []);

  // Initial greeting
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const greeting = project
      ? `${project.startupName} is ready. I've generated your ${
          project.generatedSections?.worldV2?.categoryLabel ?? "startup"
        } world — ${project.generatedSections?.worldV2?.variantLabel ?? ""}. What do you want to build next?`
      : "I'm Orchestra, your operating partner. Tell me about the startup you want to build.";

    setMessages([{
      id: "init",
      role: "agent",
      content: greeting,
      ts: Date.now(),
    }]);
  }, [initialized, project]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .slice(-10)
        .map((m) => ({ role: m.role === "agent" ? "assistant" : "user" as const, content: m.content }));

      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, project, history }),
      });

      const data = await res.json();
      const response = data.response ?? "Something went wrong. Try again.";

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "agent", content: response, ts: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "agent", content: "Connection lost. Check your API key and try again.", ts: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, project]);

  const handleKey = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }, [send]);

  const world = project?.generatedSections?.worldV2;
  const launchScore = project ? [
    !!project.startupName,
    !!project.generatedSections?.hero?.headline,
    (project.pricing?.tiers?.length ?? 0) > 0,
    (world?.sections?.filter(s => s.images?.length > 0).length ?? 0) > 0,
    !!project.generatedSections?.testimonials?.[0],
  ].filter(Boolean).length : 0;
  const launchPct = Math.round((launchScore / 5) * 100);

  return (
    <>
      <style jsx global>{`
        @keyframes agent-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes agent-msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes agent-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .agent-input:focus { outline: none; }
        .agent-input::placeholder { color: oklch(45% .015 280); }
        .agent-scroll { scrollbar-width: thin; scrollbar-color: oklch(20% .02 280) transparent; }
        .agent-scroll::-webkit-scrollbar { width: 3px; }
        .agent-scroll::-webkit-scrollbar-thumb { background: oklch(20% .02 280); border-radius: 9999px; }
      `}</style>

      <aside
        style={{
          width: 340,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          background: "oklch(8.5% .018 280)",
          borderRight: "1px solid oklch(16% .025 280)",
          overflow: "hidden",
        }}
      >
        {/* Lavender accent top edge */}
        <div style={{
          height: 1.5,
          background: "linear-gradient(to right, transparent, oklch(70% .11 295 / 0.6), transparent)",
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          padding: "14px 16px 12px",
          borderBottom: "1px solid oklch(14% .02 280)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              {/* Animated presence indicator */}
              <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "oklch(70% .11 295 / 0.12)",
                  border: "1px solid oklch(70% .11 295 / 0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <circle cx="6.5" cy="7.5" r="1" fill="oklch(70% .11 295)" />
                    <circle cx="11.5" cy="7.5" r="1" fill="oklch(70% .11 295)" />
                    <path d="M6.8 11 Q9 12.5 11.2 11" stroke="oklch(70% .11 295)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "oklch(65% .15 150)",
                  border: "1.5px solid oklch(8.5% .018 280)",
                  animation: "agent-pulse 2.5s ease-in-out infinite",
                }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "oklch(90% .008 270)", letterSpacing: "-0.01em" }}>
                  Orchestra
                </div>
                <div style={{ fontSize: 9, color: "oklch(70% .11 295 / 0.8)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  Operating partner
                </div>
              </div>
            </Link>
            <button
              onClick={onLaunch}
              style={{
                fontSize: 10, fontWeight: 700, padding: "4px 10px",
                borderRadius: 6, background: "oklch(70% .11 295)",
                color: "#fff", border: "none", cursor: "pointer",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}
            >
              Launch
            </button>
          </div>

          {/* Project name + progress */}
          {project && (
            <div>
              <p style={{
                fontSize: 13, fontWeight: 500, color: "oklch(88% .008 270)",
                letterSpacing: "-0.02em", margin: 0, marginBottom: 6,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {project.startupName}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  flex: 1, height: 2, borderRadius: 9999,
                  background: "oklch(18% .02 280)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 9999,
                    background: "linear-gradient(to right, oklch(60% .14 295), oklch(70% .11 295))",
                    width: `${launchPct}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "oklch(70% .11 295)", flexShrink: 0 }}>
                  {launchPct}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid oklch(14% .02 280)",
          flexShrink: 0,
          padding: "0 8px",
        }}>
          {([
            { id: "chat" as Tab, label: "Chat" },
            { id: "pages" as Tab, label: "Pages" },
            { id: "clients" as Tab, label: "Clients" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 0", fontSize: 11, fontWeight: 600,
                background: "none", border: "none", cursor: "pointer",
                color: tab === t.id ? "oklch(70% .11 295)" : "oklch(45% .015 280)",
                borderBottom: tab === t.id ? "1.5px solid oklch(70% .11 295)" : "1.5px solid transparent",
                letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "color 0.15s, border-color 0.15s",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* ─── CHAT TAB ─── */}
          {tab === "chat" && (
            <>
              {/* Messages */}
              <div
                className="agent-scroll"
                style={{ flex: 1, overflowY: "auto", padding: "1rem 1rem 0.5rem" }}
              >
                {messages.map((msg) => (
                  <AgentMessage key={msg.id} msg={msg} />
                ))}
                {loading && (
                  <div style={{ animation: "agent-msg-in 0.28s cubic-bezier(0.22,1,0.36,1) both" }}>
                    <div style={{
                      fontSize: "9px", fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.7)",
                      marginBottom: "0.3rem", paddingLeft: "0.1rem",
                    }}>
                      Orchestra
                    </div>
                    <div style={{
                      display: "inline-block",
                      background: "oklch(15% .02 280)",
                      border: "1px solid oklch(25% .025 280)",
                      borderRadius: "4px 14px 14px 14px",
                    }}>
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick prompts — shown when conversation is short */}
              {messages.length <= 1 && project && (
                <div style={{ padding: "0 1rem 0.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {[
                    "What's missing from my world?",
                    "Make it more distinct",
                    "What would the best version look like?",
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setInput(prompt);
                        inputRef.current?.focus();
                      }}
                      style={{
                        fontSize: 10, fontWeight: 500, padding: "5px 10px",
                        borderRadius: 6, background: "oklch(14% .02 280)",
                        border: "1px solid oklch(22% .025 280)",
                        color: "oklch(62% .012 270)", cursor: "pointer",
                        letterSpacing: "0.01em",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: "0.75rem 1rem 1rem",
                borderTop: "1px solid oklch(14% .02 280)",
                flexShrink: 0,
              }}>
                <div style={{
                  display: "flex", alignItems: "flex-end", gap: "0.5rem",
                  background: "oklch(12% .02 280)",
                  border: "1px solid oklch(22% .025 280)",
                  borderRadius: 12,
                  padding: "0.5rem 0.5rem 0.5rem 0.85rem",
                  transition: "border-color 0.15s",
                }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask Orchestra anything…"
                    rows={1}
                    className="agent-input"
                    style={{
                      flex: 1, background: "none", border: "none", resize: "none",
                      fontSize: 12, lineHeight: 1.5, color: "oklch(88% .008 270)",
                      fontFamily: "inherit", padding: 0,
                      maxHeight: 80, overflowY: "auto",
                    }}
                    onInput={(e) => {
                      const t = e.currentTarget;
                      t.style.height = "auto";
                      t.style.height = Math.min(t.scrollHeight, 80) + "px";
                    }}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || loading}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "none",
                      background: input.trim() && !loading
                        ? "oklch(70% .11 295)"
                        : "oklch(18% .02 280)",
                      cursor: input.trim() && !loading ? "pointer" : "default",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, transition: "background 0.15s",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                        stroke={input.trim() && !loading ? "#fff" : "oklch(40% .012 270)"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize: 9, color: "oklch(35% .012 270)", marginTop: 5, textAlign: "center" }}>
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          )}

          {/* ─── PAGES TAB ─── */}
          {tab === "pages" && (
            <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0.75rem 1rem" }} className="agent-scroll">
              <p style={{
                fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                color: "oklch(40% .015 280)", margin: "0 0 0.75rem 0.25rem",
              }}>
                Pages
              </p>
              {SITE_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onPageChange(page.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "8px 10px", borderRadius: 8, border: "none",
                    background: activePage === page.id ? "oklch(70% .11 295 / 0.12)" : "none",
                    cursor: "pointer", marginBottom: 2,
                    transition: "background 0.1s",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: activePage === page.id ? "oklch(70% .11 295)" : "oklch(28% .02 280)",
                  }} />
                  <span style={{
                    fontSize: 12, fontWeight: activePage === page.id ? 500 : 400,
                    color: activePage === page.id ? "oklch(82% .008 270)" : "oklch(52% .012 270)",
                  }}>
                    {page.label}
                  </span>
                </button>
              ))}

              {/* World info */}
              {world && (
                <div style={{ marginTop: "1.25rem" }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                    color: "oklch(40% .015 280)", margin: "0 0 0.75rem 0.25rem",
                  }}>
                    World
                  </p>
                  <div style={{
                    padding: "0.75rem", borderRadius: 8,
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(18% .022 280)",
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(70% .11 295)", margin: "0 0 2px" }}>
                      {world.categoryLabel}
                    </p>
                    <p style={{ fontSize: 10, color: "oklch(48% .015 280)", margin: 0 }}>
                      {world.variantLabel} · {world.category}
                    </p>
                  </div>
                </div>
              )}

              {/* Launch CTA */}
              <button
                onClick={onLaunch}
                style={{
                  width: "100%", marginTop: "1.5rem", padding: "0.85rem",
                  borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, oklch(65% .14 295), oklch(72% .11 295))",
                  color: "#fff", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", letterSpacing: "0.03em",
                  boxShadow: "0 4px 20px oklch(70% .11 295 / 0.25)",
                }}
              >
                Launch {project?.startupName ?? "startup"} →
              </button>
            </div>
          )}

          {/* ─── CLIENTS TAB ─── */}
          {tab === "clients" && (
            <div className="agent-scroll" style={{ flex: 1, overflowY: "auto", padding: "0.75rem 0.75rem 1rem" }}>

              {/* Generate Plan */}
              <p style={{
                fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                color: "oklch(40% .015 280)", margin: "0 0 0.6rem 0.25rem",
              }}>
                Land a Client
              </p>
              <div style={{
                background: "oklch(12% .018 280)",
                border: "1px solid oklch(18% .022 280)",
                borderRadius: 10, padding: "0.75rem",
                marginBottom: "1rem",
              }}>
                <textarea
                  value={outreachInput}
                  onChange={(e) => setOutreachInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generatePlan(); } }}
                  placeholder="Describe the business type or a real lead…"
                  rows={2}
                  className="agent-input"
                  style={{
                    width: "100%", background: "none", border: "none", resize: "none",
                    fontSize: 12, lineHeight: 1.5, color: "oklch(88% .008 270)",
                    fontFamily: "inherit", padding: 0, boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={generatePlan}
                  disabled={!outreachInput.trim() || outreachLoading}
                  style={{
                    marginTop: "0.5rem", width: "100%", padding: "0.55rem",
                    borderRadius: 7, border: "none", fontSize: 11, fontWeight: 600,
                    background: outreachInput.trim() && !outreachLoading
                      ? "oklch(70% .11 295)"
                      : "oklch(18% .02 280)",
                    color: outreachInput.trim() && !outreachLoading ? "#fff" : "oklch(40% .012 270)",
                    cursor: outreachInput.trim() && !outreachLoading ? "pointer" : "default",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {outreachLoading ? "Generating…" : "Generate Outreach Plan"}
                </button>
              </div>

              {/* Past plans quick-load */}
              {plans.length > 0 && !outreachPlan && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                    color: "oklch(40% .015 280)", margin: "0 0 0.5rem 0.25rem",
                  }}>Recent Plans</p>
                  {plans.slice(-3).reverse().map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setOutreachPlan(p)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "7px 10px", borderRadius: 7, border: "1px solid oklch(18% .022 280)",
                        background: "oklch(12% .018 280)", cursor: "pointer",
                        marginBottom: 4, fontSize: 11, color: "oklch(72% .01 270)",
                        transition: "border-color 0.1s",
                      }}
                    >
                      {p.niche}
                      <span style={{ float: "right", fontSize: 9, color: "oklch(40% .012 270)" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Generated plan display */}
              {outreachPlan && (
                <>
                  {/* ICP */}
                  <div style={{
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(18% .022 280)",
                    borderRadius: 10, padding: "0.75rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.8)", margin: "0 0 0.5rem" }}>
                      ICP — {outreachPlan.icp.businessType}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div>
                        <p style={{ fontSize: 9, color: "oklch(40% .012 270)", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Pain Points</p>
                        {outreachPlan.icp.painPoints.map((pt, i) => (
                          <p key={i} style={{ fontSize: 11, color: "oklch(72% .01 270)", margin: "1px 0" }}>· {pt}</p>
                        ))}
                      </div>
                      <div>
                        <p style={{ fontSize: 9, color: "oklch(40% .012 270)", margin: "4px 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Buy Signals</p>
                        {outreachPlan.icp.budgetSignals.map((s, i) => (
                          <p key={i} style={{ fontSize: 11, color: "oklch(72% .01 270)", margin: "1px 0" }}>· {s}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Research Checklist */}
                  <div style={{
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(18% .022 280)",
                    borderRadius: 10, padding: "0.75rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.8)", margin: "0 0 0.5rem" }}>
                      Research Checklist
                    </p>
                    {outreachPlan.researchChecklist.map((item, i) => (
                      <div key={i} style={{ marginBottom: 6 }}>
                        <p style={{ fontSize: 11, fontWeight: 500, color: "oklch(80% .008 270)", margin: "0 0 1px" }}>
                          {i + 1}. {item.task}
                        </p>
                        <p style={{ fontSize: 10, color: "oklch(42% .012 270)", margin: 0 }}>
                          {item.sources.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Outreach Drafts */}
                  <div style={{
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(18% .022 280)",
                    borderRadius: 10, padding: "0.75rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.8)", margin: "0 0 0.5rem" }}>
                      Outreach Drafts
                    </p>
                    <div style={{ display: "flex", gap: 4, marginBottom: "0.6rem" }}>
                      {(["email", "dm", "inPerson"] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDraftTab(d)}
                          style={{
                            flex: 1, padding: "4px 0", borderRadius: 5,
                            border: "1px solid oklch(22% .022 280)",
                            background: draftTab === d ? "oklch(70% .11 295 / 0.15)" : "none",
                            color: draftTab === d ? "oklch(70% .11 295)" : "oklch(42% .012 270)",
                            fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                            cursor: "pointer", transition: "background 0.1s, color 0.1s",
                          }}
                        >
                          {d === "inPerson" ? "IRL" : d === "dm" ? "DM" : "Email"}
                        </button>
                      ))}
                    </div>
                    {draftTab === "email" && (
                      <>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "oklch(58% .01 270)", margin: "0 0 4px" }}>
                          Subject: {outreachPlan.outreachDrafts.emailSubject}
                        </p>
                        <p style={{ fontSize: 11, color: "oklch(72% .01 270)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                          {outreachPlan.outreachDrafts.email}
                        </p>
                      </>
                    )}
                    {draftTab === "dm" && (
                      <p style={{ fontSize: 11, color: "oklch(72% .01 270)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {outreachPlan.outreachDrafts.dm}
                      </p>
                    )}
                    {draftTab === "inPerson" && (
                      <p style={{ fontSize: 11, color: "oklch(72% .01 270)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                        {outreachPlan.outreachDrafts.inPerson}
                      </p>
                    )}
                  </div>

                  {/* 7-Day Action Plan */}
                  <div style={{
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(18% .022 280)",
                    borderRadius: 10, padding: "0.75rem", marginBottom: "0.75rem",
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "oklch(70% .11 295 / 0.8)", margin: "0 0 0.5rem" }}>
                      7-Day Action Plan
                    </p>
                    {outreachPlan.actionPlan.map((day) => (
                      <div key={day.day} style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "oklch(70% .11 295)", margin: "0 0 2px" }}>
                          Day {day.day} — {day.label}
                        </p>
                        {day.tasks.map((task, i) => (
                          <p key={i} style={{ fontSize: 11, color: "oklch(68% .01 270)", margin: "1px 0 1px 8px" }}>
                            · {task}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setOutreachPlan(null)}
                    style={{
                      width: "100%", padding: "0.45rem", borderRadius: 7,
                      border: "1px solid oklch(18% .022 280)", background: "none",
                      color: "oklch(40% .012 270)", fontSize: 10, cursor: "pointer",
                      marginBottom: "1rem",
                    }}
                  >
                    ← Back to generator
                  </button>
                </>
              )}

              {/* Pipeline Tracker */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em",
                    color: "oklch(40% .015 280)", margin: "0 0 0 0.25rem",
                  }}>Pipeline</p>
                  <button
                    onClick={() => setAddingLead(true)}
                    style={{
                      fontSize: 10, fontWeight: 600, padding: "3px 8px",
                      borderRadius: 5, border: "1px solid oklch(18% .022 280)",
                      background: "none", color: "oklch(55% .01 270)", cursor: "pointer",
                    }}
                  >
                    + Add Lead
                  </button>
                </div>

                {addingLead && (
                  <div style={{
                    background: "oklch(12% .018 280)",
                    border: "1px solid oklch(22% .022 280)",
                    borderRadius: 8, padding: "0.6rem", marginBottom: "0.6rem",
                  }}>
                    <input
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="Contact name"
                      className="agent-input"
                      style={{
                        display: "block", width: "100%", background: "none", border: "none",
                        fontSize: 12, color: "oklch(88% .008 270)", fontFamily: "inherit",
                        padding: "0 0 4px", borderBottom: "1px solid oklch(22% .025 280)",
                        marginBottom: "0.5rem", boxSizing: "border-box",
                      }}
                    />
                    <input
                      value={newLeadBiz}
                      onChange={(e) => setNewLeadBiz(e.target.value)}
                      placeholder="Business name"
                      className="agent-input"
                      style={{
                        display: "block", width: "100%", background: "none", border: "none",
                        fontSize: 12, color: "oklch(88% .008 270)", fontFamily: "inherit",
                        padding: "0 0 4px", borderBottom: "1px solid oklch(22% .025 280)",
                        marginBottom: "0.6rem", boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={handleAddLead}
                        style={{
                          flex: 1, padding: "0.4rem", borderRadius: 6, border: "none",
                          background: "oklch(70% .11 295)", color: "#fff",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingLead(false); setNewLeadName(""); setNewLeadBiz(""); }}
                        style={{
                          padding: "0.4rem 0.75rem", borderRadius: 6,
                          border: "1px solid oklch(22% .022 280)",
                          background: "none", color: "oklch(42% .012 270)",
                          fontSize: 10, cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {leads.length === 0 && !addingLead && (
                  <p style={{ fontSize: 11, color: "oklch(35% .012 270)", textAlign: "center", padding: "1rem 0" }}>
                    No leads yet. Generate a plan and add your first lead.
                  </p>
                )}

                {leads.map((lead) => {
                  const stage = STAGES.find((s) => s.id === lead.stage) ?? STAGES[0];
                  return (
                    <div
                      key={lead.id}
                      style={{
                        background: "oklch(11% .016 280)",
                        border: "1px solid oklch(16% .02 280)",
                        borderRadius: 8, padding: "0.6rem 0.75rem",
                        marginBottom: 5,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "oklch(80% .008 270)", margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 10, color: "oklch(42% .012 270)", margin: 0 }}>{lead.business}</p>
                        </div>
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as PipelineLead["stage"])}
                          style={{
                            background: "oklch(14% .02 280)",
                            border: "1px solid oklch(22% .022 280)",
                            borderRadius: 5, padding: "2px 6px",
                            fontSize: 9, fontWeight: 700,
                            color: stage.color,
                            cursor: "pointer", textTransform: "uppercase",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
