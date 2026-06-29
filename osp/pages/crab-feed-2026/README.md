# Crab Feed 2026 — Webflow Hybrid page (One SAFE Place)

One SAFE Place's **Crab Feed 2026** page, converted to the Webflow Hybrid model:
Webflow holds a thin loader; the real page content lives here and ships by `git push`.
This is **OSP's first hybrid conversion** (second org overall, after Arch's Aster Project).

Repo-wide architecture (folder rules, routing, go-live process): see `../../../HYBRID-CMS.md`.
Base model + image hosting + SEO tradeoffs: the Longinow Creative playbook
`work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`.

## 📄 What this page is

A **post-event recap**: it thanks attendees of the **39th Annual OSP Crab Feed**
(held **March 7, 2026** at the Shasta District Fairgrounds, which raised **over
$292,000**) and pivots to promote the **40th Annual** event — **March 13, 2027** at
the **Shasta District Fair & Event Center, 1890 Briggs St, Anderson, CA 96007**.

Sections (top → bottom): banner → "Thank You for an Amazing Night!" + Get-Your-Tickets
CTA → Become A Sponsor for 2027 → 2026 Sponsors thank-you → 2026 Highlights (YouTube)
→ When & Where (2027 + Google Map). **No newsletter section** — see the standing rule below.

**Static page — no JSON-CMS.** The Crab Feed raffle-items page is a *separate* page and
is out of scope here.

## 📂 Folder layout

```
crab-feed-2026/
├── production/crab-feed-2026.html   ← guts the LIVE OSP custom domain loads
├── preview/crab-feed-2026.html      ← guts every NON-production host loads
├── webflow-embed-loader.html        ← the one-time Webflow Designer embed (reference copy)
├── README.md                        ← this file
└── */*.preview.html                 ← LOCAL styled previews (gitignored, never shipped)
```

Page-specific images live one level up in `../images/` (shared by OSP page convention),
served straight from raw.githubusercontent.com (NOT jsDelivr — see the "No CDN cache" note
below). There is **no `cms/`** — this page has no data collection.

The **only** difference between `preview/crab-feed-2026.html` and
`production/crab-feed-2026.html` is the ENV marker comment at the top. For a static page
the two are otherwise identical; the split exists so future content changes can be staged
on the preview host before flipping live.

## 🔀 How a visitor's browser routes (preview vs production)

The Webflow embed (`webflow-embed-loader.html`) reads `location.hostname`:

- **Live OSP custom domain** (`PROD_HOST`) → fetches `production/crab-feed-2026.html`.
- **Any other host** (Webflow staging `*.webflow.io`, preview/share links) → fetches
  `preview/crab-feed-2026.html`.

⚠️ **`PROD_HOST` is an unconfirmed placeholder (`onesafeplace.org`).** Aster's
`archcollaborative.org` does **not** apply — OSP is a different org. Confirm the exact
published OSP hostname with Mat and set it in `webflow-embed-loader.html` before go-live.

## 🖼️ Images

Self-hosted in `../images/` and referenced by **absolute raw.githubusercontent.com URL**
(required — the guts are injected into the Webflow domain, so relative paths would break):
`https://raw.githubusercontent.com/Mat-Longinow/arch/main/osp/pages/images/<file>`.

Hosted here: `Crab-Feed-Banner-2026-text-only---nobg.png`, `Copy-of-Thank-You---CF26.png`
(+ `-p-500`), `Become-A-Sponsor_1.png` (+ `-p-500`, `-p-800`), `Crab-Feed-Sponors---3.4.26.png`
(+ `-p-500`). The banner **backdrop** and other decorative backgrounds are CSS-driven from
OSP's live `clc-mnhstr` stylesheet — they resolve automatically on the live page, nothing
to host.

### 🚫 No CDN cache (deliberate, Mat 2026-06-29)

This page serves **everything** — guts, images — directly from `raw.githubusercontent.com`,
**not jsDelivr**. Reason: jsDelivr's `@main` edge cache has a ~7-day TTL and lagged badly on
updates. raw.githubusercontent.com carries only a 5-minute `Cache-Control` and GitHub
invalidates it on push, so edits show up in seconds–minutes. **Do not reintroduce jsDelivr
URLs on this page.** (Repo-wide rule — see `../../../HYBRID-CMS.md`.)

## ⛔ STANDING RULE — never include the bottom Newsletter section

**NEVER add the "Sign Up for … Newsletter" section to this page.** Repo-wide standing rule
from Mat (2026-06-29). It has been deliberately removed from both `production/` and `preview/`
guts. Two reasons: (1) the Webflow newsletter form does not re-bind when injected after page
load — Webflow.js binds forms at page load and won't re-initialize an injected one, so it
degrades to a bare GET; (2) Mat does not want it on these pages regardless. If you ever
rebuild or re-snapshot this page from a source (e.g. a `-current.html` export) that contains
the newsletter block, **strip it** — the omission is intentional. Repo-wide mirror lives in
`../../../HYBRID-CMS.md`.

## ✍️ How to edit

Change copy / the 2027 date / the ticket link / sponsor logos: edit **both**
`preview/crab-feed-2026.html` and `production/crab-feed-2026.html` (keep them in sync
except the ENV marker), re-build the `.preview.html` companions if you want to eyeball
offline, then commit + push. Live within ~5 min.

**Preview locally without pushing:** double-click `production/crab-feed-2026.preview.html`
(or the preview one). Self-contained, gitignored, renders fully styled offline using the
local OSP export CSS + images. Webflow JS interactions and the newsletter form aren't
wired in the static preview; CSS background images need a connection.

## 🚦 Go-live cutover (HOLD until Mat green-lights)

This page is **built but not wired**. Go-live is a deliberate, gated step (same discipline
as Aster):

1. Confirm `PROD_HOST` (the real OSP published domain) with Mat; set it in
   `webflow-embed-loader.html`.
2. In Webflow Designer, replace the Crab Feed 2026 page body with an HTML Embed containing
   the loader from `webflow-embed-loader.html`. **This is the only Designer step, ever.**
3. Push the repo (guts + images). Verify the raw.githubusercontent.com URLs return 200, the live page
   renders the injected content, inherits OSP styling, images load, and the ticket button
   opens the TicketSpice page.
4. From then on, every change is an autonomous `git push` — no Designer.

**Promoting preview content to production** = copy the approved `preview/` guts into
`production/`, **preserving production's ENV marker**, then push.
