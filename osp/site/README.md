# OSP site-wide live banner (DWTS 2026)

`live-banner.js` is loaded on every OSP page via Webflow site-wide custom code (footer, one-time).
It reads `live-stream.json` and shows a sticky "Watch live" bar + modal embedding the stream only
when `enabled` is true and now is inside `show_start`..`show_end` (Pacific). Show night: set
`embed_url` (YouTube/Facebook/Vimeo iframe src), flip `enabled` to true, `scripts/ship.sh`.
`force_on: true` skips the time window (for testing). Free stream, no paywall.

Site-wide footer snippet (one-time):
`<script src="https://cdn.jsdelivr.net/gh/Mat-Longinow/arch@main/osp/site/live-banner.js" defer></script>`

## Update 2026-10-07 (SL-71)

- Reads config from raw GitHub (not jsDelivr, whose @main cache lags ~7 days). Prod host reads `live-stream.json`; any other host reads `live-stream.preview.json` (force_on, for testing).
- Adds `sponsor_label/sponsor_logo/sponsor_name` ("Sponsored by <logo>") in the bar and the modal. Bar is sticky at top, so it is also the top-of-mobile link (sponsor hidden in the bar on phones, still shown in the modal).
- Because jsDelivr lags, Webflow loads the script via fetch+inject from raw GitHub, not a `<script src>`:
  `<script>fetch("https://raw.githubusercontent.com/Mat-Longinow/arch/main/osp/site/live-banner.js",{cache:"no-store"}).then(function(r){return r.text()}).then(function(t){var s=document.createElement("script");s.textContent=t;document.head.appendChild(s)})</script>`
- Show-night steps: fill embed_url / watch_url / sponsor_logo / sponsor_name in live-stream.json, push.
