export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Griya Flora Babulu',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Agrotourism featuring fresh organic fruits, vegetables, and flowers',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  gallery: '/gallery',
  products: '/products',
  booking: '/booking',
} as const;

export const PRODUCT_CATEGORIES = {
  fruits: 'Buah-buahan',
  vegetables: 'Sayuran',
  flowers: 'Bunga',
  processed: 'Produk Olahan',
} as const;

export const GALLERY_CATEGORIES = {
  fruits: 'Buah-buahan',
  vegetables: 'Sayuran',
  flowers: 'Bunga',
  activities: 'Aktivitas',
  facilities: 'Fasilitas',
} as const;

export const PACKAGE_TYPES = {
  educational: 'Paket Edukasi',
  family: 'Paket Keluarga',
  custom: 'Paket Custom',
} as const;
