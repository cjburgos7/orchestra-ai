"use client";

import { useEffect } from "react";
import type { ImagerySet } from "@/lib/types/startup";
import type { PipelineTrace } from "@/lib/pipeline-trace";
import { emitTraceToConsole, pipelineTraceEnabled } from "@/lib/pipeline-trace";

type Props = {
  imagery?: ImagerySet;
  label?: string;
};

/** Logs attached pipeline trace + render diagnostics once visuals mount. */
export default function PipelineDebugMount({ imagery, label = "world" }: Props) {
  useEffect(() => {
    if (!pipelineTraceEnabled() || !imagery) return;

    const trace = imagery.artDirection?.pipelineTrace as PipelineTrace | undefined;
    if (trace) emitTraceToConsole(trace);

    const imgs = document.querySelectorAll("[data-safe-image]");
    const empty = document.querySelectorAll("[data-safe-image-status='error'], [data-safe-image-status='empty']");
    const canvas = document.querySelector("canvas");

    console.groupCollapsed(`%c[Orchestra Render] ${label}`, "color:#0891b2;font-weight:bold");
    console.log("SafeImage nodes:", imgs.length, "| Failed/empty:", empty.length);
    console.log("AtmosphereCanvas mounted:", Boolean(canvas));
    console.log("Motion root:", Boolean(document.querySelector(".pd-world, .orch-motion-cinematic")));
    if (empty.length) {
      console.warn(
        "Empty/failed image nodes:",
        [...empty].map((el) => ({
          src: el.getAttribute("data-safe-image-src"),
          status: el.getAttribute("data-safe-image-status"),
        }))
      );
    }
    console.groupEnd();
  }, [imagery, label]);

  return null;
}
