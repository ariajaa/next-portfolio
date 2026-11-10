import { supabase } from '../supabaseClient';
import { Certificate } from '../types';

export const fallbackCertificates: Certificate[] = [
  {
    id: 7,
    title: 'Kuliah Umum Gemini Academy for Higher Education',
    issuer: 'Google for Education × Paideia',
    year: '2026',
    credential_url: '/assets/uploads/certificates/SERTIFIKASI%20GEMINI.pdf',
    image_file: 'Sertifikat Kuliah Umum Gemini.jpg',
    order_index: 0,
  },
  {
    id: 6,
    title: 'Gemini Academy for Higher Education',
    issuer: 'Google for Education × Paideia',
    year: '2026',
    credential_url: '/assets/uploads/certificates/SERTIFIKASI%20GEMINI.pdf',
    image_file: 'SERTIFIKASI GEMINI.png',
    order_index: 1,
  },
  {
    id: 1,
    title: 'Sertifikat Workshop',
    issuer: 'Universitas PGRI Semarang',
    year: '2024',
    credential_url: null,
    image_file: 'Sertifikat Workshop Juniari Nur Shofa .jpeg',
    order_index: 1,
  },
  {
    id: 2,
    title: 'Sertifikat Pelatihan Pemrograman (Pelpem)',
    issuer: 'HIMFORMA UPGRIS',
    year: '2024',
    credential_url: null,
    image_file: 'Sertifikat Pelpem.jpeg',
    order_index: 2,
  },
  {
    id: 3,
    title: 'Sertifikat Media Kreatif 1',
    issuer: 'BEM FTI UPGRIS',
    year: '2026',
    credential_url: null,
    image_file: 'Sertifikat Medkraf 1.png',
    order_index: 3,
  },
  {
    id: 4,
    title: 'Sertifikat Media Kreatif 2',
    issuer: 'BEM FTI UPGRIS',
    year: '2026',
    credential_url: null,
    image_file: 'SERTIF MEDKRAF2.png',
    order_index: 4,
  },
  {
    id: 5,
    title: 'Sertifikat Pelatihan Web Development',
    issuer: 'HIMFORMA UPGRIS',
    year: '2026',
    credential_url: null,
    image_file: 'Sertifikat Juniari Nur Shofa.pdf',
    order_index: 5,
  },
];

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: false });

    if (error || !data || data.length === 0) {
      return fallbackCertificates;
    }
    return data as Certificate[];
  } catch {
    return fallbackCertificates;
  }
}
