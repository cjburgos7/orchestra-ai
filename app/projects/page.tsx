"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProjects } from "@/lib/persistence/projects";
import type { StartupProject } from "@/lib/types/startup";
import { getDirectionLabel } from "@/lib/orchestration/directions";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<StartupProject[]>([]);

  useEffect(() => {
    setProjects(listProjects());
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-400 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-sm font-bold text-slate-900">Orchestra</span>
          </Link>
          <Link
            href="/#generate"
            className="text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            New startup
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My projects</h1>
        <p className="text-slate-500 mb-8">Your startups are saved on this device. Continue building anytime.</p>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500 mb-4">No projects yet.</p>
            <Link href="/#generate" className="text-blue-600 font-semibold text-sm">
              Generate your first startup →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{p.startupName}</h2>
                    <p className="text-sm text-slate-500 mt-1">{p.tagline}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {p.selectedDirection ? getDirectionLabel(p.selectedDirection) : "No direction"} ·{" "}
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">Open →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
