'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Article as ArticleListItem } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config/domain.config';

interface ArticlesGridProps {
  articles: ArticleListItem[];
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-xl">Belum ada artikel tersedia</p>
      </div>
    );
  }

  // Calculate column span untuk setiap artikel agar tidak ada space kosong
  // Golden ratio inspired: 8:5 ≈ 1.6 (mendekati golden 1.618)
  const calculateColSpan = (index: number, remaining: number): number => {
    // Cek sisa artikel yang belum di-render
    const articlesLeft = articles.length - index;
    
    // Kalau sisa artikel cuma 1, ambil semua space yang tersisa
    if (articlesLeft === 1) return remaining;
    
    // Pattern golden ratio: 8, 4, 5, 7, 6, 6, 4, 4, 4
    // Tidak ada yang full 12 cols - semua berbagi layar
    const patterns = [8, 4, 5, 7, 6, 6, 4, 4, 4];
    const patternIndex = index % patterns.length;
    const idealSpan = patterns[patternIndex];
    
    // Kalau ideal span lebih besar dari remaining, ambil remaining saja
    if (idealSpan > remaining) return remaining;
    
    return idealSpan;
  };

  // Track remaining columns in current row
  let remainingCols = 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 lg:gap-4">
      {articles.map((article, index) => {
        // Reset to 12 if starting new row
        if (remainingCols === 0) {
          remainingCols = 12;
        }
        
        const colSpan = calculateColSpan(index, remainingCols);
        remainingCols -= colSpan;
        
        // Determine size category based on col span
        const isLarge = colSpan >= 7;
        const isMedium = colSpan >= 5 && colSpan < 7;

        return (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.1 }}
            transition={{
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`group relative ${
              colSpan === 8
                ? 'col-span-1 md:col-span-8'
                : colSpan === 7
                ? 'col-span-1 md:col-span-7'
                : colSpan === 6
                ? 'col-span-1 md:col-span-6'
                : colSpan === 5
                ? 'col-span-1 md:col-span-5'
                : 'col-span-1 md:col-span-4'
            }`}
          >
            <Link href={`/articles/${article.slug}`} className="block">
              {/* Image with overlay - no card container */}
              <div className={`relative overflow-hidden rounded-3xl ${
                isLarge
                  ? 'aspect-[4/3] md:aspect-[3/2]'
                  : isMedium
                  ? 'aspect-[4/3] md:aspect-[1/1]'
                  : 'aspect-[4/3] md:aspect-[3/4]'
              }`}>
                <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Category badge - minimal */}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-full shadow-lg inline-block">
                    {ARTICLE_CATEGORIES[article.category]}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
                  {/* Author */}
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    {article.author.avatar && (
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white/50"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {article.author.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/80">
                        <time>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id })}</time>
                        {article.views && <span>• {article.views} views</span>}
                      </div>
                    </div>
                  </div>

                  {/* Title - varying sizes */}
                  <h2 className={`font-bold text-white mb-3 line-clamp-2 ${
                    isLarge
                      ? 'text-lg md:text-2xl'
                      : isMedium
                      ? 'text-lg md:text-xl'
                      : 'text-lg md:text-base'
                  }`}>
                    {article.title}
                  </h2>

                  {/* Excerpt - only for large */}
                  {isLarge && (
                    <p className="hidden md:block text-white/90 line-clamp-2 mb-4 text-sm">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Tags - minimal */}
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.article>
        );
      })}</div>
  );
}
