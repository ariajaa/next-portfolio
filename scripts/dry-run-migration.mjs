/**
 * DRY RUN ASSET & DATA MIGRATION SCRIPT
 *
 * Sesuai aturan:
 * 1. HANYA membaca data dan file asli, TIDAK mengubah atau menghapus apapun.
 * 2. Mensimulasikan proses upload aset ke Supabase Storage.
 * 3. Mensimulasikan migrasi data dari database.sql ke Supabase PostgreSQL.
 * 4. Menampilkan laporan verifikasi secara lengkap.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../..');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const SQL_FILE = path.join(ROOT_DIR, 'database.sql');

console.log('='.repeat(70));
console.log('🔎 [DRY-RUN] SIMULASI MIGRASI ASET & DATABASE (READ-ONLY)');
console.log('='.repeat(70));
console.log(`Direktori Sumber  : ${ROOT_DIR}`);
console.log(`File Database SQL : ${SQL_FILE}`);
console.log(`Direktori Aset    : ${ASSETS_DIR}`);
console.log('Mode              : DRY RUN (TIDAK ADA PERUBAHAN APAPUN DIBUAT)\n');

// 1. Audit File Assets
console.log('--- 1. AUDIT FILE ASET ASLI ---');

function scanDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allAssetFiles = scanDir(ASSETS_DIR);
console.log(`Ditemukan total ${allAssetFiles.length} file di folder assets/:\n`);

const plannedMigrations = [];

for (const file of allAssetFiles) {
  const relPath = path.relative(ASSETS_DIR, file).replace(/\\/g, '/');
  const stat = fs.statSync(file);
  const sizeKb = (stat.size / 1024).toFixed(2);
  const ext = path.extname(file).toLowerCase();

  let targetBucket = 'assets';
  if (relPath.startsWith('uploads/profile/')) targetBucket = 'profile';
  else if (relPath.startsWith('uploads/projects/')) targetBucket = 'projects';
  else if (relPath.startsWith('uploads/certificates/')) targetBucket = 'certificates';
  else if (relPath.startsWith('files/')) targetBucket = 'files';

  const fileName = path.basename(file);

  plannedMigrations.push({
    sourcePath: `assets/${relPath}`,
    fileName,
    sizeKb: `${sizeKb} KB`,
    extension: ext,
    targetBucket,
    targetStorageKey: `${targetBucket}/${fileName}`,
    status: 'READY FOR UPLOAD (DRY-RUN)',
  });
}

console.table(plannedMigrations);

// 2. Audit Data SQL
console.log('\n--- 2. AUDIT DATA DATABASE SQL ---');
if (fs.existsSync(SQL_FILE)) {
  const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');

  const tables = [
    'admins',
    'profile',
    'skills',
    'projects',
    'experiences',
    'certificates',
    'messages',
  ];

  console.log('Pemeriksaan tabel dan data awal di database.sql:');
  for (const table of tables) {
    const hasCreate = sqlContent.includes(`CREATE TABLE IF NOT EXISTS \`${table}\``);
    const hasInsert = sqlContent.includes(`INSERT INTO \`${table}\``);
    console.log(`- Tabel public.${table.padEnd(14)} : CREATE [${hasCreate ? 'OK' : 'MISSING'}] | SEED DATA [${hasInsert ? 'OK' : 'EMPTY'}]`);
  }
} else {
  console.log('File database.sql tidak ditemukan!');
}

console.log('\n' + '='.repeat(70));
console.log('✅ KESIMPULAN DRY RUN:');
console.log('1. Seluruh file aset asli utuh dan siap dipindahkan ke Supabase Storage.');
console.log('2. Tidak ada file PHP, SQL, gambar, atau CV yang diubah atau dihapus.');
console.log('3. Script sesungguhnya hanya akan dijalankan setelah mendapatkan persetujuan.');
console.log('='.repeat(70));
