import { IEventRepository } from '@/core/repositories/IEventRepository';
import { Event, EventListItem, EventStatus, EventCategory } from '@/core/entities/Event';
import { supabase } from '@/lib/supabase/client';
import { dbEventToEvent, dbEventToListItem } from '@/lib/supabase/type-mappers';

export class SupabaseEventRepository implements IEventRepository {
  async getAll(): Promise<EventListItem[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw new Error('Unable to load events. Please try again later.');
    }
  }

  async getBySlug(slug: string): Promise<Event | null> {
    try {
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

      return data ? dbEventToEvent(data) : null;
    } catch (error) {
      console.error('Failed to fetch event by slug:', error);
      throw new Error('Unable to load event. Please try again later.');
    }
  }

  async getByStatus(status: EventStatus): Promise<EventListItem[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', status)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching events by status:', error);
        throw new Error('Failed to fetch events by status');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch events by status:', error);
      throw new Error('Unable to load events. Please try again later.');
    }
  }

  async getByCategory(category: EventCategory): Promise<EventListItem[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('category', category)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching events by category:', error);
        throw new Error('Failed to fetch events by category');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch events by category:', error);
      throw new Error('Unable to load events. Please try again later.');
    }
  }

  async getUpcoming(limit?: number): Promise<EventListItem[]> {
    try {
      const now = new Date().toISOString();

      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', now)
        .order('start_date', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching upcoming events:', error);
        throw new Error('Failed to fetch upcoming events');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
      throw new Error('Unable to load upcoming events. Please try again later.');
    }
  }

  async getFeatured(limit?: number): Promise<EventListItem[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('featured', true)
        .order('start_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching featured events:', error);
        throw new Error('Failed to fetch featured events');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch featured events:', error);
      throw new Error('Unable to load featured events. Please try again later.');
    }
  }

  async getByDateRange(startDate: string, endDate: string): Promise<EventListItem[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', startDate)
        .lte('end_date', endDate)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events by date range:', error);
        throw new Error('Failed to fetch events by date range');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch events by date range:', error);
      throw new Error('Unable to load events. Please try again later.');
    }
  }

  async search(query: string): Promise<EventListItem[]> {
    try {
      const lowerQuery = query.toLowerCase();

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`title.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,content.ilike.%${lowerQuery}%`)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error searching events:', error);
        throw new Error('Failed to search events');
      }

      return data?.map(dbEventToListItem) ?? [];
    } catch (error) {
      console.error('Failed to search events:', error);
      throw new Error('Unable to search events. Please try again later.');
    }
  }
}
