import { NAP_DATA, SITE_URL, SITE_DESCRIPTION } from './constants';
import { WithContext, Organization, LocalBusiness, WebSite, FAQPage, Question } from 'schema-dts';

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: NAP_DATA.name,
    url: SITE_URL,
    logo: `${SITE_URL}/media/brand/DRpQ8qHl.svg`,
    description: SITE_DESCRIPTION,
    email: NAP_DATA.email,
    telephone: NAP_DATA.phone.primary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP_DATA.address.street,
      addressLocality: NAP_DATA.address.city,
      addressRegion: NAP_DATA.address.province,
      postalCode: NAP_DATA.address.postalCode,
      addressCountry: 'CA',
    },
    founder: {
      '@type': 'Person',
      name: NAP_DATA.owner,
    },
  };
}

export function getLocalBusinessSchema(): WithContext<LocalBusiness> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    '@id': `${SITE_URL}/#pharmacy`,
    name: NAP_DATA.name,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: NAP_DATA.phone.primary,
    email: NAP_DATA.email,
    image: `${SITE_URL}/media/heroes/DPsZ9mdv-hero.webp`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP_DATA.address.street,
      addressLocality: NAP_DATA.address.city,
      addressRegion: NAP_DATA.address.province,
      postalCode: NAP_DATA.address.postalCode,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.6846,
      longitude: -79.7603,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '12:00',
      },
    ],
  };
}

export function getWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: NAP_DATA.name,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  };
}

export function getFAQSchema(): WithContext<FAQPage> {
  const questions: Question[] = [
    {
      '@type': 'Question',
      name: 'What minor ailments can pharmacists prescribe for at Queen Lynch Pharmacy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our pharmacists can prescribe for 13 common minor ailments including allergic rhinitis, conjunctivitis, dermatitis, GERD, hemorrhoids, cold sores, insect bites, urinary tract infections, and more. Visit us for convenient care without needing a doctor\'s appointment.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are your pharmacy hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are open Monday to Friday from 9am to 6pm, Saturday from 9am to 12pm, and closed on Sunday.',
      },
    },
    {
      '@type': 'Question',
      name: 'What specialized services does Queen Lynch Pharmacy offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer specialized services including oncology and palliative medication management, diabetes education, smoking cessation, naturopathic therapy, vaccines and flu shots, and home health care.',
      },
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: questions,
  };
}

export function getHomePageGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getOrganizationSchema(),
      getLocalBusinessSchema(),
      getWebSiteSchema(),
      getFAQSchema(),
    ],
  };
}
