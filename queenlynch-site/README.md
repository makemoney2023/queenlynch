# Queen Lynch Pharmacy - Next.js Website

A modern, accessible pharmacy website built with Next.js 16, React 19, Tailwind 4, and GSAP ScrollTrigger.

## 🏥 About

Queen Lynch Pharmacy is a local pharmacy in Brampton, Ontario, providing prescription services, minor ailment prescribing, and specialized healthcare services.

**Owner:** Carolyn Khan  
**Location:** 157 Queen St E, Brampton, ON L6W 3X4  
**Phone:** (905) 450-3500  
**Email:** queenlynchpharmacy@gmail.com

## ✨ Features

- **Next.js 16 App Router** with React 19 and TypeScript
- **GSAP ScrollTrigger** for smooth scroll-driven animations with parallax effects
- **Tailwind CSS 4** for modern, responsive styling
- **Accessibility-first** with prefers-reduced-motion support
- **SEO Optimized** with:
  - Structured data (JSON-LD @graph with Organization, LocalBusiness, WebSite, FAQPage)
  - robots.txt with AI crawler allowlist
  - Dynamic sitemap generation
  - Proper meta tags and Open Graph
- **410 Gone responses** for deprecated blog posts (proper HTTP status handling)
- **Media sync script** for asset management

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Sync media assets from ../assets to public/media
npm run media-sync

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
# Build (automatically runs media-sync first)
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
queenlynch-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with JSON-LD
│   │   ├── page.tsx            # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog index
│   │   │   └── [slug]/
│   │   │       ├── page.tsx    # Blog post pages
│   │   │       └── route.ts    # 410 handler for gone posts
│   │   ├── robots.ts           # robots.txt with AI crawler rules
│   │   └── sitemap.ts          # Dynamic sitemap
│   ├── components/
│   │   ├── Header.tsx          # Site header with navigation
│   │   ├── Footer.tsx          # Site footer
│   │   ├── Hero.tsx            # Hero with GSAP scroll effects
│   │   ├── Services.tsx        # Service sections
│   │   └── Contact.tsx         # Location and contact form
│   └── lib/
│       ├── types.ts            # TypeScript types
│       ├── constants.ts        # NAP data, services, ailments
│       ├── site-schema.ts      # JSON-LD schema generators
│       └── blog-data.ts        # Blog post data
├── public/media/               # Synced media assets
├── scripts/
│   └── media-sync.mjs          # Asset sync script
└── package.json
```

## 🎨 Key Features

### Scroll-World Homepage

The homepage features a photographic scroll-driven experience powered by GSAP ScrollTrigger:
- Parallax hero image
- Smooth reveal animations
- Scroll-triggered section appearances
- Respects `prefers-reduced-motion` for accessibility

### SEO & Schema

All pages include proper structured data:
- **Organization** schema for business identity
- **LocalBusiness** (Pharmacy) with NAP, hours, geo coordinates
- **WebSite** schema
- **FAQPage** for common questions
- AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, etc.)

### Blog System

- 10 published blog posts with featured images
- 3 deprecated posts return proper 410 Gone status
- Automatic sitemap generation
- Article metadata and excerpts

### Minor Ailments Prescribing

Pharmacy can prescribe for 13 minor ailments including:
- Allergic rhinitis
- Conjunctivitis
- Dermatitis
- GERD
- UTIs
- And more (see full list in constants.ts)

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes media sync)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run media-sync` - Sync assets from ../assets to public/media

## 🔧 Configuration

### Canonical URL

Update `SITE_URL` in `src/lib/constants.ts` before deployment:

```typescript
export const SITE_URL = 'https://www.queenlynch.com';
```

### NAP Data

All business contact information is centralized in `src/lib/constants.ts` as `NAP_DATA`.

## 📝 Adding Blog Posts

Edit `src/lib/blog-data.ts` to add new posts:

```typescript
{
  slug: 'your-slug',
  title: 'Your Title',
  excerpt: 'Brief description...',
  publishedDate: '2026-03-15',
  featuredImage: '/media/other/blog-image.jpg',
  status: 'published',
  content: '',
}
```

## 🌐 Deployment

The site is optimized for deployment on:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

Environment variables (if needed):
- None required for static build
- Configure email service if replacing mailto: links

## 📄 License

© 2026 Queen Lynch Pharmacy. All Rights Reserved.

## 🤝 Support

For technical support or questions about the website:
- Email: queenlynchpharmacy@gmail.com
- Phone: (905) 450-3500

---

Built with ❤️ using Next.js 16, React 19, Tailwind 4, and GSAP
