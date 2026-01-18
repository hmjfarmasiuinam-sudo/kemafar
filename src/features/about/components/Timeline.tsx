/**
 * Timeline Component
 * Display company history timeline
 */

'use client';

import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 origin-top"
      />

      <div className="space-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
          >
            {/* Year badge */}
            <div className="flex-shrink-0 md:w-1/2 flex items-center md:justify-end">
              <div
                className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full font-bold text-lg shadow-xl border-4 border-white">
                  {item.year.slice(-2)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 relative group"
              >
                <div className="absolute top-6 -left-2 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-200 md:block hidden group-hover:border-primary-200 transition-colors" style={{ left: index % 2 === 0 ? '-9px' : 'auto', right: index % 2 === 0 ? 'auto' : '-9px', borderLeft: index % 2 === 0 ? '1px solid #e5e7eb' : 'none', borderRight: index % 2 === 0 ? 'none' : '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', borderTop: 'none' }} />

                <div className="text-sm text-primary-600 font-semibold mb-2">
                  {item.year}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
