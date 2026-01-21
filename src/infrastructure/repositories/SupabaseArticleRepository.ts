import { IArticleRepository } from '@/core/repositories/IArticleRepository';
import { Article, ArticleListItem, ArticleCategory } from '@/core/entities/Article';
import { supabase } from '@/lib/supabase/client';
import { dbArticleToArticle, dbArticleToListItem } from '@/lib/supabase/type-mappers';

export class SupabaseArticleRepository implements IArticleRepository {
  async getAll(): Promise<ArticleListItem[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw new Error('Unable to load articles. Please try again later.');
    }
  }

  async getBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching article by slug:', error);
        throw new Error('Failed to fetch article');
      }

      return data ? dbArticleToArticle(data) : null;
    } catch (error) {
      console.error('Failed to fetch article by slug:', error);
      throw new Error('Unable to load article. Please try again later.');
    }
  }

  async getByCategory(category: ArticleCategory): Promise<ArticleListItem[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles by category:', error);
        throw new Error('Failed to fetch articles by category');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch articles by category:', error);
      throw new Error('Unable to load articles. Please try again later.');
    }
  }

  async getFeatured(limit?: number): Promise<ArticleListItem[]> {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .eq('featured', true)
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching featured articles:', error);
        throw new Error('Failed to fetch featured articles');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch featured articles:', error);
      throw new Error('Unable to load featured articles. Please try again later.');
    }
  }

  async getRecent(limit: number = 5): Promise<ArticleListItem[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent articles:', error);
        throw new Error('Failed to fetch recent articles');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch recent articles:', error);
      throw new Error('Unable to load recent articles. Please try again later.');
    }
  }

  async getRelated(articleId: string, limit: number = 3): Promise<ArticleListItem[]> {
    try {
      // First, get the current article to get its category and tags
      const { data: currentArticle, error: currentError } = await supabase
        .from('articles')
        .select('category, tags')
        .eq('id', articleId)
        .single();

      if (currentError || !currentArticle) {
        console.error('Error fetching current article:', currentError);
        // Return empty array if we can't find the current article
        return [];
      }

      // Get articles with the same category, excluding the current article
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', (currentArticle as { category: string }).category)
        .neq('id', articleId)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching related articles:', error);
        throw new Error('Failed to fetch related articles');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
      throw new Error('Unable to load related articles. Please try again later.');
    }
  }

  async search(query: string): Promise<ArticleListItem[]> {
    try {
      const lowerQuery = query.toLowerCase();

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${lowerQuery}%,excerpt.ilike.%${lowerQuery}%,content.ilike.%${lowerQuery}%`)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error searching articles:', error);
        throw new Error('Failed to search articles');
      }

      return data?.map(dbArticleToListItem) ?? [];
    } catch (error) {
      console.error('Failed to search articles:', error);
      throw new Error('Unable to search articles. Please try again later.');
    }
  }
}
