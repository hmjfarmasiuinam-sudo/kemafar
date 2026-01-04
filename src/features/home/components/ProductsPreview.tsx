/**
 * ProductsPreview Component
 * Show featured products on homepage
 */

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { ROUTES } from '@/lib/constants';
import { jsonProductRepository } from '@/infrastructure/repositories/JsonProductRepository';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export async function ProductsPreview() {
  // Get first 6 products
  const products = await jsonProductRepository.findAll();
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Produk Segar Kami
            </h2>
            <p className="text-lg text-gray-600">
              Langsung dari kebun organik ke meja Anda
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href={ROUTES.products}>
              Lihat Semua
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
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

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href={ROUTES.products}>
              Lihat Semua Produk
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
