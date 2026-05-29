# Orchestra AI — Project State
_Last updated: 2026-05-29_

---

## Current Orchestra Architecture

### Stack
- **Framework**: Next.js 15 App Router (params is a Promise — must await)
- **Styling**: Tailwind CSS v4 + oklch color space throughout (no hex/hsl)
- **Animation**: Framer Motion
- **Fonts**: Geist Sans (system), Instrument Serif loaded via `next/font/google` → `--font-instrument-serif`
- **AI**: OpenAI GPT-4o (agent chat + section generation), Replicate Flux 1.1 Pro (images)
- **Storage**: JSON files in `/data/projects/` (no database)

### Generation Pipeline
```
User idea → /api/generate-startup → StartupProject (name, directions, category)
         → /api/generate-sections → StartupBrief + GeneratedSections (hero, features, testimonials, pricing, worldV2)
         → /api/generate-images   → Flux images assigned to V2 sections
         → /projects/[slug]       → ProjectWorkspace renders result
```

### World V2 System (`WORLD_V2_ENABLED=true`)
- `buildWorldV2()` in `lib/world-v2/builder.ts` → `WorldV2Package`
- `WorldV2Package` contains: category, variant, accentColor, typography, motion, sections[], heroImage, allImageIds
- 15 categories: fitness, floral, finance, fashion, food, saas, wellness, travel, home, education, health, creator, sports, music, science
- Per-category `V2VariantProfile` in `lib/world-v2/variants.ts` defines section blueprints
- `GeneratedWorldV2` component renders the full cinematic site

### Section Types (V2SectionType)
| Type | Used by | Character |
|---|---|---|
| `hero-cinematic` | general | full-bleed image, dark overlay, centered headline |
| `hero-split-kinetic` | multiple | 50/50 image+text |
| `hero-editorial-luxury` | floral, fashion, wellness | Motion Sites DNA: Instrument Serif, color-split headline, staggered fade-rise, image below fold |
| `hero-athletic` | sports, fitness | Stats-first hierarchy, 45/55 split, hard 3px accent bar, raw image |
| `hero-product-saas` | saas | Browser chrome frame, grid background, feature tags, floating price badge |
| `editorial-mosaic` | general | Multi-image editorial grid |
| `feature-asymmetric` | general | Large image + feature list, alternating |
| `proof-gallery` | general | Image gallery for social proof |
| `stats-band` | general | Horizontal stats strip (now dynamic via deriveStats()) |
| `testimonial-float` | general | Floating testimonial cards |
| `story-editorial` | general | Long-form editorial story section |
| `cta-immersive` | general | Full-bleed CTA with image background |

### Dynamic Stats
`deriveStats(brief, world)` in `GeneratedWorldV2.tsx`:
- Uses `nameHash(startupName)` for deterministic seeding
- Returns category-specific labels/values (e.g. fitness → "Active members", sports → "Games tracked")
- Eliminates the old hardcoded "12k+ / 4.9★" that appeared on every startup

### Subpages (V2)
`SitePageViews.tsx` now checks `sections.worldV2` and delegates to V2 subpage shells:
- `FeaturesV2`, `PricingV2Subpage`, `AboutV2`, `ContactV2`, `BlogV2`
- All use `WorldV2Package` tokens: `world.background`, `world.foreground`, `world.accentColor`, `world.typography.displayFamily`
- Previously all used V1 Tailwind `theme.card` / `theme.heroText` classes regardless of world

---

## Orchestra Agent Architecture

### AgentPanel (`app/components/AgentPanel.tsx`)
- 340px persistent dark sidebar — the **center of the product**
- Background: `oklch(8.5% .018 280)` — deep midnight purple
- Props: `{ project: StartupProject | null, activePage: SitePageId, onPageChange, onLaunch }`
- Two tabs: **Chat** (default) | **Pages**
- Chat features: message history, typing indicator (animated dots), quick prompt chips (shown for first message), auto-resize textarea, Enter-to-send
- Pages tab: page navigation, world info card, launch CTA
- Animated presence indicator: pulsing green dot on Orchestra avatar
- Initial greeting auto-generated based on project state

### Agent API (`app/api/agent-chat/route.ts`)
- POST `{ message, project: StartupProject | null, history: ChatMessage[] }`
- `buildSystemPrompt(project)` — context-aware: startup name, category, world label, brief, pricing, launch % 
- GPT-4o at temperature 0.88, max_tokens 300, last 12 turns of history
- Returns `{ response: string }` (non-streaming JSON for now)
- System prompt style: under 120 words, specific, no bullet points, ends with one question or action

### ProjectWorkspace Layout
**Old**: `[WorkspaceSidebar 208px] [main: GuidedEditor + preview]` + floating OrchestraAgent button  
**New**: `[AgentPanel 340px] [preview fills rest]` — agent IS the product, no editor by default

- Mobile: header with name + Launch button + page tabs
- Desktop: AgentPanel (hidden on mobile) + preview chrome bar (traffic lights + URL + page tabs) + full site preview

### What was removed
- `WorkspaceSidebar` — removed from workspace layout
- `OrchestraAgent` — replaced by AgentPanel
- `GuidedEditor` — no longer shown by default (component still exists, not yet re-integrated)

---

## Lovable Integration Strategy

### Current status
- `/api/handoff/lovable` route exists — generates a handoff payload
- Lovable MCP tools (`mcp__claude_ai_Lovable__*`) are available but **not yet actively used**
- User explicitly asked: "USE MOTION SITES and LOVABLE"

### Planned strategy
- Use `mcp__claude_ai_Lovable__send_message` to push Orchestra-generated startup data into a Lovable project
- Lovable handles: refined component polish, production-ready UI, deployable output
- Orchestra handles: concept, world generation, brand identity, cinematic direction
- Handoff point: after world generation, founder can "Open in Lovable" → pre-seeded with brand, copy, palette

### What needs to be built
1. Create a Lovable workspace/project via MCP when user requests handoff
2. Push startup world data (colors, copy, sections) as initial message
3. Return Lovable preview URL to show in Orchestra UI
4. "Continue in Lovable" button in AgentPanel or LaunchModal

---

## Motion Sites Integration Strategy

### What Motion Sites AI does
- Cinematic, editorial web experiences with:
  - Instrument Serif display type
  - Color-split headlines (word 1 in accent, rest in white/dark)
  - Staggered fade-rise animations (0.08s delays between words)
  - Video backgrounds (not yet implemented)
  - Precise letter-spacing (-0.025em), tight line-height (0.95)
  - Text-dominant compositions, image below the fold

### What has been implemented
- `hero-editorial-luxury` section type — direct Motion Sites DNA
- Instrument Serif loaded as CSS variable (`--font-instrument-serif`)
- Color-split headline technique in editorial hero
- Staggered word animations via Framer Motion

### What has NOT been implemented
- Video backgrounds (Motion Sites prompt references `<video autoplay muted loop>` backgrounds)
- Full `hero-editorial-luxury` is only used for floral/fashion/wellness — should expand
- The deeper Motion Sites prompt pattern (full cinematic scroll experience) not yet generalized
- No skill invocation happened — the `/orchestra-world-design` skill was consulted but Lovable/Motion Sites MCP tools were not actually called

---

## Higgsfield Integration Status

### Current state
- `/api/handoff/higgsfield` route exists
- 4 Higgsfield skills exist in `.claude/skills/`:
  - `higgsfield-generate`
  - `higgsfield-marketplace-cards`
  - `higgsfield-product-photoshoot`
  - `higgsfield-soul-id`
- **No actual Higgsfield API calls are being made** — skills exist but are not wired to generation pipeline
- No Higgsfield API key in `.env`

### Planned use
- Higgsfield for cinematic video generation (product demos, brand films)
- "Soul ID" for startup brand personality/motion identity
- Product photoshoot for hero imagery (replacing or augmenting Flux stills)

---

## Current Generation Engine Problems

### The core problem (as stated by user)
The engine is still: `Idea → Category → Template Selection → Fill Content`  
It should be: `Idea → World Generation → Brand Understanding → Visual Identity → Website Identity`

### Specific issues

1. **Template-driven, not world-driven**
   - Category maps to a fixed set of variant profiles
   - Claude fills a fixed JSON schema (hero, features, testimonials, pricing)
   - No true world/brand understanding — just content slot-filling

2. **Same page tree for every startup**
   - All startups get: Home, Features, Pricing, About, Contact, Blog, Dashboard, API
   - A basketball analytics startup gets "Dashboard" and "API" pages — makes no sense
   - Category-specific page trees not yet implemented

3. **Editor is still V1**
   - `GuidedEditor` uses tab-based form fields (hero, features, pricing, style)
   - No conversational world-building
   - Not yet replaced or redesigned

4. **Agent can chat but can't act**
   - AgentPanel sends/receives messages but cannot trigger generation
   - Agent cannot say "let me regenerate your hero section" and do it
   - Agent cannot update project data from the chat interface

5. **Images are post-generation**
   - Images are generated separately after text content
   - No semantic tying between brand identity and image prompts at generation time

---

## Current Open Bugs

1. **Agent chat not streaming** — responses are full JSON, no progressive text reveal. UX feels slow on long responses.

2. **AgentPanel not shown on mobile** — hidden via `hidden lg:flex`. Mobile has no agent access.

3. **GuidedEditor removed from workspace** — no way to edit startup name, copy, or sections from the UI anymore. Needs re-integration as a secondary panel or inline editing.

4. **Instrument Serif only applies to 3 categories** — floral, fashion, wellness get `hero-editorial-luxury`. Other editorial categories (home, travel, food, health) use Instrument Serif in `typographyFor()` but their section blueprints may not use `hero-editorial-luxury`.

5. **`stats-band` section removed from sports/fitness variants** — those blueprints now have no stats section. Should add `proof-gallery` or athlete testimonials instead.

6. **WorldNav page-change on V2 hero types** — the new `HeroEditorialLuxury`, `HeroAthletic`, `HeroProductSaaS` all render inside the WorldNav wrapper which has page-change buttons. These buttons need testing to confirm they work with the new hero section rendering path.

---

## Immediate Next Priorities

### P0 — Polish and stability
- [ ] Test all 3 new hero types visually (editorial-luxury, athletic, product-saas)
- [ ] Re-integrate a lightweight edit capability (at minimum, startup name edit)
- [ ] Add streaming to `/api/agent-chat` for better UX

### P1 — Agent becomes active (not just chat)
- [ ] Agent can trigger section regeneration from chat ("regenerate my hero")
- [ ] Agent can update project fields (name, tagline, pricing)
- [ ] Agent asks questions → answers feed into world generation parameters

### P2 — World generation (not template selection)
- [ ] Category-specific page trees (sports startup ≠ SaaS startup page structure)
- [ ] Claude generates section structure, not just content
- [ ] Brand understanding pass before visual generation

### P3 — Integrations
- [ ] Actually call Lovable MCP — `send_message` to create Lovable project from Orchestra world
- [ ] Wire Higgsfield for video generation (product demo loop in hero)
- [ ] Motion Sites video background capability

### P4 — Mobile
- [ ] AgentPanel visible on mobile (bottom sheet or drawer)
- [ ] Mobile-responsive preview

---

## File Reference

| File | Purpose |
|---|---|
| `app/components/ProjectWorkspace.tsx` | Main workspace layout — AgentPanel + preview |
| `app/components/AgentPanel.tsx` | 340px dark agent chat sidebar |
| `app/api/agent-chat/route.ts` | GPT-4o agent endpoint |
| `app/components/world-v2/GeneratedWorldV2.tsx` | V2 site renderer — all section types, dynamic stats |
| `app/components/SitePageViews.tsx` | Routes to V2 subpages or V1 fallback |
| `lib/world-v2/variants.ts` | Per-category variant profiles + section blueprints |
| `lib/world-v2/types.ts` | V2 type definitions (V2SectionType, WorldV2Package, etc.) |
| `lib/world-v2/builder.ts` | Assembles WorldV2Package from StartupBrief |
| `lib/world-v2/visual-universe.ts` | Category-specific scene queries for Flux prompts |
| `app/layout.tsx` | Instrument Serif font loading |
| `public/hero-object.webp` | Locked Synthera ribbon sculpture (do NOT replace) |
| `app/v2/page.tsx` | Landing page (V2 hero — LOCKED visual direction) |
