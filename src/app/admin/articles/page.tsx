'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
  author: {
    name: string;
    email: string;
  };
  author_id: string;
  published_at: string;
}

type StatusFilter = 'all' | 'draft' | 'pending' | 'published' | 'archived';
type CategoryFilter = 'all' | 'post' | 'blog' | 'opinion' | 'publication' | 'info';

const ITEMS_PER_PAGE = 20;

export default function ArticlesPage() {
  const router = useRouter();
  const { user, profile, hasPermission, canEditOwnContent, canPublishArticles } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Initial fetch and refetch when filters/pagination change
  useEffect(() => {
    // Only fetch if we have profile loaded (avoid premature fetch)
    if (!profile) return;

    const timer = setTimeout(() => {
      fetchArticles();
    }, searchQuery ? 300 : 0); // Debounce only for search

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter, currentPage, profile?.id]); // profile?.id ensures we refetch when profile loads

  async function fetchArticles() {
    try {
      setLoading(true);

      // Build query with server-side filtering
      let query = supabase
        .from('articles')
        .select('id, title, slug, category, status, author, author_id, published_at', { count: 'exact' })
        .order('published_at', { ascending: false });

      // Kontributor can only see their own articles
      if (profile?.role === 'kontributor' && user) {
        query = query.eq('author_id', user.id);
      }

      // Server-side search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,author->>name.ilike.%${searchQuery}%`);
      }

      // Server-side status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Server-side category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      // Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setArticles(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    // Optimistic update
    const previousArticles = [...articles];
    setArticles(articles.filter((a) => a.id !== id));
    setTotalCount((prev) => prev - 1);

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;

      toast.success('Article deleted successfully');
    } catch (error: any) {
      // Rollback on error
      setArticles(previousArticles);
      setTotalCount((prev) => prev + 1);
      toast.error(error.message || 'Failed to delete article');
    }
  }

  async function handlePublish(id: string, title: string) {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to publish articles');
      return;
    }

    if (!confirm(`Publish "${title}"?`)) return;

    // Optimistic update
    const previousArticles = [...articles];
    const now = new Date().toISOString();
    setArticles(
      articles.map((a) =>
        a.id === id ? { ...a, status: 'published' as const, published_at: now } : a
      )
    );

    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published', published_at: now })
        .eq('id', id);

      if (error) throw error;

      toast.success('Article published successfully');
    } catch (error: any) {
      // Rollback on error
      setArticles(previousArticles);
      toast.error(error.message || 'Failed to publish article');
    }
  }

  async function handleUnpublish(id: string, title: string) {
    if (!canPublishArticles()) {
      toast.error('You do not have permission to unpublish articles');
      return;
    }

    if (!confirm(`Unpublish "${title}"? It will be set to draft.`)) return;

    // Optimistic update
    const previousArticles = [...articles];
    setArticles(
      articles.map((a) => (a.id === id ? { ...a, status: 'draft' as const } : a))
    );

    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'draft' })
        .eq('id', id);

      if (error) throw error;

      toast.success('Article unpublished successfully');
    } catch (error: any) {
      // Rollback on error
      setArticles(previousArticles);
      toast.error(error.message || 'Failed to unpublish article');
    }
  }

  function canEditArticle(article: Article): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
  }

  function canDeleteArticle(article: Article): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(article.author_id) && article.status === 'draft';
    }
    return false;
  }

  function getStatusBadge(status: string) {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  function getCategoryBadge(category: string) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        {category}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage articles and publications</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="post">Post</option>
            <option value="blog">Blog</option>
            <option value="opinion">Opinion</option>
            <option value="publication">Publication</option>
            <option value="info">Info</option>
          </select>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{article.author.name}</td>
                    <td className="py-3 px-4">{getCategoryBadge(article.category)}</td>
                    <td className="py-3 px-4">{getStatusBadge(article.status)}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(article.published_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' && (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}

                        {article.status !== 'published' && canPublishArticles() && (
                          <button
                            onClick={() => handlePublish(article.id, article.title)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {article.status === 'published' && canPublishArticles() && (
                          <button
                            onClick={() => handleUnpublish(article.id, article.title)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Unpublish"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {canEditArticle(article) && (
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}

                        {canDeleteArticle(article) && (
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalCount > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} articles
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {Math.ceil(totalCount / ITEMS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(Math.ceil(totalCount / ITEMS_PER_PAGE), p + 1))
                    }
                    disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
