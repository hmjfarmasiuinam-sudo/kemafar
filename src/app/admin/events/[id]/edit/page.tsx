'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Event } from '@/types/event';

interface EventFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: 'seminar' | 'workshop' | 'community-service' | 'competition' | 'training' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  location_type: string;
  location_address: string;
  cover_image: string;
  organizer_name: string;
  registration_url: string;
  registration_deadline: string;
  max_participants: string;
  tags: string;
  featured: boolean;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [creatorId, setCreatorId] = useState<string>('');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'seminar',
    status: 'upcoming',
    start_date: '',
    end_date: '',
    location_type: 'offline',
    location_address: '',
    cover_image: '',
    organizer_name: '',
    registration_url: '',
    registration_deadline: '',
    max_participants: '',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  async function fetchEvent() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Event not found');
        router.push('/admin/events');
        return;
      }

      const event = data as Event;

      // Check permissions
      if (profile?.role === 'kontributor') {
        if (!canEditOwnContent(event.creator_id)) {
          toast.error('You can only edit your own events');
          router.push('/admin/events');
          return;
        }
      }

      setCreatorId(event.creator_id);

      // Format dates for datetime-local input
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      const regDeadline = event.registration_deadline ? new Date(event.registration_deadline) : null;

      setFormData({
        title: event.title || '',
        slug: event.slug || '',
        description: event.description || '',
        content: event.content || '',
        category: event.category || 'seminar',
        status: event.status || 'upcoming',
        start_date: startDate.toISOString().slice(0, 16),
        end_date: endDate.toISOString().slice(0, 16),
        location_type: event.location?.type || 'offline',
        location_address: event.location?.address || '',
        cover_image: event.cover_image || '',
        organizer_name: event.organizer?.name || '',
        registration_url: event.registration_url || '',
        registration_deadline: regDeadline ? regDeadline.toISOString().slice(0, 16) : '',
        max_participants: event.max_participants ? event.max_participants.toString() : '',
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
        featured: event.featured || false,
      });
    } catch (error: any) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event');
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        location: {
          type: formData.location_type,
          address: formData.location_address,
        },
        cover_image: formData.cover_image,
        organizer: {
          name: formData.organizer_name,
        },
        registration_url: formData.registration_url || null,
        registration_deadline: formData.registration_deadline
          ? new Date(formData.registration_deadline).toISOString()
          : null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        featured: formData.featured,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('events')
        // @ts-ignore Supabase types not generated
        .update(eventData)
        .eq('id', params.id);

      if (error) throw error;

      toast.success('Event updated successfully');
      router.push('/admin/events');
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'Failed to update event');
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-1">Update event information</p>
        </div>
        <Link
          href="/admin/events"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="community-service">Community Service</option>
              <option value="competition">Competition</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-2">
              Location Type <span className="text-red-500">*</span>
            </label>
            <select
              id="location_type"
              name="location_type"
              required
              value={formData.location_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-2">
              Location Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location_address"
              name="location_address"
              required
              value={formData.location_address}
              onChange={handleChange}
              placeholder="Address or online link"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-2">
              Organizer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organizer_name"
              name="organizer_name"
              required
              value={formData.organizer_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Full Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              required
              value={formData.content}
              onChange={handleChange}
              placeholder="Detailed information about the event..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="registration_url" className="block text-sm font-medium text-gray-700 mb-2">
              Registration URL
            </label>
            <input
              type="url"
              id="registration_url"
              name="registration_url"
              value={formData.registration_url}
              onChange={handleChange}
              placeholder="https://forms.gle/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              id="registration_deadline"
              name="registration_deadline"
              value={formData.registration_deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              id="max_participants"
              name="max_participants"
              value={formData.max_participants}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty for unlimited"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {hasPermission(['super_admin', 'admin']) && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Event</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/admin/events"
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
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
        </div>
      </form>
    </div>
  );
}
