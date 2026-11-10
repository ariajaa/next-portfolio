import { supabase } from '../supabaseClient';
import { Message } from '../types';

export async function getMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as Message[];
  } catch {
    return [];
  }
}
