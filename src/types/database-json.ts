/**
 * Types for JSON fields in database
 * These represent the structure of JSON columns in Supabase tables
 */

/**
 * Author JSON structure stored in articles table
 */
export interface AuthorJson {
  name: string;
  email: string;
}

/**
 * Organizer JSON structure stored in events table
 */
export interface OrganizerJson {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Location JSON structure stored in events table
 */
export interface LocationJson {
  name: string;
  address: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Social Media JSON structure stored in members/leadership tables
 */
export interface SocialMediaJson {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}
