/**
 * JsonGalleryRepository
 * JSON-based implementation of IGalleryRepository
 */

import { IGalleryRepository } from '@/core/repositories/IGalleryRepository';
import { GalleryItem, GalleryFilters } from '@/core/entities/GalleryItem';
import galleryData from '@/../public/data/gallery.json';

export class JsonGalleryRepository implements IGalleryRepository {
  private items: GalleryItem[] = galleryData.items as GalleryItem[];

  async findAll(filters?: GalleryFilters): Promise<GalleryItem[]> {
    let result = [...this.items];

    if (filters?.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters?.type) {
      result = result.filter((item) => item.type === filters.type);
    }

    return result;
  }

  async findByCategory(category: string): Promise<GalleryItem[]> {
    return this.items.filter((item) => item.category === category);
  }

  async findById(id: string): Promise<GalleryItem | null> {
    const item = this.items.find((item) => item.id === id);
    return item || null;
  }

  async findByType(type: 'image' | 'video'): Promise<GalleryItem[]> {
    return this.items.filter((item) => item.type === type);
  }
}

// Singleton instance
export const jsonGalleryRepository = new JsonGalleryRepository();
