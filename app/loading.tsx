import React from 'react';

export default function Loading() {
  return (
    <main id="main" tabIndex={-1} className="shell" style={{ paddingBlock: 'var(--section-y)' }} aria-busy="true">
      <p className="section-label">Memuat</p>
      <p style={{ color: 'var(--ink-muted)' }}>Menyiapkan isi portofolio.</p>
    </main>
  );
}
