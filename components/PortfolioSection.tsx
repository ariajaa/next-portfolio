'use client';

import React, { useEffect, useState } from 'react';
import { Project, Certificate } from '../lib/types';
import ProjectsSection from './ProjectsSection';
import CertificatesSection from './CertificatesSection';
import { useLanguage } from '../lib/context/LanguageContext';

interface PortfolioSectionProps {
  projects: Project[];
  certificates: Certificate[];
}

const TAB_KEYS = [
  { id: 'projects', key: 'projects' as const },
  { id: 'certificates', key: 'certificates' as const },
] as const;

type TabId = (typeof TAB_KEYS)[number]['id'];

export default function PortfolioSection({ projects, certificates }: PortfolioSectionProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>('projects');

  useEffect(() => {
    const syncFromHash = () => {
      setActiveTab(window.location.hash === '#certificates' ? 'certificates' : 'projects');
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + TAB_KEYS.length) % TAB_KEYS.length;
    selectTab(TAB_KEYS[next].id);
    document.getElementById(`tab-${TAB_KEYS[next].id}`)?.focus();
  };

  return (
    <section className="section" id="portfolio">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">{t.portfolio.sectionLabel}</p>
          <div className="section-head-main">
            <h2>{t.portfolio.heading}</h2>
          </div>
        </header>

        <div className="portfolio-tabs" role="tablist" aria-label="Isi portfolio">
          {TAB_KEYS.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              id={`tab-${tab.id}`}
              role="tab"
              className="portfolio-tab"
              aria-selected={activeTab === tab.id}
              aria-controls={tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {t.portfolio.tabs[tab.key]}
            </button>
          ))}
        </div>

        <div
          id="projects"
          role="tabpanel"
          aria-labelledby="tab-projects"
          hidden={activeTab !== 'projects'}
        >
          <ProjectsSection projects={projects} />
        </div>

        <div
          id="certificates"
          role="tabpanel"
          aria-labelledby="tab-certificates"
          hidden={activeTab !== 'certificates'}
        >
          <CertificatesSection certificates={certificates} />
        </div>
      </div>
    </section>
  );
}
