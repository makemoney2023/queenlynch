# Site map — Queen Lynch Pharmacy

Canonical host: `https://www.queenlynch.com`

Redirects:
- `https://queenlynch.com` → `https://www.queenlynch.com/` (302)
- HTTP → HTTPS via host

## Tech stack (rebuild context — salvage only; do not migrate platform cruft)
- **Astro v5.18.0** static site
- React islands via `astro-island` (HeaderComponent, MainHero/PharmacyHero, FormComponent, topnav, GoogleMap)
- Tailwind-style utilities; Lenis smooth scroll; Lucide icons
- Image pipeline: Astro `/_image?href=...` over `/_astro/*.webp` originals
- Blog CMS images: **microCMS** (`images.microcms-assets.io`)
- Analytics: Plausible-compatible via `analytics.aes-studio.com`
- Maps: Google Maps embed; Mapbox GL CSS referenced; reCAPTCHA on forms
- External OTC: [Health Snap](https://www.healthsnap.ca)
- Partner: Medicus Alliance `tel:9054945888`
- Build bug: `<link rel="canonical">` points at `https://localhost/`

## Navigation hierarchy (header)

Observed top-level (HeaderComponent JS): **Home · Blog**

- **Home** → `/`
- **Blog** → `/blog`

### Utility / chrome
- Top marquee → latest blog (currently `/blog/mfx1yhx_6` → **404**)
- Phone → `tel:9054503500`
- Email → `mailto:queenlynchpharmacy@gmail.com`
- Hours strip: Mon-Fri 9am-6pm | Sat 9am-12pm
- Logo → `/` (`/_astro/DRpQ8qHl.svg`)
- CTA: Order OTC → `https://www.healthsnap.ca`

## Footer
- Location / Opening Hours / Contact Us
- Medicus Alliance partner call
- © 2025 Queen Lynch Pharmacy

## Homepage section structure
1. TopNav marquee (latest blog)
2. Utility bar (phone / email / hours)
3. Header (logo + Home/Blog)
4. Hero — minor ailments prescribing (React)
5. WHY US + photo
6. CORE SERVICES + photo
7. Specialized Services (3 cards + Health Snap CTA)
8. Come visit us + photo + map + hours + contact
9. Contact form island (React)
10. Footer

## Full URL inventory

| Path | Title | Status | Copy file |
|------|-------|--------|-----------|
| `/blog/15gt62y5hb` | Gut Health Is Mental Health; A Valentine’s Day Reality Check. | 200 | `pages/blog-15gt62y5hb.md` |
| `/blog/30otu8es0n` | From Supplements to Skincare: What’s Actually Worth Buying for Summer Health? | 200 | `pages/blog-30otu8es0n.md` |
| `/blog/4iw0q6ad21w` | 404: Not Found | 404 | `pages/blog-4iw0q6ad21w.md` |
| `/blog/9yy_1v9s7` | Dry Skin, Dry Air, Dry Everything: January Supplements That Support Skin from Within | 200 | `pages/blog-9yy_1v9s7.md` |
| `/blog/avb7g8kti` | Traveling for the Holidays?, Your Pharmacy Checklist Before You Go. | 200 | `pages/blog-avb7g8kti.md` |
| `/blog/epqhm_vsjb` | Is It the Heat or Your Hormones?, Navigating August Mood Swings, Bloating & Fatigue. | 200 | `pages/blog-epqhm_vsjb.md` |
| `/blog/jsal-6iby0c2` | 404: Not Found | 404 | `pages/blog-jsal-6iby0c2.md` |
| `/blog/mbpwv_2syot` | Back-to-School Survival Kit: Pharmacy Picks for Parents, Teachers & Students | 200 | `pages/blog-mbpwv_2syot.md` |
| `/blog/mfx1yhx_6` | 404: Not Found | 404 | `pages/blog-mfx1yhx_6.md` |
| `/blog/mnumvw1a9b` | The Smart Way to Start a Spring Health Reset Without Extreme Detoxes | 200 | `pages/blog-mnumvw1a9b.md` |
| `/blog/skpx8rtcbnpn` | Hydrated from the Inside Out: Electrolytes, IV Boosters, and When You Actually Need Them | 200 | `pages/blog-skpx8rtcbnpn.md` |
| `/blog/za33vd0l94ur` | Rosacea Season: Is November Prime Time for Flare-Ups?, How to Calm Your Skin from the Pharmacy Shelf. | 200 | `pages/blog-za33vd0l94ur.md` |
| `/blog/zm9m5w1hyn` | Breathe Easy This Fall: Tackling Autumn Allergies with Queen Lynch Pharmacy. | 200 | `pages/blog-zm9m5w1hyn.md` |
| `/blog/` | Blog Posts | 200 | `pages/blog.md` |
| `/` | Queen Lynch Pharmacy | 200 | `pages/home.md` |

## Discovery sources
- `robots.txt` → `Allow: /` + `Sitemap: /sitemap-index.xml`
- `sitemap-index.xml` → `sitemap-0.xml` (12 URLs: home, blog index, 10 posts)
- Crawl of home + blog index (found 3 additional blog slugs that **404**)
- Common pharmacy paths probed (`/about`, `/services`, `/contact`, etc.) — all **404** (single-page + blog only)
