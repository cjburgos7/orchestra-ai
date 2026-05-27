/** Dev-only: invalidate stale localStorage worlds when pipeline version bumps. */
export const PIPELINE_STORAGE_VERSION = "2026-05-24-semantic-visual-retrieval";

const STORAGE_KEY = "orchestra_projects_v1";
const VERSION_KEY = "orchestra_pipeline_version";

export function clearStaleDevState(): { cleared: boolean; reason?: string } {
  if (typeof window === "undefined") return { cleared: false };
  if (process.env.NODE_ENV === "production") return { cleared: false };

  const force = process.env.NEXT_PUBLIC_FORCE_FRESH_WORLDS === "1";
  const storedVersion = localStorage.getItem(VERSION_KEY);

  if (!force && storedVersion === PIPELINE_STORAGE_VERSION) {
    return { cleared: false, reason: "version match" };
  }

  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(VERSION_KEY, PIPELINE_STORAGE_VERSION);

  if (pipelineTraceEnabled()) {
    console.info(
      `[Orchestra Dev] Cleared stale project cache (${STORAGE_KEY}). Pipeline version: ${PIPELINE_STORAGE_VERSION}`
    );
  }

  return {
    cleared: true,
    reason: force ? "NEXT_PUBLIC_FORCE_FRESH_WORLDS=1" : `version ${storedVersion ?? "none"} → ${PIPELINE_STORAGE_VERSION}`,
  };
}

function pipelineTraceEnabled(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_PIPELINE_TRACE === "1";
}
