# Queen Lynch Pharmacy — Next.js rebuild brief

**Canonical:** https://www.queenlynch.com  
**Local pack:** Desktop/Projects/queenlynch  
**Pattern sites:** Wilk & Wilk (primary) · Strong Foam (scroll + schema depth)

## Stack (match Wilk & Wilk)
Next.js 16 App Router · React 19 · Tailwind 4 · GSAP ScrollTrigger · Vitest  
Optional later: Three/R3F (Strong Foam), Omni loops (`gemini-omni`)

## Product
Brampton pharmacy marketing site: minor-ailments prescribing, services, location, contact, blog.  
Salvage only — do not migrate broken Astro/microCMS quirks (localhost canonical, dead blog slugs).

## Verified NAP (from CONTACTS-NAP.md)
- 157 Queen St E, Brampton, ON L6W 3X4
- (905) 450-3500 · Medicus Alliance (905) 494-5888
- queenlynchpharmacy@gmail.com
- Mon–Fri 9–6, Sat 9–12, Sun closed
- Owner (meta): Carolyn Khan

## Deliver
1. Homepage scroll-world (arrival → services → trust/prescribing → location → contact CTA)
2. Blog index + posts from recovered copy where HTTP 200; omit or 410 the three known 404 blog URLs
3. `site-schema.ts` Organization/LocalBusiness/WebSite/FAQ `@graph`
4. `scripts/media-sync.mjs` assets → public/media
5. robots.txt + sitemap; fix canonicals to https://www.queenlynch.com
6. `npm run build` passes; README run instructions
7. Prefer reduced-motion fallbacks

## Assets
See `assets/` + ASSETS-MANIFEST.md (43 images). No exteriors on old site.
