import type { StartupProject } from "@/lib/types/startup";
import { uniqueSlug } from "@/lib/utils/slug";
import { generatePages, generateVisuals } from "@/lib/orchestration/pipelines/generate-pages";
import { pickWildcards } from "@/lib/orchestration/wildcards";
import { briefFromProject } from "@/lib/types/startup";

const STORAGE_KEY = "orchestra_projects_v1";

type Store = Record<string, StartupProject>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function listProjects(): StartupProject[] {
  return Object.values(readStore()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getProjectBySlug(slug: string): StartupProject | null {
  return readStore()[slug] ?? null;
}

export function assignSlug(project: StartupProject): StartupProject {
  const existing = Object.keys(readStore());
  const slug = uniqueSlug(project.startupName || "startup", existing);
  const now = new Date().toISOString();
  return {
    ...project,
    slug,
    createdAt: project.createdAt ?? now,
    updatedAt: now,
  };
}

export function saveProject(project: StartupProject): StartupProject {
  const store = readStore();
  const slug = project.slug || assignSlug(project).slug;
  const now = new Date().toISOString();
  const saved: StartupProject = {
    ...project,
    slug,
    createdAt: project.createdAt ?? now,
    updatedAt: now,
  };
  store[slug] = saved;
  writeStore(store);
  return saved;
}

export function deleteProject(slug: string) {
  const store = readStore();
  delete store[slug];
  writeStore(store);
}

/** Backfill missing fields for projects saved before platform v2 */
export function migrateProject(project: StartupProject): StartupProject {
  const wildcards = project.wildcardDirections?.length
    ? project.wildcardDirections
    : pickWildcards(project.id);

  let sections = project.generatedSections;
  const direction = project.selectedDirection ?? "orchestra";
  if (sections) {
    const needsVisuals = !sections.visuals || !sections.visuals.logo;
    if (needsVisuals) {
      sections = {
        ...sections,
        visuals: generateVisuals(briefFromProject(project), project.id, direction),
      };
    }
  }

  const pages =
    project.generatedPages ??
    (sections ? generatePages(briefFromProject({ ...project, generatedSections: sections }), sections) : null);

  const migrated: StartupProject = {
    ...project,
    wildcardDirections: wildcards,
    generatedSections: sections,
    generatedPages: pages,
  };

  if (
    migrated.generatedSections !== project.generatedSections ||
    migrated.generatedPages !== project.generatedPages ||
    migrated.wildcardDirections !== project.wildcardDirections
  ) {
    return saveProject(migrated);
  }

  return migrated;
}
