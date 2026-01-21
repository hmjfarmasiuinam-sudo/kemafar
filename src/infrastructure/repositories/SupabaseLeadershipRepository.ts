import { ILeadershipRepository } from '@/core/repositories/ILeadershipRepository';
import { Leadership, LeadershipListItem, LeadershipPosition, Division } from '@/core/entities/Leadership';
import { supabase } from '@/lib/supabase/client';
import { dbLeadershipToLeadership, dbLeadershipToListItem } from '@/lib/supabase/type-mappers';

export class SupabaseLeadershipRepository implements ILeadershipRepository {
  async getAll(): Promise<LeadershipListItem[]> {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching leadership:', error);
        throw new Error('Failed to fetch leadership');
      }

      return data?.map(dbLeadershipToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch leadership:', error);
      throw new Error('Unable to load leadership. Please try again later.');
    }
  }

  async getById(id: string): Promise<Leadership | null> {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching leadership by id:', error);
        throw new Error('Failed to fetch leadership');
      }

      return data ? dbLeadershipToLeadership(data) : null;
    } catch (error) {
      console.error('Failed to fetch leadership by id:', error);
      throw new Error('Unable to load leadership. Please try again later.');
    }
  }

  async getByPosition(position: LeadershipPosition): Promise<LeadershipListItem[]> {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .eq('position', position)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching leadership by position:', error);
        throw new Error('Failed to fetch leadership by position');
      }

      return data?.map(dbLeadershipToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch leadership by position:', error);
      throw new Error('Unable to load leadership. Please try again later.');
    }
  }

  async getByDivision(division: Division): Promise<LeadershipListItem[]> {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .eq('division', division)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching leadership by division:', error);
        throw new Error('Failed to fetch leadership by division');
      }

      return data?.map(dbLeadershipToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch leadership by division:', error);
      throw new Error('Unable to load leadership. Please try again later.');
    }
  }

  async getCore(): Promise<LeadershipListItem[]> {
    try {
      const corePositions: LeadershipPosition[] = ['ketua', 'wakil-ketua', 'sekretaris', 'bendahara'];

      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .in('position', corePositions)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching core team:', error);
        throw new Error('Failed to fetch core team');
      }

      return data?.map(dbLeadershipToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch core team:', error);
      throw new Error('Unable to load core team. Please try again later.');
    }
  }

  async getCurrentPeriod(): Promise<LeadershipListItem[]> {
    try {
      const now = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .lte('period_start', now)
        .gte('period_end', now)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching current leadership:', error);
        throw new Error('Failed to fetch current leadership');
      }

      return data?.map(dbLeadershipToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch current leadership:', error);
      throw new Error('Unable to load current leadership. Please try again later.');
    }
  }
}
