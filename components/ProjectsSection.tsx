'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';
import { useLanguage } from '../lib/context/LanguageContext';
import { EN_PROJECTS_FALLBACK } from '../lib/i18n';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const localizedProjects = useMemo(() => {
    return projects.map((p) => {
      if (lang === 'en' && EN_PROJECTS_FALLBACK[p.id]) {
        return {
          ...p,
          title: EN_PROJECTS_FALLBACK[p.id].title,
          description: EN_PROJECTS_FALLBACK[p.id].description,
        };
      }
      return p;
    });
  }, [projects, lang]);

  const rawCategories = useMemo(() => {
    const fromData = projects
      .map((project) => project.category)
      .filter((category): category is string => Boolean(category));
    return Array.from(new Set(['Web Design', 'Mobile Application', 'UI/UX Design', ...fromData]));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = localizedProjects;

    if (activeCategory !== 'all') {
      result = result.filter(
        (project) =>
          project.category === activeCategory || (!project.category && activeCategory === 'Web Design')
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tech_stack.toLowerCase().includes(query)
      );
    }

    return result;
  }, [localizedProjects, activeCategory, searchQuery]);

  return (
    <div className="portfolio-panel">
      <p className="panel-sub">{t.portfolio.projects.sub}</p>

      <div className="projects-controls">
        <div className="filter-bar" role="group" aria-label="Filter kategori proyek">
          <button
            type="button"
            className="filter-btn"
            aria-pressed={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          >
            {t.portfolio.projects.filterAll}
          </button>
          {rawCategories.map((category) => (
            <button
              key={category}
              type="button"
              className="filter-btn"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-search">
          <label className="visually-hidden" htmlFor="project-search">
            {t.portfolio.projects.searchPlaceholder}
          </label>
          <input
            id="project-search"
            type="text"
            placeholder={t.portfolio.projects.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label={t.portfolio.projects.clearSearch}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {filteredProjects && filteredProjects.length > 0 ? (
        <ul className="project-list">
          {filteredProjects.map((item) => {
            const imgUrl = item.image_file ? getStorageUrl('projects', item.image_file) : null;
            const link = item.demo_url || item.github_url;
            const linkLabel = item.demo_url
              ? t.portfolio.projects.viewDemo
              : t.portfolio.projects.viewRepo;

            return (
              <li key={item.id} className="project-row" data-reveal>
                <div className="project-plate">
                  {imgUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imgUrl} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="project-plate-empty">
                      {lang === 'en' ? 'Image not available' : 'Gambar belum tersedia'}
                    </div>
                  )}
                </div>

                <div className="project-body">
                  {item.category && <p className="project-cat">{item.category}</p>}
                  <h3 className="project-title">{item.title}</h3>
                  <p className="project-desc">{item.description}</p>
                  <p className="project-tools">{item.tech_stack}</p>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {linkLabel}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state" data-reveal>
          <h3>
            {searchQuery || activeCategory !== 'all'
              ? lang === 'en'
                ? 'No matching projects found'
                : 'Tidak ada proyek yang cocok'
              : lang === 'en'
              ? 'No Projects Added Yet'
              : 'Belum Ada Proyek Ditambahkan'}
          </h3>
          <p>
            {searchQuery || activeCategory !== 'all'
              ? lang === 'en'
                ? 'Try adjusting your search query or filter.'
                : 'Coba ubah filter atau kata kunci pencarian Anda.'
              : lang === 'en'
              ? 'This space is reserved for documenting projects by Juniari Nur Shofa. Projects can be added via the Admin Dashboard.'
              : 'Ruang ini disediakan untuk dokumentasi proyek karya Juniari Nur Shofa. Proyek dapat ditambahkan secara mudah dan cepat kapan saja melalui Dashboard Admin.'}
          </p>
        </div>
      )}
    </div>
  );
}
