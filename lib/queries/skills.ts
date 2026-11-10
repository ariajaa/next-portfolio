import { supabase } from '../supabaseClient';
import { Skill } from '../types';

export const fallbackSkills: Skill[] = [
  // Tools (Skill Lama - DIPERTAHANKAN)
  { id: 1, name: 'Figma', category: 'Tools', level_percent: 90, icon_class: 'ri-pencil-ruler-2-line', order_index: 1 },
  { id: 2, name: 'Canva', category: 'Tools', level_percent: 95, icon_class: 'ri-palette-line', order_index: 2 },
  { id: 3, name: 'CapCut', category: 'Tools', level_percent: 88, icon_class: 'ri-movie-line', order_index: 3 },
  { id: 4, name: 'Microsoft Office', category: 'Tools', level_percent: 92, icon_class: 'ri-file-text-line', order_index: 4 },
  { id: 5, name: 'Google Workspace', category: 'Tools', level_percent: 90, icon_class: 'ri-google-line', order_index: 5 },
  { id: 6, name: 'Social Media Management', category: 'Tools', level_percent: 85, icon_class: 'ri-share-forward-line', order_index: 6 },
  { id: 7, name: 'Komunikasi', category: 'Tools', level_percent: 90, icon_class: 'ri-chat-smile-2-line', order_index: 7 },
  { id: 8, name: 'Teamwork', category: 'Tools', level_percent: 95, icon_class: 'ri-team-line', order_index: 8 },
  { id: 9, name: 'Time Management', category: 'Tools', level_percent: 90, icon_class: 'ri-time-line', order_index: 9 },
  
  // Programming (Skill Baru)
  { id: 10, name: 'JavaScript', category: 'Programming', level_percent: 85, icon_class: 'ri-javascript-fill', order_index: 10 },
  { id: 11, name: 'TypeScript', category: 'Programming', level_percent: 80, icon_class: 'ri-code-s-slash-line', order_index: 11 },
  { id: 12, name: 'PHP', category: 'Programming', level_percent: 85, icon_class: 'ri-file-code-line', order_index: 12 },
  { id: 13, name: 'Python', category: 'Programming', level_percent: 75, icon_class: 'ri-file-code-fill', order_index: 13 },
  { id: 14, name: 'Dart', category: 'Programming', level_percent: 80, icon_class: 'ri-code-box-line', order_index: 14 },
  
  // Frontend (Skill Baru)
  { id: 15, name: 'HTML', category: 'Frontend', level_percent: 90, icon_class: 'ri-html5-fill', order_index: 15 },
  { id: 16, name: 'CSS', category: 'Frontend', level_percent: 90, icon_class: 'ri-css3-fill', order_index: 16 },
  { id: 17, name: 'Tailwind CSS', category: 'Frontend', level_percent: 85, icon_class: 'ri-brush-line', order_index: 17 },
  { id: 18, name: 'React', category: 'Frontend', level_percent: 85, icon_class: 'ri-reactjs-line', order_index: 18 },
  { id: 19, name: 'Next.js', category: 'Frontend', level_percent: 80, icon_class: 'ri-pages-line', order_index: 19 },
  
  // Mobile (Skill Baru)
  { id: 20, name: 'Flutter', category: 'Mobile', level_percent: 80, icon_class: 'ri-flutter-fill', order_index: 20 },
  
  // Backend (Skill Baru)
  { id: 21, name: 'Node.js', category: 'Backend', level_percent: 80, icon_class: 'ri-server-line', order_index: 21 },
  
  // Database (Skill Baru)
  { id: 22, name: 'MySQL', category: 'Database', level_percent: 85, icon_class: 'ri-database-2-line', order_index: 22 },
  { id: 23, name: 'Supabase', category: 'Database', level_percent: 80, icon_class: 'ri-database-line', order_index: 23 },
  
  // AI (Skill Baru)
  { id: 24, name: 'Gemini API', category: 'AI', level_percent: 75, icon_class: 'ri-robot-line', order_index: 24 },
];

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackSkills;
    }
    return data as Skill[];
  } catch {
    return fallbackSkills;
  }
}
