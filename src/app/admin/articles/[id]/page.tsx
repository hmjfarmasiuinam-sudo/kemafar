'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { MarkdownEditor } from '@/shared/components/MarkdownEditor';
import { Article } from '@/types/article';

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info';
  cover_image: string;
  tags: string;
  featured: boolean;
  status: 'draft' | 'pending' | 'published' | 'archived';
}

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [authorId, setAuthorId] = useState<string>('');
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'post',
    cover_image: '',
    tags: '',
    featured: false,
    status: 'draft',
  });

  const id = params.id as string;
  const isCreateMode = id === 'new';

  useEffect(() => {
    if (!isCreateMode && profile) {
      fetchArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.id]);

  async function fetchArticle() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, content, category, cover_image, tags, featured, status, author_id')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Article not found');
        router.push('/admin/articles');
        return;
      }

      const article = data as unknown as Article;

      // Check permissions
      if (profile?.role === 'kontributor') {
        if (!canEditOwnContent(article.author_id) || article.status !== 'draft') {
          toast.error('You can only edit your own draft articles');
          router.push('/admin/articles');
          return;
        }
      }

      setAuthorId(article.author_id);
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category as ArticleFormData['category'] || 'post',
        cover_image: article.cover_image || '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        featured: article.featured || false,
        status: article.status || 'draft',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to load article');
      router.push('/admin/articles');
    } finally {
      setFetching(false);
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  }

  function handleEditorChange({ text }: { text: string; html: string }) {
    setFormData({
      ...formData,
      content: text,
    });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  }

  async function handleSubmit(e: FormEvent, status?: 'draft' | 'pending') {
    e.preventDefault();
    setLoading(true);

    try {
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        cover_image: formData.cover_image,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        featured: formData.featured,
      };

      if (isCreateMode) {
        if (!user || !profile) {
          throw new Error('You must be logged in');
        }

        const submitStatus = status || 'draft';
        const insertData = {
          ...articleData,
          status: submitStatus,
          author_id: user.id,
          author: {
            name: profile.full_name || profile.email,
            email: profile.email,
          },
          published_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('articles')
          .insert([insertData as unknown as never]);

        if (error) throw error;

        toast.success(
          submitStatus === 'draft'
            ? 'Article saved as draft'
            : 'Article submitted for review'
        );
      } else {
        const { error } = await supabase
          .from('articles')
          .update(articleData as unknown as never)
          .eq('id', id);

        if (error) throw error;

        toast.success('Article updated successfully');
      }

      router.push('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      const message = error instanceof Error ? error.message : 'Failed to save article';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            {isCreateMode ? 'Create Article' : 'Edit Article'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isCreateMode
              ? 'Write a new article or publication'
              : 'Update article information'}
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>
      </div>

      <form className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Auto-generated from title. Used in URL.
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="post">Post</option>
                <option value="blog">Blog</option>
                <option value="opinion">Opinion</option>
                <option value="publication">Publication</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div>
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="cover_image"
                name="cover_image"
                required
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                required
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3 (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {(isCreateMode || hasPermission(['super_admin', 'admin'])) && (
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Article</span>
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={handleEditorChange}
              placeholder="Write your article content in Markdown..."
              height="500px"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/admin/articles"
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          {isCreateMode ? (
            <>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={loading}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'pending')}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Submit for Review
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={(e) => handleSubmit(e)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
