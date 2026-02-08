import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import type { AuthorJson } from '@/types/database-json';

// Revalidate setiap 60 detik untuk featured articles
export const revalidate = 60;

type Article = Database['public']['Tables']['articles']['Row'];

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: articles, error } = await supabase
      .from('articles')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5) as { data: Article[] | null; error: unknown };

    if (error) {
      throw error;
    }

    if (!articles) {
      return NextResponse.json([]);
    }

    // Transform raw data to match frontend expectations (handling camelCase)
    const transformedArticles = articles.map(raw => {
      const author = raw.author as unknown as AuthorJson;

      return {
        id: raw.id,
        title: raw.title,
        slug: raw.slug,
        excerpt: raw.excerpt,
        content: raw.content,
        category: raw.category,
        coverImage: raw.cover_image,
        tags: raw.tags || [],
        featured: raw.featured,
        status: raw.status,
        author: {
          name: author?.name || 'Unknown',
          role: author?.email || '',
          avatar: undefined,
        },
        publishedAt: raw.published_at,
        updatedAt: raw.updated_at,
      };
    });

    const response = NextResponse.json(transformedArticles);

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured articles' },
      { status: 500 }
    );
  }
}
