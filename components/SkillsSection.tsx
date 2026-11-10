'use client';

import React, { useState, useMemo } from 'react';
import { Skill } from '../lib/types';

interface SkillsSectionProps {
  skills: Skill[];
}

const FILTER_CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'programming', label: 'Programming' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
  { id: 'ai', label: 'AI' },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') {
      return skills;
    }
    return skills.filter((skill) => {
      return skill.category.toLowerCase() === activeFilter;
    });
  }, [skills, activeFilter]);

  return (
    <section className="section" id="skills">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">Teknologi yang saya gunakan</p>
          <div className="section-head-main">
            <h2>Skills &amp; Technologies</h2>
            <p className="section-sub">
              Kumpulan bahasa, framework, tools, dan bidang yang saya pelajari dan gunakan.
            </p>
          </div>
        </header>

        <div className="filter-bar" role="group" aria-label="Filter kategori skill">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className="filter-btn"
              aria-pressed={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredSkills && filteredSkills.length > 0 ? (
          <ul className="skill-list">
            {filteredSkills.map((skill) => (
              <li key={skill.id} className="skill-row" data-reveal>
                <span className="skill-name">{skill.name}</span>
                <span className="skill-cat">{skill.category}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" data-reveal>
            <h3>Tidak ada skill dalam kategori ini</h3>
          </div>
        )}
      </div>
    </section>
  );
}
