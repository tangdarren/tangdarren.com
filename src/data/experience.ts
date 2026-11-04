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
      'Engineered a multi-agent system for CRM issue detection and reporting that cut weekly QC review from 25 to 15 hours.',
      'Created a Python sensitive data detector for LLM security and compliance, averaging 95% detection across thousands of samples.',
      'Developed an autonomous desktop AI agent using RAG across 10 enterprise sources to surface context during customer care calls.',
      'Conducted requirements gathering and functional testing for 8 automation initiatives across Customer Care and Laboratory teams.',
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
      'Built TypeScript and C++ testbeds evaluating LLM factuality, relevance, and reasoning using rubrics for RLHF and fine-tuning.',
      'Evaluated models, MCP integrations, and prompt variants through A/B tests to identify stronger-performing configurations.',
      'Ran LLM tool call and structured output evaluation in containerized Docker environments for reproducible and isolated testing.',
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
      'Programmed a Java/SQL inventory service on Azure DevOps CI/CD that automated reorder checks, cutting review time by 50%.',
      'Collaborated with engineers and CNC operators in an Agile Scrum team to translate product requirements into validated features.',
      'Prototyped tool lookup, material tracking, and tool life monitoring features, iterating with CNC operators to improve workflows.',
    ],
    photo: {
      src: '/timeline/sonic-engineering.jpg',
      alt: 'A Haas VF-3SS CNC machining center and its control panel on the shop floor.',
    },
  },
];

export interface EducationDetail {
  label: string;
  text: string;
}

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
  details: EducationDetail[];
  photo?: TimelinePhoto;
}

export const EDUCATION: EducationEntry[] = [
  {
    school: 'Santa Clara University',
    degree: 'Master of Science in Computer Science and Engineering',
    dates: 'September 2025 – June 2027',
    details: [
      {
        label: 'Coursework',
        text: 'Advanced Algorithms, Advanced Operating Systems, Artificial Intelligence, Object-Oriented Programming, Machine Learning, AI Governance and Cybersecurity, Mobile Application Development, Data Mining and Pattern Recognition',
      },
    ],
    photo: {
      src: '/timeline/santa-clara.jpg',
      alt: 'The Santa Clara University entrance sign above a bed of red and pink flowers.',
    },
  },
  {
    school: 'University of Wisconsin, Madison',
    degree: 'Bachelor of Science in Computer Science',
    dates: 'September 2021 – May 2025',
    details: [
      {
        label: 'Honors',
        text: "Lumen Scholarship Fund ($40,000 merit-based scholarship), Dean's List (May 2024)",
      },
    ],
    photo: {
      src: '/timeline/uw-madison-2025.jpg',
      alt: 'Darren in his graduation gown making a W with his hands between giant red 2025 letters on the UW–Madison campus.',
      zoom: 1.2,
    },
  },
];
