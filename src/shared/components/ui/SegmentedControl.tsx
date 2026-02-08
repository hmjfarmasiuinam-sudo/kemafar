/**
 * SegmentedControl Component
 * Reusable pill-style filter/tab navigation component
 *
 * Usage:
 * <SegmentedControl
 *   basePath="/events"
 *   paramName="status"
 *   currentValue={status}
 *   allLabel="Semua Event"
 *   options={[
 *     { value: 'upcoming', label: 'Akan Datang' },
 *     { value: 'ongoing', label: 'Berlangsung' }
 *   ]}
 * />
 */

'use client';

import Link from 'next/link';
import { cn } from '@/shared/utils/cn';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  /**
   * Base path for the links (e.g., '/events', '/articles')
   */
  basePath: string;

  /**
   * Query parameter name (e.g., 'status', 'category', 'batch')
   */
  paramName: string;

  /**
   * Current active value
   */
  currentValue?: string;

  /**
   * Label for "all items" option
   */
  allLabel: string;

  /**
   * Array of filter options
   */
  options: SegmentedControlOption[];

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Whether to use sticky positioning
   * @default true
   */
  sticky?: boolean;

  /**
   * Delay before hiding (ms)
   * @default 2000
   */
  hideDelay?: number;
}

export function SegmentedControl({
  basePath,
  paramName,
  currentValue,
  allLabel,
  options,
  className,
  sticky = true,
  hideDelay = 2400,
}: SegmentedControlProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check horizontal scroll capability
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  // Handle any interaction (scroll, touch, hover)
  const handleInteraction = () => {
    setIsInteracting(true);
    checkScroll();

    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, hideDelay);
  };

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('resize', checkScroll);
    checkScroll();

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('resize', checkScroll);
      if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    };
  }, [hideDelay]);

  const isActive = (value?: string) => {
    if (!value) return !currentValue;
    return currentValue === value;
  };

  const getHref = (value?: string) => {
    if (!value) return basePath;
    return `${basePath}?${paramName}=${value}`;
  };

  const pillClasses = (active: boolean) =>
    cn(
      'px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
      active
        ? 'bg-primary-700 text-white shadow-md shadow-primary-500/30 ring-0'
        : 'text-gray-900 group-hover:text-gray-950 font-medium hover:bg-white/80 hover:shadow-sm'
    );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      className={cn(
        'py-4 transition-all duration-300 z-40',
        sticky && 'sticky top-0 md:top-32',
        className
      )}
      style={{
        opacity: sticky ? (isInteracting ? 1 : 0) : 1,
      }}
      onMouseEnter={handleInteraction}
      onMouseLeave={() => {
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), hideDelay);
      }}
      onTouchStart={handleInteraction}
      onTouchEnd={() => {
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => setIsInteracting(false), hideDelay);
      }}
    >
      <div className="container-custom flex justify-center">
        {/* Pill Container (Liquid Glass) */}
        <div className="relative group rounded-full bg-white/30 backdrop-blur-md border border-white/20 shadow-lg p-1.5 inline-flex max-w-full overflow-hidden supports-[backdrop-filter]:bg-white/10">

          {/* Scroll Indicators */}
          <div>
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white shadow-md text-gray-600 hover:text-primary-700 md:hidden flex items-center justify-center -ml-2 transition-transform hover:scale-110 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white shadow-md text-gray-600 hover:text-primary-700 md:hidden flex items-center justify-center -mr-2 transition-transform hover:scale-110 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Gradient Overlays */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/60 via-white/30 to-transparent rounded-l-full z-10 pointer-events-none md:hidden" />
            )}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/60 via-white/30 to-transparent rounded-r-full z-10 pointer-events-none md:hidden" />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div
            ref={scrollRef}
            onScroll={handleInteraction}
            className="flex overflow-x-auto scrollbar-hide relative z-0"
          >
            {/* "All" option */}
            <Link href={getHref()} className={pillClasses(isActive())}>
              {allLabel}
            </Link>

            {/* Dynamic options */}
            {options.map((option) => (
              <Link
                key={option.value}
                href={getHref(option.value)}
                className={pillClasses(isActive(option.value))}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}