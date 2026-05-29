"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { migrateProject, getProjectBySlug } from "@/lib/persistence/projects";
import type { StartupProject } from "@/lib/types/startup";
import ProjectWorkspace from "@/app/components/ProjectWorkspace";

export default function ProjectClient({
  initialProject,
  slug,
}: {
  initialProject: StartupProject | null;
  slug: string;
}) {
  const router = useRouter();
  const [project, setProject] = useState<StartupProject | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 1. Prefer server-loaded project from Supabase
    // 2. Fall back to localStorage (works when Supabase is unconfigured)
    const raw = initialProject ?? getProjectBySlug(slug);

    if (!raw) {
      setNotFound(true);
      return;
    }

    const p = migrateProject(raw);
    document.title = `${p.startupName} · Orchestra`;

    if (!p.generatedSections) {
      router.replace("/app?generate=1");
      return;
    }

    setProject(p);
  }, [initialProject, slug, router]);

  if (notFound) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "oklch(98.5% .002 270)" }}
      >
        <p className="text-sm font-medium" style={{ color: "oklch(52% .012 270)" }}>
          Project not found
        </p>
        <a
          href="/projects"
          className="text-xs font-bold px-5 py-2.5 rounded-full"
          style={{ background: "oklch(28% .015 280)", color: "oklch(98% .003 270)" }}
        >
          View all projects
        </a>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(98.5% .002 270)" }}>
        <span
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: "1.5px solid oklch(91% .005 270)", borderTop: "1.5px solid oklch(70% .11 295)" }}
        />
      </div>
    );
  }

  return <ProjectWorkspace key={project.slug} initialProject={project} />;
}
