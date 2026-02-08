'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Article as ArticleListItem } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config/domain.config';
import {
  BookOpen,
  Newspaper,
  MessageSquare,
  FileText,
  Info,
  Calendar,
  Eye
} from 'lucide-react';

interface ArticlesGridProps {
  articles: ArticleListItem[];
}

// Icon mapping untuk setiap kategori
const CATEGORY_ICONS = {
  article: BookOpen,
  blog: Newspaper,
  opinion: MessageSquare,
  publication: FileText,
  info: Info,
} as const;

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

        // Get icon untuk kategori
        const CategoryIcon = CATEGORY_ICONS[article.category as keyof typeof CATEGORY_ICONS] || BookOpen;

        return (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px", amount: 0.1 }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
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
              {/* Image with duotone effect */}
              <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl ${
                isLarge
                  ? 'aspect-[4/3] md:aspect-[3/2]'
                  : isMedium
                  ? 'aspect-[4/3] md:aspect-[1/1]'
                  : 'aspect-[4/3] md:aspect-[3/4]'
              }`}>
                {/* Background Image - optimized */}
                <div className="w-full h-full md:transition-transform md:duration-300 md:group-hover:scale-105">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                  />
                </div>

                {/* Color overlay KUAT - warna biru jenuh */}
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
                  <h2 className="font-bold text-white text-lg md:text-2xl leading-tight px-2 md:px-4 line-clamp-3">
                    {article.title}
                  </h2>
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
          </motion.article>
        );
      })}</div>
  );
}
