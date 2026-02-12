import { SITE_CONFIG } from '@/config/site.config';

/**
 * Structured Data (JSON-LD) for Organization
 * Helps Google understand and display rich results
 */
export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.fullName,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo-hero.jpeg`,
    description: SITE_CONFIG.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. H.M. Yasin Limpo No. 36',
      addressLocality: 'Gowa',
      addressRegion: 'Sulawesi Selatan',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.whatsappNumber,
      contactType: 'Customer Service',
      availableLanguage: ['Indonesian'],
    },
    sameAs: [
      `https://instagram.com/${SITE_CONFIG.instagram.replace('@', '')}`,
      SITE_CONFIG.url,
    ],
    foundingLocation: {
      '@type': 'Place',
      name: 'UIN Alauddin Makassar',
    },
    memberOf: {
      '@type': 'EducationalOrganization',
      name: 'UIN Alauddin Makassar',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Structured Data for Website
 */
export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: 'id-ID',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/articles?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Breadcrumb Structured Data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
