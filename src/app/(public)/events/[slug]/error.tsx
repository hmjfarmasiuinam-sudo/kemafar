'use client';

import { ErrorState } from '@/components/ui/ErrorState';

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorState
        title="Failed to load event"
        message="We couldn't load this event. It may have been moved or deleted."
        error={error}
        onRetry={reset}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    </div>
  );
}
