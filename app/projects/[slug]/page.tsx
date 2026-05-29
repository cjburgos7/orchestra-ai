import { notFound } from "next/navigation";
import { getProjectFromDb } from "@/lib/db/projects";
import { isDbConfigured } from "@/lib/db/supabase";
import ProjectClient from "./ProjectClient";
import type { StartupProject } from "@/lib/types/startup";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectFromDb(slug);

  // Only 404 if DB is configured but genuinely has no record.
  // Without DB, let the client attempt a localStorage lookup.
  if (!project && isDbConfigured()) notFound();

  return (
    <ProjectClient
      initialProject={project as StartupProject | null}
      slug={slug}
    />
  );
}
