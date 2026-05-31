import type { StartupProject } from "@/lib/types/startup";
import { uniqueSlug } from "@/lib/utils/slug";
import { generatePages } from "@/lib/orchestration/pipelines/generate-pages";
import { WORLD_V2_ENABLED, buildWorldV2 } from "@/lib/world-v2";
import { buildProductVisualsSync } from "@/lib/orchestration/product-visuals";
import { ensureImageryComplete } from "@/lib/orchestration/creative-imagery";
import { CINEMATIC_DIRECTION, resolveRenderDirection } from "@/lib/cinematic";
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
  const direction = resolveRenderDirection(project.selectedDirection);
  const brief = briefFromProject(project);
  if (sections && WORLD_V2_ENABLED && !sections.worldV2) {
    sections = {
      ...sections,
      worldV2: buildWorldV2(brief, project.id),
    };
  } else if (sections) {
    const layout = sections.visuals?.layout;
    const imagery = sections.visuals?.imagery;
    const needsVisuals =
      !sections.visuals ||
      !sections.visuals.logo ||
      !sections.visuals.productCategory ||
      !sections.visuals.motion ||
      !sections.visuals.layout ||
      !sections.visuals.imagery ||
      layout?.showCollections === undefined ||
      layout?.imageFeatures === undefined ||
      layout?.showPromo === undefined ||
      layout?.showCategories === undefined ||
      sections.visuals?.imageryOnly === undefined ||
      !sections.visuals?.secondaryCategory ||
      !sections.visuals?.creativeDirection ||
      !sections.visuals?.creativeDirection?.variantLabel ||
      !imagery?.artDirection?.pipelineTrace ||
      (imagery?.artDirection?.pipelineTrace?.duplicateIds?.length ?? 0) > 0 ||
      !imagery?.hero?.startsWith("http") ||
      !imagery?.products?.some((p) => p.image.startsWith("http")) ||
      imagery?.heroFallback?.startsWith("linear-gradient") ||
      imagery?.heroFallback?.startsWith("data:") ||
      imagery?.lifestyleFallbacks?.some((u) => u.startsWith("data:")) ||
      imagery?.products?.some((p) => p.imageFallback?.startsWith("data:")) ||
      !imagery?.heroFallback ||
      !imagery?.lifestyleFallbacks?.length ||
      imagery?.products?.some((p) => !p.imageFallback);

    if (needsVisuals) {
      sections = {
        ...sections,
        visuals: buildProductVisualsSync(brief, project.id, direction),
      };
    } else if (
      imagery &&
      (!imagery.hero?.startsWith("http") ||
        !imagery.heroFallback?.startsWith("http") ||
        !imagery.lifestyleFallbacks?.length ||
        imagery.products.some((p) => !p.image.startsWith("http")))
    ) {
      sections = {
        ...sections,
        visuals: {
          ...sections.visuals!,
          imagery: ensureImageryComplete(imagery, brief, project.id, direction),
        },
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
