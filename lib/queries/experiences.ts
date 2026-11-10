import { supabase } from '../supabaseClient';
import { Experience } from '../types';

export const fallbackExperiences: Experience[] = [
  {
    id: 1,
    role: 'Anggota Aktif',
    organization: 'BEM Fakultas Teknik dan Informatika',
    period: '2023 - Sekarang',
    type: 'Organisasi',
    description:
      'Berpartisipasi aktif dalam kegiatan kemahasiswaan, kepanitiaan program kerja fakultas, serta mengasah keterampilan komunikasi dan kepemimpinan dalam lingkup organisasi kampus.',
    order_index: 1,
  },
  {
    id: 2,
    role: 'Staf / Pengalaman Kerja',
    organization: 'PT. Jusfluff Nusantara Indonesia',
    period: '2023 - 2024',
    type: 'Pekerjaan',
    description:
      'Mendukung operasional harian, manajemen tugas secara terstruktur, kolaborasi antar divisi, serta penerapan kedisiplinan kerja profesional.',
    order_index: 2,
  },
  {
    id: 3,
    role: 'Staf Operasional',
    organization: 'Fotocopy Pantes Pemalang',
    period: '2021 - 2022',
    type: 'Pekerjaan',
    description:
      'Melayani kebutuhan percetakan, pengolahan dokumen digital, administrasi ringan, serta pelayanan konsumen dengan standar kepuasan yang tinggi.',
    order_index: 3,
  },
  {
    id: 4,
    role: 'Mahasiswa Sarjana (S1)',
    organization: 'Universitas PGRI Semarang',
    period: '2022 - Sekarang',
    type: 'Pendidikan',
    description:
      'Menempuh pendidikan sarjana Program Studi Informatika dengan fokus pembelajaran algoritma pemrograman, rekayasa perangkat lunak, basis data, dan desain antarmuka pengguna.',
    order_index: 4,
  },
];

export async function getExperiences(): Promise<Experience[]> {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackExperiences;
    }
    return data as Experience[];
  } catch {
    return fallbackExperiences;
  }
}
