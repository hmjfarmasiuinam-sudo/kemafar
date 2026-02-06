'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Event as EventListItem } from '@/lib/api/events';
import { EVENT_CATEGORIES } from '@/config/domain.config';

interface EventsGridProps {
  events: EventListItem[];
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
}

export function EventsGrid({ events, statusColors, statusLabels }: EventsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (events.length === 0) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-xl">Belum ada event tersedia</p>
      </div>
    );
  }

  // Simplified animations for better mobile performance
  const cardVariants = shouldReduceMotion ? undefined : {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-50px" }}
          variants={cardVariants}
          transition={{
            delay: shouldReduceMotion ? 0 : Math.min(index * 0.1, 0.3),
            duration: 0.4,
          }}
        >
          <Link
            href={`/events/${event.slug}`}
            className="group relative block transition-transform duration-300 hover:-translate-y-2"
          >
            {/* Glassmorphism container */}
            <div className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 hover:shadow-2xl">
              {/* Image section */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Badges */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 ${statusColors[event.status]} text-sm font-bold rounded-full shadow-lg transition-transform duration-200 hover:scale-105`}
                  >
                    {statusLabels[event.status]}
                  </span>
                  {event.featured && (
                    <span
                      className="px-4 py-2 bg-secondary-500 text-white text-sm font-bold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                    >
                      Unggulan
                    </span>
                  )}
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
              </div>

              {/* Content - overlapping image */}
              <div className="relative -mt-20 p-8">
                {/* Date badge - prominent */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl mb-6 shadow-xl transition-transform duration-200 hover:scale-105">
                  <Calendar className="w-5 h-5" />
                  <time className="font-bold">
                    {format(new Date(event.startDate), 'd MMM yyyy', { locale: id })}
                  </time>
                </div>

                {/* Category */}
                <div className="text-sm text-primary-600 font-bold mb-3">
                  {EVENT_CATEGORIES[event.category]}
                </div>

                {/* Title - large and bold */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                  {event.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-2 text-base leading-relaxed">
                  {event.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700 mb-4 transition-transform duration-200 group-hover:translate-x-1">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span className="font-medium line-clamp-1">{event.location.name}</span>
                </div>

                {/* Read more indicator */}
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  Lihat Detail
                  <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
