/** The project list on the home page, in display order. Each links to its code. */
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
    id: 'minispark',
    name: 'MiniSpark',
    description: 'Run Spark-style map, filter, and join jobs in parallel on a C thread pool.',
    label: 'Systems',
    githubUrl: 'https://github.com/tangdarren/minispark',
  },
  {
    id: 'musicbloom',
    name: 'MusicBloom',
    description: 'Grow a virtual garden while listening to music.',
    label: 'Full Stack',
    githubUrl: 'https://github.com/tangdarren/musicbloom',
  },
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
    name: 'SafeCall VR',
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
