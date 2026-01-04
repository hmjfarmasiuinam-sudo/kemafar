# Griya Flora Babulu

Website agrowisata organik dengan buah-buahan, sayuran, dan bunga segar.

## Features

- 🌱 Katalog Produk Organik
- 📸 Galeri Foto & Video
- 📅 Sistem Booking Kunjungan
- ℹ️ Informasi Perusahaan
- 📱 Integrasi WhatsApp

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Architecture**: Clean Architecture
- **Data**: JSON-based (ready for database migration)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
griyaflora_babulu/
├── public/
│   └── data/              # JSON data files
├── src/
│   ├── app/               # Next.js pages & routes
│   ├── features/          # Feature modules
│   ├── shared/            # Shared components & utils
│   ├── core/              # Domain entities & repositories
│   └── infrastructure/    # Data access & external services
```

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Griya Flora Babulu
```

## Deployment

Easily deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RahmatRafiq/griyaflora-babulu)

## License

© 2024 Griya Flora Babulu. All rights reserved.
