'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  creator_id: string;
  organizer: {
    name: string;
  };
}

type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
type CategoryFilter = 'all' | 'seminar' | 'workshop' | 'community-service' | 'competition' | 'training' | 'other';

const ITEMS_PER_PAGE = 20;

export default function EventsPage() {
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Initial fetch and refetch when filters/pagination change
  useEffect(() => {
    // Only fetch if we have profile loaded
    if (!profile) return;

    const timer = setTimeout(() => {
      fetchEvents();
    }, searchQuery ? 300 : 0); // Debounce only for search

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter, currentPage, profile?.id]);

  async function fetchEvents() {
    try {
      setLoading(true);

      // Build query with server-side filtering
      let query = supabase
        .from('events')
        .select('id, title, slug, category, status, start_date, end_date, creator_id, organizer', { count: 'exact' })
        .order('start_date', { ascending: false });

      // Kontributor can only see their own events
      if (profile?.role === 'kontributor' && user) {
        query = query.eq('creator_id', user.id);
      }

      // Server-side search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,organizer->>name.ilike.%${searchQuery}%`);
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

      setEvents(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    // Optimistic update
    const previousEvents = [...events];
    setEvents(events.filter((e) => e.id !== id));
    setTotalCount((prev) => prev - 1);

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);

      if (error) throw error;

      toast.success('Event deleted successfully');
    } catch (error: any) {
      // Rollback on error
      setEvents(previousEvents);
      setTotalCount((prev) => prev + 1);
      toast.error(error.message || 'Failed to delete event');
    }
  }

  function canEditEvent(event: Event): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(event.creator_id);
    }
    return false;
  }

  function canDeleteEvent(event: Event): boolean {
    if (hasPermission(['super_admin', 'admin'])) return true;
    if (profile?.role === 'kontributor' && user) {
      return canEditOwnContent(event.creator_id);
    }
    return false;
  }

  function getStatusBadge(status: string) {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.upcoming
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  function getCategoryBadge(category: string) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
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
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage events and activities</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or organizer..."
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
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="seminar">Seminar</option>
            <option value="workshop">Workshop</option>
            <option value="community-service">Community Service</option>
            <option value="competition">Competition</option>
            <option value="training">Training</option>
            <option value="other">Other</option>
          </select>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Organizer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.slug}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{event.organizer.name}</td>
                    <td className="py-3 px-4">{getCategoryBadge(event.category)}</td>
                    <td className="py-3 px-4">{getStatusBadge(event.status)}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(event.start_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${event.slug}`}
                          target="_blank"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {canEditEvent(event) && (
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}

                        {canDeleteEvent(event) && (
                          <button
                            onClick={() => handleDelete(event.id, event.title)}
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
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} events
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
