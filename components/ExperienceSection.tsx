import React from 'react';
import { Experience } from '../lib/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section className="section" id="experience">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">Career &amp; Leadership</p>
          <div className="section-head-main">
            <h2>Pengalaman &amp; Rekam Jejak</h2>
            <p className="section-sub">
              Pengalaman berorganisasi, dunia kerja, dan perjalanan akademik secara kronologis.
            </p>
          </div>
        </header>

        {experiences && experiences.length > 0 ? (
          <div className="cv-list">
            {experiences.map((exp) => (
              <article key={exp.id} className="cv-row" data-reveal>
                <p className="cv-period">{exp.period}</p>
                <div>
                  <h3 className="cv-role">{exp.role}</h3>
                  <p className="cv-org">
                    {exp.organization} <span>({exp.type})</span>
                  </p>
                  <p className="cv-desc">{exp.description}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" data-reveal>
            <h3>Belum Ada Pengalaman Ditambahkan</h3>
          </div>
        )}
      </div>
    </section>
  );
}
