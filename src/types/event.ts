/**
 * Event types
 * Used in admin panel and public pages
 */

/**
 * Event location structure stored as JSONB
 */
export interface EventLocation {
  type: 'online' | 'offline' | 'hybrid';
  address: string;
  mapUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Event organizer structure stored as JSONB
 */
export interface EventOrganizer {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string | null;
  category: 'seminar' | 'workshop' | 'community-service' | 'competition' | 'training' | 'other' | null;
  location: EventLocation | null;
  start_date: string;
  end_date: string;
  organizer: EventOrganizer | null;
  creator_id: string;
  registration_url: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[] | null;
  featured?: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}
