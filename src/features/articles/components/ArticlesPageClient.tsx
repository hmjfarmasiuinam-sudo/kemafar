'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Article, ArticleCategory, PaginatedResult } from '@/lib/api/articles';
import { ARTICLE_CATEGORIES } from '@/config/domain.config';
import { ArticlesGrid } from './ArticlesGrid';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

function ArticlesSkeleton() {
  // Match actual grid structure untuk prevent CLS (Cumulative Layout Shift)
  const skeletonPattern = [8, 4, 5, 7, 6, 6, 4, 4, 4, 8];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 lg:gap-4">
      {skeletonPattern.map((colSpan, i) => (
        <div 
          key={i} 
          className={`relative bg-gray-200 rounded-2xl md:rounded-3xl animate-pulse col-span-1 md:col-span-${colSpan}`}
          style={{ 
            aspectRatio: colSpan >= 7 ? '3/2' : colSpan >= 5 ? '1/1' : '3/4',
            minHeight: '300px'
          }}
        />
      ))}
    </div>
  );
}

export function ArticlesPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [result, setResult] = useState<PaginatedResult<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const category = searchParams.get('category') as ArticleCategory | null;
  const search = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Handle search input with debounce - memoized untuk prevent re-creation
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      
      // Reset to page 1 when searching
      params.delete('page');
      
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    }, 500); // 500ms debounce
  }, [searchParams, router, pathname]);

  useEffect(() => {
    // AbortController untuk cancel previous requests
    const abortController = new AbortController();
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Scroll to content section smoothly - only on desktop to prevent lag on mobile
        if (contentRef.current && window.innerWidth >= 768) {
          contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
        });

        if (category) {
          params.append('category', category);
        }

        if (search) {
          params.append('search', search);
        }

        const response = await fetch(`/api/articles?${params}`, {
          signal: abortController.signal,
          // Leverage browser cache
          next: { revalidate: 60 }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        setResult(data);
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    
    // Cleanup: abort fetch on unmount or dependency change
    return () => {
      abortController.abort();
    };
  }, [category, search, currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Artikel
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed mb-8">
            Koleksi artikel, blog, opini, publikasi, dan informasi terbaru
          </p>
          
          {/* Search Input */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter - Segmented Control */}
      <SegmentedControl
        basePath="/articles"
        paramName="category"
        currentValue={category || undefined}
        allLabel="Semua"
        options={Object.entries(ARTICLE_CATEGORIES).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      {/* Articles Masonry Grid - Animated */}
      <section ref={contentRef} className="container-custom py-16">
        {loading ? (
          <ArticlesSkeleton />
        ) : result ? (
          <>
            {/* Results Count */}
            <p className="text-gray-600 mb-8">
              Menampilkan {result.items.length} dari {result.totalCount} artikel
            </p>

            <ArticlesGrid articles={result.items} />

            {/* Pagination */}
            <Pagination
              currentPage={result.currentPage}
              totalPages={result.totalPages}
              basePath="/articles"
              searchParams={{ category: category || undefined }}
            />
          </>
        ) : (
          <p className="text-center text-gray-500">Tidak ada artikel tersedia</p>
        )}
      </section>
    </div>
  );
}
