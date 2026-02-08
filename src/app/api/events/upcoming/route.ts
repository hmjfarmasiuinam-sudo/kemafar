import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/api/events';

// Revalidate setiap 2 menit untuk upcoming events
export const revalidate = 120;

export async function GET() {
  try {
    const events = await getUpcomingEvents(3);

    const response = NextResponse.json(events);

    // Cache untuk 2 menit dengan stale-while-revalidate 5 menit
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
