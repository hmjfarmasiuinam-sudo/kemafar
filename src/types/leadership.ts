/**
 * Leadership types
 * Used in admin panel and public pages
 */

export interface Leadership {
  id: string;
  name: string;
  position: 'ketua' | 'wakil-ketua' | 'sekretaris' | 'bendahara' | 'coordinator' | 'member';
  division: string | null;
  photo: string;
  email: string | null;
  phone: string | null;
  nim: string | null;
  batch: string | null;
  bio: string | null;
  social_media: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  period_start: string;
  period_end: string;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Leadership insert data type for creating new leadership records
 * Omits id, created_at, updated_at which are managed by the database
 */
export type LeadershipInsertData = Omit<Leadership, 'id' | 'created_at' | 'updated_at'>;

/**
 * Leadership update data type for updating existing leadership records
 * Omits id, created_at, updated_at which are managed by the database
 */
export type LeadershipUpdateData = Omit<Leadership, 'id' | 'created_at' | 'updated_at'>;
