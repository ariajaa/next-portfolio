import React from 'react';
import { Profile } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';

interface AboutSectionProps {
  profile: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const cvUrl =
    getStorageUrl('files', profile.cv_file) ||
    '/assets/files/CV%20ARI.pdf';

  return (
    <section className="section" id="about">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">About Me</p>
          <div className="section-head-main">
            <h2>Profil &amp; Latar Belakang</h2>
            <p className="section-sub">
              Mengenal lebih dekat perjalanan akademik, minat, dan domisili saya saat ini.
            </p>
          </div>
        </header>

        <div className="about-grid">
          <div className="about-copy" data-reveal>
            <h3>Tentang Saya</h3>
            <p>{profile.about_description}</p>
            <p>
              Saya meyakini bahwa penguasaan teknologi yang dipadukan dengan kreativitas visual dan
              komunikasi yang efektif adalah kunci dalam menciptakan solusi digital yang bermanfaat
              bagi masyarakat.
            </p>
            <a
              href={cvUrl}
              className="link-plain"
              download="CV_Juniari_Nur_Shofa.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV (PDF)
            </a>
          </div>

          <dl className="about-facts" data-reveal>
            <div>
              <dt>Pendidikan</dt>
              <dd>{profile.education}</dd>
            </div>
            <div>
              <dt>Domisili</dt>
              <dd>{profile.domicile}</dd>
            </div>
            <div>
              <dt>Minat &amp; Ketertarikan</dt>
              <dd>{profile.interests}</dd>
            </div>
            <div>
              <dt>Status Akademik</dt>
              <dd>Mahasiswa Aktif Fakultas Teknik &amp; Informatika</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
