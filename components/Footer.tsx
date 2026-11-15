'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/context/LanguageContext';

type IconName = 'github' | 'instagram' | 'whatsapp' | 'mail' | 'arrowUp';

const ICONS: Record<IconName, React.ReactNode> = {
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5A8.5 8.5 0 0 1 8.4 19L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 8.6c.3-.6.6-.6.9-.6h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.4.6 1 1.2 1.7 1.6.3.2.5.1.6 0l.5-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .3-.1 1-.5 1.3-.4.4-.9.6-1.6.5-1.9-.3-3.6-1.6-4.6-3.4-.4-.7-.6-1.4-.5-2 0-.5.2-1 .3-1.2Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </>
  ),
};

function FooterIcon({ name }: { name: IconName }) {
  return (
    <svg
      className="footer-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const NAV_KEYS = [
  { href: '#home', key: 'home' as const },
  { href: '#about', key: 'about' as const },
  { href: '#skills', key: 'skills' as const },
  { href: '#portfolio', key: 'portfolio' as const },
  { href: '#experience', key: 'experience' as const },
  { href: '#contact', key: 'contact' as const },
];

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ariajaa',
    icon: 'github' as const,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/junnajaa_/',
    icon: 'instagram' as const,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/6282313851051',
    icon: 'whatsapp' as const,
  },
  {
    label: 'Email',
    href: 'mailto:juniarinurshofa@gmail.com',
    icon: 'mail' as const,
  },
];

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="footer-logo" aria-label="Juniari.dev, kembali ke awal">
              Juniari<span>.dev</span>
            </a>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <div className="footer-col">
            <p className="footer-heading">{t.footer.navigation}</p>
            <ul className="footer-nav-list">
              {NAV_KEYS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-nav-link">
                    {t.footer.navLinks[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-heading">{t.footer.connected}</p>
            <div className="footer-socials">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer-social-btn"
                  aria-label={item.label}
                  target={item.icon === 'mail' ? undefined : '_blank'}
                  rel={item.icon === 'mail' ? undefined : 'noopener noreferrer'}
                >
                  <FooterIcon name={item.icon} />
                </a>
              ))}
            </div>
            <div className="footer-admin-wrap">
              <Link href="/admin/login" className="footer-admin-link">
                {t.footer.adminPortal}
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {currentYear} JuniariDev. {t.footer.allRights}
          </p>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label={t.footer.backToTop}
          >
            <span>{t.footer.backToTop}</span>
            <FooterIcon name="arrowUp" />
          </button>
        </div>
      </div>
    </footer>
  );
}
