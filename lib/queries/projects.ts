import { supabase } from '../supabaseClient';
import { Project } from '../types';

// Fallback data untuk development (ketika Supabase belum dikonfigurasi)
const fallbackProjects: Project[] = [
  {
    id: 3,
    title: 'WarungKu – Aplikasi Pemesanan Warung Online',
    description: 'WarungKu adalah aplikasi mobile berbasis Flutter yang memudahkan masyarakat dalam melakukan pemesanan makanan atau produk warung secara online. Aplikasi ini dilengkapi dengan fitur login, tampilan produk warung, detail produk lengkap, pengelolaan produk (tambah/edit), pengaturan aplikasi, dan sistem autentikasi. Dikembangkan dengan desain dark theme modern dan navigasi yang intuitif untuk memberikan pengalaman berbelanja yang praktis tanpa harus datang langsung ke lokasi.',
    tech_stack: 'Flutter, Dart',
    category: 'Mobile Application',
    demo_url: null,
    github_url: 'https://github.com/ariajaa/warungku',
    image_file: 'warungku.jpg',
    order_index: 1,
  },
  {
    id: 2,
    title: 'KKL Informatika UPGRIS 2026 – Bali Trip Journal',
    description: 'Perancangan dan pengembangan website Bali Trip Journal sebagai media dokumentasi kegiatan Kuliah Kerja Lapangan (KKL) Prodi Informatika Universitas PGRI Semarang tahun 2026. Website ini menyajikan informasi perjalanan Kelompok 6 dari Semarang menuju Bali, mulai dari jadwal perjalanan, rute, kunjungan industri, galeri dokumentasi, hingga profil anggota kelompok.',
    tech_stack: 'HTML, CSS, JavaScript',
    category: 'Web Design',
    demo_url: 'https://kkl-kelompok6.vercel.app/',
    github_url: null,
    image_file: 'bali-trip-journal.png',
    order_index: 2,
  },
  {
    id: 1,
    title: 'CV. Karya Nugraha – Sistem Informasi Pergudangan',
    description: 'Perancangan prototype aplikasi Sistem Informasi Pergudangan untuk CV. Karya Nugraha menggunakan Figma. Prototype mencakup dashboard, data barang, tambah barang, barang masuk, barang keluar, permintaan barang, detail permintaan, dan laporan.',
    tech_stack: 'Figma',
    category: 'UI/UX Design',
    demo_url: 'https://www.figma.com/design/dZ5No6GYeCDb0HTYda7gDn/CV.KARYA-NUGRAHA?node-id=0-1&p=f&t=6LCWjcF9NxPiPgum-0',
    github_url: null,
    image_file: 'Mockup Aplikasi Pergudangan KN.png',
    order_index: 3,
  },
];

export async function getProjects(): Promise<Project[]> {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co';

    // If Supabase not configured, return fallback data
    if (!isSupabaseConfigured) {
      console.log('[DEV MODE] Using fallback projects data');
      return fallbackProjects;
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: false });

    if (error || !data) {
      console.warn('[Supabase] Error fetching projects, using fallback:', error?.message);
      return fallbackProjects;
    }
    
    return data as Project[];
  } catch (err) {
    console.warn('[Supabase] Exception fetching projects, using fallback:', err);
    return fallbackProjects;
  }
}
