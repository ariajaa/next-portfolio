import React from 'react';
import { Profile } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const photoUrl =
    getStorageUrl('profile', profile.photo_file) ||
    '/assets/uploads/profile/WhatsApp Image 2026-11-04 at 01.19.34.jpeg';

  const cvUrl =
    getStorageUrl('files', profile.cv_file) ||
    '/assets/files/CV ARI.pdf';

  return (
    <section className="hero" id="home">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker">Halo, Selamat Datang</p>

          <h1 className="hero-title">
            Saya <span className="hero-name">{profile.full_name}</span>
          </h1>

          <p className="hero-role">{profile.role_title} · Universitas PGRI Semarang</p>

          <p className="hero-desc">{profile.hero_subtitle}</p>

          <div className="hero-actions">
            <a
              href={cvUrl}
              className="btn-solid"
              download="CV_Juniari_Nur_Shofa.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
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
              alt={`Foto ${profile.full_name}`}
              width={900}
              height={1200}
              fetchPriority="high"
            />
          ) : (
            <div className="project-plate-empty">Foto belum tersedia</div>
          )}

          <figcaption className="hero-caption">
            <span>Program Studi</span>
            <strong>S1 Informatika</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
