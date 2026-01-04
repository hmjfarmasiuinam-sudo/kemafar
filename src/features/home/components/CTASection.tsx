/**
 * CTASection Component
 * Call-to-action for booking
 */

import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { Calendar, Phone } from 'lucide-react';
import homeData from '../../../../public/data/home.json';

export function CTASection() {
  const { cta } = homeData;

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="container-custom">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {cta.title}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-primary-50">
            {cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href={cta.primaryCTA.link}>
                <Calendar className="mr-2 w-5 h-5" />
                {cta.primaryCTA.text}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600"
              asChild
            >
              <Link href={`tel:${cta.secondaryCTA.phone}`}>
                <Phone className="mr-2 w-5 h-5" />
                {cta.secondaryCTA.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
