/**
 * Timeline Component
 * Display company history timeline
 */

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div
            key={item.year}
            className={`relative flex flex-col md:flex-row gap-8 ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Year badge */}
            <div className="flex-shrink-0 md:w-1/2 flex items-center md:justify-end">
              <div
                className={`flex items-center gap-4 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full font-bold text-lg">
                  {item.year.slice(-2)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2">
              <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <div className="text-sm text-primary-600 font-semibold mb-2">
                  {item.year}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
