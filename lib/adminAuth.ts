'use client';

import { supabase } from './supabaseClient';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name || 'Juniari Nur Shofa',
    };
  } catch {
    return null;
  }
}

export async function loginAdmin(
  identifier: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const email = identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@jnsportfolio.local`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { success: false, message: 'Username atau password salah. Silakan coba lagi.' };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: 'Tidak dapat menghubungi server autentikasi. Periksa koneksi lalu coba lagi.',
    };
  }
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // Sesi lokal tetap dibersihkan oleh klien Supabase.
  }
}
