# V2 Migration Plan — Design Consistency Audit

**Status:** In progress  
**Goal:** Every route in Orchestra uses the Lovable design system  
**Source of truth:** `docs/design/orchestra-design-dna.md`

---

## Current Design Systems

Three design systems currently coexist in the codebase. This is the problem.

### System A: Lovable (new, correct) ✅
**Where:** `app/landing/page.tsx`, `app/lovable.css`  
**Palette:** oklch color space, CameraPlainVariable, platinum/lavender  
**Status:** Landing page is complete. This is the target for all other pages.

### System B: V2 Dark Cinematic (old, deprecated) ❌
**Where:** `app/v2/page.tsx` (3394 lines), `app/components/LaunchModal.tsx`  
**Palette:** `#05050a` dark, `#7c3aed` purple, `rgba(244,244,248,...)` light text  
**Status:** Must be replaced entirely.

### System C: Old Light Purple (transitional, deprecated) ❌
**Where:** `app/components/ProjectWorkspace.tsx`, `app/components/WorkspaceSidebar.tsx`, `app/components/GuidedEditor.tsx`, `app/projects/page.tsx`  
**Palette:** `#f5f4fb` / `#f0eff8` backgrounds, `#7c5ef5` / `rgba(109,78,230,...)` purple accents  
**Status:** Closer to Lovable than V2 dark, but still wrong. Must be migrated.

---

## Route-by-Route Audit

### `/` — Landing Page
**Component:** `app/landing/page.tsx`  
**Current system:** Lovable ✅  
**Priority:** Done  
**Action:** None — this is the reference implementation.

---

### `/app` — Generation Entry / Workspace Hub
**Component:** `app/app/page.tsx` → re-exports `app/v2/page.tsx`  
**Current system:** V2 Dark Cinematic ❌  
**Priority:** CRITICAL — this is the first page the user sees after landing  
**User impact:** Immediate visual reset from Lovable light → V2 dark  

**Root cause:** `/app/app/page.tsx` is a two-line re-export pointing to V2Page.  
V2Page was the original product experience and has never been migrated.

**Migration path:**
1. Replace `app/app/page.tsx` with a new Lovable-design workspace hub
2. The workspace hub contains: project list, generate CTA, module links, Orchestra Agent
3. Keep `app/v2/page.tsx` for now as `/v2` (accessible but not linked)
4. Delete `app/v2/page.tsx` after migration is verified

**Status:** ✅ Fixed — new workspace hub created

---

### `/projects` — Startup Vault
**Component:** `app/projects/page.tsx`  
**Current system:** V2 Dark Cinematic ❌  
**Priority:** HIGH — users navigate here after generating a startup  
**User impact:** Dark background (`#05050a`) after Lovable light flow  

**Root cause:** Projects page was built independently in V2 dark aesthetic.

**Migration path:**
1. Replace dark background with Lovable background (`oklch(98.5% .002 270)`)
2. Replace project cards with Lovable surface-card style
3. Replace header with Lovable nav pattern
4. Update accent colors from `#7c3aed` to `var(--lavender)` / graphite

**Estimated effort:** Medium (self-contained page, clear design target)  
**Status:** Pending

---

### `/projects/[slug]` — Generated Startup Workspace
**Components:** `ProjectClient.tsx`, `ProjectWorkspace.tsx`, `WorkspaceSidebar.tsx`, `GuidedEditor.tsx`  
**Current system:** Old Light Purple (System C) ❌  
**Priority:** HIGH — this is where founders spend most of their time  
**User impact:** Light but wrong purple (`#f5f4fb`, `rgba(109,78,230,...)`) — feels like a different product

**Root cause:** ProjectWorkspace was built before Lovable design system existed.  
It's a large, complex component tree (4+ files, 500+ lines).

**Migration path (phased):**
1. **Phase 1** — Update background + border colors (low risk)
   - `#f5f4fb` → `oklch(98.5% .002 270)`
   - `#f0eff8` sidebar → `oklch(97% .003 270)`
   - Purple borders → `oklch(91% .005 270)`
2. **Phase 2** — Update accent colors
   - `rgba(109,78,230,...)` → `var(--lavender)` oklch equivalents
   - `#7c5ef5` → `oklch(28% .015 280)` (graphite CTA) or `oklch(70% .11 295)` (lavender accent)
3. **Phase 3** — Migrate WorkspaceSidebar to Lovable nav pattern
4. **Phase 4** — Migrate GuidedEditor panels to surface-card pattern

**Estimated effort:** Large (multiple components, complex state)  
**Status:** Pending — do Phase 1 first, verify visually, then continue

---

### `/projects/[slug]` — LaunchModal
**Component:** `app/components/LaunchModal.tsx`  
**Current system:** V2 Dark Cinematic ❌  
**Priority:** MEDIUM — appears only on explicit "Launch" action  
**User impact:** Dark overlay (`#0e0d1a`) mid-workflow  

**Migration path:**
1. Replace dark backdrop + panel with Lovable modal pattern (matching `GenerateModal.tsx`)
2. Replace purple CTAs with graphite/lavender
3. Remove cinematic design tokens

**Estimated effort:** Small (self-contained modal component)  
**Status:** Pending

---

### `/v2` — Old V2 Marketing Page
**Component:** `app/v2/page.tsx`  
**Current system:** V2 Dark Cinematic  
**Priority:** LOW — no longer linked from anywhere  
**Action:** Deprecate and eventually delete once all generation/routing migrated

---

### `/classic` — Classic landing
**Component:** `app/classic/page.tsx`  
**Priority:** LOW — legacy, not in active flow  
**Action:** Review and deprecate

---

## Migration Priority Order

```
Priority 1 (CRITICAL — visual continuity of primary flow):
  /app → workspace hub [DONE]
  GenerateModal → Lovable design [DONE]

Priority 2 (HIGH — daily use surfaces):
  /projects → startup vault
  /projects/[slug] → Phase 1 (backgrounds/borders)

Priority 3 (MEDIUM — important but not on critical path):
  /projects/[slug] → Phase 2-4 (accents, sidebar, editor)
  LaunchModal → Lovable design

Priority 4 (LOW — cleanup):
  /v2 → deprecate
  /classic → deprecate
```

---

## Design Token Mapping (System C → Lovable)

Use this table when migrating old light purple files:

| Old value | Lovable equivalent |
|-----------|-------------------|
| `#f5f4fb` (page bg) | `oklch(98.5% .002 270)` |
| `#f0eff8` (sidebar bg) | `oklch(97% .003 270)` |
| `rgba(80,70,140,0.1)` (border) | `oklch(91% .005 270)` |
| `rgba(109,78,230,0.1)` (accent bg) | `oklch(90% .04 295)` (lavender-soft) |
| `rgba(109,78,230,0.6)` (accent text) | `oklch(70% .11 295)` (lavender) |
| `#7c5ef5` (CTA button) | `oklch(28% .015 280)` (graphite) |
| `#1d1d2e` (primary text) | `oklch(22% .012 270)` (foreground) |
| `rgba(60,50,90,0.7)` (secondary text) | `oklch(52% .012 270)` (muted) |

| Old value (V2 dark) | Lovable equivalent |
|---------------------|-------------------|
| `#05050a` (page bg) | `oklch(98.5% .002 270)` |
| `rgba(244,244,248,0.9)` (text) | `oklch(22% .012 270)` |
| `rgba(244,244,248,0.45)` (muted) | `oklch(52% .012 270)` |
| `#7c3aed` (accent) | `oklch(70% .11 295)` (lavender) |
| `rgba(255,255,255,0.07)` (border) | `oklch(91% .005 270)` |
| `#0e0d1a` (modal bg) | `oklch(99.5% .001 270)` |
