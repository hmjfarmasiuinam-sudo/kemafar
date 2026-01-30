/**
 * Form data types
 * Used in admin CRUD pages
 */

import { UserRole } from '@/lib/auth/AuthContext';
import type {
  MemberStatus,
  ArticleStatus,
  EventStatus,
} from '@/lib/constants/admin';

// User Forms
export interface UserFormData {
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
}

export interface CreateUserFormData extends UserFormData {
  password: string;
}

// Leadership Forms
export interface LeadershipFormData {
  name: string;
  position: string;
  division: string;
  photo: string;
  email: string;
  phone: string;
  nim: string;
  batch: string;
  bio: string;
  social_media_instagram: string;
  social_media_linkedin: string;
  social_media_twitter: string;
  period_start: string;
  period_end: string;
}

// Member Forms
export interface MemberFormData {
  name: string;
  nim: string;
  email: string;
  phone: string;
  photo: string;
  batch: string;
  status: MemberStatus;
  division: string;
  position: string;
  joined_at: string;
  graduated_at: string;
  bio: string;
  interests: string;
  achievements: string;
  social_media_instagram: string;
  social_media_linkedin: string;
  social_media_twitter: string;
}

// Article Forms
export interface ArticleFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  images: string[];
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info';
  tags: string;
  featured: boolean;
  status: ArticleStatus;
}

// Event Forms
export interface EventFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  category: 'seminar' | 'workshop' | 'community-service' | 'competition' | 'training' | 'other';
  location: string;
  location_type: string;
  location_address: string;
  location_maps_url: string;
  start_date: string;
  end_date: string;
  organizer_name: string;
  organizer_contact: string;
  registration_url: string;
  registration_deadline: string;
  max_participants: string;
  status: EventStatus;
  tags: string;
  featured: boolean;
}
