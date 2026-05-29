import type { StartupProject } from "@/lib/types/startup";
import { createSupabaseClient, isDbConfigured } from "./supabase";

// Row shape in Supabase: { slug, data, created_at, updated_at }
// The entire StartupProject lives in `data` jsonb — no column mapping needed.

export async function saveProjectToDb(project: StartupProject): Promise<void> {
  if (!isDbConfigured()) return;
  const sb = createSupabaseClient();
  const now = new Date().toISOString();
  const { error } = await sb.from("projects").upsert(
    {
      slug: project.slug,
      data: { ...project, updatedAt: now },
      updated_at: now,
    },
    { onConflict: "slug" }
  );
  if (error) throw new Error(`[db] saveProject failed: ${error.message}`);
}

export async function getProjectFromDb(
  slug: string
): Promise<StartupProject | null> {
  if (!isDbConfigured()) return null;
  const sb = createSupabaseClient();
  const { data, error } = await sb
    .from("projects")
    .select("data")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return (data as { data: StartupProject }).data;
}

export async function listProjectsFromDb(): Promise<StartupProject[]> {
  if (!isDbConfigured()) return [];
  const sb = createSupabaseClient();
  const { data, error } = await sb
    .from("projects")
    .select("data, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return (data as { data: StartupProject }[]).map((r) => r.data);
}

export async function deleteProjectFromDb(slug: string): Promise<void> {
  if (!isDbConfigured()) return;
  const sb = createSupabaseClient();
  const { error } = await sb.from("projects").delete().eq("slug", slug);
  if (error) throw new Error(`[db] deleteProject failed: ${error.message}`);
}
