# 10 Years of Impact — Webflow Hybrid page (Children's Legacy Center)

CLC's **10 Years of Impact** landing page — the destination for a QR code printed on CLC
printables. Built on the Webflow Hybrid model: Webflow holds a thin loader; the real content lives
here and ships by `git push`.

Repo-wide architecture: `../../../HYBRID-CMS.md`. Base model: the Longinow Creative playbook
`work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`.

## 📌 Why this page exists

Morgan Bergstrom, Teams, 2026-09-03:

> *"Can we add a landing page for this document with a QR code for our printables?"*
> *"Sadly no document yet.. can you just create the QR to the landing page and we will get you more information to upload soon?"*

She needs the **QR now**, ahead of the document. That is a non-problem here: a QR encodes a **URL**,
the URL is permanently stable on this model, and the content behind it is a repo file we can
rewrite forever. Print the code now; drop the report in whenever it lands. **The QR never changes.**

## 🔗 The locked URL

```
https://childrenslegacycenter.org/10-years-of-impact
```

⚠️ **This slug is load-bearing once anything is printed.** The Webflow page MUST use the slug
`10-years-of-impact` exactly. Changing it later invalidates every printed code.

## 🔳 QR assets (`qr/`)

| File | Use |
|---|---|
| `10-years-of-impact-qr.svg` | **Give this to the printer.** Vector, scales to any size with no quality loss. |
| `10-years-of-impact-qr.png` | 1960×1960 raster, CLC navy `#123A6E` on white. For digital/on-screen use. |
| `10-years-of-impact-qr-black.png` | 1960×1960, plain black. For one-color printing or when navy isn't available. |

Generated at **error-correction level H (30% recovery)** with a 4-module quiet zone — the code
survives print wear, folds, and partial obstruction, and leaves headroom if anyone ever wants a
logo knocked into the center.

**Verified, not assumed:** decoded back with OpenCV at 1960 / 600 / 300 / 150 px and returned the
exact URL at every size (fails only at 96 px, well below any realistic print size).

**Print guidance:** minimum **1 inch** square; **1.25 in** recommended for a table card or program.
Keep the white quiet zone around it — do not crop to the code's edge or set it on a busy photo.

## 📄 The document — how to drop it in

The report does not exist yet. The download card is built and styled, sitting in a placeholder
state. When Morgan sends the file, it is a **three-edit change** in both `production/` and
`preview/` guts:

1. Put the file in `documents/` (compress first if it's a print export — `pdftoppm` + Pillow, same
   recipe as the Cops & Cones and Dinner on the Bridge guides).
2. Delete the `<div class="pending-note">` block.
3. Uncomment the `<a>` download block below it and set the filename.

Then `scripts/ship.sh "10 Years of Impact: report live"`. Live in minutes. **No Designer step, no
reprint, no new QR.**

## 🧩 Template lineage

Copied from the CLC **Resources** page (`childrenslegacycenter.org/resources`) per Mat's direction
— the existing CLC page built around downloadable documents. Reused verbatim from its class
vocabulary: the `.founding` navy document band, `.div-block-69` grid, `.cards.auto > .div-block-36`
white card, `h4.heading-11` title, `.div-block-68` rule, `.button._2.center.mt-25` Download button.

### ⚠️ Three live defects in the source template, deliberately NOT copied

All three verified against the live site on 2026-09-03. **These are bugs on CLC's real pages and
are worth fixing separately** — they are noted here only to explain why this page diverges.

1. **Dead fallback URLs on the Resources page.** All three cards' `<object>` PDF fallback links
   point at the literal placeholder `https://your-pdf-url.pdf`.
2. **The inline `<object>` PDF preview does not render.** Playwright against the live page shows
   all three cards falling through to their fallback text. Same class of failure as Morgan's
   twice-escalated DWTS sponsor-guide "unreadable on mobile" complaint. This page therefore does
   not depend on an inline PDF viewer, and its download button carries the `download` attribute
   (the fix already shipped for DWTS, commit `2f67b03`).
3. **The site-wide DONATE link points at the staging domain** — `clc-mnhstr.webflow.io/donate`,
   not the custom domain. `childrenslegacycenter.org/donate` returns 200. This page uses `/donate`.

Also avoided: the Resources hero class `.main-image._1`, which carries a hardcoded
`ben-wicks-iDCtsz-INHI-unsplash.jpg` background in the shared stylesheet with no page-level
override — the exact trap that made the Dinner on the Bridge banner bleed a stray stock photo on
its first pass. A solid navy title band we fully control is used instead; swap in real artwork
whenever Morgan sends some.

## ✍️ Content sourcing

Every stat, quote and narrative line is **verbatim** from CLC's own 2026 *DINNER ON THE BRIDGE*
Sponsorship Guide, by way of the already-approved `../dinner-on-the-bridge-2026/` guts. Nothing is
invented — no new stats, dates, names or claims. The one edit: the closing narrative's final line
("This evening is that choice.") is dropped, since this is a standing page rather than an event page.

When Morgan's actual document arrives, **its content supersedes this** — the current copy is
scaffolding chosen because it is already client-approved, not because it is the final word.

## 🗂️ Folder layout

```
10-years-of-impact/
├── production/10-years-of-impact.html   ← guts the LIVE custom domain loads
├── preview/10-years-of-impact.html      ← guts every NON-production host loads
├── documents/                           ← the report goes here (empty until Morgan sends it)
├── qr/                                  ← print-ready QR assets
├── webflow-embed-loader.html            ← the ONE Designer step (⚠️ NOT YET PASTED)
└── README.md
```

## 🚦 Status

- ✅ Page guts built, committed, pushed.
- ✅ QR codes generated and decode-verified.
- ⬜ **Mat: create the Webflow page at slug `10-years-of-impact` and paste `webflow-embed-loader.html`.**
  Until this happens the URL 404s and the QR resolves to nothing. This is the only step Studio Lead
  cannot do headlessly, and it is the critical path if the printables have a press deadline.
- ⬜ Morgan: send the 10 Years of Impact document.

**No newsletter section** — repo-wide standing rule (Mat, 2026-06-29). Do not let Designer add one.
