-- Tambahkan sertifikat Gemini ke tabel certificates.
-- Jalankan hanya jika Supabase sudah dikonfigurasi dan tabel certificates dipakai.
-- Jika Supabase masih placeholder, entri ini sudah ada di fallbackCertificates.

INSERT INTO public.certificates (title, issuer, year, credential_url, image_file, order_index)
SELECT
  'Gemini Academy for Higher Education',
  'Google for Education × Paideia',
  '2026',
  '/assets/uploads/certificates/SERTIFIKASI GEMINI.pdf',
  'SERTIFIKASI GEMINI.png',
  0
WHERE NOT EXISTS (
  SELECT 1 FROM public.certificates WHERE image_file = 'SERTIFIKASI GEMINI.png'
);
