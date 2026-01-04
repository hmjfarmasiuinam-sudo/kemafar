/**
 * GalleryItem Entity
 * Domain model untuk item gallery (foto/video)
 */

export type GalleryCategory = 'fruits' | 'vegetables' | 'flowers' | 'activities' | 'facilities';
export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: MediaType;
  src: string;
  thumbnail?: string;
  alt: string;
  category: GalleryCategory;
  title: string;
  description?: string;
  width: number;
  height: number;
}

export interface GalleryFilters {
  category?: GalleryCategory;
  type?: MediaType;
}

// Factory function
export function createGalleryItem(data: Partial<GalleryItem>): GalleryItem {
  if (!data.id || !data.type || !data.src || !data.alt || !data.category) {
    throw new Error('Missing required gallery item fields');
  }

  return {
    id: data.id,
    type: data.type,
    src: data.src,
    thumbnail: data.thumbnail,
    alt: data.alt,
    category: data.category,
    title: data.title || '',
    description: data.description,
    width: data.width || 1200,
    height: data.height || 800,
  };
}
