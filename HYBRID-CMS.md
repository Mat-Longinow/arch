# Webflow Hybrid — JSON-CMS + preview/production architecture

This repo backs Longinow Creative's **Webflow Hybrid autonomous-update workflow**: each
Webflow page holds a thin `fetch`-and-inject loader, and the real page content lives
here as committed files that ship by `git push` — no Webflow Designer, no permissions
wall. This document covers the **JSON-CMS + preview/production** layer that sits on top
of the base hybrid model.

Base model (why fetch-not-iframe, image hosting, SEO tradeoffs, when to convert a page):
Longinow Creative notes → `work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`.

The first page built on this architecture is `arch/pages/the-aster-project/` — see its
own `README.md` for the page-specific guide.

## 🗂️ Per-page folder layout

A converted page that uses the CMS + env split is a **folder**, not a single file:

```
<org>/pages/<page>/
├── production/<page>.html   ← guts the LIVE custom domain loads
├── preview/<page>.html      ← guts every NON-production host loads
├── cms/
│   ├── <collection>.json    ← a "collection": an array of objects (the data layer)
│   └── assets/              ← images referenced by that collection
├── webflow-embed-loader.html ← the one-time Webflow embed (reference copy)
├── README.md                ← page-specific guide
└── *.preview.html           ← LOCAL styled previews (gitignored, never shipped)
```

Simple pages that have no CMS data and no env split can stay as a single
`<org>/pages/<page>.html` (the original flat layout). Use the folder form when a page
needs a data collection and/or staged preview-before-live.

## 🔀 Preview / production routing

The Webflow embed (one HTML Embed per page, pasted once in the Designer) detects the host:

```js
var PROD_HOST = "archcollaborative.org";           // ⚠️ confirm per site before go-live
var host   = location.hostname.replace(/^www\./, "");
var isProd = (host === PROD_HOST);
var SRC    = REPO_BASE + (isProd ? "production" : "preview") + "/<page>.html";
```

- **Live custom domain → `production/`.** What the public sees.
- **Any other host** (Webflow staging `*.webflow.io`, preview/share links) **→ `preview/`.**
  Lets us stage and eyeball changes on the staging URL before touching production.

**Critical loader detail — script rehydration.** `innerHTML` does **not** execute
injected `<script>` tags. Because the CMS grid is rendered by a script inside the guts,
the loader must re-create each injected `<script>` into a fresh element after injection:

```js
target.innerHTML = html;
target.querySelectorAll("script").forEach(function (old) {
  var s = document.createElement("script");
  for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
  s.textContent = old.textContent;
  old.parentNode.replaceChild(s, old);
});
```

This is baked into every page's `webflow-embed-loader.html`.

## 🧩 The CMS = data file + template + ENV marker

A collection lives at `cms/<collection>.json` as `{ "collection": "...", "fields": [...], "items": [ {...}, ... ] }`.

**Fields differ per collection.** They're whatever that collection needs; the render
script for that page knows how to map them into the page's markup. The one field with
**universal semantics across every collection** is `preview`:

- **Preview host** renders **ALL** items.
- **Production host** renders **only** items where `preview !== true`
  (so `preview: false` or omitted ⇒ live; `preview: true` ⇒ staging-only).

That's the mechanism for staging a new item (team member, event, card) on the preview URL
before flipping it live — set `preview: true`, push, review on staging, then set
`preview: false` and push.

**ENV marker.** Each guts file carries an ENV marker the render script reads to decide
which filter to apply. The convention is a `data-env` attribute on the render container:
`data-env="preview"` in the `preview/` file, `data-env="production"` in the `production/`
file. **This marker is the only functional difference between the two folders' guts** —
everything else is identical.

## 🖼️ Assets & jsDelivr

CMS images live in `cms/assets/` and are referenced in JSON by **filename only**. The
render script builds the absolute jsDelivr URL:

```
https://cdn.jsdelivr.net/gh/Mat-Longinow/arch@main/<org>/pages/<page>/cms/assets/<image>
```

A full `http(s)://…` URL in the `image` field is accepted verbatim (passthrough), for
images already hosted elsewhere (e.g. an existing Webflow CDN asset).

Why jsDelivr (not `raw.githubusercontent.com`) for images: jsDelivr is a real CDN with
correct image content-types, caching, and cache-purge. `raw.githubusercontent.com` is
fine for the **guts HTML text** (fetched as text and injected), but not built for
hotlinked binaries. The repo is **public** — only push assets that are fine to be public
(public-site photos/logos, no PII). Pre-size images before pushing (jsDelivr does no
on-the-fly resizing).

## 🎨 Rendering into native markup

The render script builds cards using the **host site's own class vocabulary** so they
inherit live styling automatically (the inject-time `class → var(--…) → host :root`
mechanism). For Aster's team that's `board-tem` / `mem-item` / `image-12` / `heading-46`
/ `text-block-24-copy`. Every page provides an `onerror` fallback (e.g. an inline SVG
avatar) so a missing asset still renders intentionally rather than as a broken image.

> ⚠️ Reuse is per-design-system. CLC + OSP share one Webflow design system; Arch has its
> own (`--primary-blue` etc. vs CLC's `--dark-slate-blue`). A render template written
> against Arch classes only inherits styling on Arch. See the playbook's
> "TWO design systems" section before reusing markup across orgs.

## 👁️ Local previews (`*.preview.html`)

Every guts file gets a clickable styled companion beside it (`<page>.preview.html`) so
Mat can double-click and see the page rendered exactly as it'll look live — without
pushing or wiring Webflow. They are **self-contained** (link the local Webflow-export
CSS, rewrite jsDelivr image URLs to the local export copies) and **gitignored** — never
committed, never shipped, never fetched by a live page.

Because the companions are static (no live fetch), CMS-driven grids are **baked inline**
in the companion (static cards pointing at local `cms/assets/` paths) so the team renders
offline. Keep the baked cards in sync with `<collection>.json` by hand when the data
changes. Webflow JS interactions (accordions, hover) aren't wired in the static preview.

## 🚦 Go-live cutover process (gated — never blind)

1. **Confirm `PROD_HOST`** for the site with Mat; set it in the page's
   `webflow-embed-loader.html`.
2. **Resolve open design asks** (placement, which sections convert vs. stay native).
3. **One-time Webflow step:** in the Designer, replace the page body with an HTML Embed
   containing that page's loader. This is the only Designer touch, ever.
4. **Push** the repo (guts + cms). Verify the live page injects content, inherits site
   styling, the CMS grid populates, and links/buttons work.
5. From then on, **every change is an autonomous `git push`.**

**Promoting preview → production** = copy the approved `preview/` content into
`production/`, **preserving production's ENV marker** (`data-env="production"`). Never a
blind copy that leaks the preview marker into production.

**Hold rule:** no production cutover (no Webflow embed wiring, no first push of a new
page) without Mat's explicit green-light — same discipline as the Crowd7 team-hub.
