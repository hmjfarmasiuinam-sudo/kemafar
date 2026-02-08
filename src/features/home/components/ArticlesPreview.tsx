'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Eye, BookOpen, Newspaper, MessageSquare, FileText, Info } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { Article as ArticleListItem } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config/domain.config';

// Icon mapping untuk setiap kategori
const CATEGORY_ICONS = {
  article: BookOpen,
  blog: Newspaper,
  opinion: MessageSquare,
  publication: FileText,
  info: Info,
} as const;

function ArticlesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Featured skeleton */}
      <div className="md:col-span-8 md:row-span-2">
        <div className="relative aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
      </div>
      {/* Regular skeletons */}
      <div className="md:col-span-4">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-3xl animate-pulse" />
      </div>
      <div className="md:col-span-4">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-3xl animate-pulse" />
      </div>
      <div className="md:col-span-6">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-3xl animate-pulse" />
      </div>
      <div className="md:col-span-6">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function ArticlesPreview() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Header - Bold & Asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Artikel <span className="text-primary-600">Terbaru</span>
            </h2>
            <p className="text-xl text-gray-600">Artikel dan insight terbaru</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Link
              href="/articles"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {loading ? (
          <ArticlesSkeleton />
        ) : (
          /* Bento Grid - Balanced Pattern */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {articles.map((article, index) => {
              // Better bento grid pattern: Featured (7 cols, 2 rows), Small (5 cols), then 3x Medium (4 cols each)
              const gridClass =
                index === 0 ? 'md:col-span-7 md:row-span-2' :
                  index === 1 ? 'md:col-span-5 md:row-span-2' :
                    'md:col-span-4';

              const isFeatured = index === 0;
              const isLarge = index === 0 || index === 1;

              // Get icon untuk kategori
              const CategoryIcon = CATEGORY_ICONS[article.category as keyof typeof CATEGORY_ICONS] || BookOpen;

              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className={`group relative ${gridClass}`}
                >
                  {/* Image with duotone effect */}
                  <div className={`relative overflow-hidden rounded-3xl ${isFeatured ? 'aspect-[4/5]' : isLarge ? 'aspect-[3/4]' : 'aspect-[16/10]'}`}>
                    {/* Background Image - tidak full grayscale */}
                    <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Color overlay KUAT seperti referensi - warna biru sangat jenuh */}
                    <div className="absolute inset-0 bg-primary-500 mix-blend-multiply" />

                    {/* Layer untuk saturasi warna lebih tinggi */}
                    <div className="absolute inset-0 bg-primary-400 mix-blend-color" />

                    {/* Layer tambahan untuk brightness */}
                    <div className="absolute inset-0 bg-primary-500/40 mix-blend-screen" />

                    {/* Content - Centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 text-center">
                      {/* Icon - Large & Bold */}
                      <div className="mb-4 md:mb-6 transform transition-transform duration-300 group-hover:scale-110">
                        <CategoryIcon className="text-white w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                      </div>

                      {/* Title - Ukuran font KONSISTEN */}
                      <h3 className="font-bold text-white text-xl md:text-2xl leading-tight px-4 line-clamp-3">
                        {article.title}
                      </h3>
                    </div>

                    {/* Category badge - top */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-bold rounded-full">
                        {ARTICLE_CATEGORIES[article.category]}
                      </span>
                    </div>

                    {/* Metadata - bottom */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <time>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}</time>
                      </div>
                      {article.views && (
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{article.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
