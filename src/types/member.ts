/**
 * Member types - Auto-populated from expired Leadership records
 * Members are alumni who served in leadership but whose term has ended
 */

/**
 * Position history for a member
 * Represents one leadership term they held
 */
export interface PositionHistory {
  position: string;
  division: string | null;
  periodStart: string; // ISO date string
  periodEnd: string; // ISO date string
}

/**
 * Social media links structure (same as Leadership)
 */
export interface MemberSocialMedia {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

/**
 * Member - Alumni who served in leadership
 * Auto-populated by grouping expired leadership records by NIM
 */
export interface Member {
  nim: string; // Primary grouping key (NOT NULL)
  name: string; // From most recent record
  email: string | null; // From most recent record
  phone: string | null; // From most recent record
  photo: string | null; // From most recent record
  batch: string | null; // From most recent record
  bio: string | null; // From most recent record
  social_media: MemberSocialMedia | null; // From most recent record
  positions: PositionHistory[]; // All positions held (ordered by period_end DESC)
  lastPeriodEnd: string; // Most recent period_end (for sorting)
}

/**
 * Raw database row from leadership table (internal use)
 */
export interface LeadershipRaw {
  id: string;
  name: string;
  position: string;
  division: string | null;
  photo: string;
  email: string | null;
  phone: string | null;
  nim: string | null;
  batch: string | null;
  bio: string | null;
  social_media: MemberSocialMedia | null;
  period_start: string;
  period_end: string;
  order: number;
}
