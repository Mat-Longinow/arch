# OSP site-wide live banner (DWTS 2026)

`live-banner.js` is loaded on every OSP page via Webflow site-wide custom code (footer, one-time).
It reads `live-stream.json` and shows a sticky "Watch live" bar + modal embedding the stream only
when `enabled` is true and now is inside `show_start`..`show_end` (Pacific). Show night: set
`embed_url` (YouTube/Facebook/Vimeo iframe src), flip `enabled` to true, `scripts/ship.sh`.
`force_on: true` skips the time window (for testing). Free stream, no paywall.

Site-wide footer snippet (one-time):
`<script src="https://cdn.jsdelivr.net/gh/Mat-Longinow/arch@main/osp/site/live-banner.js" defer></script>`
