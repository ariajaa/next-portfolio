import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div className="footer-logo">
          JNS<span>.</span>
        </div>
        <p>
          &copy; {currentYear} Juniari Nur Shofa. Mahasiswa S1 Informatika Universitas PGRI Semarang. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="#home">Home</a>
          <span>•</span>
          <a href="#about">Tentang</a>
          <span>•</span>
          <a href="#projects">Proyek</a>
          <span>•</span>
          <Link href="/admin/login" title="Admin Portal">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
