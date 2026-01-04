/**
 * JsonProductRepository
 * JSON-based implementation of IProductRepository
 * Reads from public/data/products.json
 */

import { IProductRepository } from '@/core/repositories/IProductRepository';
import { Product, ProductFilters } from '@/core/entities/Product';
import productsData from '@/../public/data/products.json';

export class JsonProductRepository implements IProductRepository {
  private products: Product[] = productsData.products as Product[];

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    let result = [...this.products];

    if (filters?.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters?.available !== undefined) {
      result = result.filter((p) => p.available === filters.available);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = this.products.find((p) => p.slug === slug);
    return product || null;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter((p) => p.category === category);
  }

  async findAvailable(): Promise<Product[]> {
    return this.products.filter((p) => p.available);
  }
}

// Singleton instance
export const jsonProductRepository = new JsonProductRepository();
