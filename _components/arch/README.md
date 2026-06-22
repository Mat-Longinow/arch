# 🧩 Arch Collaborative — Page-Guts Component Library

Brand-neutral, class-keyed HTML snippets extracted from the live Arch
Collaborative Webflow export. Building blocks for the **Webflow Hybrid
autonomous-update workflow**: assemble a page by recombining these into
`~/Desktop/arch/pages/<page>.html`, `git push`, and the live Webflow page
fetches + injects it — no Designer, no permissions wall.

**Source-of-truth analysis:** Longinow Creative notes →
`work/longinow-creative/projects/arch-component-library/artifacts/arch-component-inventory.md`

> ⚠️ **Arch needs its OWN library — do NOT reuse CLC's root-level `_components/*.html`.**
> Arch's `:root` var names and component class vocabulary differ from CLC's.
> A CLC snippet injected into Arch renders with unresolved CSS vars. This
> directory is Arch's set; the root `_components/` is CLC's.

## ⚡ How brand color works (read this first)

You never set brand color in these snippets. The classes reference Arch's host
`:root` custom properties via `var(--…)`; on inject the markup inherits Arch's
stylesheet, so color resolves to Arch's palette automatically. Confirmed: zero
component classes hardcode brand hex — only the `:root` block does.

Arch palette (`css/arch-2.webflow.css`):

```css
:root {
  --primary-off-white: #fdfcf9;
  --primary-purple:    #b475f7;   /* the accent — what .yellow-div renders as */
  --primary-orange:    #ffc8aa;
  --primary-blue:      #0e3e70;   /* primary brand / buttons */
  --dim-grey:          #636363;
  --black-2:           #333;
  --dark-grey:         #9b9b9b;
  --red:               #fa191980;
}
```

Fonts: **Varela Round** (display) + **Roboto** (body) — already loaded on the
live page; snippets don't re-declare them.

## 📐 Layout wrappers — Arch uses SIX NUMBERED variants (the #1 gotcha)

Unlike CLC (one canonical wrapper), Arch sections each sit in a numbered wrapper
set. **Pick the matching set per section** — the snippets already carry the right
one, but if you hand-compose, use this table:

| Wrapper set | Section type |
|-------------|--------------|
| `.page-padding-2 > .container-large-2 > .vertical-page` | Mission / What-Is / intro statement |
| `.page-padding-3 > .container-large-3 > .vertical-page-2` | Pilot / legacy double-pane |
| `.page-padding-4 > .container-large-4 > .vertical-page-3` | Team / Board grid |
| `.page-padding-5 > .container-large-5 > .vertical-page-3` | FAQ accordion |
| `.page-padding-6 > .container-large-6 > .vertical-page-3` | News collection grid |
| `.page-padding` (+ `.container-large > .vertical-page`) | Services grid / text sections — bare set |

## 📦 The components

| File | Component | What it's for |
|------|-----------|---------------|
| `01-hero-logo.html` | Hero (logo) | Full-bleed banner with the Arch logo over an overlay. Default page banner. |
| `02-hero-title.html` | Hero (text title) | Slim banner with an animated H1. Interior/utility pages. |
| `03-mission-statement.html` | Mission statement | Eyebrow + large italic-accented statement. The signature "big copy" block. |
| `04-what-is-video.html` | What-Is + video | Mission variant with an embedded video beside copy. |
| `05-section-heading.html` | Section heading + divider | H3 + purple accent bar. The reusable title treatment. |
| `06-services-cards.html` | Services card grid | Icon + title + description cards, each an outbound link. |
| `07-double-pane.html` | Double-pane (text + media) | Workhorse two-column row. Image or YouTube embed. Variant A/B = media right/left. |
| `08-pilot-section.html` | Pilot / legacy double-pane | Standalone wrapper-3 double-pane with its own heading + divider. |
| `09-text-section.html` | Rich text body | Heading + long-form prose. Generic "section of text." |
| `10-cta-buttons.html` | CTA button group | Two button systems (`.button-link.support` and `.button-link-34`). |
| `11-team-grid.html` | Team / board grid | CMS member grid + static fallback list. |
| `12-faq-accordion.html` | FAQ accordion | Click-to-expand Q&A (Webflow interaction-driven). |
| `13-action-split.html` | Two-action split | Heading + body + two buttons, image opposite. |
| `14-news-grid.html` | News collection grid | CMS blog/news card grid. |
| `15-contact-form.html` | Contact form + social | Webflow form card + "Around the web" link list. |
| `16-detail-news-hero.html` | News detail hero | CMS article-template banner + body. |
| `17-detail-project.html` | Project detail body | CMS work/project-template body. |
| `18-page-skeleton.html` | Full page skeleton | End-to-end composition example with correct wrapper nesting. |

## 🏗️ Chrome — DO NOT inject these

The live Webflow page already renders them:

- **Nav** — `.navbar.w-nav` (brand + `.nav-menu` + `.w-nav-button`)
- **Footer** — ⚠️ Arch's footer is **unnamed raw divs** (`.div-block-27 >
  .div-block-26` with `.logo-footer` + 3 `.map-text` location cards), NOT a
  semantic `.footerv2` like CLC. Still pure chrome.
- **No cookie banner / sticky CTA** in Arch (CLC had both) — nothing extra.

## 🧱 Compose-a-page recipe (interior content page)

Top-to-bottom stack:

1. **Hero** — `01-hero-logo.html` (or `02-hero-title.html` for utility pages)
2. **Mission / intro** — `03-mission-statement.html`, optionally with a
   `07-double-pane.html` nested inside for an intro image/video
3. **Body sections** — `09-text-section.html` and/or `06-services-cards.html`,
   each opened by `05-section-heading.html`
4. **Team** — `11-team-grid.html` (bind the CMS collection in Webflow)
5. **FAQ** — `12-faq-accordion.html`
6. **CTA** — `10-cta-buttons.html`
7. **Contact** — `15-contact-form.html` (on the contact page)

## ⚠️ Naming gotchas (class names are NOT semantic)

- **`.yellow-div` is PURPLE**, not yellow — it renders `var(--primary-purple)`
  (legacy name).
- **`.our-team` / `.team-*`** are generic layout primitives, not team-specific
  (services grid uses `.our-team.full`).
- **Source typo to preserve:** `aster-proejct-text-setion` (sic) on the Aster
  sub-section variant. Reproduce verbatim or the CSS selector misses.
- **Two button systems** — `.button-link.support` (Our Story) and
  `.button-link-34` (BHCIP). Both valid; match the page.
- **CMS-bound components** (11 team, 14 news, 16/17 details) carry the wrapper +
  empty-state; bind the actual data in the Webflow Designer.
- **`resources.html` in the export is dead Irina-template cruft** — not Arch
  content, excluded from this library.

## ➡️ Per-page build flow

1. Copy `18-page-skeleton.html` to `~/Desktop/arch/pages/<page>.html`.
2. Drop in the components you need (each carries its matching numbered wrapper).
3. Swap content (titles, copy, image `src`, links, embed `src`).
4. `git push` → the live page picks it up on next load.
