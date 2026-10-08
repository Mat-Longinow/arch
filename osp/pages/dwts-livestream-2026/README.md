# DWTS 2026 Live Stream (One SAFE Place) — Webflow Hybrid page

A **hidden** page, not linked in site nav. Sarah asked (7/30 weekly) for a template she
can hand Benji: same header/footer as every other OSP event page (that's Webflow's
shell — untouched by these guts), otherwise-blank body, with one placeholder embed
block. Free stream page (sponsor-covered; Donor Perfect paywall plan DROPPED 2026-10-07). Benji is still deciding Vimeo vs. YouTube.

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

## ⏭️ Go-live (2026-10-07)

Stream is FREE on YouTube + Facebook. The embed on this page and the site-wide banner
(`osp/site/live-banner.js`) both read `osp/site/live-stream.json` (preview hosts read
`live-stream.preview.json`). On show night: fill `embed_url`, `watch_url`, `sponsor_logo`,
`sponsor_name` there and push. The banner auto-reveals inside [show_start, show_end].

## ✍️ How to edit

Edit `production/dwts-livestream-2026.html` and `preview/dwts-livestream-2026.html`
(keep them in sync), commit, push to `origin/main` via `git -C ~/Desktop/arch ...`
(never `cd && git`). Verify the raw GitHub URLs return 200.
