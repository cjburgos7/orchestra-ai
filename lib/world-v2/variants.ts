import type { V2CategoryKey, V2VariantProfile } from "./types";

const BASE: Record<V2CategoryKey, V2VariantProfile[]> = {
  fitness: [
    {
      key: "kinetic",
      label: "Kinetic training",
      motion: "energetic",
      background: "#0a0a0a",
      foreground: "#fafafa",
      meshFrom: "#fff7ed",
      meshTo: "#fed7aa",
      sectionBlueprint: [
        { type: "hero-split-kinetic", heightVh: 100, motion: "parallax", density: "dense", imageRoles: ["hero", "detail"] },
        { type: "stats-band", heightVh: 28, motion: "reveal", density: "balanced", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 72, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "editorial-mosaic", heightVh: 88, motion: "parallax", density: "dense", imageRoles: ["editorial", "ambient", "detail"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 1 },
        { type: "testimonial-float", heightVh: 55, motion: "float", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 62, motion: "drift", density: "balanced", imageRoles: ["hero"] },
      ],
    },
  ],
  floral: [
    {
      key: "editorial",
      label: "Luxury floral editorial",
      motion: "editorial",
      background: "#faf9f7",
      foreground: "#1c1917",
      meshFrom: "#e8f3ef",
      meshTo: "#cce3de",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "story-editorial", heightVh: 65, motion: "reveal", density: "sparse", imageRoles: ["editorial"] },
        { type: "editorial-mosaic", heightVh: 95, motion: "float", density: "dense", imageRoles: ["feature", "editorial", "detail"] },
        { type: "feature-asymmetric", heightVh: 70, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 50, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 58, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  finance: [
    {
      key: "premium",
      label: "Intelligent premium",
      motion: "cinematic",
      background: "#f2f5f9",
      foreground: "#0d1b2e",
      meshFrom: "#e8eef8",
      meshTo: "#d4e0f5",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 30, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 68, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "proof-gallery", heightVh: 72, motion: "parallax", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "testimonial-float", heightVh: 48, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 55, motion: "reveal", density: "balanced", imageRoles: ["editorial"] },
      ],
    },
    {
      key: "vault",
      label: "Executive vault",
      motion: "editorial",
      background: "#080e1a",
      foreground: "#e8eef8",
      meshFrom: "#0f1a2e",
      meshTo: "#071226",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 28, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 70, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "story-editorial", heightVh: 58, motion: "reveal", density: "sparse", imageRoles: ["editorial"] },
        { type: "cta-immersive", heightVh: 55, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  fashion: [
    {
      key: "runway",
      label: "Editorial runway",
      motion: "editorial",
      background: "#fafafa",
      foreground: "#0a0a0a",
      meshFrom: "#fdf2f8",
      meshTo: "#fce7f3",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "editorial-mosaic", heightVh: 90, motion: "float", density: "dense", imageRoles: ["editorial", "feature", "detail"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 45, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 60, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  food: [
    {
      key: "harvest",
      label: "Sunlit harvest",
      motion: "editorial",
      background: "#fffbeb",
      foreground: "#1c1917",
      meshFrom: "#fef9c3",
      meshTo: "#fde68a",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "dense", imageRoles: ["hero"] },
        { type: "editorial-mosaic", heightVh: 85, motion: "float", density: "dense", imageRoles: ["editorial", "feature", "detail"] },
        { type: "feature-asymmetric", heightVh: 70, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "story-editorial", heightVh: 60, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 55, motion: "parallax", density: "balanced", imageRoles: ["hero"] },
      ],
    },
  ],
  saas: [
    {
      key: "launch",
      label: "Product launch",
      motion: "cinematic",
      background: "#fafbfc",
      foreground: "#0f172a",
      meshFrom: "#f0f9ff",
      meshTo: "#e0e7ff",
      sectionBlueprint: [
        { type: "hero-split-kinetic", heightVh: 95, motion: "reveal", density: "balanced", imageRoles: ["hero", "detail"] },
        { type: "stats-band", heightVh: 28, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 70, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "proof-gallery", heightVh: 72, motion: "parallax", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "testimonial-float", heightVh: 50, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 58, motion: "reveal", density: "balanced", imageRoles: ["hero"] },
      ],
    },
    {
      key: "dark-pioneer",
      label: "Dark pioneer",
      motion: "cinematic",
      background: "#06090f",
      foreground: "#dde6f4",
      meshFrom: "#0d1a33",
      meshTo: "#12083a",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 28, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 72, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["editorial"], featureIndex: 1 },
        { type: "testimonial-float", heightVh: 52, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 60, motion: "parallax", density: "balanced", imageRoles: ["hero"] },
      ],
    },
    {
      key: "precision",
      label: "Precision editorial",
      motion: "editorial",
      background: "#f7f8fa",
      foreground: "#0c1329",
      meshFrom: "#eaf0fc",
      meshTo: "#ede8fc",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 92, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "editorial-mosaic", heightVh: 82, motion: "float", density: "dense", imageRoles: ["editorial", "feature", "detail"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 48, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 56, motion: "reveal", density: "balanced", imageRoles: ["editorial"] },
      ],
    },
  ],
  wellness: [
    {
      key: "calm",
      label: "Designed calm",
      motion: "editorial",
      background: "#f0fdf4",
      foreground: "#14532d",
      meshFrom: "#ecfdf5",
      meshTo: "#d1fae5",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "story-editorial", heightVh: 62, motion: "drift", density: "sparse", imageRoles: ["editorial"] },
        { type: "feature-asymmetric", heightVh: 65, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 48, motion: "float", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 52, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  sports: [
    {
      key: "arena",
      label: "Arena intelligence",
      motion: "energetic",
      background: "#0f172a",
      foreground: "#f8fafc",
      meshFrom: "#eff6ff",
      meshTo: "#dbeafe",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "dense", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 30, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "proof-gallery", heightVh: 78, motion: "parallax", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "cta-immersive", heightVh: 55, motion: "drift", density: "balanced", imageRoles: ["hero"] },
      ],
    },
  ],
  travel: [
    {
      key: "wander",
      label: "Departure desire",
      motion: "editorial",
      background: "#f0fdfa",
      foreground: "#134e4a",
      meshFrom: "#f0fdfa",
      meshTo: "#ccfbf1",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "editorial-mosaic", heightVh: 88, motion: "float", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "story-editorial", heightVh: 58, motion: "drift", density: "sparse", imageRoles: ["feature"] },
        { type: "cta-immersive", heightVh: 55, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  home: [
    {
      key: "lived-in",
      label: "Lived-in editorial",
      motion: "editorial",
      background: "#fafaf9",
      foreground: "#292524",
      meshFrom: "#fafaf9",
      meshTo: "#e7e5e4",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 95, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "editorial-mosaic", heightVh: 82, motion: "reveal", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "feature-asymmetric", heightVh: 65, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "cta-immersive", heightVh: 52, motion: "drift", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  education: [
    {
      key: "discovery",
      label: "Discovery learning",
      motion: "cinematic",
      background: "#fafbff",
      foreground: "#1e1b4b",
      meshFrom: "#eef2ff",
      meshTo: "#e0e7ff",
      sectionBlueprint: [
        { type: "hero-split-kinetic", heightVh: 92, motion: "reveal", density: "balanced", imageRoles: ["hero", "detail"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "proof-gallery", heightVh: 70, motion: "parallax", density: "dense", imageRoles: ["editorial", "ambient"] },
        { type: "testimonial-float", heightVh: 48, motion: "drift", density: "sparse", imageRoles: ["feature"] },
        { type: "cta-immersive", heightVh: 55, motion: "reveal", density: "balanced", imageRoles: ["hero"] },
      ],
    },
    {
      key: "campus",
      label: "Campus editorial",
      motion: "editorial",
      background: "#fffcf5",
      foreground: "#1a1207",
      meshFrom: "#fef9ee",
      meshTo: "#eef2ff",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "story-editorial", heightVh: 62, motion: "reveal", density: "sparse", imageRoles: ["editorial"] },
        { type: "feature-asymmetric", heightVh: 65, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 48, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 55, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  health: [
    {
      key: "care",
      label: "Human care",
      motion: "editorial",
      background: "#f0fdfa",
      foreground: "#134e4a",
      meshFrom: "#f0fdfa",
      meshTo: "#ccfbf1",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 92, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "story-editorial", heightVh: 60, motion: "reveal", density: "sparse", imageRoles: ["editorial"] },
        { type: "feature-asymmetric", heightVh: 65, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 48, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 52, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  creator: [
    {
      key: "studio",
      label: "Creator studio",
      motion: "energetic",
      background: "#fdf4ff",
      foreground: "#581c87",
      meshFrom: "#fdf4ff",
      meshTo: "#fae8ff",
      sectionBlueprint: [
        { type: "hero-split-kinetic", heightVh: 95, motion: "parallax", density: "dense", imageRoles: ["hero", "detail"] },
        { type: "editorial-mosaic", heightVh: 80, motion: "float", density: "dense", imageRoles: ["editorial", "feature", "ambient"] },
        { type: "feature-asymmetric", heightVh: 65, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "proof-gallery", heightVh: 68, motion: "parallax", density: "dense", imageRoles: ["editorial", "ambient"] },
        { type: "cta-immersive", heightVh: 55, motion: "drift", density: "balanced", imageRoles: ["hero"] },
      ],
    },
  ],
  music: [
    {
      key: "stage",
      label: "Live performance",
      motion: "cinematic",
      background: "#06040f",
      foreground: "#e8e0f8",
      meshFrom: "#0d0a1f",
      meshTo: "#1a1040",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 26, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 70, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "editorial-mosaic", heightVh: 85, motion: "float", density: "dense", imageRoles: ["editorial", "detail", "ambient"] },
        { type: "story-editorial", heightVh: 58, motion: "drift", density: "sparse", imageRoles: ["editorial"] },
        { type: "cta-immersive", heightVh: 62, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
    {
      key: "studio-dark",
      label: "Studio underground",
      motion: "editorial",
      background: "#080811",
      foreground: "#d4d0e8",
      meshFrom: "#10102a",
      meshTo: "#1c1035",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "story-editorial", heightVh: 60, motion: "reveal", density: "sparse", imageRoles: ["editorial"] },
        { type: "feature-asymmetric", heightVh: 68, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "testimonial-float", heightVh: 52, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 60, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
  science: [
    {
      key: "frontier",
      label: "Scientific frontier",
      motion: "cinematic",
      background: "#030b18",
      foreground: "#c8daf0",
      meshFrom: "#020817",
      meshTo: "#0a1628",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 100, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 26, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 72, motion: "float", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["editorial"], featureIndex: 1 },
        { type: "testimonial-float", heightVh: 52, motion: "drift", density: "sparse", imageRoles: ["ambient"] },
        { type: "cta-immersive", heightVh: 58, motion: "parallax", density: "balanced", imageRoles: ["hero"] },
      ],
    },
    {
      key: "lab-precision",
      label: "Lab precision",
      motion: "editorial",
      background: "#f7f9fc",
      foreground: "#0a1929",
      meshFrom: "#eef3fb",
      meshTo: "#e2eaf8",
      sectionBlueprint: [
        { type: "hero-cinematic", heightVh: 92, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
        { type: "stats-band", heightVh: 28, motion: "reveal", density: "dense", imageRoles: [] },
        { type: "feature-asymmetric", heightVh: 68, motion: "reveal", density: "balanced", imageRoles: ["feature"], featureIndex: 0 },
        { type: "editorial-mosaic", heightVh: 78, motion: "float", density: "dense", imageRoles: ["editorial", "detail", "ambient"] },
        { type: "cta-immersive", heightVh: 55, motion: "parallax", density: "sparse", imageRoles: ["hero"] },
      ],
    },
  ],
};

export function pickVariant(category: V2CategoryKey, seed: string): V2VariantProfile {
  const variants = BASE[category];
  const h = Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return variants[h % variants.length];
}

export function typographyFor(category: V2CategoryKey, variant: V2VariantProfile) {
  const kinetic = variant.motion === "energetic";
  const editorial = variant.motion === "editorial";
  const isDark = variant.background.startsWith("#0") || variant.background.startsWith("#06") || variant.background.startsWith("#08");

  if (category === "music") {
    return {
      displayFamily: "'Helvetica Neue', Arial, sans-serif",
      displayWeight: 900,
      displayTracking: "-0.05em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(4rem, 11vw, 9rem)",
    };
  }
  if (category === "science") {
    return {
      displayFamily: "'Helvetica Neue', Arial, sans-serif",
      displayWeight: 700,
      displayTracking: "-0.03em",
      bodyFamily: "'SF Mono', 'Fira Code', monospace",
      headlineScale: "clamp(3.5rem, 9vw, 7.5rem)",
    };
  }
  if (category === "floral" || category === "fashion") {
    return {
      displayFamily: "Georgia, 'Times New Roman', serif",
      displayWeight: 400,
      displayTracking: "-0.025em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(3.5rem, 9vw, 7.5rem)",
    };
  }
  if (category === "wellness" || category === "home" || category === "travel" || category === "food" || category === "health") {
    return {
      displayFamily: "Georgia, 'Times New Roman', serif",
      displayWeight: 400,
      displayTracking: "-0.02em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(3rem, 8vw, 6.5rem)",
    };
  }
  if (kinetic || category === "fitness" || category === "sports") {
    return {
      displayFamily: "'Helvetica Neue', Arial, sans-serif",
      displayWeight: 900,
      displayTracking: "-0.04em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(4rem, 12vw, 9.5rem)",
    };
  }
  if (isDark) {
    return {
      displayFamily: "'Helvetica Neue', Arial, sans-serif",
      displayWeight: 800,
      displayTracking: "-0.04em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(4rem, 10vw, 8.5rem)",
    };
  }
  if (editorial) {
    return {
      displayFamily: "Georgia, 'Times New Roman', serif",
      displayWeight: 400,
      displayTracking: "-0.02em",
      bodyFamily: "system-ui, sans-serif",
      headlineScale: "clamp(3rem, 8vw, 6.5rem)",
    };
  }
  return {
    displayFamily: "'Helvetica Neue', Arial, system-ui, sans-serif",
    displayWeight: 800,
    displayTracking: "-0.035em",
    bodyFamily: "system-ui, sans-serif",
    headlineScale: "clamp(3rem, 8vw, 6.5rem)",
  };
}
