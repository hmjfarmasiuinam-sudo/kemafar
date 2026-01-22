/**
 * Article Repository Interface
 */

import { Article, ArticleListItem, ArticleCategory } from '../entities/Article';

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IArticleRepository {
  /**
   * Get all articles
   */
  getAll(): Promise<ArticleListItem[]>;

  /**
   * Get articles by category
   */
  getByCategory(category: ArticleCategory): Promise<ArticleListItem[]>;

  /**
   * Get paginated articles with optional category filter
   */
  getPaginated(
    page: number,
    limit: number,
    category?: ArticleCategory
  ): Promise<PaginatedResult<ArticleListItem>>;

  /**
   * Get featured articles
   */
  getFeatured(limit?: number): Promise<ArticleListItem[]>;

  /**
   * Get article by slug
   */
  getBySlug(slug: string): Promise<Article | null>;

  /**
   * Get recent articles
   */
  getRecent(limit?: number): Promise<ArticleListItem[]>;

  /**
   * Search articles by query
   */
  search(query: string): Promise<ArticleListItem[]>;
}
