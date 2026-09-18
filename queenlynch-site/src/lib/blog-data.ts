import { BlogPost } from './types';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '15gt62y5hb',
    title: "Gut Health Is Mental Health; A Valentine's Day Reality Check.",
    excerpt: "Valentine's Day has a way of magnifying everything. Before you blame the cold, your schedule, or that third chocolate dessert, it's worth saying this out loud: your gut and your mood are deeply connected.",
    publishedDate: '2026-02-02',
    featuredImage: '/media/other/blog-queen_lynch_jan_26.jpeg',
    status: 'published',
    content: '',
  },
  {
    slug: '30otu8es0n',
    title: "From Supplements to Skincare: What's Actually Worth Buying for Summer Health?",
    excerpt: "Summer's here, and suddenly everyone's asking the same questions. Do I still need vitamin D when it's sunny? What about probiotics for cottage trips? And please, someone, tell me what works for bug bites that itch like crazy.",
    publishedDate: '2025-06-06',
    featuredImage: '/media/other/blog-Queen_lynch_s_Blog_Image_for_June_dup.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: '9yy_1v9s7',
    title: 'Dry Skin, Dry Air, Dry Everything: January Supplements That Support Skin from Within',
    excerpt: "January has a personality. And unfortunately, it's dry. Dry air. Dry lips. Dry elbows you didn't even know existed. You're moisturizing like it's a full-time job, yet your skin still feels tight by noon.",
    publishedDate: '2026-01-27',
    featuredImage: '/media/other/blog-Queen_lynch_Jan.jpeg',
    status: 'published',
    content: '',
  },
  {
    slug: 'avb7g8kti',
    title: 'Traveling for the Holidays?, Your Pharmacy Checklist Before You Go.',
    excerpt: 'The bags are packed, the tickets are booked, and you\'re ready to see family, friends, or just escape the routine for a few days. But somewhere between the excitement and the airport security line, your health essentials get forgotten until you need them.',
    publishedDate: '2025-12-01',
    featuredImage: '/media/other/blog-Queen_lynch_s_blog_Dec_1.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'epqhm_vsjb',
    title: 'Is It the Heat or Your Hormones?, Navigating August Mood Swings, Bloating & Fatigue.',
    excerpt: "Why everything feels \"off\" right now, and what your body might need. Let's just say it, August is a liar. It promises golden hours and summer ease, but in reality?, You're moody, puffy, and one minor inconvenience away from tears.",
    publishedDate: '2025-08-01',
    featuredImage: '/media/other/blog-Queen_Lynch_Blog_August_2.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'mbpwv_2syot',
    title: 'Back-to-School Survival Kit: Pharmacy Picks for Parents, Teachers & Students',
    excerpt: "Let's be honest, September is lying to all of us. It promises fresh starts, sharpened pencils, and cozy routines, but in reality? Parents are stretched thin, teachers are running on fumes, and students are one missed bus away from a meltdown.",
    publishedDate: '2025-09-01',
    featuredImage: '/media/other/blog-Queen_Lynch_September_sept.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'mnumvw1a9b',
    title: 'The Smart Way to Start a Spring Health Reset Without Extreme Detoxes',
    excerpt: "March arrives, and suddenly the internet is full of seven-day cleanses, detox teas, and juice fasts promising to undo winter in a week. Let's be clear, your body doesn't need a dramatic detox. It needs consistent, evidence-based support.",
    publishedDate: '2026-03-02',
    featuredImage: '/media/other/blog-Queen_lynch_march_.jpeg',
    status: 'published',
    content: '',
  },
  {
    slug: 'skpx8rtcbnpn',
    title: 'Hydrated from the Inside Out: Electrolytes, IV Boosters, and When You Actually Need Them',
    excerpt: "You'd think with all this sweating we're doing in the heat, we'd be more hydrated. But no, somehow, the hotter it gets, the more people seem to forget that water isn't the only thing your body needs to stay balanced.",
    publishedDate: '2025-07-01',
    featuredImage: '/media/other/blog-queen_lynch_1.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'za33vd0l94ur',
    title: 'Rosacea Season: Is November Prime Time for Flare-Ups?, How to Calm Your Skin from the Pharmacy Shelf.',
    excerpt: "Let's be honest, November isn't exactly a chill month for your skin. One day it's crisp and cold; the next, you're stepping into a wave of dry indoor heat that feels like a furnace.",
    publishedDate: '2025-11-03',
    featuredImage: '/media/other/blog-Queen_lynch_for_November.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'zm9m5w1hyn',
    title: 'Breathe Easy This Fall: Tackling Autumn Allergies with Queen Lynch Pharmacy.',
    excerpt: 'As crisp leaves start to fall and sweather weather sets in, many of us are breathing a sigh of relief, only to find another sneaky worry hanging in the air: Autumn allergies.',
    publishedDate: '2025-10-01',
    featuredImage: '/media/other/blog-Queen_lynch_blog_october.jpg',
    status: 'published',
    content: '',
  },
  {
    slug: 'mfx1yhx_6',
    title: 'Summer Headaches Explained',
    excerpt: 'This post is no longer available.',
    publishedDate: '2025-06-01',
    status: 'gone',
    content: '',
  },
  {
    slug: 'jsal-6iby0c2',
    title: 'Why You Feel Tired Even When You Sleep Enough',
    excerpt: 'This post is no longer available.',
    publishedDate: '2025-03-01',
    status: 'gone',
    content: '',
  },
  {
    slug: '4iw0q6ad21w',
    title: 'Spring Anxiety & Sleep Disruption',
    excerpt: 'This post is no longer available.',
    publishedDate: '2025-04-01',
    status: 'gone',
    content: '',
  },
];

export function getPublishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(post => post.status === 'published').sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}
