# Cops & Cones 2026 — Webflow Hybrid page (Children's Legacy Center)

CLC's **Cops & Cones 2026** page, converted to the Webflow Hybrid model:
Webflow holds a thin loader; the real page content lives here and ships by `git push`.
This was the **proof-of-concept** for the entire hybrid workflow (first page built end-to-end).

Repo-wide architecture (folder rules, routing, go-live process): see `../../../HYBRID-CMS.md`.
Base model + image hosting + SEO tradeoffs: the Longinow Creative playbook
`work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`.

## 📄 What this page is

A **pre-event promo**: it invites families to **Cops & Cones 2026** — a community event
pairing local law-enforcement agencies with families over ice cream — and points them to
the Facebook event to RSVP. **August 30, 2026, 1–4 PM at Turtle Bay** (relocated from
The Park Food Truck Hub this year).

Sections (top → bottom): hero → double-pane intro (copy + 2026 hero image + FB RSVP link)
→ When & Where (Turtle Bay + Google Map) → Sponsors grid → Partners grid (law-enforcement
agencies). A post-event **recap photo grid** is present but commented out — re-enable it
after the 2026 event with the day-of photos. **There is NO newsletter section** — see the
standing rule below.

**Sponsors + Partners are a Git-backed JSON-CMS** (see below); the rest of the page is static.

## 🗂️ JSON-CMS — Sponsors & Partners grids

The two logo grids render from JSON, not hardcoded markup (mirrors the Aster "Our Team" CMS):

```
cms/
├── sponsors.json   ← 10 sponsor logos (order = display order)
├── partners.json   ← 4 law-enforcement partner agencies
└── assets/         ← the 14 logo files (sp-*.png/jpg sponsors, pt-*.png/jpg partners)
```

Each guts file has a container (`#lc-cops-sponsors` / `#lc-cops-partners`, class `team-grid`)
plus an injected render script that fetches the JSON via jsDelivr and builds
`.team-card > img.team-member-image` cards. **Env-gating:** the container's `data-env`
controls visibility — `preview` renders ALL items, `production` renders only items with
`preview !== true`. (production guts = `data-env="production"`, preview guts = `data-env="preview"`.)

**To change the roster:** edit `cms/sponsors.json` / `cms/partners.json` (add/remove/reorder
items, set `preview: true` to stage a logo on preview-only), drop any new logo in `cms/assets/`,
commit + push. **No markup edits.** Logos were pulled from the live 2025 page per Mat and
carried forward; `sp-sponsor-02` and `sp-sponsor-06` are unlabeled (need ID), and the full
2026 roster is pending CLC confirmation.

## 📂 Folder layout

```
cops-cones-2026/
├── production/cops-cones-2026.html   ← guts the LIVE CLC custom domain loads
├── preview/cops-cones-2026.html      ← guts every NON-production host loads
├── webflow-embed-loader.html         ← the one-time Webflow Designer embed (reference copy)
├── README.md                         ← this file
└── */*.preview.html                  ← LOCAL styled previews (gitignored, never shipped)
```

Page-specific images live one level up in `../images/` (shared by CLC page convention),
served via jsDelivr. The sponsor/partner logos live separately in `cms/assets/` (see the
JSON-CMS section above).

The **only** difference between `preview/cops-cones-2026.html` and
`production/cops-cones-2026.html` is the ENV marker comment at the top. For a static page
the two are otherwise identical; the split exists so future content changes can be staged
on the preview host before flipping live.

## 🔀 How a visitor's browser routes (preview vs production)

The Webflow embed (`webflow-embed-loader.html`) reads `location.hostname`:

- **Live CLC custom domain** (`PROD_HOST`) → fetches `production/cops-cones-2026.html`.
- **Any other host** (Webflow staging `*.webflow.io`, preview/share links) → fetches
  `preview/cops-cones-2026.html`.

⚠️ **`PROD_HOST` is an unconfirmed placeholder (`childrenslegacycenter.org`).** OSP's and
Arch's domains do **not** apply — CLC is a different org. Confirm the exact published CLC
hostname with Mat and set it in `webflow-embed-loader.html` before go-live.

## 🖼️ Images

Self-hosted in `../images/` and referenced by **absolute jsDelivr URL** (required — the
guts are injected into the Webflow domain, so relative paths would break):
`https://cdn.jsdelivr.net/gh/Mat-Longinow/arch@main/clc/pages/images/<file>`.

Hosted here: `cops-cones-2026-hero.png` (1920×1080, the 2026 intro graphic Mat supplied).
The hero **backdrop** and other decorative backgrounds are CSS-driven from CLC's live
`clc-mnhstr` stylesheet — they resolve automatically on the live page, nothing to host.

## ⛔ STANDING RULE — never include the bottom Newsletter section

**NEVER add the "Sign Up for OUR Newsletter" section to this page.** Standing rule from Mat
(2026-06-29). It has been deliberately removed from both `production/` and `preview/` guts.
Two reasons: (1) the Webflow newsletter form does not re-bind when injected after page load
— Webflow.js binds forms at page load and won't re-initialize an injected one, so it
degrades to a bare GET; (2) Mat does not want it on this page regardless. If you ever rebuild
or re-snapshot this page from a source that contains the newsletter block, **strip it** — the
omission is intentional. Repo-wide mirror of this rule lives in `../../../HYBRID-CMS.md`.

## 📝 Open content items (non-blocking)

- **Sponsor grid** — carries the 2025 roster as a placeholder per Mat; swap when the 2026
  sponsor lineup is confirmed.
- **Partner grid** — 2025 agencies were RPD, APD, SCSO, DA; confirm the 2026 set.
- **Recap photo grid** — commented out; re-enable post-event with day-of photos.

## ✍️ How to edit

Change copy / the date / the FB link / sponsor logos: edit **both**
`preview/cops-cones-2026.html` and `production/cops-cones-2026.html` (keep them in sync
except the ENV marker), re-build the `.preview.html` companions if you want to eyeball
offline, then commit + push. Live within ~5 min.

**Preview locally without pushing:** double-click `production/cops-cones-2026.preview.html`
(or the preview one). Self-contained, gitignored, renders fully styled offline using the
local CLC export CSS + the repo-hosted hero image. Webflow JS interactions and the
newsletter form aren't wired in the static preview; CSS background images need a connection.

## 🚦 Go-live cutover (HOLD until Mat green-lights)

Go-live is a deliberate, gated step:

1. Confirm `PROD_HOST` (the real CLC published domain) with Mat; set it in
   `webflow-embed-loader.html`.
2. In Webflow Designer, replace the Cops & Cones page body with an HTML Embed containing
   the loader from `webflow-embed-loader.html`. **This is the only Designer step, ever.**
3. Push the repo (guts + images). Verify the raw + jsDelivr URLs return 200, the live page
   renders the injected content, inherits CLC styling, the hero image loads, the map embeds,
   and the Facebook RSVP link opens the 2026 event.
4. From then on, every change is an autonomous `git push` — no Designer.

**Promoting preview content to production** = copy the approved `preview/` guts into
`production/`, **preserving production's ENV marker**, then push.
