# DWTS 2026 Live Stream (One SAFE Place) — Webflow Hybrid page

A **hidden** page, not linked in site nav. Sarah asked (7/30 weekly) for a template she
can hand Benji: same header/footer as every other OSP event page (that's Webflow's
shell — untouched by these guts), otherwise-blank body, with one placeholder embed
block. This is the page a Donor Perfect paywall link will point viewers to for the DWTS
live stream. Benji is still deciding Vimeo vs. YouTube.

Body-only guts, no CMS — same static-page pattern as `clc/pages/cops-cones-2026`.

## 📂 Folder layout

```
dwts-livestream-2026/
├── production/dwts-livestream-2026.html  ← guts the LIVE custom domain loads
├── preview/dwts-livestream-2026.html     ← guts every NON-production host loads
├── webflow-embed-loader.html              ← the one-time Webflow Designer embed
└── README.md                              ← this file
```

production/ and preview/ are identical except the ENV marker in the header comment —
there's no environment-conditional content on this page (no CMS, nothing that differs
by host).

## 🔀 How a visitor's browser routes (preview vs production)

Same mechanism as every other Hybrid page — see `../../../HYBRID-CMS.md`. PROD_HOST is
reused from the DWTS 2026 event page (`ospshasta.org`, confirmed by Mat 2026-06-23).

## ⏭️ What's left before go-live

1. **Get the real embed code from Benji/Sarah** once the Vimeo-vs-YouTube call is made.
   Replace the `<div id="lc-dwts-livestream-embed">` placeholder block in BOTH
   `production/` and `preview/` guts with the real iframe embed snippet verbatim. Do
   not fabricate a platform or code.
2. **Mat's one-time Designer step:** create a new page in the OSP Webflow site, hidden
   from nav, and paste `webflow-embed-loader.html` into an HTML Embed replacing the
   body. Confirm the published slug so Sarah's Donor Perfect paywall link can point at
   it.
3. Push. Every embed-code swap after that ships by `git push`, no Designer.

## ✍️ How to edit

Edit `production/dwts-livestream-2026.html` and `preview/dwts-livestream-2026.html`
(keep them in sync), commit, push to `origin/main` via `git -C ~/Desktop/arch ...`
(never `cd && git`). Verify the raw GitHub URLs return 200.
