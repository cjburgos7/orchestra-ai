/**
 * Builds HTTP photo fallback chains — real imagery only, never CSS gradients.
 */

import { buildUnsplashUrl } from "@/lib/curated-stock-photos";
import type { CategorizedImage, ImageRole, RegistryId } from "./image-types";
import { getCategoryRegistry, getImagesForRole } from "./category-registries";
import { filterSemanticallyValid } from "./semantic-guard";
import { rotateCandidates } from "./diversity-engine";
import { buildCropVariant } from "@/lib/slot-hydration";

function hashSalt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

/** Verified fruit hero IDs — always available if registry pick fails */
const FRUIT_HERO_BACKUPS = [
  "1610837524703-040399967cf0",
  "1487700174473-bd5a8d0b4723",
  "1566385101042-f4671190a963",
  "1464965911861-746a04b4bca6",
  "1512621776951-a57141f2eefd",
  "1558618666-fcd25c85cd64",
];

const REGISTRY_HERO_BACKUPS: Partial<Record<RegistryId, string[]>> = {
  fruit: FRUIT_HERO_BACKUPS,
};

export function poolForRole(registryId: RegistryId, role: ImageRole): CategorizedImage[] {
  return filterSemanticallyValid(registryId, getImagesForRole(getCategoryRegistry(registryId), role));
}

export function guaranteeHeroUrl(
  registryId: RegistryId,
  primary: string,
  sessionSalt: string,
  treat: (url: string, salt: number) => string
): string {
  if (primary.startsWith("http")) return primary;

  const heroes = poolForRole(registryId, "hero");
  const rotated = rotateCandidates(heroes, sessionSalt);
  for (const img of rotated) {
    const url = treat(img.url, hashSalt(`${sessionSalt}:force`));
    if (url.startsWith("http")) return url;
  }

  const backups = REGISTRY_HERO_BACKUPS[registryId] ?? FRUIT_HERO_BACKUPS;
  const id = backups[hashSalt(sessionSalt) % backups.length];
  return treat(buildUnsplashUrl(id, 1600, 900), hashSalt(sessionSalt));
}

export function buildHeroChain(
  registryId: RegistryId,
  hero: string,
  sessionSalt: string,
  treat: (url: string, salt: number) => string,
  limit = 6
): string[] {
  const heroes = poolForRole(registryId, "hero");
  const rotated = rotateCandidates(heroes, `${sessionSalt}:hero-chain`);
  const chain: string[] = [];

  if (hero.startsWith("http")) chain.push(hero);

  for (const img of rotated) {
    const url = treat(img.url, hashSalt(`${sessionSalt}:${img.id}`));
    if (url.startsWith("http") && !chain.includes(url)) chain.push(url);
    if (chain.length >= limit) break;
  }

  if (chain.length < 2) {
    const backups = REGISTRY_HERO_BACKUPS[registryId] ?? FRUIT_HERO_BACKUPS;
    for (const id of backups) {
      const url = buildUnsplashUrl(id, 1600, 900);
      if (!chain.includes(url)) chain.push(url);
      if (chain.length >= limit) break;
    }
  }

  return chain.slice(0, limit);
}

export function buildProductChain(
  registryId: RegistryId,
  primary: string,
  sessionSalt: string,
  slotKey: string,
  treat: (url: string, salt: number) => string
): string[] {
  const products = poolForRole(registryId, "product");
  const macros = poolForRole(registryId, "macro");
  const pool = rotateCandidates([...products, ...macros], `${sessionSalt}:${slotKey}`);
  const chain: string[] = [];

  if (primary.startsWith("http")) {
    chain.push(primary);
    chain.push(buildCropVariant(primary, "product", slotKey.length));
  }

  for (const img of pool) {
    const url = treat(img.url, hashSalt(`${sessionSalt}:${slotKey}:${img.id}`));
    const variant = buildCropVariant(url, "product", img.id.length);
    if (variant.startsWith("http") && !chain.includes(variant)) chain.push(variant);
    if (chain.length >= 4) break;
  }

  return chain;
}

export function countHttpPhotos(imagery: {
  hero: string;
  heroChain?: string[];
  lifestyle: string[];
  products: { image: string; imageChain?: string[] }[];
}): number {
  const ids = new Set<string>();
  const add = (url: string) => {
    if (!url.startsWith("http")) return;
    const id = url.match(/photo-([\d]+-[a-f0-9]+)/i)?.[1] ?? url;
    ids.add(id);
  };
  add(imagery.hero);
  imagery.heroChain?.forEach(add);
  imagery.lifestyle.forEach(add);
  imagery.products.forEach((p) => {
    add(p.image);
    p.imageChain?.forEach(add);
  });
  return ids.size;
}
