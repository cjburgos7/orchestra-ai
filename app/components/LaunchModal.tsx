"use client";

import { useState } from "react";
import type { StartupProject } from "@/lib/types/startup";

type Props = {
  open: boolean;
  onClose: () => void;
  projectName: string;
  projectSlug?: string;
  project?: StartupProject;
};

type Step =
  | "menu"
  | "lovable-loading" | "lovable-ready"
  | "replit-loading"  | "replit-ready"
  | "higgsfield-loading" | "higgsfield-ready";

export default function LaunchModal({ open, onClose, projectName, projectSlug, project }: Props) {
  const [step, setStep] = useState<Step>("menu");
  const [prompt, setPrompt] = useState("");
  const [templateUrl, setTemplateUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handoffBody() {
    if (project) return JSON.stringify({ project });
    if (projectSlug) return JSON.stringify({ slug: projectSlug });
    return JSON.stringify({});
  }

  async function handleLovable() {
    setStep("lovable-loading"); setError("");
    try {
      const res = await fetch("/api/handoff/lovable", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: handoffBody(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Handoff failed");
      setPrompt(json.payload.prompt);
      setStep("lovable-ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("menu");
    }
  }

  async function handleReplit() {
    setStep("replit-loading"); setError("");
    try {
      const res = await fetch("/api/handoff/replit", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: handoffBody(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Handoff failed");
      setPrompt(json.payload.prompt);
      setTemplateUrl(json.payload.templateUrl);
      setStep("replit-ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("menu");
    }
  }

  async function handleHighgsfield() {
    setStep("higgsfield-loading"); setError("");
    try {
      const res = await fetch("/api/handoff/higgsfield", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: handoffBody(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Handoff failed");
      setPrompt(json.payload.scene.prompt);
      setStep("higgsfield-ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("menu");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function handleClose() {
    setStep("menu"); setPrompt(""); setTemplateUrl(""); setError("");
    onClose();
  }

  const isLoading = step.endsWith("-loading");
  const isReady   = step.endsWith("-ready");

  function readyLabel() {
    if (step === "lovable-ready")    return { title: "Lovable prompt ready",    link: "https://lovable.dev",        linkLabel: "Open Lovable →" };
    if (step === "replit-ready")     return { title: "Replit brief ready",       link: templateUrl,                  linkLabel: "Open Replit →" };
    if (step === "higgsfield-ready") return { title: "Higgsfield scene ready",   link: "https://higgsfield.ai",      linkLabel: "Open Higgsfield →" };
    return { title: "Ready", link: "", linkLabel: "" };
  }

  function loadingLabel() {
    if (step === "lovable-loading")    return "Building your Lovable prompt…";
    if (step === "replit-loading")     return "Building your Replit brief…";
    if (step === "higgsfield-loading") return "Building your Higgsfield scene…";
    return "Working…";
  }

  const ready = readyLabel();

  const integrations = [
    { label: "Build with Lovable", desc: "Full-stack app scaffold", onClick: handleLovable },
    { label: "Prototype in Replit", desc: "Rapid functional prototype", onClick: handleReplit },
    { label: "Cinematic video", desc: "Higgsfield launch reel", onClick: handleHighgsfield },
  ];

  const comingSoon = [
    { label: "Deploy to Vercel", desc: "Zero-downtime production" },
    { label: "Stripe billing", desc: "Payments + subscriptions" },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: "oklch(20% .01 270 / 0.55)", backdropFilter: "blur(20px)" }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(oklch(99.5% .001 270), oklch(98% .003 270))",
          border: "1px solid oklch(91% .005 270 / 0.9)",
          boxShadow: "0 40px 80px oklch(20% .01 270 / 0.18), 0 8px 24px oklch(20% .01 270 / 0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Top accent */}
        <div style={{ height: 1.5, background: "linear-gradient(to right, transparent, oklch(70% .11 295), transparent)" }} />

        {/* Menu */}
        {step === "menu" && (
          <div style={{ padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  borderRadius: 9999, background: "oklch(90% .04 295)",
                  padding: "3px 10px", marginBottom: 10,
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                  color: "oklch(38% .095 295)", textTransform: "uppercase",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(70% .11 295)", display: "inline-block" }} />
                  Launch
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: "oklch(22% .012 270)", margin: 0, lineHeight: 1.1 }}>
                  Launch {projectName}
                </h2>
                <p style={{ fontSize: 13, color: "oklch(52% .012 270)", margin: "4px 0 0", lineHeight: 1.5 }}>
                  Orchestrate to best-in-class tools.
                </p>
              </div>
              <button
                type="button" onClick={handleClose}
                style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  border: "1px solid oklch(88% .006 270)",
                  background: "oklch(96% .002 270)",
                  color: "oklch(52% .012 270)", fontSize: 16, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >×</button>
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13,
                background: "oklch(96% .02 25)", border: "1px solid oklch(88% .04 25)",
                color: "oklch(48% .12 25)",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {integrations.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, width: "100%",
                    borderRadius: 14, textAlign: "left", cursor: "pointer",
                    padding: "13px 16px",
                    background: "linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7))",
                    border: "1px solid oklch(88% .008 290)",
                    boxShadow: "0 1px 2px oklch(20% .01 270 / 0.04), 0 4px 12px -4px oklch(20% .01 270 / 0.08)",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(78% .012 290)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04), 0 6px 16px -4px oklch(20% .01 270 / 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(88% .008 290)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 2px oklch(20% .01 270 / 0.04), 0 4px 12px -4px oklch(20% .01 270 / 0.08)";
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: "oklch(90% .04 295)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: "oklch(70% .11 295)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "oklch(22% .012 270)" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "oklch(58% .010 270)", marginTop: 1 }}>{item.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 14, color: "oklch(65% .010 270)" }}>→</div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20, opacity: 0.45 }}>
              {comingSoon.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "11px 16px",
                    borderRadius: 12, background: "oklch(96% .002 270)",
                    border: "1px solid oklch(91% .005 270 / 0.9)",
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "oklch(92% .004 270)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "oklch(32% .012 275)" }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: "oklch(62% .010 270)", marginTop: 1 }}>{item.desc} · soon</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button" onClick={handleClose}
              style={{
                width: "100%", padding: "10px", borderRadius: 10, fontSize: 13,
                fontWeight: 500, color: "oklch(52% .012 270)", cursor: "pointer",
                background: "oklch(96% .002 270)", border: "1px solid oklch(91% .005 270 / 0.9)",
              }}
            >
              Keep refining
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ padding: "48px 28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            <div style={{ position: "relative", width: 36, height: 36, marginBottom: 16 }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1.5px solid oklch(88% .04 295)",
                borderTopColor: "oklch(70% .11 295)",
                animation: "spin 0.8s linear infinite",
              }} />
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 14, fontWeight: 500, color: "oklch(32% .012 275)", margin: 0 }}>{loadingLabel()}</p>
            <p style={{ fontSize: 12, color: "oklch(58% .010 270)", marginTop: 4 }}>Translating Orchestra context…</p>
          </div>
        )}

        {/* Ready */}
        {isReady && (
          <div>
            <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid oklch(91% .005 270 / 0.9)" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                borderRadius: 9999, background: "oklch(90% .05 155)",
                padding: "3px 10px", marginBottom: 10,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
                color: "oklch(38% .10 155)", textTransform: "uppercase",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "oklch(58% .15 155)", display: "inline-block" }} />
                Ready
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "oklch(22% .012 270)", margin: 0 }}>
                {ready.title}
              </h2>
              <p style={{ fontSize: 12, color: "oklch(52% .012 270)", marginTop: 4 }}>
                Copy prompt → paste into{" "}
                <a href={ready.link} target="_blank" rel="noopener noreferrer" style={{ color: "oklch(50% .12 295)", fontWeight: 600 }}>
                  {ready.linkLabel.replace(" →", "")}
                </a>
              </p>
            </div>

            <div style={{ padding: "16px 28px", maxHeight: 200, overflowY: "auto" }}>
              <pre style={{
                fontSize: 11, fontFamily: "monospace", lineHeight: 1.6,
                color: "oklch(42% .010 270)", background: "oklch(97% .001 270)",
                border: "1px solid oklch(91% .005 270 / 0.9)", borderRadius: 10,
                padding: "12px 14px", whiteSpace: "pre-wrap", margin: 0,
              }}>
                {prompt}
              </pre>
            </div>

            <div style={{ padding: "8px 28px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button" onClick={handleCopy}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12, fontSize: 13,
                  fontWeight: 500, cursor: "pointer",
                  background: copied ? "oklch(96% .04 155)" : "oklch(28% .015 280)",
                  color: copied ? "oklch(42% .12 155)" : "oklch(98% .003 270)",
                  border: copied ? "1px solid oklch(82% .08 155)" : "none",
                }}
              >
                {copied ? "Copied ✓" : "Copy prompt"}
              </button>
              {ready.link && (
                <a
                  href={ready.link} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block", width: "100%", padding: "12px", borderRadius: 12,
                    fontSize: 13, fontWeight: 500, textAlign: "center", textDecoration: "none",
                    color: "oklch(32% .012 275)",
                    background: "oklch(96% .002 270)", border: "1px solid oklch(91% .005 270 / 0.9)",
                  }}
                >
                  {ready.linkLabel}
                </a>
              )}
              <button
                type="button" onClick={() => setStep("menu")}
                style={{ width: "100%", padding: "8px", fontSize: 12, color: "oklch(58% .010 270)", cursor: "pointer", background: "transparent", border: "none" }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
