/**
 * Validation Schemas
 * Zod schemas untuk form validation
 */

import { z } from 'zod';

/**
 * Booking Form Schema
 */
export const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Email tidak valid'),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid (contoh: 081234567890)'),
  visitDate: z.date().min(new Date(), 'Tanggal kunjungan harus di masa depan'),
  numberOfVisitors: z
    .number()
    .min(1, 'Minimal 1 pengunjung')
    .max(100, 'Maksimal 100 pengunjung'),
  packageType: z.enum(['educational', 'family', 'custom'], {
    errorMap: () => ({ message: 'Pilih paket yang valid' }),
  }),
  message: z.string().max(500, 'Pesan terlalu panjang').optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan',
  }),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

/**
 * Contact Form Schema
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z
    .string()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
  subject: z.string().min(5, 'Subjek minimal 5 karakter').max(100),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Product Order Schema (via WhatsApp)
 */
export const productOrderSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().min(1, 'Minimal 1 item').max(1000, 'Maksimal 1000 item'),
  customerName: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Nomor telepon tidak valid'),
  deliveryAddress: z.string().min(10, 'Alamat minimal 10 karakter').optional(),
  notes: z.string().max(500, 'Catatan terlalu panjang').optional(),
});

export type ProductOrderData = z.infer<typeof productOrderSchema>;

/**
 * Newsletter Subscription Schema
 */
export const newsletterSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;
