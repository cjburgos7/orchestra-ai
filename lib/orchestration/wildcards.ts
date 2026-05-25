import type { WildcardDirectionId } from "@/lib/types/startup";

export type WildcardMeta = {
  id: WildcardDirectionId;
  label: string;
  tagline: string;
  accent: string;
};

/** Curated pool — Orchestra picks 2 per generation */
export const WILDCARD_POOL: WildcardMeta[] = [
  {
    id: "luxury-editorial",
    label: "Luxury Editorial",
    tagline: "Refined magazine · serif elegance",
    accent: "border-amber-200 hover:border-amber-300",
  },
  {
    id: "glass-futuristic",
    label: "Glass Futuristic",
    tagline: "Frosted panels · soft glow",
    accent: "border-cyan-200 hover:border-cyan-300",
  },
  {
    id: "creator-playful",
    label: "Creator Economy",
    tagline: "Playful · community-first",
    accent: "border-pink-200 hover:border-pink-300",
  },
  {
    id: "apple-modern",
    label: "Apple Modern",
    tagline: "Ultra-clean · product-led",
    accent: "border-slate-300 hover:border-slate-400",
  },
  {
    id: "retro-tech",
    label: "Retro Tech",
    tagline: "Warm nostalgia · monospace charm",
    accent: "border-emerald-200 hover:border-emerald-300",
  },
  {
    id: "creative-agency",
    label: "Creative Agency",
    tagline: "Bold typography · studio energy",
    accent: "border-violet-200 hover:border-violet-300",
  },
  {
    id: "fashion-ai",
    label: "Fashion AI",
    tagline: "High-fashion · editorial contrast",
    accent: "border-rose-200 hover:border-rose-300",
  },
  {
    id: "genz-vibrant",
    label: "Gen-Z Vibrant",
    tagline: "Electric · social-native",
    accent: "border-lime-200 hover:border-lime-300",
  },
  {
    id: "cinematic-ai",
    label: "Cinematic AI",
    tagline: "Dramatic depth · film-grade",
    accent: "border-indigo-200 hover:border-indigo-300",
  },
  {
    id: "minimal-luxury",
    label: "Minimal Luxury",
    tagline: "Quiet opulence · generous space",
    accent: "border-stone-300 hover:border-stone-400",
  },
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Deterministic wildcard pick — same project always gets same wildcards */
export function pickWildcards(seed: string, count = 2): WildcardDirectionId[] {
  const pool = [...WILDCARD_POOL];
  const start = hashSeed(seed) % pool.length;
  const picked: WildcardDirectionId[] = [];

  for (let i = 0; i < count && i < pool.length; i++) {
    const idx = (start + i * 3) % pool.length;
    const candidate = pool[idx].id;
    if (!picked.includes(candidate)) {
      picked.push(candidate);
    }
  }

  if (picked.length < count) {
    for (const w of pool) {
      if (picked.length >= count) break;
      if (!picked.includes(w.id)) picked.push(w.id);
    }
  }

  return picked;
}

export function getWildcardMeta(id: WildcardDirectionId): WildcardMeta | undefined {
  return WILDCARD_POOL.find((w) => w.id === id);
}

export function isWildcardDirection(id: string): id is WildcardDirectionId {
  return WILDCARD_POOL.some((w) => w.id === id);
}
