/**
 * Events API - Simplified data fetching
 */

import { supabase } from '@/lib/supabase/client';

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory = 'seminar' | 'workshop' | 'community-service' | 'competition' | 'training' | 'other';

/**
 * Event from database (raw snake_case)
 */
interface EventRaw {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: EventCategory;
  cover_image: string;
  location: any; // JSONB - could be object or string
  start_date: string;
  end_date: string;
  registration_url: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number | null;
  organizer: any; // JSONB - could be object or string
  creator_id: string | null;
  status: EventStatus;
  tags: string[];
  images: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Event with camelCase fields (for frontend)
 */
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: EventCategory;
  coverImage: string;
  location: {
    name: string;
    address: string;
  };
  startDate: string;
  endDate: string;
  registrationUrl?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  organizer: {
    name: string;
    contact: string;
  };
  status: EventStatus;
  tags: string[];
  images?: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform raw database event to frontend format
 */
function transformEvent(raw: EventRaw): Event {
  // Parse location - Supabase returns JSONB as object, but handle legacy string format
  let locationData = { name: '', address: '' };
  if (typeof raw.location === 'object' && raw.location !== null) {
    // Already an object from JSONB
    locationData = {
      name: raw.location.name || '',
      address: raw.location.address || raw.location.city || '',
    };
  } else if (typeof raw.location === 'string') {
    // Legacy string format
    try {
      if (raw.location.startsWith('{')) {
        locationData = JSON.parse(raw.location);
      } else {
        locationData = { name: raw.location, address: '' };
      }
    } catch {
      locationData = { name: raw.location, address: '' };
    }
  }

  // Parse organizer - Supabase returns JSONB as object
  let organizerData = { name: 'HMJF', contact: '' };
  if (typeof raw.organizer === 'object' && raw.organizer !== null) {
    organizerData = {
      name: raw.organizer.name || 'HMJF',
      contact: raw.organizer.contact || '',
    };
  } else if (typeof raw.organizer === 'string') {
    // Legacy format - shouldn't happen but handle it
    organizerData = { name: raw.organizer, contact: '' };
  }

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    content: raw.content,
    category: raw.category,
    coverImage: raw.cover_image,
    location: locationData,
    startDate: raw.start_date,
    endDate: raw.end_date,
    registrationUrl: raw.registration_url || undefined,
    registrationDeadline: raw.registration_deadline || undefined,
    maxParticipants: raw.max_participants || undefined,
    currentParticipants: raw.current_participants || undefined,
    organizer: organizerData,
    status: raw.status,
    tags: raw.tags || [],
    images: raw.images || undefined,
    featured: raw.featured,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Get all events
 */
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }

  return (data || []).map(transformEvent);
}

/**
 * Get event by slug
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching event by slug:', error);
    throw new Error('Failed to fetch event');
  }

  return data ? transformEvent(data) : null;
}

/**
 * Get events by status
 */
export async function getEventsByStatus(status: EventStatus): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching events by status:', error);
    throw new Error('Failed to fetch events by status');
  }

  return (data || []).map(transformEvent);
}

/**
 * Get events by category
 */
export async function getEventsByCategory(category: EventCategory): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('category', category)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching events by category:', error);
    throw new Error('Failed to fetch events by category');
  }

  return (data || []).map(transformEvent);
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }

  return (data || []).map(transformEvent);
}

/**
 * Get recent events
 */
export async function getRecentEvents(limit: number = 6): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent events:', error);
    throw new Error('Failed to fetch recent events');
  }

  return (data || []).map(transformEvent);
}
