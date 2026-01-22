'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { MarkdownEditor } from '@/shared/components/MarkdownEditor';

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'post' | 'blog' | 'opinion' | 'publication' | 'info';
  cover_image: string;
  tags: string;
  featured: boolean;
}

export default function NewArticlePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'post',
    cover_image: '',
    tags: '',
    featured: false,
  });

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

  async function handleSubmit(e: FormEvent, status: 'draft' | 'pending' = 'draft') {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user || !profile) {
        throw new Error('You must be logged in');
      }

      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        cover_image: formData.cover_image,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        featured: formData.featured,
        status,
        author_id: user.id,
        author: {
          name: profile.full_name || profile.email,
          email: profile.email,
        },
        published_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('articles').insert([articleData]);

      if (error) throw error;

      toast.success(
        status === 'draft'
          ? 'Article saved as draft'
          : 'Article submitted for review'
      );
      router.push('/admin/articles');
    } catch (error: any) {
      console.error('Error creating article:', error);
      toast.error(error.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Article</h1>
          <p className="text-gray-600 mt-1">Write a new article or publication</p>
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
        </div>
      </form>
    </div>
  );
}
