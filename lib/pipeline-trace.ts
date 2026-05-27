/**
 * End-to-end imagery pipeline diagnostics — dev console + attachable trace blob.
 */

export type PipelineRejection = {
  imageId: string;
  stage: "semantic-guard" | "world-blocklist" | "world-score" | "diversity" | "slot-validate";
  reason: string;
};

export type PipelineSlotPick = {
  slot: string;
  role: string;
  imageId: string | null;
  url: string | null;
  tags: string[];
  query: string;
  rejected: PipelineRejection[];
};

export type PipelineTrace = {
  timestamp: string;
  briefName: string;
  seed: string;
  direction: string;
  registryId: string;
  category: string;
  secondary?: string;
  conceptKey?: string;
  slots: PipelineSlotPick[];
  finalUrls: {
    hero: string;
    heroChain: string[];
    lifestyle: string[];
    products: Array<{ name: string; image: string; fallback: string }>;
  };
  uniqueImageIds: string[];
  duplicateIds: string[];
  httpPhotoCount: number;
  warnings: string[];
};

const traces: PipelineTrace[] = [];

export function pipelineTraceEnabled(): boolean {
  if (typeof window !== "undefined") {
    return (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_PIPELINE_TRACE === "1" ||
      (window as unknown as { __ORCHESTRA_PIPELINE_TRACE?: boolean }).__ORCHESTRA_PIPELINE_TRACE === true
    );
  }
  return process.env.IMAGE_PIPELINE_DEBUG === "1" || process.env.NODE_ENV === "development";
}

export function createPipelineTrace(partial: Omit<PipelineTrace, "timestamp" | "slots" | "finalUrls" | "uniqueImageIds" | "duplicateIds" | "httpPhotoCount" | "warnings">): PipelineTrace {
  return {
    ...partial,
    timestamp: new Date().toISOString(),
    slots: [],
    finalUrls: { hero: "", heroChain: [], lifestyle: [], products: [] },
    uniqueImageIds: [],
    duplicateIds: [],
    httpPhotoCount: 0,
    warnings: [],
  };
}

export function finalizePipelineTrace(trace: PipelineTrace): PipelineTrace {
  const ids = [
    ...trace.slots.map((s) => s.imageId).filter(Boolean) as string[],
    ...trace.finalUrls.heroChain.map((u) => urlToId(u)).filter(Boolean) as string[],
    ...trace.finalUrls.lifestyle.map((u) => urlToId(u)).filter(Boolean) as string[],
    ...trace.finalUrls.products.map((p) => urlToId(p.image)).filter(Boolean) as string[],
  ];
  const counts = new Map<string, number>();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  trace.uniqueImageIds = [...new Set(ids)];
  trace.duplicateIds = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id);

  if (trace.duplicateIds.length) {
    trace.warnings.push(`Duplicate image IDs in output: ${trace.duplicateIds.join(", ")}`);
  }
  if (trace.httpPhotoCount < 4) {
    trace.warnings.push(`Low HTTP photo count (${trace.httpPhotoCount}) — placeholders likely visible`);
  }

  if (pipelineTraceEnabled()) {
    traces.unshift(trace);
    if (traces.length > 8) traces.length = 8;
    emitTraceToConsole(trace);
  }

  return trace;
}

export function urlToId(url: string): string | null {
  const m = url.match(/photo-([\d]+-[a-f0-9]+)/i);
  return m?.[1] ?? null;
}

export function emitTraceToConsole(trace: PipelineTrace): void {
  console.groupCollapsed(
    `%c[Orchestra Pipeline] ${trace.briefName} · ${trace.registryId} · ${trace.uniqueImageIds.length} unique photos`,
    "color:#7c3aed;font-weight:bold"
  );
  console.log("Seed:", trace.seed, "| Direction:", trace.direction);
  if (trace.conceptKey) console.log("Concept:", trace.conceptKey);
  console.table(
    trace.slots.map((s) => ({
      slot: s.slot,
      role: s.role,
      id: s.imageId ?? "—",
      rejected: s.rejected.length,
      url: s.url ? s.url.slice(0, 72) + "…" : "NONE",
    }))
  );
  if (trace.warnings.length) console.warn("Warnings:", trace.warnings);
  for (const slot of trace.slots) {
    for (const r of slot.rejected.slice(0, 5)) {
      console.log(`  ✗ ${slot.slot} [${r.stage}] ${r.imageId}: ${r.reason}`);
    }
  }
  console.log("Final hero:", trace.finalUrls.hero);
  console.log("Lifestyle:", trace.finalUrls.lifestyle);
  console.log("Products:", trace.finalUrls.products.map((p) => p.image));
  console.groupEnd();
}

export function getRecentPipelineTraces(): PipelineTrace[] {
  return [...traces];
}

/** Browser global for manual inspection: window.__orchestraPipelineTraces() */
if (typeof window !== "undefined" && pipelineTraceEnabled()) {
  (window as unknown as { __orchestraPipelineTraces?: () => PipelineTrace[] }).__orchestraPipelineTraces =
    getRecentPipelineTraces;
}
