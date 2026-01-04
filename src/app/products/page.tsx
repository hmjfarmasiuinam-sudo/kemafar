/**
 * Products Page
 * List all products with filtering
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { jsonProductRepository } from '@/infrastructure/repositories/JsonProductRepository';
import { ROUTES } from '@/lib/constants';
import { ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Produk',
  description: 'Produk segar organik dari Griya Flora Babulu',
};

export default async function ProductsPage() {
  const products = await jsonProductRepository.findAll();

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Produk Kami
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Semua produk segar langsung dari kebun organik kami. Dijamin kualitas dan kesegarannya.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} variant="elevated" className="overflow-hidden group">
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-primary-300" />
                </div>
                {!product.available && (
                  <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                    Habis
                  </div>
                )}
                {product.available && (
                  <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
                    Tersedia
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                    {product.category === 'fruits' && 'Buah'}
                    {product.category === 'vegetables' && 'Sayur'}
                    {product.category === 'flowers' && 'Bunga'}
                    {product.category === 'processed' && 'Olahan'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {product.season && (
                  <p className="text-xs text-gray-500 mb-2">
                    Musim: {product.season}
                  </p>
                )}

                {product.price && (
                  <p className="text-lg font-bold text-primary-600 mb-3">
                    {product.price}
                  </p>
                )}

                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`${ROUTES.products}/${product.slug}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Belum ada produk tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
