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
    'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar - Organisasi mahasiswa yang bergerak di bidang kefarmasian, kesehatan, dan pengembangan kompetensi mahasiswa farmasi',

  /** WhatsApp number for contact (format: 62812xxxxxxxx) */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',

  /** Organization email address */
  email: 'contact@example.com',

  /** Instagram handle (with @) */
  instagram: '@yourorganization',

  /** Physical address of the organization */
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
} as const;
