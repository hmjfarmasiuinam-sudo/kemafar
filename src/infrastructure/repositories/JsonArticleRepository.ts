/**
 * JSON Article Repository Implementation
 */

import { Article, ArticleListItem, ArticleCategory } from '@/core/entities/Article';
import { IArticleRepository } from '@/core/repositories/IArticleRepository';
import { SITE_CONFIG } from '@/lib/constants';

export class JsonArticleRepository implements IArticleRepository {
  private async fetchArticles(): Promise<Article[]> {
    // Use relative URL in browser, absolute URL during build
    const url = typeof window !== 'undefined'
      ? '/data/articles.json'
      : `${process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url}/data/articles.json`;

    const response = await fetch(url, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return response.json();
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
