/**
 * Article types
 * Used in admin panel and public pages
 */

import { User } from './user';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  author_id: string;
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info' | null;
  tags: string[] | null;
  status: 'draft' | 'pending' | 'published' | 'archived';
  featured?: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  author?: User;
}

export type ArticleUpdateData = Partial<Omit<Article, 'id' | 'created_at' | 'author'>>;
