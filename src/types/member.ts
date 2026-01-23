/**
 * Member types
 * Used in admin panel and public pages
 */

/**
 * Member interests structure stored as JSONB
 * Can be either array of strings or structured object
 */
export type MemberInterests = string[] | {
  categories?: string[];
  skills?: string[];
  topics?: string[];
};

/**
 * Member achievements structure stored as JSONB
 * Can be either array of strings or structured objects
 */
export type MemberAchievements = string[] | Array<{
  title: string;
  date?: string;
  description?: string;
  category?: string;
}>;

/**
 * Member social media links stored as JSONB
 */
export interface MemberSocialMedia {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface Member {
  id: string;
  name: string;
  nim: string;
  email: string;
  phone: string | null;
  photo: string | null;
  batch: string;
  status: 'active' | 'inactive' | 'alumni';
  division: string | null;
  position: string | null;
  joined_at: string | null;
  graduated_at: string | null;
  bio: string | null;
  interests: MemberInterests | null;
  achievements: MemberAchievements | null;
  social_media: MemberSocialMedia | null;
  created_at: string;
  updated_at: string;
}

/**
 * Member update data type
 * Omits id, created_at, updated_at which are managed by the database
 */
export type MemberUpdateData = Omit<Member, 'id' | 'created_at' | 'updated_at'>;
