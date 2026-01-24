/**
 * Configuration Index
 *
 * Central configuration file for the entire application.
 * All configuration is organized into logical sections for easy navigation.
 *
 * Sections:
 * 1. Site Configuration - Basic site info, contact details, social media
 * 2. Domain Configuration - Categories and classifications
 * 3. Navigation Configuration - Routes and menu structure
 * 4. Content Configuration - Static homepage and about page content
 */

// =============================================================================
// 1. SITE CONFIGURATION
// =============================================================================

/**
 * Site Configuration
 *
 * Contains all site-specific information including:
 * - Site name, URL, and description
 * - Contact information (email, WhatsApp, address)
 * - Social media links
 *
 * Values can be overridden via environment variables for deployment flexibility.
 */
export const SITE_CONFIG = {
  /** Site name shown in header and metadata */
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Organization',

  /** Full organization name for formal contexts */
  fullName: 'Your Organization Full Name',

  /** Site URL - used for metadata and canonical URLs */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  /** Site description for SEO and metadata */
  description:
    'Your Organization - A modern platform for community engagement, content management, and member collaboration',

  /** WhatsApp number for contact (format: 62812xxxxxxxx) */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',

  /** Organization email address */
  email: 'contact@example.com',

  /** Instagram handle (with @) */
  instagram: '@yourorganization',

  /** Physical address of the organization */
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
} as const;

// =============================================================================
// 2. DOMAIN CONFIGURATION
// =============================================================================

/**
 * Article Categories
 * Keys are used in URLs and database, values are displayed to users.
 */
export const ARTICLE_CATEGORIES = {
  post: 'Post',
  blog: 'Blog',
  opinion: 'Opinion',
  publication: 'Publication',
  info: 'Info',
} as const;

/**
 * Event Categories
 * Keys are used in URLs and database, values are displayed to users.
 */
export const EVENT_CATEGORIES = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  'community-service': 'Pengabdian Masyarakat',
  competition: 'Kompetisi',
  training: 'Pelatihan',
  other: 'Lainnya',
} as const;

/**
 * Organization Divisions
 * Represents the structural divisions within the organization.
 */
export const DIVISIONS = {
  'internal-affairs': 'Dalam Negeri',
  'external-affairs': 'Luar Negeri',
  academic: 'Keilmuan',
  'student-development': 'Pengembangan Mahasiswa',
  entrepreneurship: 'Kewirausahaan',
  'media-information': 'Media dan Informasi',
  'sports-arts': 'Olahraga dan Seni',
  'islamic-spirituality': 'Kerohanian Islam',
} as const;

/**
 * Gallery Categories
 * Used for organizing photos and media in the gallery.
 */
export const GALLERY_CATEGORIES = {
  activities: 'Aktivitas',
  events: 'Event',
  facilities: 'Fasilitas',
  organization: 'Organisasi',
} as const;

// =============================================================================
// 3. NAVIGATION CONFIGURATION
// =============================================================================

/**
 * Public Routes
 * Main navigation routes for the public-facing website.
 */
export const ROUTES = {
  home: '/',
  about: '/about',
  articles: '/articles',
  events: '/events',
  leadership: '/leadership',
  members: '/members',
  gallery: '/gallery',
} as const;

/**
 * Admin Routes
 * Routes for the admin panel and management pages.
 */
export const ADMIN_ROUTES = {
  dashboard: '/admin/dashboard',
  articles: '/admin/articles',
  events: '/admin/events',
  members: '/admin/members',
  leadership: '/admin/leadership',
  users: '/admin/users',
  settings: '/admin/settings',
} as const;

/**
 * Auth Routes
 * Routes for authentication pages.
 */
export const AUTH_ROUTES = {
  login: '/auth/login',
  logout: '/auth/logout',
} as const;

/**
 * Type helper for route values
 */
export type RouteValue<T> = T[keyof T];

// =============================================================================
// 4. CONTENT CONFIGURATION (Static Homepage & About Page)
// =============================================================================

/**
 * Home Settings Type Definition
 */
export interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    description: string;
    primaryCTA: {
      text: string;
      link: string;
    };
    secondaryCTA: {
      text: string;
      link: string;
    };
    backgroundImage: string;
    stats: readonly {
      value: string;
      label: string;
    }[];
  };
  features: {
    title: string;
    description: string;
    items: readonly {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  cta: {
    title: string;
    description: string;
    primaryCTA: {
      text: string;
      link: string;
    };
    secondaryCTA: {
      text: string;
      phone: string;
    };
  };
}

/**
 * About Settings Type Definition
 */
export interface AboutSettings {
  story: string;
  mission: readonly string[];
  vision: string;
  values: readonly {
    title: string;
    description: string;
    icon?: string;
  }[];
  statistics?: {
    activeMembers: string;
    eventsPerYear: string;
    divisions: string;
    yearsActive: string;
  };
  timeline: readonly {
    year: string;
    title: string;
    description: string;
  }[];
  affiliations?: readonly {
    name: string;
    type: string;
    description: string;
  }[];
  certifications?: readonly {
    name: string;
    year: string;
  }[];
}

/**
 * Homepage Content
 * Static content for the homepage sections
 */
export const HOME_CONTENT = {
  hero: {
    badge: 'Organisasi Mahasiswa',
    title: 'Himpunan Mahasiswa Jurusan',
    titleHighlight: 'Farmasi',
    subtitle: 'UIN Alauddin Makassar',
    description:
      'Wadah aspirasi, kreativitas, dan pengembangan diri mahasiswa Farmasi UIN Alauddin Makassar',
    primaryCTA: {
      text: 'Kenali Kami',
      link: '/about',
    },
    secondaryCTA: {
      text: 'Lihat Program',
      link: '#features',
    },
    backgroundImage: '/images/hero-bg.jpg',
    stats: [
      { value: '150+', label: 'Anggota Aktif' },
      { value: '20+', label: 'Event / Tahun' },
      { value: '8', label: 'Divisi' },
    ],
  },
  features: {
    title: 'Program Kami',
    description: 'Berbagai program pengembangan untuk mahasiswa Farmasi yang profesional dan berintegritas',
    items: [
      {
        title: 'Keilmuan',
        description: 'Program pengembangan kompetensi akademik dan riset farmasi',
        icon: 'GraduationCap',
      },
      {
        title: 'Keprofesian',
        description: 'Pelatihan dan sertifikasi untuk persiapan dunia kerja',
        icon: 'Leaf',
      },
      {
        title: 'Kaderisasi',
        description: 'Pembinaan karakter dan leadership mahasiswa',
        icon: 'Users',
      },
      {
        title: 'Pengabdian',
        description: 'Kontribusi nyata untuk masyarakat dan lingkungan',
        icon: 'Heart',
      },
    ],
  },
  cta: {
    title: 'Bergabung Bersama Kami',
    description: 'Mari berkontribusi untuk kemajuan farmasi Indonesia',
    primaryCTA: {
      text: 'Hubungi Kami',
      link: '/contact',
    },
    secondaryCTA: {
      text: 'WhatsApp',
      phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628123456789',
    },
  },
} as const;

/**
 * About Page Content
 * Static content for the about page sections
 */
export const ABOUT_CONTENT = {
  story: 'Your Organization is a modern platform designed to bring communities together. We provide tools for content management, event organization, and member engagement. Founded with the vision of empowering communities through technology, we continue to innovate and serve our members with excellence.',
  mission: [
    'Empower communities through modern technology and collaboration',
    'Foster growth and development of our members',
    'Build strong networks and partnerships',
    'Deliver meaningful value to the community',
  ],
  vision:
    'To be a leading platform for community engagement and digital collaboration',
  values: [
    {
      title: 'Integrity',
      description: 'Upholding honesty and professional ethics in everything we do',
      icon: 'BookOpen',
    },
    {
      title: 'Collaboration',
      description: 'Working together to achieve shared goals',
      icon: 'Users',
    },
    {
      title: 'Innovation',
      description: 'Continuously innovating in all our programs and activities',
      icon: 'HeartHandshake',
    },
    {
      title: 'Dedication',
      description: 'Fully committed to organizational growth and excellence',
      icon: 'Briefcase',
    },
  ],
  statistics: {
    activeMembers: '150+',
    eventsPerYear: '20+',
    divisions: '8',
    yearsActive: '2015',
  },
  timeline: [
    {
      year: '2020',
      title: 'Organization Founded',
      description: 'Officially established to serve our community',
    },
    {
      year: '2021',
      title: 'Program Expansion',
      description: 'Launched structured programs and initiatives',
    },
    {
      year: '2022',
      title: 'Digital Transformation',
      description: 'Embraced digital tools for better community engagement',
    },
    {
      year: '2024',
      title: 'Continuous Innovation',
      description: 'Developing innovative programs and cross-institutional collaboration',
    },
  ],
  affiliations: [
    {
      name: 'Industry Association',
      type: 'National',
      description: 'National-level industry organization',
    },
    {
      name: 'Professional Network',
      type: 'Professional',
      description: 'Professional networking organization',
    },
    {
      name: 'Partner Institution',
      type: 'Institution',
      description: 'Partner educational or business institution',
    },
  ],
  certifications: [
    {
      name: 'Quality Certification',
      year: '2023',
    },
    {
      name: 'ISO 9001:2015',
      year: '2022',
    },
  ],
} as const;
