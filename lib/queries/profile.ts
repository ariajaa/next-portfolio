import { supabase } from '../supabaseClient';
import { Profile } from '../types';

export const fallbackProfile: Profile = {
  id: 1,
  full_name: 'Juniari Nur Shofa',
  role_title: 'Mahasiswa S1 Informatika',
  hero_subtitle:
    'Mahasiswa S1 Informatika Universitas PGRI Semarang dengan fokus pada pengembangan teknologi, UI/UX, dan eksplorasi digital kreatif.',
  about_description:
    'Saya adalah seorang mahasiswa program studi S1 Informatika di Universitas PGRI Semarang. Memiliki antusiasme tinggi dalam mempelajari hal baru seputar dunia teknologi informasi, desain kreatif, serta aktif mengembangkan potensi kepemimpinan dan kolaborasi melalui berbagai kegiatan organisasi dan pengalaman kerja.',
  education: 'S1 Informatika - Universitas PGRI Semarang',
  domicile: 'Semarang, Jawa Tengah',
  interests: 'Teknologi Informasi, Desain Kreatif, Digital Media & Kegiatan Organisasi',
  email: 'juniarinurshofa@gmail.com',
  whatsapp: '6282313851051',
  cv_file: 'CV ARI.pdf',
  photo_file: 'WhatsApp Image 2026-11-04 at 01.19.34.jpeg',
};

export async function getProfile(): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      return fallbackProfile;
    }
    return data as Profile;
  } catch {
    return fallbackProfile;
  }
}
