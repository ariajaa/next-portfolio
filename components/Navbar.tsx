'use client';

import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'certificates', label: 'CERTIFICATES' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      const scrollPos = window.scrollY + 140;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (scrollPos >= top && scrollPos < top + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActive();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a href="#home" className="wordmark" aria-label="JNS, kembali ke atas">
          JNS<span>.</span>
        </a>

        <nav className="primary-nav" aria-label="Navigasi utama">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                  onClick={closeMobileMenu}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contact" className="header-action">
          Hubungi
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="menu-toggle-bars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
          Menu
        </button>
      </div>

      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Navigasi seluler"
        data-open={mobileMenuOpen}
        hidden={!mobileMenuOpen}
      >
        <ul>
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={activeSection === section.id ? 'true' : undefined}
                onClick={closeMobileMenu}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
