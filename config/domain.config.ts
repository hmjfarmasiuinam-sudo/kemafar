/**
 * Domain Configuration
 *
 * Contains domain-specific categories and classifications:
 * - Article categories (blog, opinion, publication, etc.)
 * - Event categories (seminar, workshop, etc.)
 * - Organization divisions
 * - Gallery categories
 *
 * @remarks
 * These are the easiest values to customize when adapting this starterkit.
 * Simply modify the keys and labels to match your organization's structure.
 *
 * @example
 * ```typescript
 * // Change article categories for a different use case:
 * export const ARTICLE_CATEGORIES = {
 *   news: 'News',
 *   tutorial: 'Tutorial',
 *   announcement: 'Announcement',
 * } as const;
 * ```
 */

/**
 * Article Categories
 *
 * Used for categorizing blog posts and articles.
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
 *
 * Used for categorizing events and activities.
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
 *
 * Represents the structural divisions within the organization.
 * Used for member categorization and organizational charts.
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
 *
 * Used for organizing photos and media in the gallery.
 * Keys are used in URLs and database, values are displayed to users.
 */
export const GALLERY_CATEGORIES = {
  activities: 'Aktivitas',
  events: 'Event',
  facilities: 'Fasilitas',
  organization: 'Organisasi',
} as const;
