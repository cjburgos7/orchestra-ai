"use client";

import { useState } from "react";
import Link from "next/link";
import type { StartupProject } from "@/lib/types/startup";
import {
  buildStartupContext,
  buildRecommendations,
  getAgentStatusMessage,
} from "@/lib/agent";

type Props = {
  project: StartupProject | null;
};

export default function OrchestraAgent({ project }: Props) {
  const [open, setOpen] = useState(false);

  const startup = project ? buildStartupContext(project) : null;
  const statusMsg = getAgentStatusMessage(startup);
  const recommendations = buildRecommendations(startup);
  const topAction = recommendations[0] ?? null;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Orchestra Agent"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 48, height: 48, borderRadius: "50%",
          border: "1.5px solid oklch(84% .07 295 / 0.4)",
          background: "oklch(99.5% .001 270)",
          boxShadow: "0 1px 0 oklch(100% 0 0 / 0.9) inset, 0 4px 20px oklch(28% .015 280 / 0.1), 0 0 0 1px oklch(91% .005 270)",
          cursor: "pointer", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "box-shadow 0.2s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 oklch(100% 0 0 / 0.9) inset, 0 6px 24px oklch(28% .015 280 / 0.16), 0 0 0 1px oklch(91% .005 270)";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 oklch(100% 0 0 / 0.9) inset, 0 4px 20px oklch(28% .015 280 / 0.1), 0 0 0 1px oklch(91% .005 270)";
          (e.currentTarget as HTMLButtonElement).style.transform = "none";
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="11.5" stroke="oklch(84% .07 295)" strokeWidth="1" opacity="0.5" />
          <circle cx="13" cy="13" r="10" fill="oklch(94% .04 295 / 0.4)" />
          <circle cx="10" cy="11.5" r="1.1" fill="oklch(38% .09 295)" opacity="0.85" />
          <circle cx="16" cy="11.5" r="1.1" fill="oklch(38% .09 295)" opacity="0.85" />
          <path d="M10.5 14.5 Q13 16.5 15.5 14.5" stroke="oklch(38% .09 295)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.65" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Orchestra Agent panel"
          style={{
            position: "fixed", bottom: 84, right: 24, width: 300,
            borderRadius: 20,
            background: "oklch(99.5% .001 270)",
            border: "1px solid oklch(91% .005 270)",
            boxShadow: "0 1px 0 oklch(100% 0 0 / 0.8) inset, 0 20px 60px -10px oklch(30% .02 280 / 0.16)",
            zIndex: 100, overflow: "hidden",
            animation: "agent-in 0.22s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <style>{`@keyframes agent-in { from { opacity:0;transform:translateY(10px) scale(0.97) } to { opacity:1;transform:none } }`}</style>

          {/* Lavender top edge */}
          <div style={{ height: 1.5, background: "linear-gradient(to right, transparent, oklch(70% .11 295 / 0.5), transparent)" }} />

          {/* Header */}
          <div style={{
            padding: "14px 16px 12px",
            borderBottom: "1px solid oklch(93% .005 270)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "oklch(94% .04 295 / 0.5)",
                border: "1px solid oklch(84% .07 295 / 0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <circle cx="6.5" cy="7.5" r="0.9" fill="oklch(38% .09 295)" />
                  <circle cx="11.5" cy="7.5" r="0.9" fill="oklch(38% .09 295)" />
                  <path d="M6.8 10.8 Q9 12.2 11.2 10.8" stroke="oklch(38% .09 295)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "oklch(22% .012 270)", letterSpacing: "-0.01em" }}>Orchestra</div>
                <div style={{ fontSize: 10, color: "oklch(70% .11 295)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                  Operating partner
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                border: "1px solid oklch(91% .005 270)",
                background: "oklch(97% .001 270)",
                color: "oklch(52% .012 270)", fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* Context bar — current startup */}
          {project && (
            <div style={{
              padding: "8px 16px",
              borderBottom: "1px solid oklch(94% .004 270)",
              background: "oklch(97.5% .002 270)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "oklch(70% .11 295 / 0.8)" }}>
                Working on
              </span>
              <span style={{
                fontSize: 11, fontWeight: 500, color: "oklch(32% .012 275)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {project.startupName}
              </span>
            </div>
          )}

          {/* Body */}
          <div style={{ padding: "12px 16px 16px" }}>
            {/* Status */}
            <p style={{ fontSize: 12, color: "oklch(52% .012 270)", lineHeight: 1.55, marginBottom: 12 }}>
              {statusMsg}
            </p>

            {/* Launch progress */}
            {startup && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(52% .012 270)" }}>
                    Launch progress
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "oklch(70% .11 295)" }}>
                    {startup.launchProgress.percentComplete}%
                  </span>
                </div>
                <div style={{ height: 3, borderRadius: 9999, background: "oklch(93% .005 270)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 9999,
                    background: "linear-gradient(to right, oklch(70% .11 295), oklch(60% .15 295))",
                    width: `${startup.launchProgress.percentComplete}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>
            )}

            {/* Top recommendation */}
            {topAction && (
              <div style={{
                background: "oklch(97% .003 270)",
                border: "1px solid oklch(91% .005 270)",
                borderRadius: 10, padding: "10px 12px",
                marginBottom: recommendations.length > 1 ? 8 : 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "oklch(70% .11 295)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                  Recommended
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "oklch(22% .012 270)", marginBottom: 4 }}>
                  {topAction.label}
                </div>
                <div style={{ fontSize: 11, color: "oklch(52% .012 270)", lineHeight: 1.5, marginBottom: 10 }}>
                  {topAction.description}
                </div>
                {topAction.ctaHref ? (
                  <Link
                    href={topAction.ctaHref}
                    style={{
                      display: "inline-block", fontSize: 11, fontWeight: 600,
                      color: "oklch(98% .003 270)",
                      background: "oklch(28% .015 280)",
                      borderRadius: 6, padding: "5px 12px",
                      textDecoration: "none",
                    }}
                  >
                    {topAction.ctaLabel}
                  </Link>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 500, color: "oklch(70% .11 295)" }}>
                    {topAction.ctaLabel}
                  </span>
                )}
              </div>
            )}

            {/* Additional recommendations */}
            {recommendations.slice(1, 3).map((action) => (
              <div
                key={action.id}
                style={{
                  padding: "8px 12px", borderRadius: 8, marginTop: 6,
                  border: "1px solid oklch(91% .005 270)",
                  background: "oklch(99% .001 270)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                  background: action.priority === "critical" ? "oklch(70% .11 295)"
                    : action.priority === "high" ? "oklch(65% .15 150)"
                    : "oklch(65% .012 270)",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "oklch(32% .012 275)" }}>
                    {action.label}
                  </div>
                  {action.ctaHref && (
                    <Link href={action.ctaHref} style={{ fontSize: 10, color: "oklch(70% .11 295)", textDecoration: "none" }}>
                      {action.ctaLabel} →
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* No project state */}
            {!project && (
              <div style={{ textAlign: "center", paddingTop: 4 }}>
                <Link
                  href="/app?generate=1"
                  style={{
                    display: "inline-block", fontSize: 12, fontWeight: 500,
                    color: "oklch(98% .003 270)",
                    background: "oklch(28% .015 280)",
                    borderRadius: 8, padding: "8px 16px",
                    textDecoration: "none",
                  }}
                >
                  Start a company →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
