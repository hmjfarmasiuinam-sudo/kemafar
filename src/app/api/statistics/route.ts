import { createServerSupabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/statistics
 * Returns dynamic statistics:
 * - activeMembers: Total members including alumni
 * - eventsCount: Total events
 * - divisionsCount: Unique divisions from members
 * - yearFounded: Earliest year from timeline
 */
export async function GET() {
  try {
    const supabase = createServerSupabase();

    // 1. Get total members (including alumni)
    const { count: membersCount, error: membersError } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });

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

    // 3. Get unique divisions from members
    const { data: divisionsData, error: divisionsError } = await supabase
      .from('members')
      .select('division')
      .not('division', 'is', null);

    if (divisionsError) {
      console.error('Error fetching divisions:', divisionsError);
    }

    const uniqueDivisions = divisionsData
      ? new Set(divisionsData.map((m: { division: string }) => m.division)).size
      : 0;

    // 4. Get earliest year from about_settings timeline
    const { data: aboutData, error: aboutError } = await supabase
      .from('about_settings')
      .select('timeline')
      .single();

    if (aboutError) {
      console.error('Error fetching about settings:', aboutError);
    }

    let yearFounded = 2015; // Default fallback
    const timelineData = aboutData as { timeline?: Array<{ year: string }> } | null;
    if (timelineData?.timeline && Array.isArray(timelineData.timeline)) {
      const years = timelineData.timeline
        .map((item) => parseInt(item.year))
        .filter((year: number) => !isNaN(year));

      if (years.length > 0) {
        yearFounded = Math.min(...years);
      }
    }

    return NextResponse.json({
      activeMembers: membersCount || 0,
      eventsCount: eventsCount || 0,
      divisionsCount: uniqueDivisions,
      yearFounded: yearFounded,
    });
  } catch (error) {
    console.error('Error in statistics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
