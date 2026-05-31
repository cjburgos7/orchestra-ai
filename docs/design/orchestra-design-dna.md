# Orchestra Design DNA

**Version:** 1.0  
**Source of truth:** `https://orchestra-founder-suite.lovable.app`  
**Implementation:** `app/lovable.css` + inline styles in `app/landing/page.tsx`

This document governs the visual language of the entire Orchestra product.
Any page built without referencing this document will feel disconnected.

---

## Guiding Principle

Orchestra is a **founder operating system**, not a SaaS dashboard.

The visual language should feel:
- **Premium** — like a tool made for serious founders
- **Calm** — never loud, never demanding
- **Intelligent** — every element has a reason to exist
- **Editorial** — influenced by print, not UI kits

Reference: Apple product films + luxury editorial + A24 atmosphere.

---

## Color System

All colors use **oklch color space**. Do not use hex or RGB equivalents — the oklch values are perceptually uniform and browser-native.

### Core Tokens

```css
/* Backgrounds */
--background:    oklch(98.5% .002 270)   /* near-white with the faintest blue-purple */
--card:          oklch(99.5% .001 270)   /* slightly lighter than background */
--platinum:      oklch(97%  .003 270)    /* used for subtle surface lifts */

/* Text */
--foreground:    oklch(22%  .012 270)    /* graphite — near-black, not pure black */
--graphite:      oklch(32%  .012 275)    /* secondary text, headings */
--muted-foreground: oklch(52% .012 270) /* labels, captions, navigation */

/* Accent */
--lavender:      oklch(70%  .11  295)    /* primary accent: borders, icons, glows */
--lavender-soft: oklch(90%  .04  295)    /* lavender wash for chips, pills */

/* Structure */
--border:        oklch(91%  .005 270)    /* all borders */
--silver:        oklch(88%  .005 270)    /* dividers, inactive states */
```

### Gradients

```css
--gradient-platinum: linear-gradient(135deg, oklch(99% .002 270) 0%, oklch(95% .006 285) 50%, oklch(92% .015 295) 100%)
--gradient-silver:   linear-gradient(180deg, oklch(97% .003 270) 0%, oklch(91% .006 280) 100%)
--gradient-lavender: linear-gradient(135deg, oklch(90% .045 295) 0%, oklch(76% .105 295) 100%)
--gradient-text:     linear-gradient(135deg, oklch(28% .015 280) 0%, oklch(50% .075 295) 100%)
```

### Atmospheric Glow (page-level)

The page background carries a two-layer lavender radial gradient that creates depth without distraction.

```css
/* Layer 1: top-right dominant wash */
radial-gradient(ellipse 80% 55% at 65% -5%, oklch(88% .07 295 / 0.35), transparent 55%)

/* Layer 2: left-edge counter-glow */
radial-gradient(ellipse 50% 30% at 0% 60%, oklch(86% .06 295 / 0.12), transparent 50%)
```

---

## Typography

### Fonts

| Role | Family | Notes |
|------|--------|-------|
| Display | `CameraPlainVariable` | Variable weight 100–900. Loaded from CDN. |
| Body | System sans (Geist) | Loaded via `next/font` |
| Mono | `SF Mono`, `Fira Code` | Code and mono data only |

**Font CDN URL:** `https://cdn.gpteng.co/mcp-widgets/v1/fonts/CameraPlainVariable.woff2`

Always declare `@font-face` inline in the component AND in `lovable.css` for reliability:

```css
@font-face {
  font-family: 'CameraPlainVariable';
  src: url('https://cdn.gpteng.co/mcp-widgets/v1/fonts/CameraPlainVariable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Apply via constant, not class (more reliable across Tailwind/Next.js):

```tsx
const SERIF = "'CameraPlainVariable', Georgia, serif";
// Usage:
<h1 style={{ fontFamily: SERIF }}>
```

### Type Scale

| Element | Size | Weight | Tracking | Line Height |
|---------|------|--------|----------|-------------|
| Hero H1 | `clamp(52px, 9vw, 88px)` | 400 | -0.02em | 0.95 |
| Section H2 | `clamp(28px, 3.5vw, 40px)` | 400 | -0.02em | 1.0 |
| Card title | `clamp(18px, 2vw, 22px)` | 400 | -0.02em | 1.1 |
| Nav | 15px | 500 | -0.02em | — |
| Body | `clamp(15px, 2vw, 17px)` | 400 | normal | 1.65 |
| Label/eyebrow | 10–11px | 700 | 0.16–0.22em | — |
| Caption | 11–12px | 400 | 0.04em | 1.5 |

All display headings use **CameraPlainVariable at weight 400** (not bold). The serif itself provides visual weight.

Italic is used sparingly for **accent spans** within headlines:
```tsx
<h1 style={{ fontFamily: SERIF, fontWeight: 400 }}>
  The founder <span style={{ fontStyle: "italic" }}>operating system</span>.
</h1>
```

---

## Surfaces

### `surface-panel` (elevated, frosted glass)
Used for: navigation, workspace chrome, modal-adjacent panels

```css
backdrop-filter: blur(20px) saturate(140%);
box-shadow: 0 1px 0 oklch(100% 0 0 / 0.8) inset, 0 1px 2px oklch(20% .01 270 / 0.06), 0 20px 50px -20px oklch(30% .02 280 / 0.18);
background: linear-gradient(rgba(255,255,255,0.7), rgba(247,248,250,0.5));
border: 1px solid rgba(255,255,255,0.7);
```

### `surface-card` (content card)
Used for: workspace cards, feature cards, project cards

```css
box-shadow: 0 1px 2px oklch(20% .01 270 / 0.04), 0 8px 24px -8px oklch(20% .01 270 / 0.08);
background: linear-gradient(rgba(255,255,255,0.9), rgba(244,245,248,0.7));
border: 1px solid oklch(92% .005 270 / 0.9);
```

### Modal Panel
Used for: GenerateModal, agent panel, overlays

```css
background: oklch(99.5% .001 270);
border: 1px solid oklch(91% .005 270);
border-radius: 24px;
box-shadow: 0 1px 0 oklch(100% 0 0 / 0.9) inset,
            0 2px 4px oklch(20% .01 270 / 0.04),
            0 40px 80px -20px oklch(30% .02 280 / 0.2);
```

---

## Component Patterns

### Navigation (Sticky Header)

- `sticky top-0 z-30`
- Background: `oklch(99.5% .001 270 / 0.6)` at ≥60% opacity, blur(20px)
- Border bottom: `1px solid oklch(91% .005 270 / 0.7)`
- Max width: `1180px` centered
- Logo: 28px × 28px, 3-layer gradient badge (silver → lavender → platinum)
- Nav links: 13px, `var(--muted-foreground)`, no underline
- CTA button: `oklch(28% .015 280)` background, 10px border-radius

### Primary Button

```tsx
style={{
  display: "inline-flex", alignItems: "center", gap: 8,
  borderRadius: 10,
  background: "oklch(28% .015 280)",      /* graphite */
  padding: "11px 22px",
  fontSize: 14, fontWeight: 500,
  color: "oklch(98% .003 270)",
  boxShadow: "inset 0 1px 0 oklch(100% 0 0 / 0.12), 0 4px 16px oklch(28% .015 280 / 0.25)",
}}
```

### Secondary Button / Outline

```tsx
style={{
  display: "inline-flex", alignItems: "center", gap: 8,
  borderRadius: 10,
  border: "1px solid oklch(91% .005 270)",
  padding: "11px 22px",
  fontSize: 14,
  color: "oklch(52% .012 270)",
}}
```

### Lavender Pill / Badge

```tsx
style={{
  display: "inline-flex", alignItems: "center", gap: 6,
  borderRadius: 9999,
  background: "oklch(90% .04 295)",      /* lavender-soft */
  padding: "4px 10px",
  fontSize: 11, fontWeight: 500,
  color: "oklch(38% .095 295)",
}}
```

### Status Dot (pulsing)

```tsx
<span style={{
  width: 6, height: 6, borderRadius: "50%",
  background: "oklch(70% .11 295)",
  boxShadow: "0 0 8px oklch(70% .11 295 / 0.9)",
  display: "inline-block",
}} />
```

### Workspace Grid (12-column)

Cards use data-attribute selectors for responsive breakpoints (more reliable than Tailwind variants):

```tsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
  <style>{`
    @media(min-width:1024px){ [data-ws-card-a] { grid-column: span 5 !important } }
    @media(min-width:1024px){ [data-ws-card-b] { grid-column: span 7 !important } }
  `}</style>
  <div className="surface-card rounded-2xl p-4"
       style={{ gridColumn: "span 12" }}
       data-ws-card-a="true">
    ...
  </div>
</div>
```

---

## Layout Rules

### Max Widths

| Section | Max Width |
|---------|-----------|
| Marketing sections | `920px` |
| Workspace chrome | `1180px` |
| Content body | `680px` |
| Agent panel | `300px` |

### Section Rhythm

```
Header:          sticky, h-14 (56px)
Hero section:    pt-16 sm:pt-24 pb-12
Section gap:     mt-12 lg:mt-20
Section padding: px-5 sm:px-8
Inner padding:   p-4 sm:p-6
Card padding:    p-4 (desktop) p-3 (mobile)
```

### Spacing Scale

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |
| section | 80px |

---

## Atmosphere Rules

### What creates atmosphere

1. **Two-layer lavender radial gradient** on the page root — never a flat background
2. **`surface-panel` glass effect** on elevated containers
3. **`grain` texture overlay** at 2.5% opacity on `surface-panel` elements
4. **Lavender top-edge line** on panels: `1px linear-gradient(to right, transparent, oklch(70% .11 295 / 0.5), transparent)`
5. **Subtle box shadows** — always use the defined shadow tokens, never `drop-shadow`

### What destroys atmosphere

- Flat white `#ffffff` or `#000000` backgrounds
- Hard drop shadows
- Saturated colors (anything chroma > 0.15 in oklch)
- Obvious CSS gradients
- Default browser focus rings
- Tight, dense layouts without breathing room
- Missing the CameraPlainVariable font (falling back to system sans)

---

## Animation Guidelines

### Principles

- **Ultra-subtle** — motion should be felt, not noticed
- **Editorial easing** — `cubic-bezier(0.22, 1, 0.36, 1)` for entries
- **No spring physics** for UI elements (only for interactive gestures)
- **No loops** unless truly ambient

### Standard Transitions

```css
/* Hover transitions */
transition: border-color 0.15s, background 0.15s, box-shadow 0.2s;

/* Page/section entry */
animation: float-in 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
@keyframes float-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}

/* Modal entry */
animation: modal-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
@keyframes modal-in {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
```

### Hover States

- Cards: `transform: translateY(-1px)`, shadow increase
- Buttons: no scale (too playful), just shadow/color shift
- Links: color shift to `var(--graphite)`

---

## Do / Don't

| Do | Don't |
|----|-------|
| oklch colors with the defined tokens | Hex colors (#7c3aed, #f5f4fb, etc.) |
| CameraPlainVariable at weight 400 | System sans for display headings |
| Two-layer lavender atmospheric glow | Flat solid background colors |
| `surface-card` / `surface-panel` classes | Custom card backgrounds |
| Subtle editorial motion | Obvious CSS animations or spring physics |
| Graphite on platinum (high contrast) | Pure black on pure white |
| Lavender as accent (never dominant) | Using lavender as a background fill |
| `inline style={{ fontFamily: SERIF }}` | CSS class `.serif` (unreliable with Tailwind) |
| Data-attribute selectors for responsive grid | Tailwind responsive variants (less reliable) |
| One action per section | Feature dumps |

---

## File References

| File | Purpose |
|------|---------|
| `app/lovable.css` | Design token CSS vars + utility classes |
| `app/landing/page.tsx` | Reference implementation (full Lovable page) |
| `app/layout.tsx` | Font preload (`<link rel="preload">`) |
| `lib/agent/types.ts` | Agent type system |
| `docs/architecture/v2-migration.md` | Pages still using old V2 system |
