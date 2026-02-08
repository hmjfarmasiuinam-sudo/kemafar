import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedArticles, ArticleCategory } from '@/lib/api/articles';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category') as ArticleCategory | undefined;
    const search = searchParams.get('search') || undefined;

    // Validate page and limit
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page

    const result = await getPaginatedArticles(validPage, validLimit, category, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching paginated articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
