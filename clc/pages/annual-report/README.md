# Annual Reports — Webflow Hybrid page (Children's Legacy Center)

CLC's **Annual Reports** page: one card per report, each with a cover preview and a
"View Report" button, plus a QR code to the page for printables. Built on the Webflow Hybrid
model: Webflow holds a thin loader; the real content lives here and ships by `git push`.

Repo-wide architecture: `../../../HYBRID-CMS.md`.

## 📌 Why this page exists

Morgan Bergstrom, on a call with Mat (2026-09-10): make a version of the **Resources** page for
annual reports: a list of documents you can click to view, with a preview for each, one per
year of report, and a QR code to the page. The second report (`CDSS Pilot Report - 04.06.26
Final.pdf`) came from Morgan by email the same morning.

This **replaced** the old Designer-built `/annual-report` page, which was built around the single
2023-2024 report. The old sections are **hidden, not deleted** in Webflow, so the previous layout
can be restored by un-hiding them.

## 🔗 The locked URL

```
https://childrenslegacycenter.org/annual-report
```

⚠️ **Load-bearing once the QR is printed.** This is the page's existing slug (kept so the nav, the
`/articles/regional-pilot` article, and any old links keep working). Do not rename it.

## 🔳 QR assets (`qr/`)

| File | Use |
|---|---|
| `annual-report-qr.svg` | **Give this to the printer.** Vector, CLC navy `#123A6E`. |
| `annual-report-qr.png` | Large raster, CLC navy on white. For Canva / digital use. |
| `annual-report-qr-black.png` | Plain black. For one-color printing. |

Error-correction **H** (30% recovery), 4-module quiet zone. Decode-verified with OpenCV at full
size, 600, 300 and 150 px. Print at **1 in minimum, 1.25 in recommended**, and keep the white border.

## 📄 The reports

| Card | File | Hosted |
|---|---|---|
| 2024 – 2026 · *From Exploitation Response to Systems Reform* | compressed from Morgan's 17.5 MB export to 6.3 MB (Ghostscript `/ebook`, all 113 pages) | Webflow CDN, asset `6aa2cf67dc4fd7438ee9bc7e` |
| 2023 – 2024 · *Addressing Exploitation Through Multi-Systems Partnership: A Rural Pilot* | original | Webflow CDN (unchanged from the old page) |

PDFs live on the **Webflow CDN** because it serves them as `application/pdf`, so "View Report"
opens the browser's own PDF viewer. `raw.githubusercontent.com` serves PDFs as
`application/octet-stream`, which forces a download instead.

**Preview = cover image** (`images/`), not the Resources page's inline `<object>` viewer. That
viewer doesn't render on mobile or in several desktop browsers. Covers were rendered from page 1
at 110 dpi and resized to 720 px wide; the 2023-2024 one had its printer crop marks trimmed.

## ➕ Adding next year's report

1. Upload the PDF somewhere that serves `application/pdf` (Webflow assets is simplest). Compress
   first if it's a print export: `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook …`.
2. Render its cover: `pdftoppm -f 1 -l 1 -r 110 -png report.pdf cover`, resize to 720 px wide,
   save as `images/annual-report-YYYY-YYYY-cover.jpg`.
3. Copy one `.cards.auto` block to the **top** of the grid in both `production/` and `preview/`.
4. `scripts/ship.sh "Annual Reports: add YYYY-YYYY"`. No Designer step, and the QR never changes.

## 🗂️ Folder layout

```
annual-report/
├── production/annual-report.html   ← guts the LIVE custom domain loads
├── preview/annual-report.html      ← guts every NON-production host loads
├── images/                         ← report cover previews
├── qr/                             ← print-ready QR assets
├── webflow-embed-loader.html       ← the HTML Embed pasted into Webflow
└── README.md
```

**No newsletter section** in the guts (repo-wide rule). The page's native Webflow Newsletter
component is left in place outside the embed.
