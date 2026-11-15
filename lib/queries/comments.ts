import { supabase } from '../supabaseClient';
import { isSupabaseConfigured } from '../supabaseServer';
import { Comment } from '../types';

export async function getComments(): Promise<Comment[]> {
  // Tanpa kredensial, jangan tembak placeholder.supabase.co saat SSR.
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('id, name, message, photo_url, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      return [];
    }
    return data as Comment[];
  } catch {
    return [];
  }
}
