-- ==============================================================================
-- MIGRATION: Add category column to projects table
-- ==============================================================================
-- This migration adds a category field to the projects table to support
-- filtering projects by type (Web Application, Mobile Application, UI/UX Design, IoT)
-- ==============================================================================

-- Add category column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Web Application';

-- Update existing projects with default category if needed
-- (You can manually update specific projects after running this migration)

-- Optional: Add index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

-- ==============================================================================
-- DATA SEED: Add CV. Karya Nugraha project
-- ==============================================================================

INSERT INTO public.projects (
    title,
    description,
    tech_stack,
    category,
    demo_url,
    github_url,
    image_file,
    order_index
) VALUES (
    'CV. Karya Nugraha – Sistem Informasi Pergudangan',
    'Perancangan prototype aplikasi Sistem Informasi Pergudangan untuk CV. Karya Nugraha menggunakan Figma. Aplikasi ini dirancang untuk membantu proses pengelolaan stok barang, pencatatan barang masuk dan keluar, pengelolaan permintaan barang, serta penyajian laporan pergudangan.

Prototype mencakup beberapa halaman dan alur navigasi:
• Splash Screen
• Login
• Dashboard
• Data Barang
• Tambah Barang
• Barang Masuk
• Barang Keluar
• Permintaan Barang
• Detail Permintaan
• Laporan',
    'Figma',
    'UI/UX Design',
    'https://www.figma.com/design/dZ5No6GYeCDb0HTYda7gDn/CV.KARYA-NUGRAHA?node-id=0-1&p=f&t=6LCWjcF9NxPiPgum-0',
    NULL,
    'Mockup Aplikasi Pergudangan KN.png',
    1
) ON CONFLICT DO NOTHING;

-- ==============================================================================
-- NOTES:
-- 1. Run this migration in your Supabase SQL Editor
-- 2. After migration, update existing projects with appropriate categories
-- 3. The CV. Karya Nugraha project will be added automatically
-- ==============================================================================
