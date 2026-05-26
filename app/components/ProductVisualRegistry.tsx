"use client";

import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { VisualId } from "@/lib/types/startup";

type MockProps = { theme: DirectionTheme; accent: string; animate?: boolean };

export function renderProductVisual(id: VisualId, props: MockProps) {
  switch (id) {
    case "dashboard":
      return <DashboardMock {...props} />;
    case "analytics":
      return <AnalyticsMock {...props} />;
    case "device":
      return <DeviceMock {...props} />;
    case "workflow":
      return <WorkflowMock {...props} />;
    case "creator":
      return <CreatorGridMock {...props} />;
    case "onboarding":
      return <OnboardingMock {...props} />;
    case "saas-panel":
      return <SaasPanelMock {...props} />;
    case "fitness-tracker":
      return <FitnessTrackerMock {...props} />;
    case "health-metrics":
      return <HealthMetricsMock {...props} />;
    case "creator-timeline":
      return <CreatorTimelineMock {...props} />;
    case "creator-analytics":
      return <CreatorAnalyticsMock {...props} />;
    case "finance-charts":
      return <FinanceChartsMock {...props} />;
    case "fashion-editorial":
      return <FashionEditorialMock {...props} />;
    case "trend-dashboard":
      return <TrendDashboardMock {...props} />;
    case "learning-progress":
      return <LearningProgressMock {...props} />;
    default:
      return <DashboardMock {...props} />;
  }
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

function AnimatedBars({ heights, accent, animate }: { heights: number[]; accent: string; animate?: boolean }) {
  return (
    <div className="flex items-end gap-1 h-full">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm ${animate ? "orch-bar-animate" : ""}`}
          style={{
            height: `${h}%`,
            backgroundColor: i === heights.length - 2 ? accent : `${accent}${i % 2 ? "50" : "70"}`,
            animationDelay: animate ? `${i * 60}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}

function DashboardMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {["2,847", "98%", "340h"].map((v, i) => (
          <div key={i} className={`rounded-lg p-2 ${theme.card}`}>
            <div className={`text-xs font-bold ${theme.cardTitle}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className={`rounded-lg p-2 h-20 ${theme.card}`}>
        <AnimatedBars heights={[40, 65, 45, 80, 55, 90, 70]} accent={accent} animate={animate} />
      </div>
    </Chrome>
  );
}

function FitnessTrackerMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="flex gap-3 h-full items-center">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke={`${accent}25`} strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="72 100" className={animate ? "orch-glow-pulse" : ""} />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-bold ${theme.cardTitle}`}>72%</span>
        </div>
        <div className="flex-1 space-y-2">
          {[["Steps", "8,432"], ["Calories", "420"], ["Active min", "47"]].map(([l, v]) => (
            <div key={l} className="flex justify-between">
              <span className={`text-[9px] ${theme.cardBody}`}>{l}</span>
              <span className={`text-[10px] font-bold ${theme.cardTitle}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function HealthMetricsMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className={`rounded-lg p-2 ${theme.card}`}>
          <p className={`text-[8px] ${theme.cardBody}`}>Heart rate</p>
          <p className={`text-sm font-bold ${theme.cardTitle}`}>68 bpm</p>
          <svg viewBox="0 0 80 24" className="w-full h-6 mt-2">
            <path d="M0,12 L10,12 L12,4 L14,20 L16,12 L80,12" fill="none" stroke={accent} strokeWidth="1.5" />
          </svg>
        </div>
        <div className={`rounded-lg p-2 ${theme.card}`}>
          <p className={`text-[8px] ${theme.cardBody}`}>Sleep score</p>
          <p className={`text-sm font-bold ${theme.cardTitle}`}>87</p>
          <div className="flex gap-0.5 mt-2 h-8 items-end">
            {[30, 50, 70, 45, 80, 60, 90].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-sm ${animate ? "orch-bar-animate" : ""}`} style={{ height: `${h}%`, backgroundColor: `${accent}80`, animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function CreatorTimelineMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className={`h-8 rounded-lg relative overflow-hidden mb-2 ${theme.card}`}>
        <div className="absolute inset-y-1 left-0 w-[35%] rounded-md" style={{ backgroundColor: `${accent}50` }} />
        <div className="absolute inset-y-2 left-[38%] w-[22%] rounded-md" style={{ backgroundColor: `${accent}35` }} />
        <div className={`absolute top-0 bottom-0 w-0.5 ${animate ? "orch-glow-pulse" : ""}`} style={{ left: "42%", backgroundColor: accent }} />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`rounded-md h-10 ${theme.card}`} style={{ background: `linear-gradient(135deg, ${accent}${40 + i * 10}, transparent)` }} />
        ))}
      </div>
    </Chrome>
  );
}

function CreatorAnalyticsMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {[["Views", "124k"], ["Subs", "+842"]].map(([l, v]) => (
          <div key={l} className={`rounded-lg p-2 ${theme.card}`}>
            <p className={`text-[8px] ${theme.cardBody}`}>{l}</p>
            <p className={`text-xs font-bold ${theme.cardTitle}`}>{v}</p>
          </div>
        ))}
      </div>
      <div className={`rounded-lg p-2 h-14 ${theme.card}`}>
        <AnimatedBars heights={[35, 55, 40, 75, 50, 88, 65, 92]} accent={accent} animate={animate} />
      </div>
    </Chrome>
  );
}

function FinanceChartsMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="flex gap-2 h-full">
        <div className="flex-1">
          <p className={`text-[8px] mb-2 ${theme.cardBody}`}>Portfolio performance</p>
          <svg viewBox="0 0 120 50" className="w-full h-16">
            <path d="M0,40 L20,35 L40,28 L60,32 L80,18 L100,22 L120,8" fill="none" stroke={accent} strokeWidth="2" />
            <path d="M0,40 L20,35 L40,28 L60,32 L80,18 L100,22 L120,8 V50 H0 Z" fill={accent} opacity="0.12" />
          </svg>
        </div>
        <div className="w-20 space-y-2">
          {[["Risk", "Low"], ["Yield", "6.2%"], ["AUM", "$2.4M"]].map(([l, v]) => (
            <div key={l} className={`rounded p-1.5 ${theme.card}`}>
              <p className={`text-[7px] ${theme.cardBody}`}>{l}</p>
              <p className={`text-[9px] font-bold ${theme.cardTitle}`}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function FashionEditorialMock({ theme, accent }: MockProps) {
  return (
    <div className={`h-full flex ${theme.page}`}>
      <div className="w-1/2 h-full bg-gradient-to-br from-neutral-800 to-neutral-600" />
      <div className="w-1/2 p-3 flex flex-col justify-between">
        <p className={`text-[8px] uppercase tracking-[0.2em] ${theme.cardBody}`}>Spring collection</p>
        <p className={`text-sm font-light ${theme.cardTitle}`}>Editorial</p>
        <div className="grid grid-cols-2 gap-1">
          {[accent, `${accent}80`].map((c, i) => (
            <div key={i} className="h-10 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendDashboardMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="space-y-1.5">
        {[["Minimal luxe", "+42%"], ["Earth tones", "+28%"], ["Structured", "+19%"]].map(([label, pct]) => (
          <div key={label} className={`flex items-center gap-2 rounded-lg p-1.5 ${theme.card}`}>
            <div className="w-6 h-6 rounded" style={{ backgroundColor: `${accent}60` }} />
            <span className={`text-[9px] flex-1 ${theme.cardTitle}`}>{label}</span>
            <span className="text-[8px] font-bold" style={{ color: accent }}>{pct}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function LearningProgressMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="space-y-2">
        {["Intro to AI", "Core concepts", "Applied projects"].map((m, i) => (
          <div key={m}>
            <div className="flex justify-between mb-1">
              <span className={`text-[8px] ${theme.cardTitle}`}>{m}</span>
              <span className={`text-[8px] ${theme.cardBody}`}>{i < 2 ? "Done" : "45%"}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/5 overflow-hidden">
              <div className={`h-full rounded-full ${animate ? "orch-bar-animate" : ""}`} style={{ width: i < 2 ? "100%" : "45%", backgroundColor: accent }} />
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function AnalyticsMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <svg viewBox="0 0 200 80" className="w-full h-full">
        <path d="M0,60 Q50,20 100,40 T200,25" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.8" />
        <path d="M0,60 Q50,20 100,40 T200,25 V80 H0 Z" fill={accent} opacity="0.12" />
      </svg>
    </Chrome>
  );
}

function DeviceMock({ theme, accent }: MockProps) {
  return (
    <div className={`h-full flex items-center justify-center ${theme.page}`}>
      <div className={`w-28 h-48 rounded-[1.5rem] border-4 ${theme.border} shadow-xl overflow-hidden orch-animate-float`}>
        <div className="h-4 flex items-center justify-center" style={{ backgroundColor: accent }}>
          <div className="w-8 h-1 rounded-full bg-white/30" />
        </div>
        <div className={`p-2 space-y-2 ${theme.section}`}>
          <div className={`h-8 rounded-lg ${theme.card}`} />
          <div className="h-16 rounded-lg" style={{ backgroundColor: `${accent}30` }} />
        </div>
      </div>
    </div>
  );
}

function WorkflowMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="flex gap-2 h-full items-center">
        {["Input", "Process", "Output"].map((label, i) => (
          <div key={label} className={`flex-1 rounded-lg p-2 text-center ${theme.card}`} style={i === 1 ? { borderColor: accent, borderWidth: 1 } : undefined}>
            <div className="w-6 h-6 rounded-md mx-auto mb-1" style={{ backgroundColor: i === 1 ? accent : `${accent}40` }} />
            <span className={`text-[9px] ${theme.cardTitle}`}>{label}</span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

function CreatorGridMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="grid grid-cols-2 gap-2 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`rounded-lg h-10 ${theme.card}`} style={{ backgroundColor: `${accent}${20 + i * 15}` }} />
        ))}
      </div>
    </Chrome>
  );
}

function OnboardingMock({ theme, accent }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-white text-xs font-bold orch-glow-pulse" style={{ backgroundColor: accent }}>1</div>
        <div className={`h-2 w-32 rounded mb-2 ${theme.card}`} />
        <div className="flex gap-2 w-full max-w-[180px]">
          <div className="flex-1 h-8 rounded-lg" style={{ backgroundColor: accent }} />
          <div className={`flex-1 h-8 rounded-lg ${theme.card}`} />
        </div>
      </div>
    </Chrome>
  );
}

function SaasPanelMock({ theme, accent, animate }: MockProps) {
  return (
    <Chrome theme={theme}>
      <div className="flex h-full gap-2">
        <div className={`w-10 rounded-lg p-1 ${theme.card}`} />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">{[1, 2, 3].map((i) => <div key={i} className={`flex-1 h-6 rounded-lg ${theme.card}`} />)}</div>
          <div className={`rounded-lg p-2 h-12 ${theme.card}`}>
            <AnimatedBars heights={[30, 50, 35, 70, 45, 80]} accent={accent} animate={animate} />
          </div>
        </div>
      </div>
    </Chrome>
  );
}
