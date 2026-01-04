/**
 * Booking Page
 * Page for booking visits
 */

import { Metadata } from 'next';
import { BookingForm } from '@/features/booking/components/BookingForm';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { jsonPackageRepository } from '@/infrastructure/repositories/JsonPackageRepository';
import { Calendar, Users, Clock, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Booking Kunjungan',
  description: 'Pesan kunjungan ke Griya Flora Babulu',
};

export default async function BookingPage() {
  const packages = await jsonPackageRepository.findAll();

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Kunjungan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Isi formulir di bawah untuk memesan kunjungan ke agrowisata kami.
            Kami akan menghubungi Anda via WhatsApp untuk konfirmasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Packages Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Paket Tersedia
              </h2>
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id} variant="bordered">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Durasi: {pkg.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{pkg.minVisitors}-{pkg.maxVisitors} orang</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="font-bold text-primary-600">{pkg.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Info */}
            <Card variant="bordered" className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informasi Penting</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Booking minimal H-3 sebelum kunjungan</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Konfirmasi via WhatsApp dalam 1x24 jam</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>DP 50% untuk konfirmasi booking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span>Bawa perlengkapan outdoor yang nyaman</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
