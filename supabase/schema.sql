-- ==============================================================================
-- DATABASE SCHEMA: Supabase PostgreSQL for JNS Portfolio
-- Sesuai dengan struktur dan data asli database.sql (portfolio_juniari)
-- ==============================================================================

-- 1. Table: profile
CREATE TABLE IF NOT EXISTS public.profile (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    hero_subtitle TEXT NOT NULL,
    about_description TEXT NOT NULL,
    education VARCHAR(255) NOT NULL,
    domicile VARCHAR(100) NOT NULL,
    interests TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    cv_file VARCHAR(255) DEFAULT NULL,
    photo_file VARCHAR(255) DEFAULT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Table: skills
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Teknis',
    level_percent INT DEFAULT 85,
    icon_class VARCHAR(50) DEFAULT 'ri-checkbox-circle-line',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Table: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    demo_url VARCHAR(255) DEFAULT NULL,
    github_url VARCHAR(255) DEFAULT NULL,
    image_file VARCHAR(255) DEFAULT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Table: experiences
CREATE TABLE IF NOT EXISTS public.experiences (
    id SERIAL PRIMARY KEY,
    role VARCHAR(150) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    period VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Organisasi',
    description TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Table: certificates
CREATE TABLE IF NOT EXISTS public.certificates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    year VARCHAR(10) NOT NULL,
    credential_url VARCHAR(255) DEFAULT NULL,
    image_file VARCHAR(255) DEFAULT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Table: messages
CREATE TABLE IF NOT EXISTS public.messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(150) DEFAULT 'Pesan dari Form Kontak Portfolio',
    message TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. Table: admins (untuk referensi metadata admin)
CREATE TABLE IF NOT EXISTS public.admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- 1. Profile Policies:
-- Public can read
CREATE POLICY "Allow public read access to profile"
    ON public.profile FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated admin can update
CREATE POLICY "Allow authenticated full access to profile"
    ON public.profile FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Skills Policies:
CREATE POLICY "Allow public read access to skills"
    ON public.skills FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated full access to skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Projects Policies:
CREATE POLICY "Allow public read access to projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated full access to projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Experiences Policies:
CREATE POLICY "Allow public read access to experiences"
    ON public.experiences FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated full access to experiences"
    ON public.experiences FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Certificates Policies:
CREATE POLICY "Allow public read access to certificates"
    ON public.certificates FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated full access to certificates"
    ON public.certificates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Messages Policies:
-- Anyone can submit message (public insert)
CREATE POLICY "Allow public insert to messages"
    ON public.messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated can view, update (mark as read), or delete messages
CREATE POLICY "Allow authenticated full access to messages"
    ON public.messages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Admins Policies:
CREATE POLICY "Allow authenticated access to admins"
    ON public.admins FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
-- Buckets yang dibutuhkan:
-- 1. 'profile'      (public) untuk foto profil & CV
-- 2. 'projects'     (public) untuk thumbnail proyek
-- 3. 'certificates' (public) untuk file sertifikat (jpg/png/pdf)
-- 4. 'files'        (public) untuk CV & dokumen publik lainnya

INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('profile', 'profile', true),
    ('projects', 'projects', true),
    ('certificates', 'certificates', true),
    ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies: Public read, Authenticated write
CREATE POLICY "Public read storage objects"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id IN ('profile', 'projects', 'certificates', 'files'));

CREATE POLICY "Authenticated upload storage objects"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id IN ('profile', 'projects', 'certificates', 'files'));

CREATE POLICY "Authenticated update storage objects"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id IN ('profile', 'projects', 'certificates', 'files'));

CREATE POLICY "Authenticated delete storage objects"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id IN ('profile', 'projects', 'certificates', 'files'));
