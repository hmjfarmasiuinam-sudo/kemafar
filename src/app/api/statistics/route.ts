import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Revalidate setiap 5 menit untuk statistics (data jarang berubah)
export const revalidate = 300;

/**
 * GET /api/statistics
 * Returns dynamic statistics:
 * - activeMembers: Total ACTIVE members (current period) from leadership table
 * - eventsCount: Total events
 * - divisionsCount: Unique positions from ACTIVE leadership members
 * - yearFounded: Earliest year from timeline
 */
export async function GET() {
  try {
    const supabase = createServerSupabase();

    // 1. Get total ACTIVE members from leadership table (current period only)
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { count: membersCount, error: membersError } = await supabase
      .from('leadership')
      .select('*', { count: 'exact', head: true })
      .lte('period_start', now)  // period started on or before today
      .gte('period_end', now);   // period ends on or after today

    if (membersError) {
      console.error('Error fetching members count:', membersError);
    }

    // 2. Get total events
    const { count: eventsCount, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (eventsError) {
      console.error('Error fetching events count:', eventsError);
    }

    // 3. Get unique positions from ACTIVE leadership (as divisions)
    const { data: divisionsData, error: divisionsError } = await supabase
      .from('leadership')
      .select('position')
      .lte('period_start', now)  // only active members
      .gte('period_end', now)
      .not('position', 'is', null);

    if (divisionsError) {
      console.error('Error fetching divisions:', divisionsError);
    }

    const uniqueDivisions = divisionsData
      ? new Set(divisionsData.map((m: { position: string }) => m.position)).size
      : 0;

    // 4. Get earliest year from organization_timeline table
    const { data: timelineData, error: timelineError } = await supabase
      .from('organization_timeline')
      .select('year')
      .order('year', { ascending: true })
      .limit(1)
      .maybeSingle() as { data: { year: string } | null; error: unknown };

    if (timelineError) {
      console.error('Error fetching timeline:', timelineError);
    }

    let yearFounded = 2015; // Default fallback
    if (timelineData?.year) {
      const year = parseInt(timelineData.year);
      if (!isNaN(year)) {
        yearFounded = year;
      }
    }

    const response = NextResponse.json({
      activeMembers: membersCount || 0,
      eventsCount: eventsCount || 0,
      divisionsCount: uniqueDivisions,
      yearFounded: yearFounded,
    });

    // Cache untuk 5 menit dengan stale-while-revalidate 10 menit
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('Error in statistics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
