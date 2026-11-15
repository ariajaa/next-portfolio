'use client';

import React from 'react';
import { Experience } from '../lib/types';
import { useLanguage } from '../lib/context/LanguageContext';
import { EN_EXPERIENCES_FALLBACK } from '../lib/i18n';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const { lang, t } = useLanguage();

  return (
    <section className="section" id="experience">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">{t.experience.sectionLabel}</p>
          <div className="section-head-main">
            <h2>{t.experience.heading}</h2>
            <p className="section-sub">{t.experience.sub}</p>
          </div>
        </header>

        {experiences && experiences.length > 0 ? (
          <div className="cv-list">
            {experiences.map((exp) => {
              const role =
                lang === 'en' && EN_EXPERIENCES_FALLBACK[exp.id]
                  ? EN_EXPERIENCES_FALLBACK[exp.id].role
                  : exp.role;
              const org =
                lang === 'en' && EN_EXPERIENCES_FALLBACK[exp.id]
                  ? EN_EXPERIENCES_FALLBACK[exp.id].organization
                  : exp.organization;
              const period =
                lang === 'en' && EN_EXPERIENCES_FALLBACK[exp.id]
                  ? EN_EXPERIENCES_FALLBACK[exp.id].period
                  : exp.period;
              const type =
                lang === 'en' && EN_EXPERIENCES_FALLBACK[exp.id]
                  ? EN_EXPERIENCES_FALLBACK[exp.id].type
                  : exp.type;
              const description =
                lang === 'en' && EN_EXPERIENCES_FALLBACK[exp.id]
                  ? EN_EXPERIENCES_FALLBACK[exp.id].description
                  : exp.description;

              return (
                <article key={exp.id} className="cv-row" data-reveal>
                  <p className="cv-period">{period}</p>
                  <div>
                    <h3 className="cv-role">{role}</h3>
                    <p className="cv-org">
                      {org} <span>({type})</span>
                    </p>
                    <p className="cv-desc">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" data-reveal>
            <h3>{t.experience.empty}</h3>
          </div>
        )}
      </div>
    </section>
  );
}
