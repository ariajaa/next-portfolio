import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-space',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-jet',
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
  themeColor: '#050510',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
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
