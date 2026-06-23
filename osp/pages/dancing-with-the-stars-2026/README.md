# Dancing With The Stars 2026 (One SAFE Place) — Webflow Hybrid page (JSON-CMS edition)

One SAFE Place's **Dancing with the Shasta Stars 2026** event page (17th annual,
Saturday Oct 17 2026 at the Cascade Theatre, Redding), converted to the Webflow Hybrid
model: Webflow holds a thin loader; the real page content lives here and ships by
`git push`. This is OSP's **second** hybrid conversion (after `crab-feed-2026/`) and the
first OSP page to use our own **Git-backed JSON-CMS** + **preview/production** split —
the same pattern proven on Arch's `the-aster-project/`, generalized to a different
collection type (dancers/stars driving three sections).

Repo-wide architecture (folder rules, routing, JSON schema, go-live): see
`../../../HYBRID-CMS.md`. This file is the page-specific guide.

## 📂 Folder layout

```
dancing-with-the-stars-2026/
├── production/dancing-with-the-stars-2026.html  ← guts the LIVE custom domain loads
├── preview/dancing-with-the-stars-2026.html     ← guts every NON-production host loads
├── cms/
│   ├── stars.json                               ← the "stars" collection (data)
│   └── assets/                                   ← star/staff photos (populate on roster)
├── webflow-embed-loader.html                     ← the one-time Webflow Designer embed
├── README.md                                     ← this file
└── */*.preview.html                              ← LOCAL styled previews (gitignored)
```

The **only** functional difference between the `preview/` and `production/` guts is the
three star containers' ENV marker (`data-env="preview"` vs `data-env="production"`) and
the header ENV comment. Everything else is identical.

## 🔀 How a visitor's browser routes (preview vs production)

The Webflow embed (`webflow-embed-loader.html`) reads `location.hostname`:

- **Live custom domain** (`PROD_HOST` = `ospshasta.org`, confirmed by Mat 2026-06-23;
  `www.` is stripped, so `www.ospshasta.org` also routes to production) → fetches
  `production/…html`.
- **Any other host** (Webflow staging `*.webflow.io`, share links) → fetches
  `preview/…html`.

The loader injects the guts via `innerHTML`, then **re-creates each injected `<script>`**
into a fresh element — `innerHTML` does not execute injected scripts, and the star grids
are rendered by a script. That rehydration is what makes the CMS render run.

## 🌟 The "stars" JSON-CMS — ONE collection, THREE sections

The export carried **three** Webflow dynamic lists, all bound to the **same** Webflow
collection (`dwts-stars`), split into three on-page sections. We mirror that exactly with
**one** `cms/stars.json` collection filtered by a `section` field. One render script
(`DWTS-STARS-CMS`, baked at the bottom of each guts file) drives all three containers:

| `data-section` value | On-page heading |
|----------------------|-----------------|
| `2026-cast`  | "Meet Our 2026 Cast" |
| `2026-staff` | "Meet Our 2026 Staff" |
| `2025-cast`  | "Thank You To Our 2025 Cast" (archive) |

**`cms/stars.json` schema** — an array of objects under `items`:

| field     | type    | meaning |
|-----------|---------|---------|
| `name`    | string  | rendered into `<div class="text-block-24-copy nopad">` (card) + popup heading |
| `role`    | string  | optional — dancer/committee title, shown bolded atop the popup bio |
| `image`   | string  | filename in `cms/assets/` (render builds the jsDelivr URL); a full `http(s)://…` URL is accepted verbatim |
| `bio`     | string  | HTML/richtext, rendered into the popup `cfr-staff-bio-text` block |
| `section` | string  | one of `2026-cast` / `2026-staff` / `2025-cast` — selects which on-page list the row lands in |
| `preview` | boolean | visibility gate (see below). Omit ⇒ `false` ⇒ live |

**The `preview` flag — staging a star before flipping them live:**

- **Preview host** renders **ALL** items (regardless of `preview`).
- **Production host** renders **only** items where `preview !== true`.

So set a new star to `preview: true`, push, eyeball on the preview URL, then change to
`preview: false` (or remove it) and push to take them live.

**Render details:** each card reuses the live Webflow classes (`board-tem` / `mem-item
dwts-star` / `image-12 board-image` / `text-block-24-copy nopad`) so it inherits OSP
styling. A "Learn More" button opens a `popup-board` showing the larger photo
(`image-40`) + the richtext bio. Missing photos fall back to an inline SVG avatar
(initials) via `onerror`. Each section has a sibling "coming soon" fallback shown when
its filtered list is empty.

### ⚠️ Two reconstructions to eyeball at go-live

1. **The "Learn More" popup.** Webflow's IX2 interactions don't run on injected guts, so
   the script wires its **own** popup handler — a self-contained centered modal with a
   dark backdrop (open on "Learn More", close on the X, the backdrop, or `Esc`). It does
   **not** depend on the live CSS to position/hide the popup, so it works regardless of
   IX2. It may differ slightly from the original Webflow animation — confirm it looks
   right against the live design when the roster is populated. (Same class of
   reconstruction as the Aster FAQ-accordion + the OSP newsletter-form caveat.)
2. **The roster is EMPTY.** The Webflow static export renders dynamic lists as empty
   templates — the actual 2026 cast/staff + 2025 archive are **not** in the export.
   Until `cms/stars.json` `items` is populated (from the live OSP `dwts-stars` collection
   or a list Mat provides), all three sections show their "coming soon" fallback. See
   `cms/stars.json` `_data_gap`.

## ✍️ How to edit

**Change page copy / buttons:** edit BOTH `preview/…html` and `production/…html` (keep
them in sync except the `data-env` marker), commit + push. Live within ~5 min.

**Add / change / remove a star or staff member:**

1. Drop the photo (pre-sized, public-safe) into `cms/assets/`.
2. Add/edit the entry in `cms/stars.json` (`name`, `section`, `image`, `bio`, optional
   `role` / `preview`).
3. Commit + push. The live render picks up `stars.json` automatically (no guts edit
   needed for a pure roster change — the script reads the JSON at load time).

**Preview locally without pushing:** double-click `preview/…preview.html` (or the
production one). Self-contained, gitignored, renders fully styled offline using the local
OSP export CSS. Note: the star grids fetch `stars.json` over the network (empty today, so
the "coming soon" fallback shows); CSS background images need a connection.

## 🚦 Go-live cutover (HOLD until Mat green-lights)

This page is **built but not wired**. Go-live is a deliberate, gated step:

1. `PROD_HOST` already set to `ospshasta.org` in `webflow-embed-loader.html` (Mat
   confirmed 2026-06-23).
2. Populate `cms/stars.json` with the real 2026 roster + 2025 archive (open data gap).
3. Confirm: keep the 2025-cast archive block on the 2026 page, or drop it? (open ask).
4. In Webflow Designer, replace the DWTS page body with an HTML Embed containing the
   loader from `webflow-embed-loader.html`. **This is the only Designer step, ever.**
5. Push the repo (guts + cms + images + documents). Verify the live page renders the
   injected content, inherits OSP styling, the star grids + popups work, the Sponsorship
   "Learn More" opens the 2026 sponsor guide PDF, and the map/video embeds load.
6. From then on, every change is an autonomous `git push` — no Designer.

**Promoting preview content to production** = copy the approved `preview/` guts content
into `production/`, **preserving production's `data-env="production"` markers** (never a
blind copy that leaks the preview marker), then push.
