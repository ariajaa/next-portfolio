-- ============================================================================
-- UPDATE NOMOR WHATSAPP DI SUPABASE
-- Nomor Baru: 6282313851051
-- Link WhatsApp: https://wa.me/6282313851051
-- ============================================================================

-- CARA MENJALANKAN:
-- 1. Login ke dashboard Supabase: https://supabase.com/dashboard
-- 2. Pilih project Anda
-- 3. Klik "SQL Editor" di sidebar kiri
-- 4. Copy-paste script ini dan klik "Run"

-- ============================================================================
-- CEK DATA SEBELUM UPDATE
-- ============================================================================

SELECT 
    id, 
    full_name, 
    email, 
    whatsapp AS whatsapp_lama,
    updated_at
FROM public.profile 
WHERE id = 1;

-- ============================================================================
-- UPDATE NOMOR WHATSAPP
-- ============================================================================

UPDATE public.profile 
SET 
    whatsapp = '6282313851051',
    updated_at = NOW()
WHERE id = 1;

-- ============================================================================
-- VERIFIKASI HASIL UPDATE
-- ============================================================================

SELECT 
    id, 
    full_name, 
    email, 
    whatsapp AS whatsapp_baru,
    updated_at
FROM public.profile 
WHERE id = 1;

-- ============================================================================
-- EXPECTED RESULT:
-- whatsapp_baru = '6282313851051'
-- Link WhatsApp = https://wa.me/6282313851051
-- ============================================================================
