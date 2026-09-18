# Final report — Queen Lynch Pharmacy scrape

**Canonical:** https://www.queenlynch.com
**Scraped (America/Toronto):** 2026-09-18 09:40 EDT

## Counts
- Page markdown files: **15** (HTTP 200: 12, noted 404: 3)
- Raw HTML snapshots: **15**
- Images downloaded: **43**
- Asset breakdown: `{"brand": 21, "staff": 1, "interiors": 3, "exteriors": 0, "heroes": 1, "other": 17}`

## NAP summary
- Address: 157 Queen St E, Brampton, ON L6W 3X4
- Phone: (905) 450-3500, (905) 494-5888
- Email: queenlynchpharmacy@gmail.com
- Hours: Mon-Fri 9am-6pm; Sat 9am-12pm; Sun Closed
- Owner (meta): Carolyn Khan

## What the site is
Small Astro marketing site for a Brampton pharmacy: one homepage (minor-ailments prescribing, services, location, contact form) plus a blog index and posts (microCMS-backed images). Navigation is only **Home · Blog**.

## Blockers / gaps
- /blog/mfx1yhx_6 → HTTP 404 (Summer Headaches — top banner)
- /blog/jsal-6iby0c2 → HTTP 404 (Why You Feel Tired…)
- /blog/4iw0q6ad21w → HTTP 404 (Spring Anxiety & Sleep Disruption)
- sitemap.xml 404 (use sitemap-index.xml → sitemap-0.xml)
- HTML canonical points to https://localhost/ (misconfig)
- No social links found
- No exterior storefront photos found
- Hero/header/form content is client-only React — salvaged from JS bundles
- CMS: microCMS for blog images; one microCMS asset URL 404
- mailto: hrefs sometimes include trailing space

## Rebuild notes
- Salvage copy + photos only; rebuild on a clean stack (do not port Astro island/React cruft or localhost canonical).
- Fix or unpublish broken blog IDs; remove top banner until posts exist.
- Trim trailing space in mailto hrefs.
- Add social links if the business uses them.
- Consider a dedicated exterior/storefront photo — none on current site.
- Blog imagery is on microCMS CDN — re-host locally for rebuild.

## Pack layout
```
queenlynch/
  README.md SITE-MAP.md COPY.md CONTACTS-NAP.md ASSETS-MANIFEST.md
  FINAL-REPORT.md scrape-summary.json scrape.py
  pages/*.md
  raw/*.html (+ JS/CSS snapshots)
  assets/{brand,staff,interiors,exteriors,heroes,other}/
```
