import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe client that can handle missing credentials during build
// Use dummy values if not provided to prevent build errors
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';

export const supabase = createClient(safeUrl, safeKey);

/**
 * Helper to get the public URL for an asset stored in Supabase Storage.
 * Falls back to local/default assets if path is null or URL cannot be constructed.
 */
export function getStorageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  
  // If it's already an absolute URL (e.g. external link or http...)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with assets/, it's a legacy static path
  if (path.startsWith('assets/')) {
    return `/${path}`;
  }
  
  // If no valid Supabase URL is configured, use local public path
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    // Map bucket to local public paths
    if (bucket === 'profile') {
      return `/assets/uploads/profile/${path}`;
    }
    if (bucket === 'certificates') {
      return `/assets/uploads/certificates/${path}`;
    }
    if (bucket === 'projects') {
      return `/assets/projects/${path}`;
    }
    if (bucket === 'files') {
      return `/assets/files/${path}`;
    }
    return `/assets/uploads/${bucket}/${path}`;
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
