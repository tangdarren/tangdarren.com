export type ProjectCategory =
  | 'Full-Stack'
  | 'AI'
  | 'Financial Technology'
  | 'Mobile'
  | 'Extended Reality'
  | 'Data Visualization'
  | 'Automation'
  | 'Interactive Training';

export interface ProjectScreenshot {
  src: string;
  alt: string;
}

export interface ProjectArchitectureStage {
  title: string;
  description: string;
  technologies?: string[];
}

export interface ProjectCaseStudy {
  role?: string;
  timeline?: string;
  status?: string;
  challenge?: string;
  approach?: string;
  outcome?: string;
  architecture?: ProjectArchitectureStage[];
  lessonsLearned?: string[];
  screenshots?: ProjectScreenshot[];
}

export interface Project {
  id: string;
  name: string;
  summary: string;
  description: string;
  categories: ProjectCategory[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  image?: string;
  screenshots?: ProjectScreenshot[];
  caseStudy?: ProjectCaseStudy;
  details: {
    problem: string;
    solution: string;
    keyFeatures: string[];
    technicalDecisions: string[];
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'spy-market-intelligence',
    name: 'SPY Market Intelligence Dashboard',
    summary:
      'A recruiter-facing market intelligence platform that surfaces SPY trends, overnight movement, and pre-market prep in one view.',
    description:
      'Transforms SPY market data into clear trends, overnight movement analysis, market context, and pre-market preparation insights for daily decision-making.',
    categories: ['Full-Stack', 'Financial Technology', 'Data Visualization'],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Alpha Vantage API',
      'Financial APIs',
      'Data Visualization',
    ],
    githubUrl: 'https://github.com/tangdarren/stock-market-dashboard',
    featured: true,
    details: {
      problem:
        'Traders and analysts often stitch together fragmented data sources when preparing for the market open, which is slow and error-prone.',
      solution:
        'A single dashboard that consolidates SPY data into trend context, overnight movement, and a pre-market brief so users can start each session with an informed baseline.',
      keyFeatures: [
        'SPY trend visualization with contextual annotations.',
        'Overnight movement summary with directional cues.',
        'Pre-market preparation panel highlighting key levels.',
        'Modular architecture that supports adding new data feeds.',
      ],
      technicalDecisions: [
        'React + TypeScript for a strongly-typed component tree.',
        'Vite for fast local iteration and lean production builds.',
        'Alpha Vantage as the primary data source, wrapped behind a small client for easy provider swaps.',
      ],
    },
    caseStudy: {
      challenge:
        'Traders and analysts often stitch together fragmented data sources when preparing for the market open, which is slow and error-prone.',
      approach:
        'Build a full-stack market intelligence dashboard that combines live SPY data or explicitly enabled Excel simulation data with explainable forecasts, historical replay, and model monitoring.',
      outcome:
        'Delivers educational one-day and five-session SPY directional forecasts with current market indicators, a Market Replay Lab, and a Model Monitor across forecast horizons.',
      architecture: [
        {
          title: 'Frontend',
          description:
            'React + TypeScript + Vite client talks to a FastAPI REST backend.',
          technologies: ['React', 'TypeScript', 'Vite'],
        },
        {
          title: 'API & data',
          description:
            'Backend serves live Alpha Vantage data or an opt-in Excel simulation workbook.',
          technologies: ['FastAPI', 'Alpha Vantage'],
        },
        {
          title: 'Forecast models',
          description:
            'pandas / scikit-learn produce local model artifacts used for forecasts.',
          technologies: ['pandas', 'scikit-learn'],
        },
        {
          title: 'Market Replay Lab',
          description:
            'Supports reviewing historical sessions, locking predictions, and revealing outcomes.',
        },
      ],
      lessonsLearned: [
        'Simulated mode stays opt-in and never activates automatically when live data fails.',
        'Keep the Alpha Vantage API key backend-only.',
        'Build forecast features to avoid look-ahead leakage; forecasts remain probabilistic and educational.',
      ],
    },
  },
  {
    id: 'expensense',
    name: 'ExpenSense',
    summary:
      'An AI multi-agent reimbursement platform that reads receipts, checks policy, routes approvals, and flags anomalies.',
    description:
      'Processes receipts, validates policy requirements, routes approvals, identifies anomalies, and maintains structured audit records — coordinated by a set of cooperating AI agents.',
    categories: ['Full-Stack', 'AI', 'Automation'],
    technologies: [
      'React',
      'Vite',
      'Gmail API',
      'Firebase',
      'Firestore',
      'Cloud Storage',
      'Vector Database',
      'AI Agents',
    ],
    githubUrl: 'https://github.com/tangdarren/expensense',
    featured: true,
    details: {
      problem:
        'Expense reimbursement is repetitive, spread across email and spreadsheets, and frequently loses context between submission and approval.',
      solution:
        'A multi-agent workflow where specialized agents handle ingestion, policy validation, routing, anomaly detection, and audit — with a clean review UI on top.',
      keyFeatures: [
        'Receipt ingestion from email attachments via the Gmail API.',
        'Policy validation agent with configurable rule sets.',
        'Approval routing with structured status tracking.',
        'Anomaly detection surfaced in the reviewer queue.',
        'Structured audit trail persisted in Firestore.',
      ],
      technicalDecisions: [
        'Firebase + Firestore for auth, storage, and structured records without standing up a separate backend.',
        'Vector database for retrieval when agents need contextual policy lookups.',
        'React + Vite for a responsive reviewer UI.',
      ],
    },
    caseStudy: {
      challenge:
        'Expense reimbursement is repetitive, spread across email and spreadsheets, and frequently loses context between submission and approval.',
      approach:
        'Coordinate specialized AI agents for receipt OCR and validation, policy-aware reimbursement decisions, anomaly detection, admin review, and full audit logging across the expense-review lifecycle.',
      outcome:
        'Automates receipt processing, policy rules (R1–R5), anomaly flagging, and admin approve/reject workflows with structured audit records.',
      architecture: [
        {
          title: 'Presentation',
          description: 'Web UI for employees and admins.',
          technologies: ['React', 'Vite'],
        },
        {
          title: 'Business logic',
          description: 'Traditional backend workflow and validation.',
          technologies: ['FastAPI'],
        },
        {
          title: 'Agent layer',
          description:
            'Expense, Document, Email, and Orchestrator agents coordinate OCR, policy checks, notifications, and routing.',
          technologies: ['AI Agents'],
        },
        {
          title: 'Data access',
          description:
            'CRUD abstraction for Firestore, Cloud Storage, Gmail, and a vector database.',
          technologies: [
            'Firestore',
            'Cloud Storage',
            'Gmail API',
            'Vector Database',
          ],
        },
      ],
      lessonsLearned: [
        'A MAESTRO-aligned red-team suite (29 tests across 7 layers and 4 agents) surfaced 5 vulnerabilities, primarily RBAC-related, with documented mitigation recommendations.',
        'Policy retrieval via a vector database needs safeguard grounding to keep agent decisions auditable.',
      ],
    },
  },
  {
    id: 'sql-detective',
    name: 'SQL Detective',
    summary:
      'A black-and-white SQL mystery game where you investigate a hotel theft by writing real queries against case evidence.',
    description:
      'Query the evidence and solve the case: a short mystery game with one fictional hotel theft, five levels, and no accounts — driven by real SQL against guest logs, staff records, access logs, and payments.',
    categories: ['Full-Stack', 'Interactive Training'],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'Flyway',
    ],
    githubUrl: 'https://github.com/tangdarren/sql-detective',
    featured: true,
    details: {
      problem:
        'Learning SQL is more engaging when practice is tied to a concrete investigation instead of isolated drills.',
      solution:
        'A monochrome mystery game that progresses through five levels of a hotel-theft case while players write real SQL against case tables and track findings in a Detective Notebook.',
      keyFeatures: [
        'Black-and-white investigation UI for a focused mystery-game feel.',
        'Five-level case progression from introduction through investigation to completion.',
        'Persistent Detective Notebook for notes and pinnable query-result evidence (browser local storage).',
        'Backend accepts only a single read-only SELECT, runs it with a restricted database role, and compares results to a hidden expected query.',
      ],
      technicalDecisions: [
        'React + TypeScript + Vite for the investigation workspace.',
        'Java 21 and Spring Boot for challenge loading and SQL execution.',
        'PostgreSQL with Flyway for schema and case data; player queries use a read-only role.',
      ],
    },
    caseStudy: {
      challenge:
        'Learning SQL is more engaging when practice is tied to a concrete investigation instead of isolated drills.',
      approach:
        'Build a short, account-free mystery game inspired by SQL Murder Mystery: players investigate one hotel theft across five levels by querying real evidence tables through a locked-down API.',
      outcome:
        'Delivers a complete investigation loop — landing, case intro, workspace with SQL execution and feedback, Detective Notebook, and case completion — without exposing write access to the database.',
      architecture: [
        {
          title: 'React UI',
          description:
            'Loads challenges from the API, sends SQL to an execute endpoint, and keeps notebook notes plus pinned evidence in local storage.',
          technologies: ['React', 'TypeScript', 'Vite'],
        },
        {
          title: 'Spring Boot API',
          description:
            'Serves challenges and validates player SQL as a single read-only SELECT before execution.',
          technologies: ['Java 21', 'Spring Boot'],
        },
        {
          title: 'PostgreSQL',
          description:
            'Stores case data with Flyway migrations; player queries run under a restricted read-only database role.',
          technologies: ['PostgreSQL', 'Flyway'],
        },
        {
          title: 'Investigation progression',
          description:
            'Routes move from landing → case introduction → investigation workspace → case completion across five levels.',
        },
      ],
      lessonsLearned: [
        'Restrict player SQL to a single read-only SELECT and a dedicated database role.',
        'Keep notebook state client-side when the game does not require accounts.',
        'Compare query results to a hidden expected query to grade progress without revealing the answer SQL.',
      ],
    },
  },
  {
    id: 'musicbloom',
    name: 'MusicBloom',
    summary:
      'A full-stack music player that turns listening into garden progression with Melody Points, quests, and achievements.',
    description:
      'Grow your music garden, one song at a time — a React visual player backed by a typed FastAPI service for catalog, playback sessions, queue control, progression, and optional Spotify or Azure DevOps integrations, with a credential-free demo mode.',
    categories: ['Full-Stack'],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'FastAPI',
      'Python',
      'SQLAlchemy',
      'Alembic',
      'Docker',
      'Azure Pipelines',
    ],
    githubUrl: 'https://github.com/tangdarren/musicbloom',
    details: {
      problem:
        'Music players rarely connect listening behavior to a durable progression system that still works without third-party credentials.',
      solution:
        'A full-stack app where a React visual player talks to FastAPI for catalog, sessions, queue, Melody Points, quests, and achievements, with demo mode covering the product without Spotify or Azure DevOps secrets.',
      keyFeatures: [
        'Visual music player with playback controls, queue management, and listening-event sync.',
        'Garden progression with Melody Points, quests, achievements, decorations, and BloomBud.',
        'BloomMix mood-based five-track previews planted into a server-backed queue; Recent Blooms and Favorites from persisted listening events.',
        'Demo mode for catalog, player, garden, history, favorites, and Dev Garden sample data without external credentials.',
      ],
      technicalDecisions: [
        'React, TypeScript, Vite, React Router, and TanStack Query on the frontend.',
        'Python, FastAPI, Pydantic, and SQLAlchemy 2 with Alembic migrations on the backend.',
        'SQLite by default with PostgreSQL-compatible persistence; Spotify and Azure DevOps secrets stay server-side.',
      ],
    },
    caseStudy: {
      status:
        'Single demo user; quest and achievement pages are partly scaffold-level; CI validates and publishes artifacts but does not deploy production.',
      challenge:
        'Music players rarely connect listening behavior to a durable progression system that still works without third-party credentials.',
      approach:
        'Split a typed FastAPI domain (catalog, sessions, progression, favorites, optional Spotify/Azure clients) from a React visual player, and default to demo mode so the full loop runs locally without external APIs.',
      outcome:
        'Delivers player, garden progression, history, favorites, OpenAPI docs, Docker Compose demo stack, and Azure Pipelines CI for lint, typecheck, tests, builds, and artifacts.',
      architecture: [
        {
          title: 'React visual player',
          description:
            'Playback UI, queue, garden views, and a typed API client shared with TanStack Query.',
          technologies: ['React', 'TypeScript', 'Vite', 'TanStack Query'],
        },
        {
          title: 'FastAPI REST API',
          description:
            'Versioned /api/v1 routes for demo catalog, player session, queue, and progression systems.',
          technologies: ['Python', 'FastAPI', 'Pydantic'],
        },
        {
          title: 'Persistence',
          description:
            'SQLAlchemy repositories with Alembic migrations; SQLite by default, PostgreSQL-compatible.',
          technologies: ['SQLAlchemy', 'Alembic', 'SQLite'],
        },
        {
          title: 'Quality & delivery',
          description:
            'pytest (100% coverage gate on src/musicbloom), Vitest, Ruff, mypy, ESLint, Azure Pipelines, Docker, and Compose demo stack.',
          technologies: ['pytest', 'Vitest', 'Docker', 'Azure Pipelines'],
        },
      ],
      lessonsLearned: [
        'Demo mode should cover the full product loop without requiring Spotify or Azure DevOps credentials.',
        'Keep OAuth and DevOps tokens server-side so they are never exposed to the browser.',
        'Enforce backend coverage and CI quality gates early so demo-friendly apps stay production-minded.',
      ],
    },
  },
  {
    id: 'vr-first-responder-training',
    name: 'SafeCall VR',
    summary:
      'An immersive WebSpatial training experience for emergency-response scenarios on Apple Vision Pro.',
    description:
      'SafeCall lets learners work through scripted 911-style calls in WebSpatial, make stage-based decisions, dispatch a response, and receive a deterministic debrief — prototyped for Hack for Humanity 2026.',
    categories: ['Extended Reality', 'Interactive Training'],
    technologies: [
      'WebSpatial',
      'React',
      'TypeScript',
      'Spring Boot',
      'Java',
    ],
    githubUrl: 'https://github.com/tangdarren/safecall-vr',
    details: {
      problem:
        'Hands-on training for first responders is expensive to run and hard to repeat at scale.',
      solution:
        'A WebSpatial prototype that lets trainees rehearse scenarios in an immersive environment with structured decision points.',
      keyFeatures: [
        'Immersive training scenarios in WebSpatial.',
        'Interactive decision moments to reinforce protocol.',
        'React-based UI for scenario controls and review.',
      ],
      technicalDecisions: [
        'WebSpatial chosen to reach modern spatial browsers without a heavy install path.',
        'React used for standard UI surfaces so the same team can iterate across web and spatial views.',
      ],
    },
    caseStudy: {
      timeline:
        'Prototyped at Santa Clara University’s 2026 Hackathon for Humanity, with further enhancement afterwards.',
      status:
        'Focused 911 call console, backend scenarios/sessions/debriefs, Apple Vision Pro simulator flow, and physical device validation are implemented; voice, maps, AI, authentication, and database persistence remain planned enhancements.',
      challenge:
        'Hands-on training for first responders is expensive to run and hard to repeat at scale.',
      approach:
        'Build an Apple Vision Pro / WebSpatial experience backed by a Spring Boot REST API where learners work through scripted 911-style calls, make stage-based decisions, dispatch a response, and receive a deterministic debrief.',
      outcome:
        'Validated in the Apple Vision Pro simulator and on a physical Apple Vision Pro device provided for testing at the hackathon.',
      architecture: [
        {
          title: 'Launcher',
          description: 'Entry into the single main spatial scene.',
          technologies: ['WebSpatial', 'React'],
        },
        {
          title: 'Scenario selection',
          description: 'Learner chooses a scripted 911-style training scenario.',
        },
        {
          title: 'Call console',
          description:
            'Active-call experience with transcript and stage-based decisions; the backend remains authoritative.',
          technologies: ['Spring Boot', 'Java 21'],
        },
        {
          title: 'Debrief',
          description:
            'In-scene deterministic debrief after the simulation completes.',
        },
      ],
      lessonsLearned: [
        'Keep the backend authoritative for scenario state, sessions, and debriefs.',
        'Optional in-page view references can illustrate scenes without separate spatial windows.',
      ],
    },
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function hasCaseStudy(project: Project): boolean {
  return Boolean(project.caseStudy);
}

/** Projects that have a dedicated case-study page, in list order. */
export function getCaseStudyProjects(): Project[] {
  return PROJECTS.filter(hasCaseStudy);
}

export function getCaseStudyNeighbors(id: string): { previous?: Project; next?: Project } {
  const list = getCaseStudyProjects();
  const index = list.findIndex((project) => project.id === id);
  if (index === -1) return {};
  return {
    previous: index > 0 ? list[index - 1] : undefined,
    next: index < list.length - 1 ? list[index + 1] : undefined,
  };
}

/** Case studies link back to the project list on the home page. */
export const PROJECTS_LIST_PATH = '/#projects';

export function projectCaseStudyPath(id: string): string {
  return `/projects/${id}`;
}
