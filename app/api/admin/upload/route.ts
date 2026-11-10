import { NextResponse } from 'next/server';
import { createAdminClient, createServerClient } from '@/lib/supabaseServer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];
const ALLOWED_BUCKETS = ['profile', 'files', 'certificates', 'projects'];

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Sesi admin tidak ditemukan. Silakan login ulang.' },
        { status: 401 }
      );
    }

    const authClient = createServerClient();
    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        { success: false, message: 'Sesi admin tidak valid. Silakan login ulang.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'projects';

    if (!ALLOWED_BUCKETS.includes(bucket)) {
      return NextResponse.json(
        { success: false, message: 'Bucket penyimpanan tidak dikenal.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file yang dipilih untuk diunggah.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file melebihi batas maksimal 5MB.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Format file tidak didukung. Format yang diizinkan: JPG, PNG, WEBP, PDF.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, message: `Gagal mengunggah file ke Supabase Storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName: uniqueFileName,
      path: uniqueFileName,
      message: 'File berhasil diunggah.',
    });
  } catch (err) {
    console.error('Upload API Error:', err);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat mengunggah file.' },
      { status: 500 }
    );
  }
}
