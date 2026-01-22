import { Metadata } from 'next';
import { z } from 'zod';
import { RepositoryFactory } from '@/infrastructure/repositories/RepositoryFactory';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { ArticlesGrid } from '@/features/articles/components/ArticlesGrid';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { ArticleCategory } from '@/core/entities/Article';

// Zod schema for validating article category query parameter
const ArticleCategorySchema = z.enum(['post', 'blog', 'opinion', 'publication', 'info']);

export const metadata: Metadata = {
  title: 'Artikel - HMJF UIN Alauddin',
  description: 'Kumpulan artikel, blog, opini, publikasi, dan informasi dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const articleRepo = RepositoryFactory.getArticleRepository();

  // Validate and sanitize category parameter
  let validatedCategory: ArticleCategory | undefined;
  if (searchParams.category) {
    const validation = ArticleCategorySchema.safeParse(searchParams.category);
    if (validation.success) {
      validatedCategory = validation.data;
    }
    // If validation fails, validatedCategory remains undefined and we show all articles
  }

  const articles = validatedCategory
    ? await articleRepo.getByCategory(validatedCategory)
    : await articleRepo.getAll();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Artikel
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kumpulan artikel, blog, opini, publikasi ilmiah, dan informasi terkini dari HMJF
          </p>
        </div>
      </section>

      {/* Category Filter - Segmented Control */}
      <SegmentedControl
        basePath="/articles"
        paramName="category"
        currentValue={validatedCategory}
        allLabel="Semua"
        options={Object.entries(ARTICLE_CATEGORIES).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      {/* Articles Masonry Grid - Animated */}
      <section className="container-custom py-16">
        <ArticlesGrid articles={articles} />
      </section>
    </div>
  );
}
