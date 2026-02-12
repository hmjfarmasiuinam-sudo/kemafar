import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/config/site.config';
import { Toaster } from 'sonner';
import { getHomeSettings } from '@/lib/api/settings';
import { OrganizationStructuredData, WebsiteStructuredData } from '@/shared/components/seo/StructuredData';


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'optional',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'optional',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

// Helper function to truncate text
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  // Fetch home settings to get description
  const homeSettings = await getHomeSettings();
  const siteDescription = truncate(
    homeSettings.hero.description || SITE_CONFIG.description,
    160 // Optimal length for meta description
  );

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: siteDescription,
    keywords: [
      'HMJ Farmasi',
      'Himpunan Mahasiswa Jurusan Farmasi',
      'farmasi UIN Alauddin',
      'mahasiswa farmasi Makassar',
      'organisasi mahasiswa farmasi',
      'jurusan farmasi',
      'UIN Alauddin Makassar',
      'farmasi',
      'kesehatan',
      'kefarmasian',
      'KEMAFAR',
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.name,
      description: siteDescription,
      images: [
        {
          url: `${SITE_CONFIG.url}/images/logo-hero.jpeg`,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: siteDescription,
      images: [`${SITE_CONFIG.url}/images/logo-hero.jpeg`],
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
    verification: {
      google: 'exWRxgfkK_Im73hprKz7yxLOE6KLX8XmSlbw3kT_kro',
    },
    alternates: {
      canonical: SITE_CONFIG.url,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={`${plusJakarta.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
