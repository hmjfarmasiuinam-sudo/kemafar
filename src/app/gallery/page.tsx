/**
 * Gallery Page
 * Display photo and video gallery
 */

import { Metadata } from 'next';
import { GalleryGrid } from '@/features/gallery/components/GalleryGrid';
import { jsonGalleryRepository } from '@/infrastructure/repositories/JsonGalleryRepository';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Galeri foto dan video kegiatan HMJF UIN Alauddin Makassar',
};

export default async function GalleryPage() {
  const galleryItems = await jsonGalleryRepository.findAll();

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Galeri Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Lihat momen-momen indah dan kegiatan menarik HMJF UIN Alauddin Makassar melalui koleksi foto dan video.
          </p>
        </div>

        {/* Gallery Grid */}
        <GalleryGrid items={galleryItems} />
      </div>
    </div>
  );
}
