import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import PortfolioSection from '../components/PortfolioSection';
import ExperienceSection from '../components/ExperienceSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import { getProfile } from '../lib/queries/profile';
import { getSkills } from '../lib/queries/skills';
import { getProjects } from '../lib/queries/projects';
import { getExperiences } from '../lib/queries/experiences';
import { getCertificates } from '../lib/queries/certificates';
import { getComments } from '../lib/queries/comments';
import { isSupabaseConfigured } from '../lib/supabaseServer';

// Revalidate or dynamic SSR
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, skills, projects, experiences, certificates, comments] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertificates(),
    getComments(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <PortfolioSection projects={projects} certificates={certificates} />
        <ExperienceSection experiences={experiences} />
        <ContactSection
          profile={profile}
          comments={comments}
          commentsEnabled={isSupabaseConfigured()}
        />
      </main>
      <Footer />
    </>
  );
}
