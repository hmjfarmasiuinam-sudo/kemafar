/**
 * Configuration Index
 *
 * This file re-exports all configuration from organized config files
 * and contains content-specific configuration (HOME_CONTENT, ABOUT_CONTENT).
 *
 * Configuration is split into:
 * - site.config.ts - Site information, contact details
 * - domain.config.ts - Business domain categories and classifications
 * - navigation.config.ts - Routes and navigation structure
 */

// Re-export from organized config files
export { SITE_CONFIG } from './site.config';
export { ARTICLE_CATEGORIES, EVENT_CATEGORIES, DIVISIONS, GALLERY_CATEGORIES } from './domain.config';
export { ROUTES, ADMIN_ROUTES, AUTH_ROUTES, type RouteValue } from './navigation.config';

// =============================================================================
// CONTENT CONFIGURATION (Static Homepage & About Page)
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
 * Contact Settings Type Definition
 */
export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter?: string;
    linkedin?: string;
  };
  footerDescription: string;
}

/**
 * About Settings Type Definition
 */
export interface AboutSettings {
  story: string;
  mission: string;
  vision: string;
  values: readonly {
    title: string;
    description: string;
    icon?: string;
  }[];
  programs: readonly {
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
  mission: '1. Empower communities through modern technology and collaboration\n2. Foster growth and development of our members\n3. Build strong networks and partnerships\n4. Deliver meaningful value to the community',
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
  programs: [
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
  statistics: {
    activeMembers: '150+',
    eventsPerYear: '20+',
    divisions: '8',
    yearsActive: '2015',
  },
  timeline: [
    {
      year: '2015',
      title: 'Pendirian Organisasi',
      description: 'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar resmi didirikan sebagai wadah aspirasi dan pengembangan mahasiswa Farmasi',
    },
    {
      year: '2016',
      title: 'Peluncuran Program Kaderisasi',
      description: 'Memulai program kaderisasi terstruktur untuk membentuk karakter dan kepemimpinan mahasiswa Farmasi yang berintegritas',
    },
    {
      year: '2018',
      title: 'Kerjasama Industri Farmasi',
      description: 'Menjalin kerjasama dengan berbagai industri farmasi dan rumah sakit untuk program magang dan pengembangan profesional mahasiswa',
    },
    {
      year: '2020',
      title: 'Adaptasi Digital',
      description: 'Transformasi digital penuh dalam kegiatan organisasi sebagai respons terhadap pandemi, menghadirkan seminar online dan pelatihan virtual',
    },
    {
      year: '2021',
      title: 'Ekspansi Program Keprofesian',
      description: 'Meluncurkan berbagai program pelatihan keprofesian seperti workshop formulasi, quality control, dan good manufacturing practice',
    },
    {
      year: '2022',
      title: 'Penguatan Riset Mahasiswa',
      description: 'Mendirikan divisi riset dan publikasi ilmiah untuk mendorong mahasiswa aktif dalam penelitian farmasi',
    },
    {
      year: '2023',
      title: 'Pengabdian Masyarakat Berkelanjutan',
      description: 'Menginisiasi program pengabdian masyarakat rutin dengan fokus pada edukasi kesehatan dan konseling obat di berbagai wilayah',
    },
    {
      year: '2024',
      title: 'Inovasi dan Kolaborasi Nasional',
      description: 'Mengembangkan program inovasi farmasi dan memperluas jaringan kolaborasi dengan organisasi mahasiswa farmasi se-Indonesia',
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

/**
 * Contact Content (Default)
 */
export const CONTACT_CONTENT: ContactSettings = {
  phone: '628123456789',
  whatsapp: '628123456789',
  email: 'contact@kemafar.org',
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
  socialMedia: {
    facebook: 'https://facebook.com/kemafar',
    instagram: 'https://instagram.com/kemafar',
    youtube: 'https://youtube.com/@kemafar',
    twitter: '',
    linkedin: '',
  },
  footerDescription:
    'Kami adalah wadah pengembangan mahasiswa farmasi yang berkomitmen mencetak profesional berintegritas dan berwawasan luas.',
};
