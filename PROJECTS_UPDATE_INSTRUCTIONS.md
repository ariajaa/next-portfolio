# Instruksi Update Projects dengan Kategori

## 🔄 Status Implementasi

✅ **SELESAI:**
- Komponen ProjectsSection dengan desain horizontal list
- Filter kategori (Semua, Web Application, Mobile Application, UI/UX Design, IoT)
- Fitur pencarian project
- Desain responsive untuk desktop, tablet, dan mobile
- Type definition untuk field `category`
- CSS styling lengkap
- Migration SQL untuk menambah kolom category

❌ **BELUM DILAKUKAN:**
- Koneksi ke database Supabase (memerlukan kredensial `.env.local`)
- Menjalankan migration SQL di Supabase
- Upload gambar project ke Supabase Storage

---

## 📋 Langkah-Langkah Setup Database

### 1. Setup Environment Variables

Buat file `.env.local` di root folder `next-portfolio` dengan isi:

```env
# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Private Configuration
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Ganti dengan kredensial Supabase Anda yang sebenarnya.**

---

### 2. Jalankan Migration SQL

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy isi file `supabase/add_category_to_projects.sql`
3. Paste dan jalankan di SQL Editor
4. Migration akan:
   - Menambah kolom `category` ke tabel `projects`
   - Membuat index untuk performa filter
   - Menambahkan project **CV. Karya Nugraha** secara otomatis

---

### 3. Upload Gambar Project ke Supabase Storage

**File gambar yang tersedia:**
- `public/assets/uploads/projects/Mockup Aplikasi Pergudangan KN.png`

**Langkah upload:**

1. Buka **Supabase Dashboard** → **Storage** → **projects bucket**
2. Upload file `Mockup Aplikasi Pergudangan KN.png`
3. Pastikan file dapat diakses publik
4. Nama file di database sudah sesuai: `Mockup Aplikasi Pergudangan KN.png`

**ATAU**

Jika ingin menggunakan local assets (untuk development):

Gambar sudah tersedia di `public/assets/uploads/projects/` dan akan otomatis diambil oleh fungsi `getStorageUrl()` jika Supabase Storage belum dikonfigurasi.

---

## 🎨 Perubahan yang Dilakukan

### File yang Diubah:

1. **`components/ProjectsSection.tsx`** (DIGANTI TOTAL)
   - Tambah state untuk filter kategori
   - Tambah state untuk pencarian
   - Implementasi logika filter & search
   - Desain horizontal list dengan thumbnail kiri, konten tengah, arrow kanan

2. **`lib/types.ts`**
   - Tambah field `category?: string` pada interface Project

3. **`styles/style.css`**
   - Tambah styles untuk `.projects-controls`
   - Tambah styles untuk `.projects-filters` dan `.projects-filter-btn`
   - Tambah styles untuk `.projects-search`
   - Tambah styles untuk `.projects-list` dan `.project-item`
   - Tambah styles untuk `.project-thumbnail`, `.project-content`, `.project-action`
   - Tambah responsive styles untuk mobile & tablet

### File Baru:

1. **`supabase/add_category_to_projects.sql`**
   - Migration untuk menambah kolom category
   - Insert data project CV. Karya Nugraha

2. **`PROJECTS_UPDATE_INSTRUCTIONS.md`** (file ini)
   - Dokumentasi lengkap update

---

## 🎯 Fitur yang Ditambahkan

### Filter Kategori
- 5 kategori: Semua, Web Application, Mobile Application, UI/UX Design, IoT
- Button dengan active state
- Smooth transition

### Pencarian
- Search box dengan icon
- Mencari di: title, description, tech_stack
- Clear button untuk reset pencarian
- Real-time filtering

### Desain Horizontal List
- ✅ Thumbnail project di kiri (200x140px)
- ✅ Nomor urut project (01, 02, 03, dst)
- ✅ Judul project yang menonjol
- ✅ Badge kategori dengan warna accent
- ✅ Deskripsi project (max 3 baris dengan ellipsis)
- ✅ Info teknologi/tools dengan icon
- ✅ Ikon arrow di kanan (hover effect)
- ✅ Garis pembatas antarproject
- ✅ Hover effect pada setiap item

### Responsive Design
- **Desktop (>992px)**: Full horizontal layout
- **Tablet (768-992px)**: Thumbnail lebih kecil
- **Mobile (<768px)**: Stack vertical, thumbnail full width

---

## 🧪 Testing & Verifikasi

### Setelah Setup Database:

1. ✅ Project CV. Karya Nugraha muncul di list
2. ✅ Thumbnail project dimuat dengan benar
3. ✅ Filter "UI/UX Design" menampilkan project CV. Karya Nugraha
4. ✅ Pencarian dengan kata "pergudangan" menemukan project
5. ✅ Tombol arrow membuka link Figma di tab baru
6. ✅ Badge kategori "UI/UX Design" muncul
7. ✅ Nomor urut project sesuai
8. ✅ Tampilan responsive di mobile

### Build Testing:

```bash
npm run build
```

Pastikan tidak ada error terkait ProjectsSection.

---

## 📝 Data Project CV. Karya Nugraha

```sql
{
  title: 'CV. Karya Nugraha – Sistem Informasi Pergudangan',
  category: 'UI/UX Design',
  tech_stack: 'Figma',
  demo_url: 'https://www.figma.com/design/dZ5No6GYeCDb0HTYda7gDn/CV.KARYA-NUGRAHA?node-id=0-1&p=f&t=6LCWjcF9NxPiPgum-0',
  github_url: null,
  image_file: 'Mockup Aplikasi Pergudangan KN.png',
  description: 'Perancangan prototype aplikasi Sistem Informasi Pergudangan untuk CV. Karya Nugraha menggunakan Figma...'
}
```

---

## ⚠️ Catatan Penting

1. **Jangan lupa setup `.env.local`** sebelum menjalankan dev server
2. **Migration harus dijalankan** sebelum data project dengan kategori bisa berfungsi
3. **Project lama** yang belum punya kategori akan default ke "Web Application"
4. **Gambar project** harus diupload ke Supabase Storage bucket `projects`
5. **Filter dan pencarian** bekerja di client-side untuk performa optimal

---

## 🚀 Next Steps

1. Setup kredensial Supabase di `.env.local`
2. Jalankan migration SQL
3. Upload gambar project ke Storage
4. Test filter dan pencarian
5. Verifikasi tampilan mobile
6. Update kategori project lama (jika ada)

---

**Update dilakukan pada:** 5 November 2026  
**Developer:** Kiro AI Assistant  
**Project:** Portfolio Juniari Nur Shofa - Next.js Migration
