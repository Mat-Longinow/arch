# 🧩 Webflow Page-Guts Component Library

Brand-neutral, class-keyed HTML snippets extracted from the live CLC Webflow
export. These are the building blocks for the **Webflow Hybrid autonomous-update
workflow** — assemble a page by recombining these components into
`<org>/pages/<page>.html`, push, and the live Webflow page fetches + injects it.

**Source of truth for the analysis:** Longinow Creative notes →
`work/longinow-creative/projects/webflow-component-library/artifacts/component-inventory.md`

## ⚡ How brand color works (read this first)

**You never set brand color in these snippets.** The component classes reference
the host site's `:root` CSS custom properties via `var(--…)`. When a page-guts
file is injected (`fetch` + `innerHTML`) into a live Webflow page, it inherits
**that** site's stylesheet, so the color resolves to **that** org's palette
automatically:

```css
:root {
  --dark-slate-blue: #0f3d73;
  --white:           #fff;
  --gold:            #f2be00;
  --pale-violet-red: #f55978;
  --white-smoke:     #f3f3f3;
  --grey:            #797979;
}
```

So these snippets carry **only Webflow class names** — no inline color, no style
attributes for brand. They are genuinely brand-neutral. CLC's palette is above;
Arch + OSP palettes differ in hex but (hypothesis) use the same `:root` var names.

> ⚠️ **Turnkey-across-3-sites risk.** Auto-resolution only holds if Arch + OSP
> (a) reuse the **same component class names** and (b) define **the same `:root`
> var names** (just different hex). Verify the moment those exports land. If
> either site renames classes or hardcodes hex, that org needs a per-site map.
> CLC is confirmed; Arch/OSP are unverified.

## 📐 Layout wrapper — every section sits inside this

```
.page-padding > .container-large > .vertical-page > <section content>
```

`.page-padding` + `.footerv2` appear on 42 of 51 CLC pages — the universal
skeleton. See `08-page-skeleton.html` for the full nesting.

## 📦 The components

| File | Component | What it's for |
|------|-----------|---------------|
| `01-hero.html` | Hero / page banner (`main-image`) | Full-bleed image banner + H1. Per-page bg via a modifier class. |
| `02-double-pane.html` | Double-pane (`columns _2`) | The workhorse: text column + image column. Variant A/B = image right/left. |
| `03-gold-divider.html` | Gold divider (`yellow-div`) | Signature CLC accent bar under headings. |
| `04-map-when-where.html` | When-&-Where + map (`map` / `map-text`) | Event details + Google Maps embed, two columns. |
| `05-image-grid.html` | Image grid (`team-circles` / `team-grid`) | Generic responsive card grid — recap photos, sponsor/partner logos. |
| `06-centered-heading.html` | Centered heading (`centered-heading`) | Title treatment for centered/grid sections. |
| `07-newsletter.html` | Newsletter signup (`newsletter`) | Footer-adjacent email capture form. |
| `08-page-skeleton.html` | Full page skeleton | The wrapper + a complete event-page composition example. |

## 🏗️ Chrome — DO NOT inject these

The live Webflow page already renders these. They're documented in the inventory
for completeness but are **not** part of page-guts:

- **Nav** — `navbar-copy` / `navbar-responsive` / `navbar-2`
- **Footer** — `footerv2` (current), `footer` (legacy)
- **Cookie consent** (`fs-cc-banner2_*`) + **sticky Giving CTA** (`sticky-button`)

## 🧱 Compose-a-page recipe (event page)

Top-to-bottom stack of page-guts components:

1. **Hero** — `01-hero.html` (set the bg modifier class for the page)
2. **Double-pane intro** — `02-double-pane.html` variant A (text-left), with the RSVP link in the body copy
3. **When-&-Where + Map** — `04-map-when-where.html`
4. **Recap photo grid** — `05-image-grid.html` + `06-centered-heading.html` — *omit on a pre-event page; this is post-event recap*
5. **Sponsors grid** — `05-image-grid.html` (section modifier `cac-sponsors`)
6. **Partners grid** — `05-image-grid.html` (bare, no modifier)
7. **Newsletter** — `07-newsletter.html`

Every section sits inside `.page-padding > .container-large > .vertical-page`;
every title gets a `yellow-div` (`03-gold-divider.html`).

## ⚠️ Naming gotchas (the class names are not semantic)

- **`.image-holder` is sometimes the TEXT pane, sometimes the IMAGE pane.** Trust
  child order + contents, not the class name.
- **`.yellow-div`** = gold, not yellow (legacy name).
- **`.team-*`** classes are the generic image-grid primitive, not team-specific.

## ➡️ Per-page build flow

1. Copy `08-page-skeleton.html` to `<org>/pages/<page>.html`.
2. Drop in the components you need from the recipe above.
3. Swap content (titles, copy, image `src`, map iframe `src`, RSVP link).
4. `git push` → the live page picks it up on next load.
