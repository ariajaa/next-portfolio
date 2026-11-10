import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 }
      );
    }

    // Trim and validate lengths
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (trimmedName.length === 0 || trimmedEmail.length === 0 || trimmedMessage.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const supabase = createAdminClient();

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co';

    if (!isSupabaseConfigured) {
      console.error('[Contact API] Supabase is not configured. Please set up .env.local with valid credentials.');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Fitur pengiriman pesan belum dikonfigurasi. Silakan hubungi melalui email atau WhatsApp yang tertera.' 
        },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('messages').insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: subject?.trim() || 'Pesan dari Form Kontak Portfolio',
      message: trimmedMessage,
      ip_address: ip,
      is_read: false,
    });

    if (error) {
      console.error('Supabase insert error in /api/contact:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gagal menyimpan pesan ke database. Silakan coba beberapa saat lagi atau hubungi langsung via email/WhatsApp.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim! Terima kasih telah menghubungi saya.',
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem saat memproses pesan. Silakan coba lagi nanti.' },
      { status: 500 }
    );
  }
}
