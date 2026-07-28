# Dinner on the Bridge 2026 — Webflow Hybrid page (Children's Legacy Center)

CLC's **Dinner on the Bridge** page, built on the Webflow Hybrid model: Webflow holds a thin
loader; the real page content lives here and ships by `git push`.

Repo-wide architecture (folder rules, routing, go-live process): see `../../../HYBRID-CMS.md`.
Base model + image hosting + SEO tradeoffs: the Longinow Creative playbook
`work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`.

## 📄 What this page is

A **pre-event promo** for CLC's first-time fundraising event honoring ten years of service:
**September 12, 2026, 5:30 PM, on the Diestelhorst Bridge in Redding, CA** — single seating,
one continuous table, Founding Culinary Partner Odell Craft BBQ. Built from the asset package
Sarah + Morgan sent 7/21/26 (Teams first, then downloaded from email at Mat's request) and the
"DINNER ON THE BRIDGE.pdf" 2026 Sponsorship Guide.

**Invitations already mailed 7/20 with QR codes pointing directly to the ticketing site** — this
page is the fallback for anyone who types the domain instead of scanning the code.

Sections (top → bottom): banner hero (blue Diestelhorst Bridge illustration) → event intro +
Get Tickets CTA (paired with a live Diestelhorst Bridge photo) → "Ten Years. One Bridge. One
Evening." story section (second bridge photo, copy pulled from the sponsorship guide's own
narrative) → When & Where + map → Sponsorship block (guide cover + "View Sponsorship Guide"
button). **No newsletter section** — see the standing rule below.

## 🎟️ Ticketing link

`https://onesafeplace.ticketspice.com/dinner-on-the-bridge` — confirmed by Sarah via email
7/21/26 (the PDF itself was NOT hyperlinked, as flagged in the 7/21 weekly brief). Used for both
the intro "Get Your Tickets" CTA.

## 📄 Sponsorship Guide download

"Interested in Sponsoring?" section pairs the guide's own cover art with a "View Sponsorship
Guide" button linking the PDF, laid out the same way as OSP's Dancing with the Stars sponsorship
section (text + purple CTA button on one side, image on the other) — the pattern Sarah referenced
on the 7/21 call. Hosted at
`documents/compressed_Dinner-on-the-Bridge-Sponsorship-Guide---2026---7.21.26.pdf`
(raster-compressed from the original ~6.7MB export down to ~705KB via `pdftoppm` + Pillow, same
recipe as the Cops & Cones guide). Served from raw.githubusercontent.com — **not** jsDelivr, same
reasoning as the images.

Sponsorship tiers (from the guide, for reference — not reproduced on the page itself): Presenting
Sponsor $15,000 (1 slot), Legacy Founding Table $7,500 (4 slots), Community Table $3,500 (6
slots). Commitment deadline for guaranteed print/signage inclusion: **August 15, 2026**. Sponsor
contact: Elizabeth Schroeder, e.schroeder@childrenslegacycenter.org.

## 🗂️ Folder layout

```
dinner-on-the-bridge-2026/
├── production/dinner-on-the-bridge-2026.html   ← guts the LIVE CLC custom domain loads
├── preview/dinner-on-the-bridge-2026.html      ← guts every NON-production host loads
├── webflow-embed-loader.html                   ← the one-time Webflow Designer embed (reference copy)
├── README.md                                   ← this file
└── */*.preview.html                            ← LOCAL styled previews (gitignored, never shipped) — not yet built
```

No JSON-CMS on this page — it's static (no roster/grid). Page-specific images live in
`../images/` (shared CLC page convention): `dinner-on-the-bridge-2026-banner.jpg` (the blue
illustrated banner), `dinner-on-the-bridge-2026-diestelhorst-1.jpg` +
`dinner-on-the-bridge-2026-diestelhorst-2.jpg` (the two live Diestelhorst Bridge photos Morgan
sent — she said "a couple" but sent one; Mat was cleared to source a second, sourced from the
"Venues - Redding.png" asset in the same package), and
`dinner-on-the-bridge-2026-sponsorship-cover.jpg` (the guide's cover art).

The **only** difference between `preview/` and `production/` guts is the ENV marker comment at
the top — this page has no env-gated content.

## 🔀 How a visitor's browser routes (preview vs production)

Same mechanism as Cops & Cones: `webflow-embed-loader.html` reads `location.hostname` — the live
CLC custom domain (`PROD_HOST`) gets `production/`, every other host gets `preview/`.

✅ **`PROD_HOST` is CONFIRMED** as `childrenslegacycenter.org` (Mat, 2026-07-28, at the Designer
paste). It was carried over from Cops & Cones as an unverified placeholder during the initial
build; that caveat no longer applies.

## 🚫 No CDN cache

Same standing rule as every other CLC/OSP hybrid page (Mat, 2026-06-29): everything — guts,
images, PDF — serves from `raw.githubusercontent.com`, not jsDelivr. Do not reintroduce jsDelivr
URLs on this page.

## ⛔ STANDING RULE — never include the bottom Newsletter section

Same repo-wide rule as every hybrid page. Omitted deliberately from both `production/` and
`preview/` guts.

## ✅ Go-live cutover — COMPLETE (2026-07-28)

**This page is LIVE at `https://childrenslegacycenter.org/dinner-on-the-bridge-2026`.** The full
cutover finished on 2026-07-28; every step below is done. Kept here as the record.

1. ✅ `PROD_HOST` confirmed as `childrenslegacycenter.org`.
2. ✅ Mat created the page in Webflow Designer and pasted the loader from
   `webflow-embed-loader.html` into an HTML Embed. **This was the only Designer step, ever** —
   the one step Studio Lead could not do.
3. ✅ Guts + images + PDF committed and pushed; raw.githubusercontent.com URLs verified 200 and
   the live page confirmed rendering the injected content (Playwright screenshots of the real
   custom domain, not raw-URL diffing).
4. ✅ **From here on, every change is an autonomous `git push` — no Designer, no permissions wall.**

Four content/design rounds have shipped against the live page since cutover (build `7a2275d`;
fix-list `1da3d4a` + `dd95c6f`; round 2 `37ee211` + `bd26040`; round 3 `c00e260`; hero passes
`50bf985`, `609f638`, `d28358d`). See `arch/correspondence/2026-07-28-dinner-on-the-bridge-*.md`
in the notes repo for the review memos.

## ✍️ How to edit

Change copy / date / ticketing link / images: edit **both** `preview/` and `production/` guts
(keep them in sync except the ENV marker), commit + push. Live within ~5 min once wired.
