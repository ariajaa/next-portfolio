'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';

interface ProjectsSectionProps {
  projects: Project[];
}

const BASE_CATEGORIES = ['Semua', 'Web Design', 'Mobile Application', 'UI/UX Design'];

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const fromData = projects
      .map((project) => project.category)
      .filter((category): category is string => Boolean(category));
    return Array.from(new Set([...BASE_CATEGORIES, ...fromData]));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (activeCategory !== 'Semua') {
      result = result.filter(
        (project) => project.category === activeCategory || (!project.category && activeCategory === 'Web Design')
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
  }, [projects, activeCategory, searchQuery]);

  return (
    <section className="section" id="projects">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">Portfolio Work</p>
          <div className="section-head-main">
            <h2>Karya &amp; Proyek Terpilih</h2>
            <p className="section-sub">
              Daftar proyek dan karya yang telah diselesaikan. Dikelola dinamis melalui dashboard admin.
            </p>
          </div>
        </header>

        <div className="projects-controls">
          <div className="filter-bar" role="group" aria-label="Filter kategori proyek">
            {categories.map((category) => (
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
              Cari project
            </label>
            <input
              id="project-search"
              type="text"
              placeholder="Cari project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
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
              const linkLabel = item.demo_url ? 'Buka proyek' : 'Buka repositori';

              return (
                <li key={item.id} className="project-row" data-reveal>
                  <div className="project-plate">
                    {imgUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={imgUrl} alt={item.title} loading="lazy" />
                    ) : (
                      <div className="project-plate-empty">Gambar belum tersedia</div>
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
              {searchQuery || activeCategory !== 'Semua'
                ? 'Tidak ada proyek yang cocok'
                : 'Belum Ada Proyek Ditambahkan'}
            </h3>
            <p>
              {searchQuery || activeCategory !== 'Semua'
                ? 'Coba ubah filter atau kata kunci pencarian Anda.'
                : 'Ruang ini disediakan untuk dokumentasi proyek karya Juniari Nur Shofa. Proyek dapat ditambahkan secara mudah dan cepat kapan saja melalui Dashboard Admin.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
