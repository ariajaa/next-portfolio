import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

// Menyalakan reveal hanya jika browser siap dan pengguna tidak minta gerak dikurangi.
// Konten tetap terlihat pada default (tanpa JS, reduced motion, atau skrip gagal).
const revealScript = `
(function () {
  var root = document.documentElement;
  if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-inview');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function watch(el) {
    if (seen.has(el) || el.classList.contains('is-inview')) return;
    seen.add(el);
    io.observe(el);
  }

  function scan() {
    document.querySelectorAll('[data-reveal]').forEach(watch);
  }

  function start() {
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  }

  root.classList.add('reveal-on');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
`;

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: 'Juniari Nur Shofa | Mahasiswa S1 Informatika - Personal Portfolio',
  description:
    'Portfolio pribadi Juniari Nur Shofa - Mahasiswa S1 Informatika Universitas PGRI Semarang. Desain kreatif, teknologi, dan eksplorasi digital.',
  authors: [{ name: 'Juniari Nur Shofa' }],
  openGraph: {
    title: 'Juniari Nur Shofa | Personal Portfolio',
    description:
      'Mahasiswa S1 Informatika Universitas PGRI Semarang. Pengembangan teknologi, UI/UX, dan media digital.',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#101210',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={archivo.variable}>
      <body>
        <Script id="reveal" strategy="beforeInteractive">
          {revealScript}
        </Script>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
