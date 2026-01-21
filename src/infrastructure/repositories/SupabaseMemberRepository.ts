import { IMemberRepository } from '@/core/repositories/IMemberRepository';
import { Member, MemberListItem, MemberStatus } from '@/core/entities/Member';
import { supabase } from '@/lib/supabase/client';
import { dbMemberToMember, dbMemberToListItem } from '@/lib/supabase/type-mappers';

export class SupabaseMemberRepository implements IMemberRepository {
  async getAll(): Promise<MemberListItem[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching members:', error);
        throw new Error('Failed to fetch members');
      }

      return data?.map(dbMemberToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch members:', error);
      throw new Error('Unable to load members. Please try again later.');
    }
  }

  async getByStatus(status: MemberStatus): Promise<MemberListItem[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', status)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching members by status:', error);
        throw new Error('Failed to fetch members by status');
      }

      return data?.map(dbMemberToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch members by status:', error);
      throw new Error('Unable to load members. Please try again later.');
    }
  }

  async getByBatch(batch: string): Promise<MemberListItem[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('batch', batch)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching members by batch:', error);
        throw new Error('Failed to fetch members by batch');
      }

      return data?.map(dbMemberToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch members by batch:', error);
      throw new Error('Unable to load members. Please try again later.');
    }
  }

  async getByDivision(division: string): Promise<MemberListItem[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('division', division)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching members by division:', error);
        throw new Error('Failed to fetch members by division');
      }

      return data?.map(dbMemberToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch members by division:', error);
      throw new Error('Unable to load members. Please try again later.');
    }
  }

  async getById(id: string): Promise<Member | null> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // PGRST116 is the "not found" error code in PostgREST (Supabase)
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching member:', error);
        throw new Error('Failed to fetch member');
      }

      return data ? dbMemberToMember(data) : null;
    } catch (error) {
      console.error('Failed to fetch member:', error);
      throw new Error('Unable to load member. Please try again later.');
    }
  }

  async search(query: string): Promise<MemberListItem[]> {
    try {
      const lowerQuery = query.toLowerCase();

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`name.ilike.%${lowerQuery}%,nim.ilike.%${lowerQuery}%,batch.ilike.%${lowerQuery}%`)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error searching members:', error);
        throw new Error('Failed to search members');
      }

      return data?.map(dbMemberToListItem) ?? [];
    } catch (error) {
      console.error('Failed to search members:', error);
      throw new Error('Unable to search members. Please try again later.');
    }
  }

  async getAllBatches(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('batch')
        .order('batch', { ascending: false });

      if (error) {
        console.error('Error fetching batches:', error);
        throw new Error('Failed to fetch batches');
      }

      // Extract unique batches
      const uniqueBatches = [...new Set(data?.map(item => (item as { batch: string }).batch) ?? [])];
      return uniqueBatches;
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      throw new Error('Unable to load batches. Please try again later.');
    }
  }
}
