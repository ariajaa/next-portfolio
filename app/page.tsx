import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ExperienceSection from '../components/ExperienceSection';
import CertificatesSection from '../components/CertificatesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

import { getProfile } from '../lib/queries/profile';
import { getSkills } from '../lib/queries/skills';
import { getProjects } from '../lib/queries/projects';
import { getExperiences } from '../lib/queries/experiences';
import { getCertificates } from '../lib/queries/certificates';

// Revalidate or dynamic SSR
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [profile, skills, projects, experiences, certificates] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getCertificates(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
    </>
  );
}
