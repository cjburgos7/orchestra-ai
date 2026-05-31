"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Msg = { role: "user" | "assistant"; content: string; ts: number };

const QUICK_ACTIONS = [
  "Find local businesses with weak websites",
  "Draft an outreach email for a prospect",
  "Write my 7-day action plan",
  "How do I use Orchestra?",
  "Generate 3 follow-up messages",
  "Qualify a lead for me",
];

const PULSE_CSS = `
@keyframes fa-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.08); }
}
@keyframes fa-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes fa-msg-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fa-spin {
  to { transform: rotate(360deg); }
}
`;

export default function FloatingAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "I'm Orchestra. Ask me anything — find leads, draft outreach, edit your site, or plan your week.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadMode, setLeadMode] = useState(false);
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim(), ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          mode: "os",
          history: messages.slice(-12).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json() as { response?: string; error?: string };
      const reply = data.response ?? data.error ?? "Something went wrong.";
      setMessages((m) => [...m, { role: "assistant", content: reply, ts: Date.now() }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Connection error. Check your network.", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleLeadSearch = useCallback(async () => {
    if (!niche.trim()) return;
    const query = `Find ${niche.trim()}${location.trim() ? ` in ${location.trim()}` : ""} — give me specific Google search queries, directories to check, and a qualification checklist.`;
    setLeadMode(false);
    setNiche("");
    setLocation("");
    await send(query);
  }, [niche, location, send]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <>
      <style>{PULSE_CSS}</style>

      {/* Floating button */}
      {/* Tooltip label */}
      {!open && (
        <div style={{
          position: "fixed",
          bottom: 36,
          right: 88,
          zIndex: 8998,
          background: "oklch(14% .02 280)",
          border: "1px solid oklch(22% .025 280)",
          borderRadius: 10,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 500,
          color: "oklch(80% .008 270)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px oklch(5% .01 280 / 0.5)",
          letterSpacing: "-0.01em",
        }}>
          Orchestra · Ask me anything
          <div style={{
            position: "absolute",
            right: -5,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeft: "5px solid oklch(22% .025 280)",
          }} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Orchestra Agent"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9000,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "1.5px solid oklch(28% .035 280)",
          cursor: "pointer",
          background: "linear-gradient(135deg, oklch(20% .025 280), oklch(14% .018 280))",
          boxShadow: "0 8px 32px oklch(10% .02 280 / 0.7), 0 2px 8px oklch(20% .02 280 / 0.4), inset 0 1px 0 oklch(100% 0 0 / 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
          animation: !open ? "fa-pulse 4s ease-in-out infinite" : "none",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {open ? (
          <span style={{ color: "oklch(72% .008 270)", fontSize: 20, lineHeight: 1, fontWeight: 300 }}>×</span>
        ) : (
          /* Friendly face SVG */
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            {/* Outer glow ring */}
            <circle cx="15" cy="15" r="13" stroke="oklch(70% .11 295 / 0.3)" strokeWidth="1" />
            {/* Face background */}
            <circle cx="15" cy="15" r="11" fill="oklch(70% .11 295 / 0.12)" />
            {/* Eyes */}
            <circle cx="11" cy="13" r="1.8" fill="oklch(78% .09 295)" />
            <circle cx="19" cy="13" r="1.8" fill="oklch(78% .09 295)" />
            {/* Eye shine */}
            <circle cx="11.7" cy="12.3" r="0.6" fill="white" opacity="0.8" />
            <circle cx="19.7" cy="12.3" r="0.6" fill="white" opacity="0.8" />
            {/* Smile */}
            <path d="M11 18 Q15 21.5 19 18" stroke="oklch(70% .11 295)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        )}
        {/* Live presence dot */}
        {!open && (
          <span style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: "oklch(72% .20 145)",
            boxShadow: "0 0 6px oklch(72% .20 145 / 0.8), 0 0 0 2px oklch(14% .018 280)",
            animation: "fa-dot 2.4s ease-in-out infinite",
          }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            zIndex: 8999,
            width: 360,
            maxHeight: "min(580px, calc(100vh - 120px))",
            borderRadius: 20,
            background: "oklch(10.5% .018 280)",
            border: "1px solid oklch(18% .022 280)",
            boxShadow: "0 8px 48px oklch(5% .01 280 / 0.8), inset 0 1px 0 oklch(22% .025 280 / 0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 16px 12px",
            borderBottom: "1px solid oklch(16% .022 280)",
            background: "oklch(12% .02 280)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, oklch(20% .025 280), oklch(14% .018 280))",
                border: "1px solid oklch(28% .035 280)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="11" fill="oklch(70% .11 295 / 0.12)" />
                  <circle cx="11" cy="13" r="1.8" fill="oklch(78% .09 295)" />
                  <circle cx="19" cy="13" r="1.8" fill="oklch(78% .09 295)" />
                  <circle cx="11.7" cy="12.3" r="0.6" fill="white" opacity="0.8" />
                  <circle cx="19.7" cy="12.3" r="0.6" fill="white" opacity="0.8" />
                  <path d="M11 18 Q15 21.5 19 18" stroke="oklch(70% .11 295)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "oklch(88% .008 270)", letterSpacing: "-0.01em" }}>Orchestra</div>
                <div style={{ fontSize: 10, color: "oklch(45% .015 280)" }}>Operating partner · always on</div>
              </div>
              <button
                type="button"
                onClick={() => setLeadMode((l) => !l)}
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 20,
                  border: leadMode ? "1px solid oklch(70% .11 295 / 0.5)" : "1px solid oklch(22% .025 280)",
                  background: leadMode ? "oklch(70% .11 295 / 0.12)" : "transparent",
                  color: leadMode ? "oklch(70% .11 295)" : "oklch(50% .015 280)",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Find Leads
              </button>
            </div>
          </div>

          {/* Lead discovery form */}
          {leadMode && (
            <div style={{
              padding: "12px 14px",
              borderBottom: "1px solid oklch(16% .022 280)",
              background: "oklch(9% .015 280)",
              flexShrink: 0,
            }}>
              <p style={{ fontSize: 10.5, color: "oklch(55% .015 280)", marginBottom: 8, letterSpacing: "0.04em" }}>
                Search for local businesses with weak digital presence
              </p>
              <input
                type="text"
                placeholder="Business type (e.g. florists, dentists, gyms)"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid oklch(22% .025 280)",
                  background: "oklch(14% .02 280)",
                  color: "oklch(85% .008 270)",
                  fontSize: 12,
                  outline: "none",
                  marginBottom: 6,
                  boxSizing: "border-box",
                }}
              />
              <input
                type="text"
                placeholder="Location (e.g. Indianapolis, IN)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void handleLeadSearch(); }}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid oklch(22% .025 280)",
                  background: "oklch(14% .02 280)",
                  color: "oklch(85% .008 270)",
                  fontSize: 12,
                  outline: "none",
                  marginBottom: 8,
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={handleLeadSearch}
                disabled={!niche.trim()}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 8,
                  border: "none",
                  background: niche.trim() ? "oklch(70% .11 295)" : "oklch(25% .02 280)",
                  color: niche.trim() ? "#fff" : "oklch(40% .015 280)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: niche.trim() ? "pointer" : "default",
                  letterSpacing: "-0.01em",
                }}
              >
                Find & qualify leads →
              </button>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  animation: "fa-msg-in 0.25s ease both",
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div style={{
                  maxWidth: "86%",
                  padding: "8px 12px",
                  borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.role === "user" ? "oklch(70% .11 295)" : "oklch(15% .02 280)",
                  border: m.role === "user" ? "none" : "1px solid oklch(20% .025 280)",
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: m.role === "user" ? "#fff" : "oklch(78% .008 270)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "8px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  background: "oklch(15% .02 280)",
                  border: "1px solid oklch(20% .025 280)",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "oklch(70% .11 295)",
                      animation: `fa-dot 1.2s ease-in-out ${d}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && !loading && (
            <div style={{
              padding: "6px 14px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
              flexShrink: 0,
            }}>
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => void send(qa)}
                  style={{
                    fontSize: 10.5,
                    padding: "4px 9px",
                    borderRadius: 20,
                    border: "1px solid oklch(22% .025 280)",
                    background: "oklch(14% .02 280)",
                    color: "oklch(60% .012 275)",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    letterSpacing: "0.01em",
                  }}
                >
                  {qa}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "10px 14px 12px",
            borderTop: "1px solid oklch(16% .022 280)",
            background: "oklch(12% .02 280)",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-end",
              background: "oklch(15% .02 280)",
              border: "1px solid oklch(22% .025 280)",
              borderRadius: 12,
              padding: "8px 10px 8px 12px",
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything or give a command…"
                rows={1}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontSize: 12.5,
                  color: "oklch(82% .008 270)",
                  lineHeight: 1.5,
                  fontFamily: "inherit",
                  maxHeight: 80,
                  overflowY: "auto",
                }}
              />
              <button
                type="button"
                onClick={() => void send(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: "none",
                  background: input.trim() ? "oklch(70% .11 295)" : "oklch(22% .025 280)",
                  cursor: input.trim() ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                {loading ? (
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "1.5px solid oklch(60% .015 280)",
                    borderTop: "1.5px solid oklch(75% .008 270)",
                    animation: "fa-spin 0.8s linear infinite",
                  }} />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                )}
              </button>
            </div>
            <p style={{ fontSize: 9.5, color: "oklch(35% .012 275)", textAlign: "center", marginTop: 6, letterSpacing: "0.04em" }}>
              ORCHESTRA AI · PERSONALIZED · NEVER FABRICATES DATA
            </p>
          </div>
        </div>
      )}
    </>
  );
}
