# 🧩 One SAFE Place (OSP) — Page-Guts Components

**OSP reuses CLC's shared library. There is no parallel OSP snippet set here by
design.** OSP's Webflow project is the **same `clc-mnhstr` lineage** as CLC: same
`:root` var names (and hex), all of CLC's component classes present, 768 shared
classes. A CLC root-level `_components/*.html` snippet injected into a live OSP
page renders correctly and resolves to OSP's palette automatically.

> 🟢 **Build OSP pages from the root `../_components/*.html` library** — `01-hero`,
> `02-double-pane`, `03-gold-divider`, `04-map-when-where`, `05-image-grid`,
> `06-centered-heading`, `07-newsletter`, `08-page-skeleton`. Same compose recipe
> as CLC (see `../README.md`). This folder holds **only the OSP deltas** below.

**Source-of-truth analysis:** Longinow Creative notes →
`work/longinow-creative/projects/osp-component-library/artifacts/osp-component-inventory.md`

**Contrast with the sibling `../arch/` folder:** Arch is a *different* design
system and has its own full parallel library. OSP is **not** — it is a CLC-library
reuser. Don't mirror the Arch pattern here.

## ⚡ How brand color works

Identical to CLC: components reference the host `:root` via `var(--…)`; on inject
the markup inherits OSP's stylesheet, so color resolves to OSP's palette. OSP's
`:root` shares CLC's vars and adds two:

```css
:root {
  /* shared with CLC — same names, same hex */
  --dark-slate-blue: #0f3d73;
  --gold:            #f2be00;
  --pale-violet-red: #f55978;
  --white-smoke:     #f3f3f3;
  --grey:            #797979;
  --brown:           #ae1f3c;
  --crimson:         #c5193b;
  /* OSP-only */
  --osp:             #632466;   /* signature OSP purple */
  --black:           #000;
}
```

## 🟣 OSP deltas (the only OSP-specific pieces)

- **`01-purple-button.html`** — the OSP-purple CTA button (`purple-button`), OSP's
  analog of CLC's gold button. Use wherever an OSP page wants a brand-accent CTA.
- **DWTS / Crab Feed event family** *(no snippet needed)* — OSP has Dancing With
  The Stars + Crab Feed raffle pages CLC doesn't. They introduce OSP-only classes
  (`pilot` / `pilot-holder` = a styled `team-grid`/`team-circles` variant for
  star/dancer cards; `nominations-text` / `nominations-section-image` /
  `nomintions-button` = a nominations CTA section; `bluetext`, `dwtss`,
  `dwtss-2025-save-the-date`). These are **event-specific decoration whose CSS
  already ships in OSP's live stylesheet** — when converting a DWTS/raffle page,
  reference the classes by name in the page-guts; no snippet here needs to carry
  their CSS.

## ➡️ Per-page build flow (OSP)

1. Compose from the root `../_components/` library exactly as for CLC.
2. Swap CLC's gold CTA for `01-purple-button.html` where an OSP-purple CTA is wanted.
3. For DWTS/raffle pages, reference the OSP event classes by name (CSS is live).
4. `git push` → the live OSP page fetches + injects; palette auto-resolves.
