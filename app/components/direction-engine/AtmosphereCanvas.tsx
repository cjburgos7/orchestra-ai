"use client";

import { useEffect, useRef } from "react";
import type { AtmosphereSpec } from "@/lib/world-intelligence";
import type { DirectionKey } from "@/lib/world-intelligence";
import { useHeroParallax } from "./shared/useScrollParallax";
import { pipelineTraceEnabled } from "@/lib/pipeline-trace";

type Props = {
  atmosphere: AtmosphereSpec;
  direction?: DirectionKey;
  className?: string;
  scrollLinked?: boolean;
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Canvas atmosphere renderer — drives composition from WorldDNA.atmosphere.
 * Mounted in generated startup worlds (not decoration-only overlay).
 */
export default function AtmosphereCanvas({
  atmosphere,
  direction = "premium-dark",
  className = "",
  scrollLinked = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroOffset = useHeroParallax();
  const override = atmosphere.directionOverrides?.[direction];

  const atm: AtmosphereSpec = {
    ...atmosphere,
    baseColor: override?.baseColor ?? atmosphere.baseColor,
    noiseOpacity: override?.noiseOpacity ?? atmosphere.noiseOpacity,
    vignetteStrength: override?.vignetteStrength ?? atmosphere.vignetteStrength,
    glows: override?.glows ?? atmosphere.glows,
  };

  useEffect(() => {
    if (pipelineTraceEnabled()) {
      console.log("[AtmosphereCanvas] mounted · glows:", atm.glows.length, "· scroll:", scrollLinked);
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t0 = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    const draw = (timestamp: number) => {
      if (!t0) t0 = timestamp;
      const t = (timestamp - t0) * 0.001;
      const W = canvas.width;
      const H = canvas.height;
      const parallaxY = scrollLinked ? heroOffset * 40 : 0;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = atm.baseColor;
      ctx.fillRect(0, 0, W, H);

      for (const glow of atm.glows) {
        const breathe = 1 + Math.sin(t * 0.18 + glow.animationPhase) * 0.1;
        const px = (parseFloat(glow.x) / 100) * W + Math.sin(t * 0.08 + glow.animationPhase) * 12;
        const py = (parseFloat(glow.y) / 100) * H + Math.cos(t * 0.06 + glow.animationPhase) * 10 + parallaxY;
        const r = (parseFloat(glow.radius) / 100) * Math.max(W, H) * breathe;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, hexToRgba(glow.color, glow.opacity));
        grad.addColorStop(0.55, hexToRgba(glow.color, glow.opacity * 0.35));
        grad.addColorStop(1, hexToRgba(glow.color, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      if (atm.vignetteStrength > 0) {
        const vGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.9);
        vGrad.addColorStop(0, "rgba(0,0,0,0)");
        vGrad.addColorStop(1, `rgba(0,0,0,${atm.vignetteStrength * 0.75})`);
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [atm, heroOffset, scrollLinked]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
