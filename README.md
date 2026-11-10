# Portfolio Juniari Nur Shofa

Situs portofolio pribadi berbasis Next.js 14 App Router dan Supabase. Halaman publik menampilkan profil, skills, proyek, pengalaman, sertifikat, dan form kontak. Dashboard admin tersedia di `/admin` untuk mengelola konten.

## Stack

- Next.js 14 (App Router, TypeScript)
- React 18
- Supabase (database, storage, auth admin)
- CSS murni dengan design token di `styles/`

## Menjalankan

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Environment

Isi `.env.local` (jangan commit file ini):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Tanpa konfigurasi Supabase, halaman publik tetap tampil memakai data fallback di `lib/queries/*`. Form kontak akan mengembalikan pesan bahwa layanan belum dikonfigurasi.

## Struktur

```text
app/            halaman publik, admin, dan API route
components/     komponen halaman publik
lib/            tipe, klien Supabase, query data
styles/         token dan stylesheet publik/admin
supabase/       schema dan migrasi SQL
public/assets/  foto, gambar proyek, CV, sertifikat
```

## Skrip

```bash
npm run dev              # server pengembangan
npm run build            # build produksi
npm run start            # jalankan hasil build
npm run lint             # ESLint Next.js
npm run migration:dry-run
```

## Catatan

- Sertifikat dibaca dari tabel `certificates`. Jika tabel kosong atau Supabase belum diatur, daftar fallback di `lib/queries/certificates.ts` yang dipakai.
- Untuk menambahkan sertifikat Gemini ke database, jalankan `supabase/add_gemini_certificate.sql` setelah schema utama.
- Animasi memakai `IntersectionObserver` dan CSS, tanpa library tambahan, dan otomatis nonaktif saat `prefers-reduced-motion: reduce`.
