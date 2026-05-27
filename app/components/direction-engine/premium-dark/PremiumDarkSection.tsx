"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { HomeSectionId } from "@/lib/types/startup";

type Props = {
  id: HomeSectionId;
  minVh?: number;
  children: ReactNode;
  className?: string;
  /** Cinematic transition — fade + rise on enter */
  transition?: "rise" | "fade" | "none";
  enterDurationMs?: number;
};

export default function PremiumDarkSection({
  id,
  minVh = 0.6,
  children,
  className = "",
  transition = "rise",
  enterDurationMs = 900,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const transitionClass =
    transition === "none"
      ? ""
      : transition === "fade"
        ? visible
          ? "opacity-100"
          : "opacity-0"
        : visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10";

  return (
    <section
      ref={ref}
      id={`section-${id}`}
      className={`relative scroll-mt-28 pd-section ${className}`}
      style={{ minHeight: minVh > 0 ? `${minVh * 100}vh` : undefined }}
      data-section={id}
    >
      <div
        className={`transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${transitionClass}`}
        style={{ transitionDuration: `${enterDurationMs}ms` }}
      >
        {children}
      </div>
    </section>
  );
}
