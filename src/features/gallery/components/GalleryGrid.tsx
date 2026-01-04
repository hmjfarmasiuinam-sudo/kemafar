'use client';

/**
 * GalleryGrid Component
 * Display gallery items in a masonry grid with lightbox
 */

import { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { GalleryItem } from '@/core/entities/GalleryItem';
import { Image as ImageIcon, Play, X } from 'lucide-react';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'fruits', label: 'Buah-buahan' },
    { value: 'vegetables', label: 'Sayuran' },
    { value: 'flowers', label: 'Bunga' },
    { value: 'facilities', label: 'Fasilitas' },
    { value: 'activities', label: 'Aktivitas' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            variant="bordered"
            className="overflow-hidden cursor-pointer group"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-secondary-100">
              <div className="absolute inset-0 flex items-center justify-center">
                {item.type === 'image' ? (
                  <ImageIcon className="w-16 h-16 text-primary-300" />
                ) : (
                  <Play className="w-16 h-16 text-primary-300" />
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Play icon for videos */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
              )}
            </div>

            {item.title && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Tidak ada item di kategori ini.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedItem.type === 'image' ? (
                  <ImageIcon className="w-24 h-24 text-primary-300" />
                ) : (
                  <Play className="w-24 h-24 text-primary-300" />
                )}
              </div>
            </div>

            {(selectedItem.title || selectedItem.description) && (
              <div className="mt-4 text-white">
                {selectedItem.title && (
                  <h3 className="text-xl font-semibold mb-2">{selectedItem.title}</h3>
                )}
                {selectedItem.description && (
                  <p className="text-gray-300">{selectedItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
