# 🔧 Panduan Konfigurasi Supabase untuk Portfolio

## ⚠️ PENTING: Contact Form Belum Berfungsi

Fitur pengiriman pesan melalui form Contact saat ini **belum berfungsi** karena Supabase belum dikonfigurasi.

Pesan error yang muncul:
```
"Fitur pengiriman pesan belum dikonfigurasi. Silakan hubungi melalui email atau WhatsApp yang tertera."
```

---

## 📋 Langkah-Langkah Konfigurasi

### 1. Buat Project Supabase

1. Login ke [https://supabase.com](https://supabase.com)
2. Klik **"New Project"**
3. Pilih Organization atau buat baru
4. Isi informasi project:
   - **Name:** `portfolio-juniari` (atau nama lain)
   - **Database Password:** Buat password yang kuat (simpan dengan aman)
   - **Region:** Pilih yang terdekat (misalnya: `Southeast Asia (Singapore)`)
5. Klik **"Create new project"** (tunggu 1-2 menit)

---

### 2. Ambil Kredensial API

1. Setelah project selesai dibuat, masuk ke **Settings** > **API**
2. Salin 3 nilai berikut:

**a. Project URL**
```
https://xxxxx.supabase.co
```
Salin ke `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`

**b. anon public (API Key)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Salin ke `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**c. service_role (Secret)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Salin ke `.env.local` → `SUPABASE_SERVICE_ROLE_KEY`

---

### 3. Update File .env.local

Buka file `.env.local` dan isi dengan nilai yang sudah disalin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **JANGAN** commit file ini ke Git!

---

### 4. Jalankan SQL Schema

1. Di Supabase Dashboard, masuk ke **SQL Editor**
2. Klik **"New query"**
3. Buka file `supabase/schema.sql` dari project
4. Copy seluruh isi file dan paste ke SQL Editor
5. Klik **"Run"** (atau tekan Ctrl/Cmd + Enter)
6. Pastikan semua query berhasil (tidak ada error merah)

**Tabel yang akan dibuat:**
- ✅ `profile` - Data profil portofolio
- ✅ `skills` - Daftar skills
- ✅ `projects` - Daftar project
- ✅ `experiences` - Pengalaman kerja
- ✅ `certificates` - Sertifikat
- ✅ **`messages`** - **Pesan dari Contact form** ← PENTING untuk Contact
- ✅ `admins` - Data admin dashboard

**RLS Policies yang akan dibuat:**
- ✅ Public dapat insert ke tabel `messages` (untuk Contact form)
- ✅ Public hanya bisa read data profil, skills, projects, dll
- ✅ Authenticated admin dapat CRUD semua data

---

### 5. Verifikasi Tabel Messages

Setelah schema dijalankan, verifikasi bahwa tabel `messages` sudah dibuat:

1. Masuk ke **Table Editor**
2. Cari tabel **"messages"**
3. Struktur kolom harus seperti ini:
   - `id` (int4, primary key)
   - `name` (varchar(100), not null)
   - `email` (varchar(100), not null)
   - `subject` (varchar(150), default)
   - `message` (text, not null)
   - `ip_address` (varchar(50), nullable)
   - `is_read` (boolean, default false)
   - `created_at` (timestamptz, auto)

4. Cek RLS Policy:
   - Klik icon **Shield** di sebelah nama tabel
   - Pastikan ada policy: **"Allow public insert to messages"**
   - Policy ini memungkinkan pengunjung mengirim pesan tanpa login

---

### 6. Restart Development Server

Setelah `.env.local` dikonfigurasi:

```bash
# Stop server yang sedang berjalan (Ctrl+C)

# Restart server
npm run dev
```

Server akan membaca kredensial baru dari `.env.local`.

---

## ✅ Cara Menguji Contact Form

1. Buka browser: `http://localhost:3000`
2. Scroll ke bagian **"Hubungi Saya"** / Contact
3. Isi form:
   - **Nama Lengkap:** Test User
   - **Alamat Email:** test@example.com
   - **Pesan:** Ini pesan test dari form contact
4. Klik **"Kirim Pesan"**

**Jika berhasil:**
```
✓ Pesan berhasil dikirim! Terima kasih telah menghubungi saya.
```
Form akan dikosongkan otomatis.

**Jika masih gagal:**
- Cek console browser (F12) untuk error
- Cek terminal server untuk log error dari Supabase
- Verifikasi kredensial di `.env.local` sudah benar
- Pastikan tabel `messages` dan RLS policy sudah ada

---

## 📊 Melihat Pesan yang Masuk

Setelah berhasil, pesan tersimpan di database Supabase:

1. Masuk ke **Table Editor**
2. Pilih tabel **"messages"**
3. Semua pesan dari pengunjung akan muncul di sini
4. Kolom `is_read` untuk menandai pesan yang sudah dibaca

**Nanti di Dashboard Admin:**
Pesan-pesan ini bisa diakses melalui dashboard admin di `/admin/messages`.

---

## 🔒 Keamanan RLS

### Pengunjung Publik (Anon):
- ✅ **Boleh:** Insert pesan baru ke tabel `messages`
- ❌ **Tidak boleh:** Read/update/delete pesan orang lain
- ❌ **Tidak boleh:** Akses tabel lain (profile, projects, dll hanya read)

### Admin Authenticated:
- ✅ **Boleh:** Read semua pesan
- ✅ **Boleh:** Update (mark as read)
- ✅ **Boleh:** Delete pesan
- ✅ **Boleh:** CRUD semua tabel

### Service Role (Server-side only):
- ✅ **Bypass semua RLS** (hanya digunakan di API routes)
- ❌ **TIDAK PERNAH diekspos ke browser**

---

## 🚨 Troubleshooting

### Error: "Gagal menyimpan pesan ke database"

**Penyebab umum:**
1. `.env.local` belum dikonfigurasi
2. Kredensial salah
3. Tabel `messages` belum dibuat
4. RLS policy belum dibuat

**Solusi:**
- Ulangi langkah 2-4 di atas
- Restart server setelah update `.env.local`

---

### Error: "new row violates row-level security policy"

**Penyebab:**
RLS policy untuk public insert belum ada.

**Solusi:**
Jalankan query ini di SQL Editor:

```sql
CREATE POLICY "Allow public insert to messages"
    ON public.messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
```

---

### Error: "relation 'public.messages' does not exist"

**Penyebab:**
Tabel `messages` belum dibuat.

**Solusi:**
Jalankan schema.sql lengkap atau minimal query ini:

```sql
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

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
```

---

## 📝 Catatan Penting

1. **Service Role Key sangat rahasia!**
   - Jangan pernah commit ke Git
   - Jangan share ke orang lain
   - Hanya digunakan di server-side (API routes)

2. **Anon Key aman untuk browser**
   - Boleh diekspos ke client (NEXT_PUBLIC_*)
   - Tetap terlindungi oleh RLS policies

3. **Backup Database**
   - Supabase otomatis backup daily (plan berbayar)
   - Untuk free tier, export manual berkala

---

## 📞 Jika Masih Bermasalah

Jika setelah mengikuti panduan ini Contact form masih belum berfungsi:

1. Cek terminal server untuk log error detail
2. Cek browser console (F12) untuk error client-side
3. Screenshot error dan bagikan untuk debugging lebih lanjut
4. Sementara waktu, pengunjung bisa kontak via email/WhatsApp langsung

---

**Setelah konfigurasi selesai, website akan fully functional! 🚀**
