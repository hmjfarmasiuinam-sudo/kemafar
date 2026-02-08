'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Eye, BookOpen, Newspaper, MessageSquare, FileText, Info } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      {/* Featured skeleton */}
      <div className="md:col-span-8 md:row-span-2">
        <div className="relative aspect-[4/5] bg-gray-200 rounded-2xl md:rounded-3xl animate-pulse" />
      </div>
      {/* Regular skeletons - only show 2 more on mobile */}
      <div className="md:col-span-4">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-2xl md:rounded-3xl animate-pulse" />
      </div>
      <div className="md:col-span-4">
        <div className="relative aspect-[16/10] bg-gray-200 rounded-2xl md:rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

// Lightweight animation variants for smooth scroll
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

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
        // Limit to 3 articles on mobile for better performance
        setArticles(data.slice(0, 3));
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
          /* Bento Grid - Simplified for mobile with smooth animations */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px", amount: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
          >
            {articles.map((article, index) => {
              // Simplified grid: 3 columns on mobile, bento on desktop
              const gridClass = index === 0
                ? 'md:col-span-8 md:row-span-2'
                : 'md:col-span-4';

              const isFeatured = index === 0;

              // Get icon untuk kategori (lazy load icons)
              const CategoryIcon = CATEGORY_ICONS[article.category as keyof typeof CATEGORY_ICONS] || BookOpen;

              return (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  className={`${gridClass}`}
                  style={{
                    willChange: 'auto',
                    contentVisibility: 'auto',
                    containIntrinsicSize: 'auto 500px'
                  }}
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group relative block"
                  >
                    {/* Image with duotone effect */}
                    <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${isFeatured ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}
                      style={{ transform: 'translateZ(0)' }}
                    >
                      {/* Background Image - optimized */}
                      <div className="w-full h-full md:transition-transform md:duration-500 md:ease-out md:group-hover:scale-105">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                          className="object-cover"
                          priority={index === 0}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          quality={index === 0 ? 85 : 75}
                        />
                      </div>

                    {/* Color overlay - warna biru jenuh */}
                    <div className="absolute inset-0 bg-primary-600 mix-blend-multiply" />

                    {/* Layer untuk saturasi warna lebih tinggi */}
                    <div className="absolute inset-0 bg-primary-600 mix-blend-color" />

                    {/* Content - Centered - optimized */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 text-center">
                      {/* Icon - responsive size */}
                      <div className="mb-3 md:mb-6 md:transform md:transition-transform md:duration-300 md:group-hover:scale-110">
                        <CategoryIcon className="text-white w-10 h-10 md:w-16 md:h-16" strokeWidth={1.5} />
                      </div>

                      {/* Title - optimized font size */}
                      <h3 className="font-bold text-white text-lg md:text-2xl leading-tight px-2 md:px-4 line-clamp-3">
                        {article.title}
                      </h3>
                    </div>

                    {/* Category badge - top */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-bold rounded-full">
                        {ARTICLE_CATEGORIES[article.category]}
                      </span>
                    </div>

                    {/* Metadata - bottom - simplified on mobile */}
                    <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 flex items-center justify-between text-white/90 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <time className="text-[10px] md:text-xs">{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}</time>
                      </div>
                      {article.views && (
                        <div className="hidden sm:flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{article.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
