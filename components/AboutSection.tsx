'use client';

import React from 'react';
import { Profile } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';
import { useLanguage } from '../lib/context/LanguageContext';
import { EN_PROFILE_FALLBACK } from '../lib/i18n';

interface AboutSectionProps {
  profile: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const { lang, t } = useLanguage();

  const cvUrl =
    getStorageUrl('files', profile.cv_file) ||
    '/assets/files/CV%20ARI.pdf';

  const aboutDescription =
    lang === 'en' ? EN_PROFILE_FALLBACK.about_description : profile.about_description;
  const education = lang === 'en' ? EN_PROFILE_FALLBACK.education : profile.education;
  const domicile = lang === 'en' ? EN_PROFILE_FALLBACK.domicile : profile.domicile;
  const interests = lang === 'en' ? EN_PROFILE_FALLBACK.interests : profile.interests;

  return (
    <section className="section" id="about">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">{t.about.sectionLabel}</p>
          <div className="section-head-main">
            <h2>{t.about.heading}</h2>
            <p className="section-sub">{t.about.sub}</p>
          </div>
        </header>

        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <h3>{t.about.aboutTitle}</h3>
            <p>{aboutDescription}</p>
            <p>{t.about.p2}</p>
            <a
              href={cvUrl}
              className="link-plain"
              download="CV_Juniari_Nur_Shofa.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.downloadCv}
            </a>
          </div>

          <dl className="about-facts" data-reveal>
            <div>
              <dt>{t.about.facts.education}</dt>
              <dd>{education}</dd>
            </div>
            <div>
              <dt>{t.about.facts.domicile}</dt>
              <dd>{domicile}</dd>
            </div>
            <div>
              <dt>{t.about.facts.interests}</dt>
              <dd>{interests}</dd>
            </div>
            <div>
              <dt>{t.about.facts.academicStatus}</dt>
              <dd>{t.about.facts.academicStatusVal}</dd>
            </div>
          </dl>
        </div>

        <div className="music-card">
          <div className="music-copy">
            <h3>{t.about.music.title}</h3>
            <p>{t.about.music.desc}</p>
            <a
              className="link-plain"
              href="https://open.spotify.com/playlist/3XXwLc91K6JYhtotQO98S4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.music.link}
            </a>
          </div>

          <div className="music-embed">
            <iframe
              title="Playlist Spotify NgodingTime"
              src="https://open.spotify.com/embed/playlist/3XXwLc91K6JYhtotQO98S4?utm_source=generator&theme=0"
              width="100%"
              height="352"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
