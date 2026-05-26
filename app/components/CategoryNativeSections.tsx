"use client";

import type { DirectionTheme } from "@/lib/orchestration/direction-themes";
import type { GeneratedSections, ImagerySet, StartupBrief } from "@/lib/types/startup";
import WebsiteVisuals from "./WebsiteVisuals";
import SafeImage from "./SafeImage";
import { Reveal, HoverLift, StatCounter, ParallaxBand } from "./VisualMotion";

type Theme = DirectionTheme;

function HeatmapGrid({ accent }: { accent: string }) {
  const cells = [
    0.9, 0.7, 0.4, 0.85, 0.55, 0.3, 0.75, 0.95, 0.6, 0.45, 0.8, 0.65,
    0.5, 0.35, 0.7, 0.88, 0.42, 0.6, 0.92, 0.58, 0.38, 0.72, 0.48, 0.82,
  ];
  return (
    <div className="grid grid-cols-6 gap-1 p-3 rounded-xl bg-black/40 border border-white/10">
      {cells.map((opacity, i) => (
        <div
          key={i}
          className="aspect-square rounded-sm orch-bar-animate"
          style={{
            backgroundColor: accent,
            opacity: 0.15 + opacity * 0.75,
            animationDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </div>
  );
}

function StatStrip({
  stats,
  theme,
  accent,
}: {
  stats: { label: string; value: string; change: string }[];
  theme: Theme;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {stats.map((s, i) => (
        <Reveal key={s.label} delay={i * 80}>
          <HoverLift>
            <div className={`rounded-xl p-4 border ${theme.border} ${theme.card}`}>
              <p className={`text-[10px] uppercase tracking-widest mb-1 ${theme.cardBody}`}>{s.label}</p>
              <p className={`text-2xl font-black tabular-nums ${theme.cardTitle}`} style={{ color: accent }}>
                <StatCounter value={s.value} />
              </p>
              <p className={`text-xs mt-1 font-semibold ${theme.cardBody}`} style={{ color: accent }}>
                {s.change}
              </p>
            </div>
          </HoverLift>
        </Reveal>
      ))}
    </div>
  );
}

/** Sports analytics — heatmaps, scouting cards, live stats */
export function AnalyticsDashboardSection({
  brief,
  sections,
  imagery,
  theme,
  gap,
  accent,
  stats,
  heroVisual,
}: {
  brief: StartupBrief;
  sections: GeneratedSections;
  imagery?: ImagerySet;
  theme: Theme;
  gap: string;
  accent: string;
  stats: { label: string; value: string; change: string }[];
  heroVisual: string;
}) {
  return (
    <section id="section-analytics" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
                Live intelligence
              </p>
              <h2 className={`text-2xl md:text-3xl font-black ${theme.heroText}`}>
                {sections.features.sectionTitle || "Performance analytics"}
              </h2>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border animate-pulse"
              style={{ borderColor: `${accent}55`, color: accent }}
            >
              Live · Q4
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Reveal className="lg:col-span-7" delay={100}>
            <div className={`relative rounded-2xl overflow-hidden border min-h-[280px] ${theme.border}`}>
              {imagery?.hero ? (
                <>
                  <SafeImage src={imagery.hero} fallback={imagery.heroFallback} imagery={imagery} className="absolute inset-0" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-[2]" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
              )}
              <div className="relative z-[3] p-6 h-full flex flex-col justify-end">
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Shot chart overlay</p>
                <h3 className="text-xl font-bold text-white mb-4">{brief.name}</h3>
                <HeatmapGrid accent={accent} />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5 space-y-4">
            <Reveal delay={150}>
              <WebsiteVisuals visualId={heroVisual as never} theme={theme} accentColor={accent} compact animate label={false} />
            </Reveal>
            <StatStrip stats={stats} theme={theme} accent={accent} />
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.features.items.slice(0, 4).map((item, i) => (
              <HoverLift key={item.title}>
                <div className={`rounded-xl p-4 border h-full ${theme.border} ${theme.card}`}>
                  <span className="text-[10px] font-black opacity-30">{String(i + 1).padStart(2, "0")}</span>
                  <p className={`text-sm font-bold mt-2 mb-1 ${theme.cardTitle}`}>{item.title}</p>
                  <p className={`text-xs leading-relaxed ${theme.cardBody}`}>{item.description}</p>
                </div>
              </HoverLift>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Platform showcase — product UI + feature density */
export function PlatformShowcaseSection({
  sections,
  theme,
  gap,
  accent,
  heroVisual,
  secondaryVisual,
}: {
  sections: GeneratedSections;
  theme: Theme;
  gap: string;
  accent: string;
  heroVisual: string;
  secondaryVisual: string;
}) {
  return (
    <section id="section-platform" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
            Platform
          </p>
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${theme.heroText}`}>
            Built for how teams actually work
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Reveal delay={80}>
            <WebsiteVisuals visualId={heroVisual as never} theme={theme} accentColor={accent} animate label />
          </Reveal>
          <Reveal delay={160}>
            <WebsiteVisuals visualId={secondaryVisual as never} theme={theme} accentColor={accent} compact animate label />
          </Reveal>
        </div>
        <Reveal delay={240}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.features.items.slice(0, 4).map((item) => (
              <div key={item.title} className={`flex gap-4 p-4 rounded-xl border ${theme.border} ${theme.card}`}>
                <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <div>
                  <p className={`text-sm font-bold ${theme.cardTitle}`}>{item.title}</p>
                  <p className={`text-xs mt-1 ${theme.cardBody}`}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Metrics band — dense stat row with motion */
export function MetricsBandSection({
  theme,
  gap,
  accent,
  stats,
  headline,
}: {
  theme: Theme;
  gap: string;
  accent: string;
  stats: { label: string; value: string; change: string }[];
  headline?: string;
}) {
  return (
    <section id="section-metrics" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <ParallaxBand className="max-w-6xl mx-auto">
        {headline && (
          <Reveal>
            <h2 className={`text-xl md:text-2xl font-bold mb-6 text-center ${theme.heroText}`}>{headline}</h2>
          </Reveal>
        )}
        <StatStrip stats={stats} theme={theme} accent={accent} />
      </ParallaxBand>
    </section>
  );
}

/** Seasonal drops — food / produce editorial */
export function SeasonalDropsSection({
  brief,
  imagery,
  theme,
  gap,
  accent,
}: {
  brief: StartupBrief;
  imagery: ImagerySet;
  theme: Theme;
  gap: string;
  accent: string;
}) {
  const labels = ["Peak season", "Limited harvest", "Chef's pick", "Farm direct"];
  const imgs = [imagery.hero, ...imagery.lifestyle.slice(0, 3)];

  return (
    <section id="section-seasonal" className={`${gap} border-t scroll-mt-28 ${theme.section} ${theme.border}`}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${theme.cardBody}`} style={{ color: accent }}>
            Seasonal
          </p>
          <h2 className={`text-2xl md:text-3xl font-serif font-light mb-8 ${theme.heroText}`}>
            This week&apos;s harvest
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {labels.map((label, i) => (
            <Reveal key={label} delay={i * 70}>
              <HoverLift>
                <div className={`rounded-2xl overflow-hidden border ${theme.border}`}>
                  <div className="relative aspect-[4/5]">
                    <SafeImage
                      src={imgs[i] ?? imagery.hero}
                      fallback={imagery.lifestyleFallbacks[i] ?? imagery.heroFallback}
                      imagery={imagery}
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-[2]" />
                    <div className="absolute bottom-3 left-3 right-3 z-[3]">
                      <p className="text-[10px] uppercase tracking-widest text-white/70">{label}</p>
                      <p className="text-sm font-bold text-white">{brief.name}</p>
                    </div>
                  </div>
                </div>
              </HoverLift>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
