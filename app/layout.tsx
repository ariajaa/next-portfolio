import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const themeScript = `
(function () {
  var theme = 'dark';
  try {
    if (localStorage.getItem('theme') === 'light') theme = 'light';
  } catch (e) {}
  document.documentElement.dataset.theme = theme;
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
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
