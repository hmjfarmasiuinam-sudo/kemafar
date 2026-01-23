/**
 * Site Configuration
 *
 * Contains all site-specific information including:
 * - Site name, URL, and description
 * - Contact information (email, WhatsApp, address)
 * - Social media links
 *
 * @remarks
 * Values can be overridden via environment variables for deployment flexibility.
 * Change these values to customize the site for your organization.
 */

export const SITE_CONFIG = {
  /**
   * Site name shown in header and metadata
   * Override with NEXT_PUBLIC_SITE_NAME environment variable
   */
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'HMJF UIN Alauddin',

  /**
   * Full organization name for formal contexts
   */
  fullName: 'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',

  /**
   * Site URL - used for metadata and canonical URLs
   * Override with NEXT_PUBLIC_SITE_URL environment variable
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  /**
   * Site description for SEO and metadata
   */
  description:
    'Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar - Wadah organisasi mahasiswa farmasi untuk pengembangan akademik, soft skills, dan pengabdian masyarakat',

  /**
   * WhatsApp number for contact (include country code)
   * Override with NEXT_PUBLIC_WHATSAPP_NUMBER environment variable
   * Format: 62812xxxxxxxx (no + or spaces)
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',

  /**
   * Organization email address
   */
  email: 'hmjf@uin-alauddin.ac.id',

  /**
   * Instagram handle (with @)
   */
  instagram: '@hmjf.uinalauddin',

  /**
   * Physical address of the organization
   */
  address: 'Jl. H.M. Yasin Limpo No. 36, Romangpolong, Gowa, Sulawesi Selatan',
} as const;
