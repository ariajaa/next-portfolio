'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" tabIndex={-1} className="shell" style={{ paddingBlock: 'var(--section-y)' }}>
      <p className="section-label">Gangguan</p>
      <h1 style={{ fontSize: 'var(--step-3)', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
        Halaman gagal dimuat
      </h1>
      <p style={{ color: 'var(--ink-muted)', maxWidth: '58ch', marginBottom: '2rem' }}>
        Data portofolio tidak dapat diambil saat ini. Coba muat ulang halaman. Jika masalah berlanjut,
        hubungi pemilik situs.
      </p>
      <button type="button" className="btn-solid" onClick={reset}>
        Muat ulang
      </button>
      {error.digest && (
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
          Kode kesalahan: {error.digest}
        </p>
      )}
    </main>
  );
}
