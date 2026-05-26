"use client";

import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import { getVisualLabel } from "@/lib/orchestration/product-visuals";
import type { SiteVisuals, VisualId } from "@/lib/types/startup";
import { renderProductVisual } from "./ProductVisualRegistry";

type Props = {
  visualId: VisualId;
  theme: DirectionTheme;
  accentColor?: string;
  compact?: boolean;
  animate?: boolean;
  label?: boolean;
};

export default function WebsiteVisuals({
  visualId,
  theme,
  accentColor = "#2563eb",
  compact,
  animate = true,
  label,
}: Props) {
  const h = compact ? "h-36" : "h-56 md:h-72";

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${h} mt-4 mb-2`}>
      <div
        className={`absolute inset-0 rounded-2xl overflow-hidden border ${theme.border} shadow-2xl orch-animate-float`}
        style={{ boxShadow: `0 25px 50px -12px ${accentColor}25` }}
      >
        {renderProductVisual(visualId, { theme, accent: accentColor, animate })}
      </div>
      <div
        className="absolute -bottom-3 -right-3 w-28 h-28 rounded-full blur-3xl opacity-25 pointer-events-none orch-glow-pulse"
        style={{ backgroundColor: accentColor }}
      />
      {label && (
        <p className={`text-center text-[10px] font-medium mt-3 uppercase tracking-widest opacity-50 ${theme.cardBody}`}>
          {getVisualLabel(visualId)}
        </p>
      )}
    </div>
  );
}

export function VisualGallery({
  visuals,
  theme,
  accentColor,
  compact,
}: {
  visuals: SiteVisuals;
  theme: DirectionTheme;
  accentColor: string;
  compact?: boolean;
}) {
  const ids = [visuals.secondaryVisual, visuals.featureVisual, visuals.heroVisual].filter(
    (v, i, a) => a.indexOf(v) === i && v !== visuals.heroVisual
  ).slice(0, 2);
  if (ids.length === 0) ids.push(visuals.secondaryVisual, visuals.featureVisual);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto ${compact ? "mt-4" : "mt-10"}`}>
      {[visuals.secondaryVisual, visuals.featureVisual].map((id) => (
        <div key={id} className={`rounded-2xl overflow-hidden border ${theme.border} h-40 orch-hover-lift`}>
          {renderProductVisual(id, { theme, accent: accentColor, animate: true })}
        </div>
      ))}
    </div>
  );
}

export function ImmersionStrip({
  visualId,
  theme,
  accent,
  animate = true,
}: {
  visualId: VisualId;
  theme: DirectionTheme;
  accent: string;
  animate?: boolean;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden border ${theme.border} h-48 orch-hover-lift`}>
      {renderProductVisual(visualId, { theme, accent, animate })}
    </div>
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
    <div className="space-y-4 orch-stagger">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`orch-reveal rounded-2xl p-5 ${theme.card} orch-hover-lift`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className={`text-xs mb-1 ${theme.cardBody}`}>{s.label}</p>
            <p className={`text-2xl font-bold ${theme.cardTitle}`}>{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: accent }}>{s.change}</p>
          </div>
        ))}
      </div>
      <div className={`orch-reveal rounded-2xl p-6 ${theme.card}`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme.cardBody}`}>Activity overview</p>
        <div className="flex items-end gap-2 h-32">
          {[35, 55, 40, 70, 50, 85, 65, 90, 75, 95, 80, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md orch-bar-animate"
              style={{ height: `${h}%`, backgroundColor: i % 3 === 0 ? accent : `${accent}50`, animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
