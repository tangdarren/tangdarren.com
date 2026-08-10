'use client';

import { useId, useState } from 'react';

import {
  HOMEPAGE_EDUCATION,
  HOMEPAGE_EXPERIENCE,
} from '@/data/homepage';

type CareerTab = 'experience' | 'education';

function ExperienceItem({
  role,
  company,
  type,
  dates,
  description,
}: {
  role: string;
  company: string;
  type: string;
  dates: string;
  description: string;
}) {
  return (
    <li className="relative pb-8 pl-6 last:pb-0">
      <span
        aria-hidden
        className="absolute left-0 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-cyan"
      />
      <p className="text-base font-medium tracking-tight text-mist-50">{role}</p>
      <p className="mt-0.5 text-sm text-mist-300">
        {company} · {type}
      </p>
      <p className="mt-0.5 text-sm text-mist-400">{dates}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-300">
        {description}
      </p>
    </li>
  );
}

function EducationItem({
  school,
  degree,
  dates,
  description,
}: {
  school: string;
  degree: string;
  dates: string;
  description: string;
}) {
  return (
    <li className="relative pb-8 pl-6 last:pb-0">
      <span
        aria-hidden
        className="absolute left-0 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-cyan"
      />
      <p className="text-base font-medium tracking-tight text-mist-50">
        {degree}
      </p>
      <p className="mt-0.5 text-sm text-mist-300">{school}</p>
      <p className="mt-0.5 text-sm text-mist-400">{dates}</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-300">
        {description}
      </p>
    </li>
  );
}

export default function ExperienceEducationSection() {
  const [tab, setTab] = useState<CareerTab>('experience');
  const baseId = useId();
  const experiencePanelId = `${baseId}-experience`;
  const educationPanelId = `${baseId}-education`;

  return (
    <section
      id="experience"
      aria-labelledby="experience-education-heading"
      className="scroll-mt-20"
    >
      <h2 id="experience-education-heading" className="sr-only">
        Experience and Education
      </h2>

      <div
        role="tablist"
        aria-label="Experience and education"
        className="flex items-center gap-6"
      >
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-experience`}
          aria-controls={experiencePanelId}
          aria-selected={tab === 'experience'}
          tabIndex={tab === 'experience' ? 0 : -1}
          onClick={() => setTab('experience')}
          className={[
            'border-b pb-1 text-base transition-colors',
            tab === 'experience'
              ? 'border-accent-cyan font-medium text-mist-50'
              : 'border-transparent text-mist-400 hover:text-mist-200',
          ].join(' ')}
        >
          Experience
        </button>
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-education`}
          aria-controls={educationPanelId}
          aria-selected={tab === 'education'}
          tabIndex={tab === 'education' ? 0 : -1}
          onClick={() => setTab('education')}
          className={[
            'border-b pb-1 text-base transition-colors',
            tab === 'education'
              ? 'border-accent-cyan font-medium text-mist-50'
              : 'border-transparent text-mist-400 hover:text-mist-200',
          ].join(' ')}
        >
          Education
        </button>
      </div>

      <div
        role="tabpanel"
        id={experiencePanelId}
        aria-labelledby={`${baseId}-tab-experience`}
        hidden={tab !== 'experience'}
        className="mt-8"
      >
        <ol className="relative ml-1 border-l border-ink-600">
          {HOMEPAGE_EXPERIENCE.map((entry) => (
            <ExperienceItem key={entry.id} {...entry} />
          ))}
        </ol>
      </div>

      <div
        role="tabpanel"
        id={educationPanelId}
        aria-labelledby={`${baseId}-tab-education`}
        hidden={tab !== 'education'}
        className="mt-8"
      >
        <ol className="relative ml-1 border-l border-ink-600">
          {HOMEPAGE_EDUCATION.map((entry) => (
            <EducationItem key={entry.id} {...entry} />
          ))}
        </ol>
      </div>
    </section>
  );
}
