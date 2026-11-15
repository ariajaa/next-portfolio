'use client';

import React, { useState, useMemo } from 'react';
import { Skill } from '../lib/types';
import { useLanguage } from '../lib/context/LanguageContext';

interface SkillsSectionProps {
  skills: Skill[];
}

type CategoryItem =
  | { id: string; key: 'filterAll' }
  | { id: string; label: string };

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'all', key: 'filterAll' },
  { id: 'programming', label: 'Programming' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
  { id: 'ai', label: 'AI' },
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { t } = useLanguage();
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
          <p className="section-label">{t.skills.sectionLabel}</p>
          <div className="section-head-main">
            <h2>{t.skills.heading}</h2>
            <p className="section-sub">{t.skills.sub}</p>
          </div>
        </header>

        <div className="filter-bar" role="group" aria-label="Filter kategori skill">
          {CATEGORY_ITEMS.map((category) => {
            const label = 'key' in category ? t.skills[category.key] : category.label;
            return (
              <button
                key={category.id}
                type="button"
                className="filter-btn"
                aria-pressed={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
              >
                {label}
              </button>
            );
          })}
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
            <p>{t.skills.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}
