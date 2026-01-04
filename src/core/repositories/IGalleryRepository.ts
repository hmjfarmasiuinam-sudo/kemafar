/**
 * IGalleryRepository
 * Interface for Gallery data access
 */

import { GalleryItem, GalleryFilters } from '../entities/GalleryItem';

export interface IGalleryRepository {
  /**
   * Get all gallery items with optional filtering
   */
  findAll(filters?: GalleryFilters): Promise<GalleryItem[]>;

  /**
   * Get gallery items by category
   */
  findByCategory(category: string): Promise<GalleryItem[]>;

  /**
   * Get a single gallery item by ID
   */
  findById(id: string): Promise<GalleryItem | null>;

  /**
   * Get gallery items by type (image or video)
   */
  findByType(type: 'image' | 'video'): Promise<GalleryItem[]>;
}
