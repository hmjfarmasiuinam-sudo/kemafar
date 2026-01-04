'use client';

/**
 * BookingForm Component
 * Form for booking visits
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, BookingFormData } from '@/infrastructure/validators/schemas';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { SITE_CONFIG } from '@/lib/constants';
import { Calendar, Users, Package as PackageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      // Format WhatsApp message
      const message = `
*Booking Kunjungan - ${SITE_CONFIG.name}*

Nama: ${data.name}
Email: ${data.email}
Telepon: ${data.phone}
Tanggal Kunjungan: ${new Date(data.visitDate).toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}
Jumlah Pengunjung: ${data.numberOfVisitors} orang
Paket: ${data.packageType === 'educational' ? 'Paket Edukasi' : data.packageType === 'family' ? 'Paket Keluarga' : 'Paket Custom'}
${data.message ? `\nPesan: ${data.message}` : ''}
      `.trim();

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Reset form
      reset();
      toast.success('Booking berhasil! Silakan lanjutkan di WhatsApp.');
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="bordered">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Input
            label="Nama Lengkap"
            placeholder="John Doe"
            error={errors.name?.message}
            required
            {...register('name')}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          {/* Phone */}
          <Input
            label="Nomor Telepon"
            type="tel"
            placeholder="081234567890"
            error={errors.phone?.message}
            helperText="Format: 081234567890"
            required
            {...register('phone')}
          />

          {/* Visit Date */}
          <Input
            label="Tanggal Kunjungan"
            type="date"
            error={errors.visitDate?.message}
            required
            {...register('visitDate', {
              valueAsDate: true,
            })}
          />

          {/* Number of Visitors */}
          <Input
            label="Jumlah Pengunjung"
            type="number"
            min="1"
            max="100"
            placeholder="10"
            error={errors.numberOfVisitors?.message}
            required
            {...register('numberOfVisitors', {
              valueAsNumber: true,
            })}
          />

          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pilih Paket <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'educational', label: 'Paket Edukasi', icon: '🎓' },
                { value: 'family', label: 'Paket Keluarga', icon: '👨‍👩‍👧‍👦' },
                { value: 'custom', label: 'Paket Custom', icon: '⚙️' },
              ].map((pkg) => (
                <label
                  key={pkg.value}
                  className="relative flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
                >
                  <input
                    type="radio"
                    value={pkg.value}
                    className="sr-only"
                    {...register('packageType')}
                  />
                  <div className="flex-1">
                    <div className="text-2xl mb-1">{pkg.icon}</div>
                    <div className="font-medium text-gray-900">{pkg.label}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.packageType && (
              <p className="mt-1 text-sm text-red-600">{errors.packageType.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan Tambahan (Opsional)
            </label>
            <textarea
              rows={4}
              placeholder="Tambahkan catatan atau permintaan khusus..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('message')}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              {...register('agreeToTerms')}
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Saya setuju dengan syarat dan ketentuan yang berlaku
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Lanjutkan ke WhatsApp'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
