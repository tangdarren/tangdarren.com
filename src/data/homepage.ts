export interface HomepageProject {
  id: string;
  name: string;
  description: string;
  label: string;
  githubUrl: string;
  featured?: boolean;
}

export const HOMEPAGE_PROJECTS: HomepageProject[] = [
  {
    id: 'tempest',
    name: 'Tempest',
    description: 'Explore stock trends and market forecasts.',
    label: 'Full-Stack ML',
    githubUrl: 'https://github.com/tangdarren/stock-market-dashboard',
    featured: true,
  },
  {
    id: 'safecall',
    name: 'SafeCall',
    description: 'Practice handling realistic 911 emergency calls.',
    label: 'Spatial Computing',
    githubUrl: 'https://github.com/tangdarren/safecall-vr',
    featured: true,
  },
  {
    id: 'sql-detective',
    name: 'SQL Detective',
    description: 'Solve mysteries by investigating database clues.',
    label: 'Full-Stack',
    githubUrl: 'https://github.com/tangdarren/sql-detective',
    featured: true,
  },
  {
    id: 'tensor-digits',
    name: 'TensorDigits',
    description: 'Draw a number and predict the digit.',
    label: 'Machine Learning',
    githubUrl: 'https://github.com/tangdarren/tensor-digits',
  },
];

export type HomepageTechId =
  | 'java'
  | 'python'
  | 'typescript'
  | 'postgresql'
  | 'react'
  | 'nextjs'
  | 'springboot'
  | 'docker';

export interface HomepageTech {
  id: HomepageTechId;
  name: string;
  description: string;
}

/**
 * Curated homepage stack (8 strongest for recruiters).
 * Display order fills a 4×2 desktop grid row-first.
 */
export const HOMEPAGE_TECH: HomepageTech[] = [
  { id: 'java', name: 'Java', description: 'Backend language' },
  { id: 'python', name: 'Python', description: 'Automation & scripting' },
  { id: 'typescript', name: 'TypeScript', description: 'Typesafe JavaScript' },
  { id: 'postgresql', name: 'PostgreSQL', description: 'Relational database' },
  { id: 'react', name: 'React', description: 'UI library' },
  { id: 'nextjs', name: 'Next.js', description: 'React framework' },
  { id: 'springboot', name: 'Spring Boot', description: 'Java framework' },
  { id: 'docker', name: 'Docker', description: 'Containers' },
];

export interface HomepageExperience {
  id: string;
  role: string;
  company: string;
  type: string;
  dates: string;
  description: string;
}

export interface HomepageEducation {
  id: string;
  school: string;
  degree: string;
  dates: string;
  description: string;
}

export const HOMEPAGE_EXPERIENCE: HomepageExperience[] = [
  {
    id: 'veracyte',
    role: 'AI Agent Development Intern',
    company: 'Veracyte, Inc.',
    type: 'Internship',
    dates: 'Jun 2026 – Present',
    description:
      'Built AI-powered workflow automation for internal operations.',
  },
  {
    id: 'dataannotation',
    role: 'Software Engineer',
    company: 'DataAnnotation',
    type: 'Contract',
    dates: 'Jan 2026 – May 2026',
    description:
      'Evaluated AI coding tools including Claude Code, Claude Cowork, Codex, and Gemini.',
  },
  {
    id: 'sonic',
    role: 'Software Engineer',
    company: 'Sonic Engineering Inc.',
    type: 'Internship',
    dates: 'May 2025 – Aug 2025',
    description:
      'Built inventory software and automated CNC manufacturing workflows.',
  },
];

export const HOMEPAGE_EDUCATION: HomepageEducation[] = [
  {
    id: 'scu',
    school: 'Santa Clara University',
    degree: 'Master of Science, Computer Science and Engineering',
    dates: 'Sep 2025 – Mar 2027',
    description:
      'Coursework in algorithms, AI, data mining, systems, and application development.',
  },
  {
    id: 'uw-madison',
    school: 'University of Wisconsin–Madison',
    degree: 'Bachelor of Science, Computer Science',
    dates: 'Sep 2021 – May 2025',
    description: 'Lumen Scholarship recipient.',
  },
];
