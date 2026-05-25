"use client";

import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { SiteVisuals } from "@/lib/types/startup";

type Props = {
  type: SiteVisuals["heroVisual"];
  theme: DirectionTheme;
  accentColor?: string;
  compact?: boolean;
};

export default function WebsiteVisuals({ type, theme, accentColor = "#2563eb", compact }: Props) {
  const h = compact ? "h-36" : "h-56 md:h-72";

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${h} mt-8 mb-4`}>
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden border ${theme.border} shadow-2xl`}
        style={{ boxShadow: `0 25px 50px -12px ${accentColor}20` }}
      >
        {type === "dashboard" && <DashboardMock theme={theme} accent={accentColor} />}
        {type === "device" && <DeviceMock theme={theme} accent={accentColor} />}
        {type === "analytics" && <AnalyticsMock theme={theme} accent={accentColor} />}
        {type === "workflow" && <WorkflowMock theme={theme} accent={accentColor} />}
        {type === "creator" && <CreatorMock theme={theme} accent={accentColor} />}
        {type === "onboarding" && <OnboardingMock theme={theme} accent={accentColor} />}
        {type === "saas-panel" && <SaasPanelMock theme={theme} accent={accentColor} />}
      </div>
      <div
        className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

function Chrome({ theme, children }: { theme: DirectionTheme; children: React.ReactNode }) {
  return (
    <div className={`h-full flex flex-col ${theme.page}`}>
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${theme.border} flex-shrink-0`}>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400/70" />
          <div className="w-2 h-2 rounded-full bg-amber-400/70" />
          <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
        </div>
        <div className={`flex-1 h-4 rounded-md ${theme.card} mx-2 max-w-[120px]`} />
      </div>
      <div className="flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

function DashboardMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {["2,847", "98%", "340h"].map((v, i) => (
          <div key={i} className={`rounded-lg p-2 ${theme.card}`}>
            <div className={`h-1.5 w-8 rounded ${theme.cardBody} opacity-40 mb-1.5`} />
            <div className={`text-xs font-bold ${theme.cardTitle}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className={`rounded-lg p-2 flex-1 ${theme.card}`}>
        <div className="flex items-end gap-1 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm opacity-80"
              style={{ height: `${h}%`, backgroundColor: i === 5 ? accent : `${accent}60` }}
            />
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function DeviceMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <div className={`h-full flex items-center justify-center ${theme.page}`}>
      <div className={`w-28 h-48 rounded-[1.5rem] border-4 ${theme.border} shadow-xl overflow-hidden`}>
        <div className="h-4 flex items-center justify-center" style={{ backgroundColor: accent }}>
          <div className="w-8 h-1 rounded-full bg-white/30" />
        </div>
        <div className={`p-2 space-y-2 ${theme.section}`}>
          <div className={`h-8 rounded-lg ${theme.card}`} />
          <div className={`h-3 w-3/4 rounded ${theme.card}`} />
          <div className={`h-3 w-1/2 rounded ${theme.card}`} />
          <div className="h-16 rounded-lg mt-3" style={{ backgroundColor: `${accent}30` }} />
        </div>
      </div>
    </div>
  );
}

function AnalyticsMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <Chrome theme={theme}>
      <div className="flex gap-3 h-full">
        <div className="flex-1">
          <svg viewBox="0 0 200 80" className="w-full h-full">
            <path
              d="M0,60 Q50,20 100,40 T200,25"
              fill="none"
              stroke={accent}
              strokeWidth="2.5"
              opacity="0.8"
            />
            <path d="M0,60 Q50,20 100,40 T200,25 V80 H0 Z" fill={accent} opacity="0.12" />
          </svg>
        </div>
        <div className="w-16 space-y-2">
          {[85, 62, 48].map((p, i) => (
            <div key={i}>
              <div className={`h-1 rounded-full ${theme.card} mb-1`} />
              <div className="h-1.5 rounded-full overflow-hidden bg-black/5">
                <div className="h-full rounded-full" style={{ width: `${p}%`, backgroundColor: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function WorkflowMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  const steps = ["Input", "Process", "Output"];
  return (
    <Chrome theme={theme}>
      <div className="flex items-center justify-between gap-2 h-full">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-full rounded-lg p-2 ${theme.card} text-center`}
              style={i === 1 ? { borderColor: accent, borderWidth: 1 } : undefined}
            >
              <div className={`w-6 h-6 rounded-md mx-auto mb-1`} style={{ backgroundColor: `${accent}${i === 1 ? "" : "40"}` }} />
              <span className={`text-[9px] font-medium ${theme.cardTitle}`}>{label}</span>
            </div>
            {i < 2 && <span className="text-[10px] opacity-30">→</span>}
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function CreatorMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-2 gap-2 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded-lg overflow-hidden ${theme.card}`}>
            <div className="h-10" style={{ backgroundColor: `${accent}${20 + i * 15}` }} />
            <div className="p-1.5">
              <div className={`h-1.5 w-2/3 rounded ${theme.cardBody} opacity-30 mb-1`} />
              <div className={`h-1 w-1/2 rounded ${theme.cardBody} opacity-20`} />
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

export function ImmersionStrip({
  type,
  theme,
  accent,
}: {
  type: "onboarding" | "analytics" | "saas-panel";
  theme: DirectionTheme;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden border ${theme.border} h-48`}>
      {type === "onboarding" && <OnboardingMock theme={theme} accent={accent} />}
      {type === "analytics" && <AnalyticsMock theme={theme} accent={accent} />}
      {type === "saas-panel" && <SaasPanelMock theme={theme} accent={accent} />}
    </div>
  );
}

function OnboardingMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <Chrome theme={theme}>
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div
          className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: accent }}
        >
          1
        </div>
        <div className={`h-2 w-32 rounded mb-2 ${theme.card}`} />
        <div className={`h-2 w-24 rounded mb-4 ${theme.card}`} />
        <div className="flex gap-2 w-full max-w-[180px]">
          <div className="flex-1 h-8 rounded-lg opacity-30" style={{ backgroundColor: accent }} />
          <div className={`flex-1 h-8 rounded-lg ${theme.card}`} />
        </div>
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i === 0 ? accent : `${accent}40` }}
            />
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function SaasPanelMock({ theme, accent }: { theme: DirectionTheme; accent: string }) {
  return (
    <Chrome theme={theme}>
      <div className="flex h-full gap-2">
        <div className={`w-12 rounded-lg p-1.5 space-y-1.5 flex-shrink-0 ${theme.card}`}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-2 rounded"
              style={{ backgroundColor: i === 1 ? `${accent}50` : undefined }}
            />
          ))}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 h-8 rounded-lg ${theme.card}`} />
            ))}
          </div>
          <div className={`flex-1 rounded-lg p-2 ${theme.card}`}>
            <div className="flex items-end gap-1 h-12">
              {[30, 50, 35, 70, 45, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${h}%`, backgroundColor: i === 4 ? accent : `${accent}45` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

export function InlineDashboardPreview({
  theme,
  stats,
  accent = "#2563eb",
}: {
  theme: DirectionTheme;
  stats: { label: string; value: string; change: string }[];
  accent?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 ${theme.card}`}>
            <p className={`text-xs mb-1 ${theme.cardBody}`}>{s.label}</p>
            <p className={`text-2xl font-bold ${theme.cardTitle}`}>{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: accent }}>
              {s.change}
            </p>
          </div>
        ))}
      </div>
      <div className={`rounded-2xl p-6 ${theme.card}`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme.cardBody}`}>
          Activity overview
        </p>
        <div className="flex items-end gap-2 h-32">
          {[35, 55, 40, 70, 50, 85, 65, 90, 75, 95, 80, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md opacity-90"
              style={{ height: `${h}%`, backgroundColor: i % 3 === 0 ? accent : `${accent}50` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
