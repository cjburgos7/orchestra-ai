"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { pipelineTraceEnabled } from "@/lib/pipeline-trace";
import type { ImagerySet } from "@/lib/types/startup";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  fallback?: string;
  chain?: string[];
  fallbackGradient?: string;
  /** @deprecated not rendered */
  fallbackLabel?: string;
  imagery?: Pick<ImagerySet, "fallbackGradient" | "fallbackLabel" | "meshFrom" | "meshTo" | "heroAlt" | "heroFallback">;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  /** @deprecated ignored — kept for call-site compatibility */
  category?: string;
  /** @deprecated ignored */
  seed?: string;
};

function gradientFromProps(
  fallbackGradient?: string,
  fallback?: string,
  imagery?: Props["imagery"]
): string {
  if (fallbackGradient) return fallbackGradient;
  if (imagery?.fallbackGradient) return imagery.fallbackGradient;
  if (fallback?.startsWith("linear-gradient")) return fallback;
  if (imagery?.meshFrom && imagery?.meshTo) {
    return `linear-gradient(135deg, ${imagery.meshFrom} 0%, ${imagery.meshTo} 100%)`;
  }
  return "linear-gradient(135deg, #1a0f08 0%, #c8501a 50%, #2d5016 100%)";
}

/** Cinematic texture fallback — photographic gradients only, never logos or letters */
function TextureFallbackView({
  gradient,
  alt,
  className = "",
}: {
  gradient: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradient }}
      role="img"
      aria-label={alt ?? "Ambient texture"}
    >
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(0,0,0,0.25) 0%, transparent 50%)",
        }}
        aria-hidden
      />
    </div>
  );
}

function isRenderableUrl(url: string): boolean {
  return url.startsWith("http");
}

/** Photo loader with cinematic texture fallbacks — never logo blocks or gray skeletons. */
export default function SafeImage({
  src,
  alt = "",
  className = "",
  fallback,
  chain = [],
  fallbackGradient,
  imagery,
  priority,
  fill,
  width,
  height,
}: Props) {
  const gradient = gradientFromProps(fallbackGradient, fallback, imagery);

  const candidates = useMemo(() => {
    const list = [src, ...chain, fallback, imagery?.heroFallback]
      .filter((url): url is string => Boolean(url))
      .filter((url) => isRenderableUrl(url));
    return [...new Set(list)];
  }, [src, fallback, chain, imagery?.heroFallback]);

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    setIndex(0);
    setStatus(candidates.length ? "loading" : "error");
  }, [candidates.join("|")]);

  useEffect(() => {
    if (priority && candidates[0]?.startsWith("http")) {
      const img = new window.Image();
      img.src = candidates[0];
    }
  }, [priority, candidates]);

  const current = candidates[Math.min(index, candidates.length - 1)] ?? "";
  const fillParent =
    fill ?? (className.includes("absolute") || className.includes("inset-0") || className.includes("min-h-"));

  const DEFAULT_WIDTH = 1200;
  const DEFAULT_HEIGHT = 800;
  const useFill = fillParent;
  const resolvedWidth = width ?? DEFAULT_WIDTH;
  const resolvedHeight = height ?? DEFAULT_HEIGHT;

  if (!current || (status === "error" && index >= candidates.length - 1)) {
    return (
      <TextureFallbackView
        gradient={gradient}
        alt={alt}
        className={fillParent ? `absolute inset-0 ${className}` : className}
      />
    );
  }

  const onLoad = () => setStatus("loaded");
  const onError = () => {
    if (pipelineTraceEnabled()) {
      console.warn("[SafeImage] failed:", current, { alt, candidates: candidates.length, index });
    }
    if (index < candidates.length - 1) {
      setIndex((i) => i + 1);
      setStatus("loading");
      return;
    }
    setStatus("error");
  };

  const debugStatus = !current ? "empty" : status;

  return (
    <div
      className={`relative overflow-hidden ${fillParent ? "absolute inset-0" : "w-full h-full min-h-[inherit]"} ${className}`}
      data-safe-image
      data-safe-image-src={current}
      data-safe-image-status={debugStatus}
    >
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-300"
        style={{ background: gradient, opacity: status === "loaded" ? 0 : 0.12 }}
        aria-hidden
      >
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
          }}
        />
      </div>

      <Image
        src={current}
        alt={alt}
        {...(useFill ? { fill: true } : { width: resolvedWidth, height: resolvedHeight })}
        onLoad={onLoad}
        onLoadingComplete={onLoad}
        onError={onError}
        priority={priority}
        unoptimized={
          current.includes("oaidalleapiprodscus") || current.includes("images.unsplash.com")
        }
        className={[
          "relative z-[2] transition-opacity duration-500",
          status === "loaded" ? "opacity-100" : "opacity-40",
          useFill ? "object-cover" : "h-full w-full object-cover",
        ]
          .filter(Boolean)
          .join(" ")}
        sizes={useFill ? "100vw" : undefined}
      />
    </div>
  );
}

export function preloadImages(urls: string[]) {
  if (typeof window === "undefined") return;
  urls.filter((u) => u.startsWith("http")).forEach((url) => {
    const img = new window.Image();
    img.src = url;
  });
}
