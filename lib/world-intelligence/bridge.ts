import type { DirectionId, ImagerySet, StartupBrief } from "@/lib/types/startup";
import type { DirectionKey } from "./world-intelligence";
import type { ThumbnailImage } from "@/app/components/ThumbnailCompositor";

/** Map Orchestra DirectionId → world-intelligence DirectionKey for thumbnails/renderers */
export function toDirectionKey(direction: DirectionId): DirectionKey {
  const map: Partial<Record<DirectionId, DirectionKey>> = {
    orchestra: "orchestra-style",
    "premium-dark": "premium-dark",
    "minimal-clean": "minimal-clean",
    "bold-experimental": "bold-experimental",
    "luxury-editorial": "luxury-editorial",
    "genz-vibrant": "genz-vibrant",
    "cinematic-ai": "premium-dark",
    "fashion-ai": "luxury-editorial",
    "minimal-luxury": "luxury-editorial",
    "apple-modern": "minimal-clean",
    "creative-agency": "bold-experimental",
    "glass-futuristic": "orchestra-style",
    "retro-tech": "bold-experimental",
    "creator-playful": "genz-vibrant",
  };
  return map[direction] ?? "orchestra-style";
}

export function briefToRawInput(brief: StartupBrief): string {
  return [
    brief.name,
    brief.tagline,
    brief.description,
    brief.startupCategory,
    ...(brief.features ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function imagesFromImagerySet(imagery: ImagerySet): {
  heroAtmosphere?: ThumbnailImage;
  heroFocal?: ThumbnailImage;
  featureCard?: ThumbnailImage;
  editorialSpread?: ThumbnailImage;
  socialProof?: ThumbnailImage;
} {
  const asImg = (url: string, alt: string): ThumbnailImage | undefined =>
    url.startsWith("http") ? { url, alt, valid: true } : undefined;

  return {
    heroAtmosphere: asImg(imagery.hero, imagery.heroAlt),
    heroFocal: asImg(imagery.heroChain[1] ?? imagery.hero, imagery.heroAlt),
    featureCard: imagery.products[0]
      ? asImg(imagery.products[0].image, imagery.products[0].name)
      : undefined,
    editorialSpread: imagery.lifestyle[0]
      ? asImg(imagery.lifestyle[0], "Editorial")
      : undefined,
    socialProof: imagery.lifestyle[1]
      ? asImg(imagery.lifestyle[1], "Lifestyle")
      : undefined,
  };
}
