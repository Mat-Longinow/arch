# arch — Webflow page-guts

Public repo backing the **Webflow Hybrid autonomous-update workflow** for Longinow
Creative's Arch-relationship sites. Each Webflow page holds a thin `fetch`-and-inject
loader; the real page content lives here as `<org>/pages/<page>.html` and ships by
`git push` — no Webflow Designer, no permissions wall.

## Layout

- `arch/pages/` — Arch Collaborative's own site
- `clc/pages/`  — Children's Legacy Center (e.g. Cops & Cones)
- `osp/pages/`  — One SAFE Place

## How it works

A page's content is fetched at load time from:
`https://raw.githubusercontent.com/Mat-Longinow/arch/main/<org>/pages/<page>.html`

Full spec: Longinow Creative notes →
`work/longinow-creative/playbooks/webflow-hybrid-autonomous-updates.md`
