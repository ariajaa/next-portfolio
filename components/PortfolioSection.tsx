'use client';

import React, { useEffect, useState } from 'react';
import { Project, Certificate } from '../lib/types';
import ProjectsSection from './ProjectsSection';
import CertificatesSection from './CertificatesSection';

interface PortfolioSectionProps {
  projects: Project[];
  certificates: Certificate[];
}

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function PortfolioSection({ projects, certificates }: PortfolioSectionProps) {
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
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    selectTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  };

  return (
    <section className="section" id="portfolio">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">Portfolio Work</p>
          <div className="section-head-main">
            <h2>Karya, Proyek &amp; Sertifikasi</h2>
          </div>
        </header>

        <div className="portfolio-tabs" role="tablist" aria-label="Isi portfolio">
          {TABS.map((tab, index) => (
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
              {tab.label}
            </button>
          ))}
        </div>

        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
          >
            {tab.id === 'projects' ? (
              <ProjectsSection projects={projects} />
            ) : (
              <CertificatesSection certificates={certificates} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
