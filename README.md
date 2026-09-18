# Queen Lynch Pharmacy — website salvage pack

Scraped from [https://www.queenlynch.com](https://www.queenlynch.com) for a clean rebuild handoff.

## Quick facts
- **Address:** 157 Queen St E, Brampton, ON L6W 3X4
- **Phone:** (905) 450-3500
- **Email:** queenlynchpharmacy@gmail.com
- **Hours:** Mon–Fri 9am–6pm · Sat 9am–12pm · Sun Closed
- **Owner (meta):** Carolyn Khan

## What's in this pack
| File / folder | Purpose |
|---------------|---------|
| `SITE-MAP.md` | URL inventory + nav hierarchy + tech notes |
| `COPY.md` + `pages/` | Clean per-page copy |
| `CONTACTS-NAP.md` | Phone, email, address, hours, partners |
| `ASSETS-MANIFEST.md` | Every downloaded image with dims/bytes/use |
| `assets/` | brand / staff / interiors / heroes / other (incl. blog CMS images) |
| `raw/` | HTML (+ key JS/CSS) snapshots |
| `FINAL-REPORT.md` / `scrape-summary.json` | Counts, blockers, summary |
| `scrape.py` | Reproducible scraper |

## Scope note
Live site is essentially **Home + Blog**. Most pharmacy section content lives on the homepage. Hero, header, and contact form are React islands — copy was salvaged from JS bundles. Blog posts use microCMS-hosted images (downloaded into `assets/other/`).

## Counts
- Pages (md): 15 · Images: 43 · Breakdown: {"brand": 21, "staff": 1, "interiors": 3, "exteriors": 0, "heroes": 1, "other": 17}

## Do not
- Do not treat this as a platform migration of the Astro/AES/microCMS build.
- Parent agent handles CopyFromBox to Mac Desktop — this pack stays on the box under `/workspace/queenlynch/`.

## Open in Cursor
`/Users/cbsuperpatch/Desktop/Projects/queenlynch`
(also linked from Desktop as `queenlynch`)
