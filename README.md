# HMJF UIN Alauddin Makassar - Website Kompro

Website resmi Himpunan Mahasiswa Jurusan Farmasi (HMJF) UIN Alauddin Makassar. Platform komprehensif untuk mengelola informasi organisasi, artikel, acara, anggota, dan kepengurusan.

## ✨ Features

### Public Pages
- 🏠 **Homepage** - Landing page dengan informasi organisasi
- 📰 **Articles** - Sistem publikasi artikel dengan kategori (Post, Blog, Opinion, Publication, Info)
- 📅 **Events** - Manajemen event dengan status (Upcoming, Ongoing, Completed, Cancelled)
- 👥 **Members** - Database anggota dengan filter batch & status
- 👔 **Leadership** - Struktur kepengurusan dengan divisi

### Admin Panel
- 🔐 **Authentication** - JWT-based auth dengan role management (Super Admin, Admin, Kontributor)
- 📝 **Article Management** - CRUD artikel dengan Markdown editor
- 🎪 **Event Management** - CRUD event dengan kategori lengkap
- 👨‍💼 **Leadership Management** - Manajemen struktur kepengurusan
- 👤 **User Management** - Kelola user dan role assignment
- 📊 **Dashboard** - Statistik dan overview data

### UI/UX Features
- 🎨 **Modern Design** - Tailwind CSS dengan komponen reusable
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Loading States** - Skeleton loaders untuk better UX
- ❌ **Error Handling** - Dedicated error pages dengan retry functionality
- 🔍 **Not Found Pages** - Custom 404 pages per route
- ✍️ **Markdown Support** - Rich text editing dengan syntax highlighting
- 🖼️ **Image Optimization** - Next.js Image component
- 🌙 **Floating Dock** - Modern navigation component

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Lucide Icons
- **Markdown**: React Markdown + Turndown (HTML to MD conversion)
- **Date Handling**: date-fns
- **Notifications**: Sonner (toast notifications)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase Client
- **Authentication**: Supabase Auth (JWT)
- **RLS**: Row Level Security dengan JWT claims
- **Storage**: Supabase Storage (untuk images)

### Architecture
- **Pattern**: Clean Architecture
- **Data Access**: Repository Pattern
- **State Management**: React Context (Auth)
- **Type Safety**: Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/griyaflora_babulu.git
cd griyaflora_babulu

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local dengan Supabase credentials kamu
```

### Database Setup (Cloud-Based)

> **Note**: Semua setup database dilakukan di Supabase Dashboard (cloud-based). Tidak perlu Supabase CLI lokal.

1. **Create Supabase Project**
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy **Project URL** dan **Anon Key** dari Settings → API

2. **Run Migration di SQL Editor**
   - Buka **SQL Editor** di Supabase Dashboard
   - Copy isi file `supabase/migrations/20240122000000_initial_schema.sql`
   - Paste dan **Run** di SQL Editor
   - Tunggu hingga selesai (create tables, RLS policies, functions)

3. **Seed Data Articles (Optional)**
   - Di **SQL Editor**, copy isi file `supabase/seed-articles.sql`
   - Paste dan **Run** untuk insert 82 artikel dari kemafar.org
   - Proses memakan waktu ~30 detik

4. **Create First Admin User**
   - Signup melalui aplikasi (http://localhost:3000/admin/login)
   - Di Supabase Dashboard → **Authentication** → **Users**
   - Click user yang baru dibuat → Edit user
   - Tambahkan di `raw_app_meta_data`:
     ```json
     {
       "role": "super_admin"
     }
     ```
   - Save → Logout → Login kembali

### Environment Variables

Update `.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="HMJF UIN Alauddin"

# WhatsApp Configuration
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Feature Flags (set to true setelah migration selesai)
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
NEXT_PUBLIC_USE_SUPABASE_EVENTS=true
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=true
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
griyaflora_babulu/
├── public/
│   └── data/              # Legacy JSON data files
├── src/
│   ├── app/
│   │   ├── (public)/      # Public pages (/, /articles, /events, dll)
│   │   ├── admin/         # Admin panel routes
│   │   └── api/           # API routes
│   ├── core/
│   │   ├── domain/        # Entities & interfaces
│   │   └── repositories/  # Repository interfaces
│   ├── infrastructure/
│   │   └── repositories/  # Supabase implementations
│   ├── lib/
│   │   ├── auth/          # Authentication context & utils
│   │   ├── supabase/      # Supabase client config
│   │   └── constants.ts   # App constants
│   └── shared/
│       ├── components/    # Reusable UI components
│       └── utils/         # Helper functions
├── scripts/
│   └── scrape-kemafar-articles.ts  # Web scraper untuk seed data
└── supabase/
    ├── migrations/        # Database migrations
    └── seed-articles.sql  # Seed data artikel
```

## 🔐 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full access to everything, manage users & roles |
| **Admin** | CRUD articles, events, leadership, members |
| **Kontributor** | Create & edit own articles (draft/pending only) |

## 📝 Content Management

### Articles
- **Markdown Editor**: WYSIWYG editor dengan preview
- **Categories**: Post, Blog, Opinion, Publication, Info
- **Status**: Draft, Pending, Published, Archived
- **Features**: Cover image, tags, featured flag, view counter

### Events
- **Categories**: Seminar, Workshop, Community Service, Competition, Training, Other
- **Status**: Upcoming, Ongoing, Completed, Cancelled
- **Features**: Location (JSONB), registration URL, participant tracking

### Leadership
- **Positions**: Ketua, Wakil Ketua, Sekretaris, Bendahara, Coordinator, Member
- **Divisions**: 8 divisions (Internal Affairs, External Affairs, Academic, dll)
- **Period Management**: Start/end dates per leadership period

## 🎨 Key Components

### UI Components
- `<MarkdownContent>` - Render Markdown dengan syntax highlighting
- `<MarkdownEditor>` - WYSIWYG Markdown editor
- `<FloatingDock>` - Modern navigation dock
- `<ErrorState>` - Reusable error display dengan retry
- `<Skeleton>` - Loading skeleton components
- `Page Skeletons` - Dedicated skeletons per page type

### Auth Components
- `<AuthContext>` - Global auth state management
- `<AdminLayout>` - Protected admin layout dengan sidebar
- `<Sidebar>` - Admin navigation

## 🌐 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables di Production
Pastikan set semua environment variables di deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Set all `NEXT_PUBLIC_USE_SUPABASE_*` to `true`

## 🔧 Development Tools

### Web Scraper
Script untuk scrape artikel dari kemafar.org:

```bash
# Run scraper
npx tsx scripts/scrape-kemafar-articles.ts

# Output: supabase/seed-articles.sql
```

Features:
- Scrape dari multiple categories
- HTML to Markdown conversion (Turndown)
- Automatic pagination handling
- Rate limiting protection
- Error handling & retry logic

## 📚 Documentation

- [Admin Panel Guide](docs/admin-panel-setup.md)
- [Database Migration Guide](supabase/migrations/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request to `dev` branch

**Branch Strategy:**
- `main` - Production ready code
- `dev` - Development branch (merge here first)
- `feat/*` - Feature branches
- `fix/*` - Bug fix branches

## 📄 License

© 2024 HMJF UIN Alauddin Makassar. All rights reserved.

## 👥 Team

Developed with ❤️ by HMJF UIN Alauddin Makassar Development Team

---

**Tech Stack:** Next.js 14 • TypeScript • Tailwind CSS • Supabase • Vercel
