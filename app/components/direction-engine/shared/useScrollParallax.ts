"use client";

import { useEffect, useState } from "react";

function findScrollRoot(): HTMLElement | Window {
  if (typeof document === "undefined") return window;
  const root = document.querySelector("[data-orchestra-scroll-root]") as HTMLElement | null;
  return root ?? window;
}

function readScroll(root: HTMLElement | Window): { y: number; max: number } {
  if (root === window) {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return { y: window.scrollY, max };
  }
  const el = root as HTMLElement;
  const max = Math.max(el.scrollHeight - el.clientHeight, 1);
  return { y: el.scrollTop, max };
}

/** Scroll-linked progress for cinematic parallax (0–1 over scroll root) */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = findScrollRoot();
    let raf = 0;

    const update = () => {
      const { y, max } = readScroll(root);
      setProgress(Math.min(Math.max(y / max, 0), 1));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    if (root === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return progress;
}

/** Hero-only parallax — 0 at top, increases through first viewport */
export function useHeroParallax(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const root = findScrollRoot();
    let raf = 0;

    const update = () => {
      const { y } = readScroll(root);
      const vh = root === window ? window.innerHeight : (root as HTMLElement).clientHeight;
      setOffset(Math.min(y / Math.max(vh, 1), 1.2));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    if (root === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return offset;
}

export function parallaxTransform(depth: number, scrollOffset: number, px = 80): string {
  return `translate3d(0, ${scrollOffset * depth * px}px, 0) scale(${1 + scrollOffset * depth * 0.04})`;
}
