# The Aster Project — Webflow Hybrid page (JSON-CMS edition)

Arch Collaborative's **The Aster Project** page, converted to the Webflow Hybrid
model: Webflow holds a thin loader; the real page content lives here and ships by
`git push`. This is **Arch's first hybrid conversion** and the first page to use our
own **Git-backed JSON-CMS** + **preview/production** separation (mirrors the Crowd7
team-hub pattern).

Repo-wide architecture (folder rules, routing, JSON schema, go-live process):
see `../../../HYBRID-CMS.md`. This file is the page-specific guide.

## 📂 Folder layout

```
the-aster-project/
├── production/the-aster-project.html   ← guts the LIVE custom domain loads
├── preview/the-aster-project.html      ← guts every NON-production host loads
├── cms/
│   ├── team.json                       ← the "Our Team" collection (data)
│   └── assets/                         ← team photos (mary-williams.png, dr-b.png, sarah-peery.png)
├── webflow-embed-loader.html           ← the one-time Webflow Designer embed (reference copy)
├── README.md                           ← this file
└── *.preview.html                      ← LOCAL styled previews (gitignored, never shipped)
```

The **only** functional difference between `preview/the-aster-project.html` and
`production/the-aster-project.html` is the team container's ENV marker
(`data-env="preview"` vs `data-env="production"`). Everything else is identical.

## 🔀 How a visitor's browser routes (preview vs production)

The Webflow embed (`webflow-embed-loader.html`) reads `location.hostname`:

- **Live custom domain** (`PROD_HOST`, currently `archcollaborative.org` — ⚠️ confirm
  with Mat) → fetches `production/the-aster-project.html`.
- **Any other host** (Webflow staging `*.webflow.io`, preview/share links) → fetches
  `preview/the-aster-project.html`.

The loader injects the guts via `innerHTML`, then **re-creates each injected
`<script>`** into a fresh element — because `innerHTML` does not execute injected
scripts, and the team grid is rendered by a script. That rehydration is what makes
the CMS render run.

## 🗂️ The "Our Team" JSON-CMS

The visible team grid is **not** Webflow's CMS — it's `cms/team.json`, rendered by the
`ASTER-TEAM-CMS` script baked into each guts file.

**`cms/team.json` schema** — an array of team members under `items`:

| field     | type    | meaning |
|-----------|---------|---------|
| `name`    | string  | rendered into `<h3 class="heading-46">` |
| `title`   | string  | rendered into `<div class="text-block-24-copy nopad">` |
| `image`   | string  | filename in `cms/assets/` (the render builds the jsDelivr URL). A full `http(s)://…` URL is also accepted verbatim. |
| `preview` | boolean | visibility gate (see below). Omit ⇒ treated as `false` ⇒ live. |

**The `preview` flag — how you stage a member before flipping them live:**

- **Preview host** renders **ALL** items (regardless of `preview`).
- **Production host** renders **only** items where `preview !== true`.

So set a new member to `preview: true`, push, and they appear on the preview URL only.
Eyeball it, then change to `preview: false` (or remove the flag) and push to take them
live. All three current members are `preview: false` (live).

**Render details:** the script fetches `team.json`, filters by the container's
`data-env`, and builds Arch team cards (`board-tem` / `mem-item` / `image-12` /
`heading-46` / `text-block-24-copy`) so they inherit the live Arch site styling. If a
photo fails to load, an inline SVG avatar (initials on a soft background) is swapped in
via `onerror`, so a missing image still looks intentional.

## ✍️ How to edit

**Change page copy / the Yearly Report button / FAQ:** edit BOTH
`preview/the-aster-project.html` and `production/the-aster-project.html` (keep them in
sync except the `data-env` marker), then commit + push. Live within ~5 min.

**Add / change / remove a team member:**

1. Drop the photo (pre-sized, public-safe, no PII) into `cms/assets/`.
2. Add/edit the entry in `cms/team.json` (`name`, `title`, `image`, optional `preview`).
3. (For offline preview) bake the same card into the `#lc-aster-team` container in the
   `*.preview.html` companions — they're static and don't fetch.
4. Commit + push. The live render picks up `team.json` automatically (no guts edit
   needed for a pure team change — the script reads the JSON at load time).

**Preview locally without pushing:** double-click `preview/the-aster-project.preview.html`
(or the production one). These are self-contained, gitignored, and render fully styled
offline using the local Webflow export CSS + the `cms/assets/` photos. Note: Webflow JS
interactions (FAQ accordion, hover) aren't wired in the static preview.

## 🚦 Go-live cutover (HOLD until Mat green-lights)

This page is **built but not wired**. Go-live is a deliberate, gated step:

1. Confirm `PROD_HOST` with Mat; update it in `webflow-embed-loader.html`.
2. Confirm the team-grid call and button placement (open asks).
3. In Webflow Designer, replace the Aster page body with an HTML Embed containing the
   loader from `webflow-embed-loader.html`. **This is the only Designer step, ever.**
4. Push the repo (guts + cms). Verify the live page renders the injected content,
   inherits Arch styling, the team grid populates, and the Yearly Report button opens
   the flipbook.
5. From then on, every change is an autonomous `git push` — no Designer.

**Promoting preview content to production** = copy the approved `preview/` guts content
into `production/`, **preserving production's `data-env="production"` marker** (never a
blind copy that leaks the preview marker), then push.
