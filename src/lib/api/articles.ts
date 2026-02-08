/**
 * Articles API - Simplified data fetching without repository pattern
 *
 * Direct Supabase queries with proper error handling.
 * Uses database types directly (no conversion needed).
 */

import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Article category type matching database enum
 */
export type ArticleCategory = 'post' | 'blog' | 'opinion' | 'publication' | 'info';

/**
 * Article status type matching database enum
 */
export type ArticleStatus = 'draft' | 'pending' | 'published' | 'archived';

/**
 * Article from database (raw snake_case data)
 */
interface ArticleRaw {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  cover_image: string;
  images: string[] | null;
  tags: string[];
  featured: boolean;
  status: ArticleStatus;
  author_id: string;
  author: {
    name: string;
    email: string;
  };
  published_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Article with camelCase fields (for frontend compatibility)
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  coverImage: string;
  images: string[];
  tags: string[];
  featured: boolean;
  status: ArticleStatus;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  views?: number;
}

/**
 * Transform raw database article to frontend format
 */
function transformArticle(raw: ArticleRaw): Article {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    content: raw.content,
    category: raw.category,
    coverImage: raw.cover_image,
    images: raw.images || [],
    tags: raw.tags || [],
    featured: raw.featured,
    status: raw.status,
    author: {
      name: raw.author?.name || 'Unknown',
      role: raw.author?.email || '',
      avatar: undefined,
    },
    publishedAt: raw.published_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Pagination result wrapper
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Get all published articles
 */
export async function getArticles(): Promise<Article[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }

  return (data || []).map(transformArticle);
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching article by slug:', error);
    throw new Error('Failed to fetch article');
  }

  return data ? transformArticle(data) : null;
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles by category:', error);
    throw new Error('Failed to fetch articles by category');
  }

  return (data || []).map(transformArticle);
}

/**
 * Get paginated articles
 */
export async function getPaginatedArticles(
  page: number,
  limit: number,
  category?: ArticleCategory,
  search?: string
): Promise<PaginatedResult<Article>> {
  const supabase = createServerSupabase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    const lowerQuery = search.toLowerCase();
    query = query.or(`title.ilike.%${lowerQuery}%,excerpt.ilike.%${lowerQuery}%,content.ilike.%${lowerQuery}%`);
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error('Error fetching paginated articles:', error);
    throw new Error('Failed to fetch articles');
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    items: (data || []).map(transformArticle),
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured articles:', error);
    throw new Error('Failed to fetch featured articles');
  }

  return (data || []).map(transformArticle);
}

/**
 * Get recent articles
 */
export async function getRecentArticles(limit: number = 5): Promise<Article[]> {
  const supabase = createServerSupabase();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent articles:', error);
    throw new Error('Failed to fetch recent articles');
  }

  return (data || []).map(transformArticle);
}

/**
 * Get related articles based on category
 */
export async function getRelatedArticles(articleId: string, limit: number = 3): Promise<Article[]> {
  const supabase = createServerSupabase();
  
  // First, get the current article's category
  const { data: currentArticle, error: currentError } = await supabase
    .from('articles')
    .select('category')
    .eq('id', articleId)
    .single();

  if (currentError || !currentArticle) {
    console.error('Error fetching current article:', currentError);
    return [];
  }

  // Get articles with same category, excluding current article
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', (currentArticle as { category: ArticleCategory }).category)
    .eq('status', 'published')
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }

  return (data || []).map(transformArticle);
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const supabase = createServerSupabase();
  const lowerQuery = query.toLowerCase();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.%${lowerQuery}%,excerpt.ilike.%${lowerQuery}%,content.ilike.%${lowerQuery}%`)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error searching articles:', error);
    throw new Error('Failed to search articles');
  }

  return (data || []).map(transformArticle);
}
