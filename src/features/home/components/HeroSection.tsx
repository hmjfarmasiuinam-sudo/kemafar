/**
 * HeroSection Component
 * Main hero section for homepage
 */

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { ArrowRight, Leaf } from 'lucide-react';
import homeData from '../../../../public/data/home.json';

export function HeroSection() {
  const { hero } = homeData;

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 md:py-28">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              <Leaf className="w-4 h-4" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {hero.title}{' '}
              <span className="text-primary-600">{hero.titleHighlight}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href={hero.primaryCTA.link}>
                  {hero.primaryCTA.text}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={hero.secondaryCTA.link}>{hero.secondaryCTA.text}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {hero.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder for hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Leaf className="w-24 h-24 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Hero Image</p>
                  <p className="text-sm opacity-75">Tambahkan foto kebun di sini</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-400 rounded-full blur-3xl opacity-30" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-400 rounded-full blur-3xl opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
