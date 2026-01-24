import { Metadata } from 'next';
import { z } from 'zod';
import { getEvents, getEventsByStatus, EventStatus } from '@/lib/api/events';
import { EventsGrid } from '@/features/events/components/EventsGrid';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS } from '@/lib/constants/event';

// Zod schema for validating event status query parameter
const EventStatusSchema = z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']);

export const metadata: Metadata = {
  title: 'Events - Your Organization',
  description: 'Daftar event dan kegiatan dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  // Validate and sanitize status parameter
  let validatedStatus: EventStatus | undefined;
  if (searchParams.status) {
    const validation = EventStatusSchema.safeParse(searchParams.status);
    if (validation.success) {
      validatedStatus = validation.data;
    }
    // If validation fails, validatedStatus remains undefined and we show all events
  }

  const events = validatedStatus
    ? await getEventsByStatus(validatedStatus)
    : await getEvents();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Event
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Latest activities and events from Your Organization
          </p>
        </div>
      </section>

      {/* Status Filter - Segmented Control */}
      <SegmentedControl
        basePath="/events"
        paramName="status"
        currentValue={validatedStatus}
        allLabel="Semua Event"
        options={Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => ({
          value,
          label,
        }))}
      />

      {/* Events Grid - Animated */}
      <section className="container-custom py-16">
        <EventsGrid events={events} statusColors={EVENT_STATUS_COLORS} statusLabels={EVENT_STATUS_LABELS} />
      </section>
    </div>
  );
}
