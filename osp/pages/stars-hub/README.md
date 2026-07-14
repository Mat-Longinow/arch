# Dancing with the Shasta Stars 2026 — HUB — Webflow Hybrid page (static)

One SAFE Place's **Stars Hub** landing page for the 17th Annual *Dancing with the Shasta
Stars* (Sat Oct 17 2026, Cascade Theatre, Redding), on the Webflow Hybrid model: Webflow
holds a thin loader; the real page content lives here and ships by `git push`.

Unlike `dancing-with-the-stars-2026/`, this is a **bespoke Longinow-built** page (not a
Webflow export) and is **static** — no JSON-CMS. It therefore mirrors `crab-feed-2026/`:
just a `preview/` ↔ `production/` split, a loader, and this README. No `cms/` folder.

Repo-wide architecture (folder rules, routing, go-live): see `../../../HYBRID-CMS.md`.

## 📂 Folder layout

```
stars-hub/
├── production/stars-hub.html   ← guts the LIVE custom domain loads
├── preview/stars-hub.html      ← guts every NON-production host loads
├── webflow-embed-loader.html   ← the one-time Webflow Designer embed
└── README.md                   ← this file
```

The **only** difference between `preview/` and `production/` is the `ENV:` header comment.
Everything else is byte-identical.

## 🔀 How a visitor's browser routes (preview vs production)

The loader (`webflow-embed-loader.html`) reads `location.hostname`:

- **Live custom domain** (`PROD_HOST` = `ospshasta.org`; `www.` is stripped) → fetches
  `production/stars-hub.html`.
- **Any other host** (Webflow staging `*.webflow.io`, share links) → fetches
  `preview/stars-hub.html`.

The loader injects the guts via `innerHTML` into `#lc-block-stars-hub`, then re-creates any
injected `<script>` into a fresh element (parity + future-proofing; this page is static today).

## ✍️ How to edit

Edit page copy in **BOTH** `preview/stars-hub.html` and `production/stars-hub.html` (keep them
in sync except the `ENV:` marker), commit + push. Live within ~5 min. Prefer
`scripts/ship.sh "msg"` to commit+push (and purge, if ever CDN-served) in one.

**Preview a change before go-live:** push, then open the Webflow staging URL (routes to
`preview/`). When it looks right, copy the approved `preview/` guts into `production/` —
**preserving production's `ENV: production` marker** (never a blind copy that leaks the
preview marker) — and push.

## 🚦 Go-live cutover

This page is **built but not wired**. One deliberate step:

1. `PROD_HOST` is `ospshasta.org` in `webflow-embed-loader.html` (Mat confirmed 2026-06-23).
2. In the Webflow Designer, replace the Stars Hub page body with an HTML Embed containing the
   loader from `webflow-embed-loader.html`. **This is the only Designer step, ever.**
3. Publish. Verify the live page renders the injected content and the branch-tracking preview
   URL loads clean.
4. From then on, every change is an autonomous `git push` — no Designer.

_Built 2026-07-14 (restructured from a monolithic single-file drop into the standard
preview/production hybrid layout to match `crab-feed-2026/` + `dancing-with-the-stars-2026/`)._
