import type { DirectionId, StartupBrief } from "@/lib/types/startup";
import type { StartupLogo } from "@/lib/types/startup";

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Math.abs(h);
}

const SHAPES: StartupLogo["shape"][] = ["rounded", "circle", "squircle", "sharp"];
const STYLES: StartupLogo["style"][] = ["gradient", "solid", "outline", "glass"];

const DIRECTION_SHAPE: Partial<Record<DirectionId, StartupLogo["shape"]>> = {
  orchestra: "rounded",
  "premium-dark": "circle",
  "bold-experimental": "sharp",
  "minimal-clean": "squircle",
  "luxury-editorial": "sharp",
  "glass-futuristic": "squircle",
  "creator-playful": "rounded",
  "apple-modern": "squircle",
  "retro-tech": "sharp",
  "creative-agency": "sharp",
  "fashion-ai": "circle",
  "genz-vibrant": "sharp",
  "cinematic-ai": "circle",
  "minimal-luxury": "squircle",
};

const DIRECTION_FONT: Partial<Record<DirectionId, StartupLogo["fontStyle"]>> = {
  orchestra: "sans",
  "premium-dark": "sans",
  "bold-experimental": "display",
  "minimal-clean": "sans",
  "luxury-editorial": "serif",
  "glass-futuristic": "sans",
  "creator-playful": "display",
  "apple-modern": "sans",
  "retro-tech": "mono",
  "creative-agency": "display",
  "fashion-ai": "serif",
  "genz-vibrant": "display",
  "cinematic-ai": "sans",
  "minimal-luxury": "serif",
};

export function generateLogo(
  brief: StartupBrief,
  direction: DirectionId,
  accentColor: string,
  seed: string
): StartupLogo {
  const words = brief.name.trim().split(/\s+/);
  const monogram =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : brief.name.slice(0, 2).toUpperCase();

  const h = hash(seed + direction);
  const secondary = shiftColor(accentColor, 40);

  return {
    monogram,
    wordmark: brief.name,
    shape: DIRECTION_SHAPE[direction] ?? SHAPES[h % SHAPES.length],
    style: STYLES[h % STYLES.length],
    fontStyle: DIRECTION_FONT[direction] ?? "sans",
    accentColor,
    secondaryColor: secondary,
  };
}

function shiftColor(hex: string, deg: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let hVal = 0;
  const d = max - min;
  if (d !== 0) {
    if (max === r / 255) hVal = ((g - b) / d) % 6;
    else if (max === g / 255) hVal = (b - r) / d + 2;
    else hVal = (r - g) / d + 4;
  }
  hVal = (hVal * 60 + deg + 360) % 360;
  return hslToHex(hVal, 0.55, 0.45);
}

function hslToHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
