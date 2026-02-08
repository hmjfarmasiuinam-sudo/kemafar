import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedEvents, EventCategory } from '@/lib/api/events';

// Revalidate setiap 2 menit untuk events list
export const revalidate = 120;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category') as EventCategory | undefined;

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page

    const result = await getPaginatedEvents(validPage, validLimit, category);

    const response = NextResponse.json(result);

    // Cache untuk 2 menit dengan stale-while-revalidate 5 menit
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');

    return response;
  } catch (error) {
    console.error('Error fetching paginated events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
