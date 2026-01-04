/**
 * IProductRepository
 * Interface for Product data access
 * Implementasi bisa dari JSON, Database, atau API
 */

import { Product, ProductFilters } from '../entities/Product';

export interface IProductRepository {
  /**
   * Get all products with optional filtering
   */
  findAll(filters?: ProductFilters): Promise<Product[]>;

  /**
   * Get a single product by slug
   */
  findBySlug(slug: string): Promise<Product | null>;

  /**
   * Get a single product by ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Get products by category
   */
  findByCategory(category: string): Promise<Product[]>;

  /**
   * Get available products only
   */
  findAvailable(): Promise<Product[]>;
}
