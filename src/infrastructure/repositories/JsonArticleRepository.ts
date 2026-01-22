/**
 * JSON Article Repository Implementation
 */

import { Article, ArticleListItem, ArticleCategory } from '@/core/entities/Article';
import { IArticleRepository, PaginatedResult } from '@/core/repositories/IArticleRepository';
import articlesData from '../../../public/data/articles.json';

export class JsonArticleRepository implements IArticleRepository {
  private async fetchArticles(): Promise<Article[]> {
    return articlesData as Article[];
  }

  async getAll(): Promise<ArticleListItem[]> {
    const articles = await this.fetchArticles();
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(this.toListItem);
  }

  async getByCategory(category: ArticleCategory): Promise<ArticleListItem[]> {
    const articles = await this.fetchArticles();
    return articles
      .filter((article) => article.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(this.toListItem);
  }

  async getPaginated(
    page: number,
    limit: number,
    category?: ArticleCategory
  ): Promise<PaginatedResult<ArticleListItem>> {
    const articles = await this.fetchArticles();

    let filtered = articles;
    if (category) {
      filtered = articles.filter((article) => article.category === category);
    }

    const sorted = filtered.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const totalCount = sorted.length;
    const totalPages = Math.ceil(totalCount / limit);
    const from = (page - 1) * limit;
    const paginated = sorted.slice(from, from + limit);

    return {
      items: paginated.map(this.toListItem),
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async getFeatured(limit: number = 3): Promise<ArticleListItem[]> {
    const articles = await this.fetchArticles();
    return articles
      .filter((article) => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
      .map(this.toListItem);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const articles = await this.fetchArticles();
    return articles.find((article) => article.slug === slug) || null;
  }

  async getRecent(limit: number = 6): Promise<ArticleListItem[]> {
    const articles = await this.fetchArticles();
    return articles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
      .map(this.toListItem);
  }

  async search(query: string): Promise<ArticleListItem[]> {
    const articles = await this.fetchArticles();
    const lowerQuery = query.toLowerCase();
    return articles
      .filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(this.toListItem);
  }

  private toListItem(article: Article): ArticleListItem {
    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      tags: article.tags,
      featured: article.featured,
      views: article.views,
    };
  }
}

