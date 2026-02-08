-- =====================================================
-- INITIAL SCHEMA & POLICIES
-- Complete database setup for ISMKI/Kemafar organization
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'kontributor'::text CHECK (role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'kontributor'::text])),
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Articles table
CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['post'::text, 'blog'::text, 'opinion'::text, 'publication'::text, 'info'::text])),
  author jsonb NOT NULL,
  author_id uuid,
  status text DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'pending'::text, 'published'::text, 'archived'::text])),
  cover_image text NOT NULL,
  published_at timestamp with time zone NOT NULL,
  updated_at timestamp with time zone,
  tags text[] DEFAULT '{}'::text[],
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  images text[] DEFAULT '{}'::text[],
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id)
);

-- Events table
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['seminar'::text, 'workshop'::text, 'community-service'::text, 'competition'::text, 'training'::text, 'other'::text])),
  status text NOT NULL CHECK (status = ANY (ARRAY['upcoming'::text, 'ongoing'::text, 'completed'::text, 'cancelled'::text])),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location jsonb NOT NULL,
  cover_image text NOT NULL,
  images text[],
  organizer jsonb NOT NULL,
  registration_url text,
  registration_deadline timestamp with time zone,
  max_participants integer,
  current_participants integer DEFAULT 0,
  tags text[] DEFAULT '{}'::text[],
  featured boolean DEFAULT false,
  author_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id)
);

-- Leadership table
CREATE TABLE public.leadership (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  position text NOT NULL CHECK ("position" = ANY (ARRAY['ketua'::text, 'wakil-ketua'::text, 'sekretaris'::text, 'bendahara'::text, 'coordinator'::text, 'member'::text])),
  division text CHECK (division = ANY (ARRAY['internal-affairs'::text, 'external-affairs'::text, 'academic'::text, 'student-development'::text, 'entrepreneurship'::text, 'media-information'::text, 'sports-arts'::text, 'islamic-spirituality'::text])),
  photo text NOT NULL,
  email text,
  phone text,
  nim text,
  batch text,
  bio text,
  social_media jsonb,
  period_start date NOT NULL,
  period_end date NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leadership_pkey PRIMARY KEY (id)
);

-- Members table
CREATE TABLE public.members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  nim text NOT NULL UNIQUE,
  email text NOT NULL,
  phone text,
  photo text,
  batch text NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'alumni'::text])),
  division text,
  position text,
  joined_at timestamp with time zone NOT NULL,
  graduated_at timestamp with time zone,
  bio text,
  interests text[],
  achievements text[],
  social_media jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id)
);

-- Organization timeline table
CREATE TABLE public.organization_timeline (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  year character varying NOT NULL CHECK (year::text ~ '^\d{4}$'::text),
  title character varying NOT NULL,
  description text NOT NULL,
  order_index integer DEFAULT 0,
  author_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  CONSTRAINT organization_timeline_pkey PRIMARY KEY (id),
  CONSTRAINT organization_timeline_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id),
  CONSTRAINT organization_timeline_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT organization_timeline_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Site settings table
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE CHECK (key = ANY (ARRAY['home'::text, 'about'::text])),
  content jsonb NOT NULL,
  updated_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id),
  CONSTRAINT site_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - PROFILES
-- =====================================================

CREATE POLICY "System can insert profile"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      -- Role tidak berubah (user tidak bisa promote diri sendiri)
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      OR
      -- Atau user adalah super_admin (bisa ubah role siapapun)
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'super_admin'
      )
    )
  );

-- =====================================================
-- RLS POLICIES - ARTICLES
-- =====================================================

CREATE POLICY "Admin view all"
  ON public.articles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin insert all"
  ON public.articles
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin update all"
  ON public.articles
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin delete all"
  ON public.articles
  FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Kontributor create"
  ON public.articles
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'kontributor'
    )
  );

CREATE POLICY "Kontributor view own"
  ON public.articles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'kontributor'
      AND auth.uid() = articles.author_id
    )
  );

CREATE POLICY "Kontributor update own draft"
  ON public.articles
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'kontributor'
      AND auth.uid() = articles.author_id
      AND articles.status = 'draft'
    )
  );

CREATE POLICY "Public can view published articles"
  ON public.articles
  FOR SELECT
  TO public
  USING (status = 'published');

-- =====================================================
-- RLS POLICIES - EVENTS
-- =====================================================

CREATE POLICY "Admin full access events"
  ON public.events
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Kontributor create events"
  ON public.events
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'kontributor'
    )
  );

CREATE POLICY "Kontributor update own events"
  ON public.events
  FOR UPDATE
  TO public
  USING (auth.uid() = author_id);

CREATE POLICY "Public can view events"
  ON public.events
  FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- RLS POLICIES - LEADERSHIP
-- =====================================================

CREATE POLICY "Admin full access leadership"
  ON public.leadership
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Public can view leadership"
  ON public.leadership
  FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- RLS POLICIES - MEMBERS
-- =====================================================

CREATE POLICY "Admin full access members"
  ON public.members
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Public can view active members"
  ON public.members
  FOR SELECT
  TO public
  USING (status = 'active');

-- =====================================================
-- RLS POLICIES - ORGANIZATION TIMELINE
-- =====================================================

CREATE POLICY "Admin full access timeline"
  ON public.organization_timeline
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Public can view timeline"
  ON public.organization_timeline
  FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- RLS POLICIES - SITE SETTINGS
-- =====================================================

CREATE POLICY "Admin can insert site settings"
  ON public.site_settings
  FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can update site settings"
  ON public.site_settings
  FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO public
  USING (true);

-- =====================================================
-- INDEXES (Optional but recommended for performance)
-- =====================================================

CREATE INDEX articles_author_id_idx ON public.articles(author_id);
CREATE INDEX articles_status_idx ON public.articles(status);
CREATE INDEX articles_slug_idx ON public.articles(slug);

CREATE INDEX events_author_id_idx ON public.events(author_id);
CREATE INDEX events_status_idx ON public.events(status);
CREATE INDEX events_slug_idx ON public.events(slug);
CREATE INDEX events_start_date_idx ON public.events(start_date);

CREATE INDEX members_nim_idx ON public.members(nim);
CREATE INDEX members_status_idx ON public.members(status);

CREATE INDEX organization_timeline_author_id_idx ON public.organization_timeline(author_id);
CREATE INDEX organization_timeline_year_idx ON public.organization_timeline(year);

-- =====================================================
-- STORAGE SETUP
-- =====================================================

-- Create article-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Allow PUBLIC READ access to article-images bucket
CREATE POLICY "Public can view article images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Allow AUTHENTICATED users to INSERT images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Allow AUTHENTICATED users to UPDATE their own images
CREATE POLICY "Authenticated users can update their article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images');

-- Allow AUTHENTICATED users to DELETE their own images
CREATE POLICY "Authenticated users can delete their article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'kontributor'
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GRANTS
-- =====================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
