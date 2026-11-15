import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabaseServer';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// short rate limit: per instance memory, resets on cold start. Upgrade to a shared
// store (Upstash/Redis) when comment spam becomes a real problem.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();
    const honeypot = String(form.get('website') ?? '');

    if (honeypot) {
      return NextResponse.json({ success: false, message: 'Komentar tidak dapat dikirim.' }, { status: 400 });
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ success: false, message: 'Nama harus 2 sampai 50 karakter.' }, { status: 400 });
    }

    if (message.length < 2 || message.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Komentar harus 2 sampai 500 karakter.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      console.error('[Comments API] Supabase is not configured. Please set up .env.local with valid credentials.');
      return NextResponse.json(
        { success: false, message: 'Kolom komentar belum aktif. Silakan hubungi lewat email atau WhatsApp.' },
        { status: 503 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak komentar dari perangkat ini. Coba lagi beberapa menit lagi.' },
        { status: 429 }
      );
    }

    const supabase = createAdminClient();
    let photoUrl: string | null = null;
    const photo = form.get('photo');

    if (photo instanceof File && photo.size > 0) {
      if (photo.size > MAX_PHOTO_BYTES) {
        return NextResponse.json({ success: false, message: 'Ukuran foto maksimal 5 MB.' }, { status: 413 });
      }
      if (!ALLOWED_TYPES.includes(photo.type)) {
        return NextResponse.json(
          { success: false, message: 'Format foto harus JPG, PNG, atau WebP.' },
          { status: 415 }
        );
      }

      const extension = photo.type === 'image/jpeg' ? 'jpg' : photo.type.split('/')[1];
      const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('comments')
        .upload(path, await photo.arrayBuffer(), { contentType: photo.type, upsert: false });

      if (uploadError) {
        console.error('[Comments API] Photo upload failed:', uploadError.message);
        return NextResponse.json(
          { success: false, message: 'Foto gagal diunggah. Coba kirim tanpa foto.' },
          { status: 500 }
        );
      }

      photoUrl = supabase.storage.from('comments').getPublicUrl(path).data.publicUrl;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({ name, message, photo_url: photoUrl })
      .select('id, name, message, photo_url, created_at')
      .single();

    if (error) {
      console.error('[Comments API] Insert failed:', error.message);
      return NextResponse.json(
        { success: false, message: 'Komentar gagal disimpan. Silakan coba lagi nanti.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, comment: data });
  } catch (error) {
    console.error('[Comments API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memproses komentar.' },
      { status: 500 }
    );
  }
}
