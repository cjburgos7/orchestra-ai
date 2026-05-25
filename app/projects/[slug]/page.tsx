"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, migrateProject } from "@/lib/persistence/projects";
import type { StartupProject } from "@/lib/types/startup";
import ProjectWorkspace from "@/app/components/ProjectWorkspace";

export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [project, setProject] = useState<StartupProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = getProjectBySlug(params.slug);
    const p = raw ? migrateProject(raw) : null;
    setProject(p);
    setLoading(false);
    if (!p) return;
    document.title = `${p.startupName} · Orchestra`;
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-600 mb-4">Project not found on this device.</p>
        <Link href="/#generate" className="text-blue-600 font-semibold text-sm">
          Create a new startup →
        </Link>
      </div>
    );
  }

  if (!project.generatedSections) {
    router.replace("/#generate");
    return null;
  }

  return <ProjectWorkspace key={project.slug} initialProject={project} />;
}
