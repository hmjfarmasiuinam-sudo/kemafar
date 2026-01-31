/**
 * Members API - Auto-populated from expired Leadership records
 * Members are alumni who served in leadership positions
 */

import { supabase } from '@/lib/supabase/client';
import type { Member, PositionHistory, LeadershipRaw } from '@/types/member';

/**
 * Check if photo URL is valid
 */
function isValidPhotoUrl(url: string | null): boolean {
  if (!url) return false;
  if (url.includes('w3.org')) return false;
  if (url.trim() === '') return false;
  if (url.startsWith('data:image/svg+xml') && url.includes('fill="%23f3f4f6"')) return false;
  return true;
}

/**
 * Group expired leadership records by NIM
 * Returns members (alumni who served but term ended)
 */
async function groupLeadershipByNIM(records: LeadershipRaw[]): Promise<Member[]> {
  // Group by NIM
  const grouped = records.reduce((acc, record) => {
    const nim = record.nim!; // Already filtered for NOT NULL
    if (!acc[nim]) {
      acc[nim] = [];
    }
    acc[nim].push(record);
    return acc;
  }, {} as Record<string, LeadershipRaw[]>);

  // Transform each group into a Member
  return Object.entries(grouped).map(([nim, records]) => {
    // Sort by period_end DESC to get most recent first
    const sorted = records.sort((a, b) =>
      new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
    );

    // Get personal data from most recent record
    const latest = sorted[0];

    // Build position history from all records
    const positions: PositionHistory[] = sorted.map(r => ({
      position: r.position,
      division: r.division,
      periodStart: r.period_start,
      periodEnd: r.period_end,
    }));

    return {
      nim,
      name: latest.name,
      email: latest.email,
      phone: latest.phone,
      photo: isValidPhotoUrl(latest.photo) ? latest.photo : null,
      batch: latest.batch,
      bio: latest.bio,
      social_media: latest.social_media,
      positions,
      lastPeriodEnd: latest.period_end,
    };
  });
}

/**
 * Get all members (alumni from expired leadership)
 * Filters: period_end < today AND nim IS NOT NULL
 */
export async function getMembers(): Promise<Member[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .lt('period_end', today)        // Expired leadership
    .not('nim', 'is', null)          // Only records with NIM
    .order('period_end', { ascending: false });

  if (error) {
    console.error('Error fetching members:', error);
    throw new Error('Failed to fetch members');
  }

  const members = await groupLeadershipByNIM(data as LeadershipRaw[]);

  // Sort by most recent period_end DESC (newest alumni first)
  return members.sort((a, b) =>
    new Date(b.lastPeriodEnd).getTime() - new Date(a.lastPeriodEnd).getTime()
  );
}

/**
 * Get member by NIM
 */
export async function getMemberByNIM(nim: string): Promise<Member | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('nim', nim)
    .lt('period_end', today)
    .order('period_end', { ascending: false });

  if (error) {
    console.error('Error fetching member by NIM:', error);
    throw new Error('Failed to fetch member');
  }

  if (!data || data.length === 0) {
    return null;
  }

  const members = await groupLeadershipByNIM(data as LeadershipRaw[]);
  return members[0] || null;
}

/**
 * Get members by batch
 */
export async function getMembersByBatch(batch: string): Promise<Member[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('batch', batch)
    .lt('period_end', today)
    .not('nim', 'is', null)
    .order('period_end', { ascending: false });

  if (error) {
    console.error('Error fetching members by batch:', error);
    throw new Error('Failed to fetch members by batch');
  }

  return groupLeadershipByNIM(data as LeadershipRaw[]);
}

/**
 * Get members who served in a specific division
 */
export async function getMembersByDivision(division: string): Promise<Member[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('leadership')
    .select('*')
    .eq('division', division)
    .lt('period_end', today)
    .not('nim', 'is', null)
    .order('period_end', { ascending: false });

  if (error) {
    console.error('Error fetching members by division:', error);
    throw new Error('Failed to fetch members by division');
  }

  return groupLeadershipByNIM(data as LeadershipRaw[]);
}

/**
 * Get unique batches from members
 */
export async function getMemberBatches(): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error} = await supabase
    .from('leadership')
    .select('batch')
    .lt('period_end', today)
    .not('nim', 'is', null)
    .not('batch', 'is', null);

  if (error) {
    console.error('Error fetching member batches:', error);
    return [];
  }

  if (!data) return [];

  // Get unique batches and sort
  const batches = [...new Set(data.map((d: { batch: string | null }) => d.batch).filter((b): b is string => b !== null))];
  return batches.sort();
}
