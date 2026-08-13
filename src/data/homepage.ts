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
    label: 'Full Stack ML',
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
    label: 'Full Stack',
    githubUrl: 'https://github.com/tangdarren/sql-detective',
    featured: true,
  },
  {
    id: 'tensor-digits',
    name: 'TensorDigits',
    description: 'Draw a number and predict the digit.',
    label: 'Machine Learning',
    githubUrl: 'https://github.com/tangdarren/tensor-digits',
    featured: true,
  },
  {
    id: 'arc-gpt',
    name: 'Arc GPT',
    description: 'Build GPT from scratch to understand how Transformers work.',
    label: 'Deep Learning',
    githubUrl: 'https://github.com/tangdarren/arc-gpt',
    featured: true,
  },
  {
    id: 'expensense',
    name: 'ExpenSense',
    description: 'Automate expense reviews with specialized AI agents.',
    label: 'AI Agents',
    githubUrl: 'https://github.com/tangdarren/expensense',
  },
  {
    id: 'musicbloom',
    name: 'MusicBloom',
    description: 'Grow a virtual garden while listening to music.',
    label: 'Full Stack',
    githubUrl: 'https://github.com/tangdarren/musicbloom',
  },
  {
    id: 'godo',
    name: 'GoDo',
    description: 'Discover places, plan events, and share local recommendations.',
    label: 'Mobile',
    githubUrl: 'https://github.com/tangdarren/godo-social-app',
  },
  {
    id: 'safecall-web',
    name: 'SafeCall Web',
    description: 'Practice emergency dispatch calls with an AI voice caller.',
    label: 'AI Voice',
    githubUrl: 'https://github.com/tangdarren/safecall-website',
  },
  {
    id: 'water-reminder',
    name: 'Water Reminder',
    description: 'Track daily water intake and progress toward a goal.',
    label: 'Mobile',
    githubUrl: 'https://github.com/tangdarren/water-reminder-app',
  },
];

export type HomepageTechId =
  | 'python'
  | 'typescript'
  | 'postgresql'
  | 'react'
  | 'nodejs'
  | 'springboot'
  | 'docker'
  | 'aws';

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
  { id: 'python', name: 'Python', description: 'Automation' },
  { id: 'typescript', name: 'TypeScript', description: 'Typed JavaScript' },
  { id: 'postgresql', name: 'PostgreSQL', description: 'SQL Database' },
  { id: 'react', name: 'React', description: 'UI library' },
  { id: 'nodejs', name: 'Node.js', description: 'Server Runtime' },
  { id: 'springboot', name: 'Spring Boot', description: 'Java framework' },
  { id: 'docker', name: 'Docker', description: 'Containers' },
  { id: 'aws', name: 'AWS', description: 'Cloud platform' },
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
      'Building AI workflow tools for automation, including QC flagging, order summarization, and Salesforce-to-TRAF automation targeting 25–40% efficiency improvements.',
  },
  {
    id: 'dataannotation',
    role: 'Software Engineer',
    company: 'DataAnnotation',
    type: 'Contract',
    dates: 'Jan 2026 – May 2026',
    description:
      'Developed and evaluated containerized LLM workflows using Docker, Kubernetes, MCP tools, and A/B testing across 50+ model outputs.',
  },
  {
    id: 'sonic',
    role: 'Software Engineer',
    company: 'Sonic Engineering Inc.',
    type: 'Internship',
    dates: 'May 2025 – Aug 2025',
    description:
      'Built Java inventory automation for CNC operations through Azure DevOps CI/CD, reducing delayed reorders by 50%.',
  },
];

export const HOMEPAGE_EDUCATION: HomepageEducation[] = [
  {
    id: 'scu',
    school: 'Santa Clara University',
    degree: 'Master of Science, Computer Science and Engineering',
    dates: 'Sep 2025 – Mar 2027',
    description:
      'Relevant coursework: Advanced Algorithms, Advanced Operating Systems, Data Mining, Object-Oriented Programming, Mobile App Development, Technology Entrepreneurship.',
  },
  {
    id: 'uw-madison',
    school: 'University of Wisconsin–Madison',
    degree: 'Bachelor of Science, Computer Science',
    dates: 'Sep 2021 – May 2025',
    description:
      'Lumen Scholarship Fund Scholar, $40,000 merit-based scholarship.',
  },
];
