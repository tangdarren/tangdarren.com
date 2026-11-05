export interface ExperienceEntry {
  company: string;
  role: string;
  location?: string;
  dates?: string;
  bullets: string[];
  photo?: TimelinePhoto;
}

// Mirrors public resume (Darren_Tang_Resume.pdf), newest first.
export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: 'SCU Video and Image Processing Lab',
    role: 'Incoming Graduate Researcher',
    location: 'Santa Clara, CA',
    dates: 'January 2027 – Present',
    bullets: [
      'Planned focus: applying deep learning to image and video analysis in computer vision research directed by Dr. Ying Liu.',
    ],
    photo: {
      src: '/timeline/scu-researcher.jpg',
      alt: 'The Santa Clara University engineering building, with palm trees and flower beds under a blue sky.',
    },
  },
  {
    company: 'Veracyte',
    role: 'AI Agent Development Intern',
    location: 'South San Francisco, CA',
    dates: 'June 2026 – September 2026',
    bullets: [
      'Built a multi-agent system that flagged CRM issues and cut weekly QC review from 25 to 15 hours. Developed a Python tool to flag sensitive data in LLM workflows, achieving a 95% detection rate across thousands of samples.',
    ],
    photo: {
      src: '/timeline/veracyte.jpg',
      alt: 'The Veracyte office building in South San Francisco, with the company logo above its glass windows.',
    },
  },
  {
    company: 'DataAnnotation',
    role: 'Artificial Intelligence Analyst',
    location: 'Remote',
    dates: 'January 2026 – May 2026',
    bullets: [
      'Built Rust, TypeScript, and C++ testbeds to evaluate the accuracy, relevance, and reasoning of LLM responses. Ran A/B tests on models, MCP integrations, and prompts to support RLHF and fine-tuning.',
    ],
    photo: {
      src: '/timeline/dataannotation.jpg',
      alt: 'Darren smiling while working on a laptop at a table surrounded by plants.',
    },
  },
  {
    company: 'Sonic Engineering',
    role: 'Full Stack Software Engineer Intern',
    location: 'Union City, CA',
    dates: 'June 2025 – September 2025',
    bullets: [
      'Built a Java and SQL inventory service that automated reorder checks and cut review time by 50%. Worked with CNC operators to prototype tool lookup, material tracking, and tool life monitoring.',
    ],
    photo: {
      src: '/timeline/sonic-engineering.jpg',
      alt: 'A Haas VF-3SS CNC machining center and its control panel on the shop floor.',
    },
  },
];

export interface TimelinePhoto {
  /** Path under public/, e.g. /timeline/uw-madison-2025.jpg (3:2, centred subject). */
  src: string;
  alt: string;
  /** Crops in on the photo, e.g. 1.15 for 15% closer. Defaults to 1. */
  zoom?: number;
}

export interface EducationEntry {
  school: string;
  degree: string;
  dates: string;
  photo?: TimelinePhoto;
}

export const EDUCATION: EducationEntry[] = [
  {
    school: 'Santa Clara University',
    degree: 'Master of Science in Computer Science and Engineering',
    dates: 'September 2025 – June 2027',
    photo: {
      src: '/timeline/santa-clara.jpg',
      alt: 'The Santa Clara University entrance sign above a bed of red and pink flowers.',
    },
  },
  {
    school: 'University of Wisconsin, Madison',
    degree: 'Bachelor of Science in Computer Science',
    dates: 'September 2021 – May 2025',
    photo: {
      src: '/timeline/uw-madison-2025.jpg',
      alt: 'Darren smiling in a black and red graduation gown on the lawn in front of Bascom Hall at UW–Madison.',
    },
  },
];
