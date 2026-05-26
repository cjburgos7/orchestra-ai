export function pipelineDebugEnabled(): boolean {
  return process.env.IMAGE_PIPELINE_DEBUG === "1" || process.env.NODE_ENV === "development";
}

export function pipelineLog(stage: string, detail: Record<string, unknown>): void {
  if (!pipelineDebugEnabled()) return;
  console.log(`[image-pipeline:${stage}]`, JSON.stringify(detail));
}
