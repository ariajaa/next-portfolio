-- Komentar publik di bagian kontak.
-- Jalankan di Supabase SQL editor sebelum mengaktifkan kolom komentar.

CREATE TABLE IF NOT EXISTS public.comments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
    message TEXT NOT NULL CHECK (char_length(message) BETWEEN 2 AND 500),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments (created_at DESC);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read comments" ON public.comments;
CREATE POLICY "Allow public read comments"
    ON public.comments FOR SELECT
    USING (true);

-- Penulisan hanya lewat /api/comments memakai service role key, jadi tidak ada
-- policy insert untuk anon.
DROP POLICY IF EXISTS "Allow authenticated full access to comments" ON public.comments;
CREATE POLICY "Allow authenticated full access to comments"
    ON public.comments FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('comments', 'comments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read comment photos" ON storage.objects;
CREATE POLICY "Allow public read comment photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'comments');
