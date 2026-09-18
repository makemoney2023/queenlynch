import type { Metadata } from 'next';
import { Outfit, Source_Sans_3 } from 'next/font/google';
import { NAP_DATA, SITE_URL, SITE_DESCRIPTION } from '@/lib/constants';
import { getHomePageGraph } from '@/lib/site-schema';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: NAP_DATA.name,
    template: `%s | ${NAP_DATA.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['pharmacy', 'Brampton', 'minor ailments', 'prescriptions', 'healthcare', 'Ontario'],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: SITE_URL,
    siteName: NAP_DATA.name,
    title: NAP_DATA.name,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/media/heroes/DPsZ9mdv-hero.webp',
        width: 1200,
        height: 630,
        alt: NAP_DATA.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: NAP_DATA.name,
    description: SITE_DESCRIPTION,
    images: ['/media/heroes/DPsZ9mdv-hero.webp'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/media/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/media/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/media/brand/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/media/brand/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = getHomePageGraph();

  return (
    <html lang="en" className={`${outfit.variable} ${sourceSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
