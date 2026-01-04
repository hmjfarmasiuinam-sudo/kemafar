/**
 * Product Entity
 * Domain model untuk produk (buah, sayur, bunga, olahan)
 */

export type ProductCategory = 'fruits' | 'vegetables' | 'flowers' | 'processed';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  images: string[];
  season?: string;
  available: boolean;
  price?: string;
  features?: string[];
}

export interface ProductFilters {
  category?: ProductCategory;
  available?: boolean;
  search?: string;
}

// Factory function untuk membuat Product instance
export function createProduct(data: Partial<Product>): Product {
  if (!data.id || !data.slug || !data.name || !data.category) {
    throw new Error('Missing required product fields');
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    description: data.description || '',
    images: data.images || [],
    season: data.season,
    available: data.available ?? true,
    price: data.price,
    features: data.features,
  };
}
