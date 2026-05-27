"use client";

/**
 * ThumbnailCompositor.tsx
 *
 * Renders direction-differentiated thumbnail cards as real designed compositions.
 *
 * Each direction has a STRUCTURALLY DIFFERENT layout — not just different colors.
 * This directly fixes the "all thumbnails look the same" problem seen in the screenshots.
 *
 * Architecture:
 * - ThumbnailCard: the public component — takes WorldDNA + direction + images
 * - Each direction has a dedicated sub-renderer
 * - Images are validated before render (uses the SafeImage pattern)
 * - No direction shares a layout with any other direction
 */

import React, { useState } from "react";
import type { WorldDNA, DirectionKey, ThumbnailSpec } from "@/lib/world-intelligence";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThumbnailImage {
  url: string;
  alt: string;
  valid?: boolean;  // pre-validated
}

export interface ThumbnailCardProps {
  dna: WorldDNA;
  direction: DirectionKey;
  images: {
    heroAtmosphere?: ThumbnailImage;
    heroFocal?: ThumbnailImage;
    featureCard?: ThumbnailImage;
    editorialSpread?: ThumbnailImage;
    socialProof?: ThumbnailImage;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  width?: number;
  height?: number;
}

const DIRECTION_LABELS: Record<DirectionKey, { title: string; subtitle: string }> = {
  "premium-dark":      { title: "Premium Dark",      subtitle: "Cinematic · atmospheric" },
  "minimal-clean":     { title: "Minimal Clean",      subtitle: "Notion-like · quiet" },
  "bold-experimental": { title: "Bold Experimental",  subtitle: "Breakout energy · expressive" },
  "luxury-editorial":  { title: "Luxury Editorial",   subtitle: "Refined magazine · serif" },
  "genz-vibrant":      { title: "Gen-Z Vibrant ✦",    subtitle: "Electric · social-native" },
  "orchestra-style":   { title: "Orchestra Style",    subtitle: "Platform signature" },
};

// ─── Image with validated fallback ───────────────────────────────────────────

function ThumbnailImage({
  image,
  style,
  fallbackColor = "#1A1A2E",
}: {
  image?: ThumbnailImage;
  style: React.CSSProperties;
  fallbackColor?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!image?.url || error) {
    return (
      <div style={{ ...style, background: fallbackColor, opacity: 0.4 }} />
    );
  }

  return (
    <div style={{ ...style, overflow: "hidden", position: "relative" }}>
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, background: fallbackColor, opacity: 0.5 }} />
      )}
      <img
        src={image.url}
        alt={image.alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />
    </div>
  );
}

// ─── Direction-specific renderers ─────────────────────────────────────────────

// PREMIUM DARK: Atmospheric full-bleed, startup name emerges from darkness
// Structure: full-bleed atmosphere image + dark gradient overlay + type at bottom
function PremiumDarkThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  const [primary] = dna.semanticField.colorSignature.dominants;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Full-bleed atmosphere */}
      <ThumbnailImage
        image={images.heroAtmosphere || images.heroFocal}
        style={{ position: "absolute", inset: 0 }}
        fallbackColor="#080810"
      />
      {/* Dark atmospheric gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse at 25% 60%, ${primary}28 0%, transparent 50%),
          linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.4) 45%, rgba(5,5,8,0.15) 100%)
        `,
      }} />
      {/* Noise grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        opacity: 0.6, mixBlendMode: "overlay",
      }} />
      {/* Category label — top left */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        fontFamily: "'Courier New', monospace", fontSize: 9,
        letterSpacing: "0.22em", color: "rgba(180,175,255,0.5)",
        textTransform: "uppercase",
      }}>
        {dna.category.replace("-", " ")}
      </div>
      {/* Startup name — bottom left, large serif */}
      <div style={{
        position: "absolute", bottom: 14, left: 14, right: 14,
      }}>
        <div style={{
          fontFamily: "'Georgia', serif",
          fontSize: 18, fontWeight: 700,
          color: "#F0EFFF", lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}>
          {dna.startupName}
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 8, letterSpacing: "0.18em",
          color: "rgba(180,175,255,0.35)",
          textTransform: "uppercase", marginTop: 4,
        }}>
          Premium Dark
        </div>
      </div>
      {/* Accent glow dot */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        width: 6, height: 6, borderRadius: "50%",
        background: primary, opacity: 0.8,
        boxShadow: `0 0 8px ${primary}`,
      }} />
    </div>
  );
}

// MINIMAL CLEAN: White space, isolated product, restrained type
// Structure: white bg, single image centered top-half, horizontal rule, name bottom
function MinimalCleanThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FAFAF8" }}>
      {/* Single focal image — centered, top 55% */}
      <div style={{ position: "absolute", top: "8%", left: "12%", right: "12%", height: "50%" }}>
        <ThumbnailImage
          image={images.heroFocal || images.heroAtmosphere}
          style={{
            width: "100%", height: "100%",
            borderRadius: 4,
            overflow: "hidden",
          }}
          fallbackColor="#E8EEF8"
        />
      </div>
      {/* Horizontal rule */}
      <div style={{
        position: "absolute", bottom: 38, left: 16, right: 16,
        height: 1, background: "rgba(0,0,0,0.07)",
      }} />
      {/* Startup name — minimal, bottom */}
      <div style={{
        position: "absolute", bottom: 14, left: 16,
        fontFamily: "'Georgia', serif",
        fontSize: 13, fontWeight: 300,
        color: "#111110", letterSpacing: "-0.01em",
      }}>
        {dna.startupName}
      </div>
      <div style={{
        position: "absolute", bottom: 14, right: 16,
        fontFamily: "'Courier New', monospace",
        fontSize: 8, color: "rgba(60,58,52,0.35)",
        letterSpacing: "0.14em", textTransform: "uppercase",
      }}>
        Minimal
      </div>
    </div>
  );
}

// LUXURY EDITORIAL: Diagonal/split composition, serif elegance
// Structure: warm paper bg, right 40% is full-bleed image, serif typography left
function LuxuryEditorialThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F7F4EF" }}>
      {/* Right panel — editorial image */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "42%",
      }}>
        <ThumbnailImage
          image={images.editorialSpread || images.heroFocal}
          style={{ position: "absolute", inset: 0 }}
          fallbackColor="#E8DDD0"
        />
        {/* Left fade */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, #F7F4EF 0%, transparent 40%)",
        }} />
      </div>

      {/* Issue number — top left rotated */}
      <div style={{
        position: "absolute", top: 16, left: 14,
        fontFamily: "'Courier New', monospace",
        fontSize: 8, letterSpacing: "0.22em",
        color: "rgba(140,110,70,0.5)", textTransform: "uppercase",
      }}>
        Collection I
      </div>

      {/* Brand name — large serif, bottom left */}
      <div style={{
        position: "absolute", bottom: 16, left: 14, right: "46%",
      }}>
        <div style={{
          fontFamily: "'Georgia', 'Palatino Linotype', serif",
          fontSize: 15, fontWeight: 400,
          color: "#1A1612", lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          {dna.startupName}
        </div>
        <div style={{
          width: 24, height: 1,
          background: "rgba(200,169,110,0.5)",
          marginTop: 6,
        }} />
      </div>

      {/* Noise */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.3, mixBlendMode: "multiply",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      }} />
    </div>
  );
}

// BOLD EXPERIMENTAL: Grid collision, 3 images overlapping, aggressive type
// Structure: dark bg, 3-image asymmetric grid, color accent block, impact type
function BoldExperimentalThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  const [primary, secondary] = dna.semanticField.colorSignature.dominants;
  const accentColor = secondary || "#FF3366";

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0D0D0D" }}>
      {/* Image 1 — top left, larger */}
      <div style={{
        position: "absolute", top: "8%", left: "6%",
        width: "46%", height: "46%",
      }}>
        <ThumbnailImage
          image={images.heroFocal}
          style={{ width: "100%", height: "100%", borderRadius: 2 }}
          fallbackColor="#1A1A1A"
        />
      </div>

      {/* Image 2 — top right */}
      <div style={{
        position: "absolute", top: "5%", right: "5%",
        width: "34%", height: "36%",
      }}>
        <ThumbnailImage
          image={images.featureCard}
          style={{ width: "100%", height: "100%", borderRadius: 2 }}
          fallbackColor="#222"
        />
      </div>

      {/* Image 3 — mid center-right */}
      <div style={{
        position: "absolute", top: "48%", left: "28%",
        width: "36%", height: "30%",
      }}>
        <ThumbnailImage
          image={images.socialProof || images.heroAtmosphere}
          style={{ width: "100%", height: "100%", borderRadius: 2 }}
          fallbackColor="#1A1A1A"
        />
      </div>

      {/* Accent color block — overlapping */}
      <div style={{
        position: "absolute", top: "50%", left: "58%",
        width: "18%", height: "22%",
        background: accentColor, opacity: 0.9,
      }} />

      {/* Startup name — bold impact, bottom */}
      <div style={{
        position: "absolute", bottom: 10, left: 10, right: 10,
      }}>
        <div style={{
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          fontSize: 16, fontWeight: 900,
          color: "#FFFFFF", letterSpacing: "-0.01em",
          lineHeight: 1, textTransform: "uppercase",
        }}>
          {dna.startupName.toUpperCase()}
        </div>
      </div>

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 3px)",
      }} />
    </div>
  );
}

// GEN-Z VIBRANT: Social card energy, bright saturated gradient, card-in-card
// Structure: gradient bg, rounded image card in center, bright type
function GenZVibrantThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  const [primary, secondary] = dna.semanticField.colorSignature.dominants;
  const bg = `linear-gradient(135deg, ${primary}DD 0%, ${secondary || primary}BB 100%)`;

  return (
    <div style={{ position: "absolute", inset: 0, background: bg }}>
      {/* Social-style card in center */}
      <div style={{
        position: "absolute", top: "9%", left: "9%", right: "9%", height: "56%",
        borderRadius: 10, overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      }}>
        <ThumbnailImage
          image={images.heroFocal || images.socialProof}
          style={{ position: "absolute", inset: 0 }}
          fallbackColor={primary}
        />
        {/* Card bottom gradient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }} />
      </div>

      {/* Bottom section */}
      <div style={{
        position: "absolute", bottom: 10, left: 12, right: 12,
      }}>
        <div style={{
          fontFamily: "'Georgia', sans-serif",
          fontSize: 14, fontWeight: 700,
          color: "#FFFFFF", letterSpacing: "-0.01em",
        }}>
          {dna.startupName}
        </div>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 8, letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.55)", marginTop: 3,
          textTransform: "uppercase",
        }}>
          Gen-Z Vibrant ✦
        </div>
      </div>
    </div>
  );
}

// ORCHESTRA STYLE: Layered depth, right-side image with left-side fade
// Structure: dark base, right image fades to dark, gradient depth, authority type
function OrchestraStyleThumbnail({ dna, images, spec }: {
  dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec;
}) {
  const [primary] = dna.semanticField.colorSignature.dominants;

  return (
    <div style={{ position: "absolute", inset: 0, background: "#090912" }}>
      {/* Right-side image with left-fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "55%",
      }}>
        <ThumbnailImage
          image={images.heroAtmosphere || images.heroFocal}
          style={{ position: "absolute", inset: 0 }}
          fallbackColor="#141428"
        />
        {/* Fade to dark on left */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, #090912 0%, transparent 60%)",
        }} />
      </div>

      {/* Category glow */}
      <div style={{
        position: "absolute", top: "30%", left: "20%",
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${primary}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Top label */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        fontFamily: "'Courier New', monospace",
        fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(180,175,255,0.4)", textTransform: "uppercase",
      }}>
        Orchestra
      </div>

      {/* Startup name */}
      <div style={{
        position: "absolute", bottom: 14, left: 14,
        fontFamily: "'Georgia', serif",
        fontSize: 15, fontWeight: 500,
        color: "#F0EFFF", letterSpacing: "-0.015em",
      }}>
        {dna.startupName}
      </div>

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to top, #090912 0%, transparent 100%)",
      }} />
    </div>
  );
}

// ─── DIRECTION RENDERER MAP ───────────────────────────────────────────────────

const DIRECTION_RENDERERS: Record<
  DirectionKey,
  React.ComponentType<{ dna: WorldDNA; images: ThumbnailCardProps["images"]; spec: ThumbnailSpec }>
> = {
  "premium-dark":      PremiumDarkThumbnail,
  "minimal-clean":     MinimalCleanThumbnail,
  "luxury-editorial":  LuxuryEditorialThumbnail,
  "bold-experimental": BoldExperimentalThumbnail,
  "genz-vibrant":      GenZVibrantThumbnail,
  "orchestra-style":   OrchestraStyleThumbnail,
};

// ─── PUBLIC COMPONENT ─────────────────────────────────────────────────────────

export function ThumbnailCard({
  dna,
  direction,
  images,
  isSelected = false,
  onSelect,
  width = 260,
  height = 320,
}: ThumbnailCardProps) {
  const meta = DIRECTION_LABELS[direction];
  const spec = dna.thumbnailSpecs[direction];
  const Renderer = DIRECTION_RENDERERS[direction];

  const borderColor = isSelected
    ? direction === "minimal-clean" || direction === "luxury-editorial"
      ? "rgba(0,0,0,0.6)"
      : "rgba(255,255,255,0.7)"
    : "transparent";

  return (
    <div
      onClick={onSelect}
      style={{
        width, height,
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        outline: isSelected ? `2px solid ${borderColor}` : "2px solid transparent",
        outlineOffset: 2,
        boxShadow: isSelected
          ? "0 0 0 1px rgba(255,255,255,0.1), 0 16px 48px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: isSelected ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Direction-specific renderer */}
      <Renderer dna={dna} images={images} spec={spec} />

      {/* Selected badge */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "#22C55E", color: "#fff",
          fontFamily: "'Courier New', monospace",
          fontSize: 9, fontWeight: 700,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "3px 8px", borderRadius: 20,
        }}>
          Selected
        </div>
      )}
    </div>
  );
}

// ─── DIRECTION SELECTOR (drop-in replacement) ─────────────────────────────────
// Replaces the existing direction selector UI.
// Shows all 6 thumbnails with structurally different compositions.

export function DirectionSelector({
  dna,
  imagesByDirection,
  selectedDirection,
  onSelect,
}: {
  dna: WorldDNA;
  imagesByDirection: Partial<Record<DirectionKey, ThumbnailCardProps["images"]>>;
  selectedDirection: DirectionKey;
  onSelect: (dir: DirectionKey) => void;
}) {
  const directions: DirectionKey[] = [
    "orchestra-style", "premium-dark", "bold-experimental",
    "minimal-clean", "genz-vibrant", "luxury-editorial",
  ];

  return (
    <div style={{
      display: "flex",
      gap: 16,
      overflowX: "auto",
      paddingBottom: 8,
      scrollbarWidth: "none",
    }}>
      {directions.map((dir) => (
        <div key={dir} style={{ flexShrink: 0 }}>
          <ThumbnailCard
            dna={dna}
            direction={dir}
            images={imagesByDirection[dir] || {}}
            isSelected={selectedDirection === dir}
            onSelect={() => onSelect(dir)}
            width={220}
            height={280}
          />
          <div style={{
            marginTop: 10, paddingLeft: 2,
          }}>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: selectedDirection === dir ? "#111" : "#555",
            }}>
              {DIRECTION_LABELS[dir].title}
            </div>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 11, color: "#888", marginTop: 2,
            }}>
              {DIRECTION_LABELS[dir].subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
