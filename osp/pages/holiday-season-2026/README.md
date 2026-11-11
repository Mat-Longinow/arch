# Holiday Season 2026 (One SAFE Place) — Webflow Hybrid page

Morgan Bergstrom's ask (text to Mat, 2026-09-24): an OSP landing page + QR with a link to
donate, a link to an Amazon Christmas wishlist, and a flyer for the Christmas event.

- **Final URL (QR is printed against it): `https://www.ospshasta.org/holiday-season-2026`** — never rename the slug.
- Browser tab / SEO title: **Holiday Season 2026** (Webflow page setting).
- On-page title (H1): **Holiday Cheer Starts With You**.
- Webflow: OSP site `64dc6469dc8981cbbbb73864`, page id `6ab54893a2c8b107cd314172`. Nav + footer are native.

## Layout

```
holiday-season-2026/
├── production/holiday-season-2026.html  ← guts the LIVE ospshasta.org loads
├── preview/holiday-season-2026.html     ← guts every other host loads (identical except the ENV comment)
├── webflow-embed-loader.html            ← reference copy of the one-time Webflow embed
└── README.md
```

## ★ Swapping a card in later (one line, no Webflow)

Open BOTH guts files, find `HOLIDAY_LINKS` in the `<script>` at the bottom:

```js
var HOLIDAY_LINKS = {
  donate:   "https://www.ospshasta.org/giving",
  wishlist: "",   // ← paste Morgan's Amazon wishlist URL
  fulfill:  "",   // ← paste Morgan's "Fulfill a Wishlist" form URL (2026 Holiday Season form)
  flyer:    ""    // ← paste the flyer URL (PDF or image)
};
```

`""` shows the card as a disabled "Coming Soon". A URL turns it into a live button (wishlist, fulfill and flyer open in a new tab).
Four cards render 2x2 on desktop, one column under 991px. `fulfill` was added at Morgan's request (email 2026-11-10); form URL still pending.
Then `scripts/ship.sh "OSP holiday: wishlist link" osp/pages/holiday-season-2026`. Live in about 5 minutes
(raw.githubusercontent cache). The flyer (Sunday with Santa) is hosted in this repo at `flyer/sunday-with-santa-2026.png` (+ `.pdf`), served from raw.githubusercontent.com/Mat-Longinow/arch/main/osp/pages/holiday-season-2026/flyer/. Live 2026-11-11.

## Notes

- Donate card links to OSP's own `/giving` page (DonorPerfect form `one-safe-place-website-form`).
- Brand: OSP purple `--osp` + gold. Never CLC navy. No newsletter section (repo-wide rule).

## QR code

`qr/holiday-season-2026-qr.png` (OSP purple `#632466`, 1960px, ready for print), `-black.png` (black, for one-colour print),
`.svg` (vector, 49mm viewBox). Error correction H, 4-module quiet zone, encodes exactly the final URL above.
Decode-tested (PNG x2 + SVG render) 2026-09-24. If the slug ever changes, regenerate — the QR is the URL.
