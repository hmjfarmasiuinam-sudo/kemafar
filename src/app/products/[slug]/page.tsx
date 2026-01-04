/**
 * Product Detail Page
 * Show individual product details
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { jsonProductRepository } from '@/infrastructure/repositories/JsonProductRepository';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';
import { ArrowLeft, ShoppingBag, Check, MessageCircle } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await jsonProductRepository.findBySlug(params.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const products = await jsonProductRepository.findAll();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await jsonProductRepository.findBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Halo ${SITE_CONFIG.name}, saya ingin memesan:\n\nProduk: ${product.name}\nHarga: ${product.price || 'Hubungi admin'}\n\nTerima kasih!`
    );
    return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href={ROUTES.products}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Produk
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <Card variant="bordered">
              <div className="relative h-96 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-primary-300" />
                </div>
                {!product.available && (
                  <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full">
                    Stok Habis
                  </div>
                )}
                {product.available && (
                  <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full">
                    Tersedia
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Info Section */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 rounded-full">
                {product.category === 'fruits' && 'Buah-buahan'}
                {product.category === 'vegetables' && 'Sayuran'}
                {product.category === 'flowers' && 'Bunga'}
                {product.category === 'processed' && 'Produk Olahan'}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {product.price && (
              <div className="mb-6">
                <p className="text-3xl font-bold text-primary-600">{product.price}</p>
              </div>
            )}

            {product.season && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Musim:</span> {product.season}
                </p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <Card variant="bordered" className="mb-6">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Keunggulan:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Order Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={!product.available}
                asChild={product.available}
              >
                {product.available ? (
                  <a href={handleWhatsAppOrder()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Pesan via WhatsApp
                  </a>
                ) : (
                  <>Stok Habis</>
                )}
              </Button>
            </div>

            {!product.available && (
              <p className="text-sm text-gray-500 mt-2">
                Produk sedang tidak tersedia. Hubungi kami untuk informasi ketersediaan.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
