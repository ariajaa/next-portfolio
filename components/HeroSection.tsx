'use client';

import React from 'react';
import { Profile } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';
import { useLanguage } from '../lib/context/LanguageContext';
import { EN_PROFILE_FALLBACK } from '../lib/i18n';

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const { lang, t } = useLanguage();

  const photoUrl =
    getStorageUrl('profile', profile.photo_file) ||
    '/assets/uploads/profile/WhatsApp Image 2026-11-04 at 01.19.34.jpeg';

  const cvUrl =
    getStorageUrl('files', profile.cv_file) ||
    '/assets/files/CV ARI.pdf';

  const roleTitle = lang === 'en' ? EN_PROFILE_FALLBACK.role_title : profile.role_title;
  const heroSubtitle = lang === 'en' ? EN_PROFILE_FALLBACK.hero_subtitle : profile.hero_subtitle;

  return (
    <section className="hero" id="home">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">{t.hero.kicker}</p>

          <h1 className="hero-title">
            {t.hero.greeting} <span className="hero-name">{profile.full_name}</span>
          </h1>

          <p className="hero-role">
            {roleTitle} · {t.hero.roleAffiliation}
          </p>

          <p className="hero-desc">{heroSubtitle}</p>

          <div className="hero-actions">
            <a
              href={cvUrl}
              className="btn-solid"
              download="CV_Juniari_Nur_Shofa.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.hero.downloadCv}
            </a>

            <a
              href="https://github.com/ariajaa"
              className="link-plain"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <a
              href="https://www.instagram.com/junnajaa_/"
              className="link-plain"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

        <figure className="hero-figure">
          {photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoUrl}
              alt={`${t.hero.photoAlt} ${profile.full_name}`}
              width={900}
              height={1200}
              fetchPriority="high"
            />
          ) : (
            <div className="project-plate-empty">{t.hero.noPhoto}</div>
          )}

          <figcaption className="hero-caption">
            <span>{t.hero.captionLabel}</span>
            <strong>{t.hero.captionValue}</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
