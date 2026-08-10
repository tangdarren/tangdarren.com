'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';

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
    <li className="relative pb-8 pl-11 last:pb-0">
      <span
        aria-hidden
        className="absolute left-0 top-1.5 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-cyan"
      />
      <p className="text-base font-normal tracking-tight text-mist-50">{role}</p>
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
    <li className="relative pb-8 pl-11 last:pb-0">
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

  /* Reserve the tallest panel's height so switching tabs never shifts Projects. */
  const panelRef = useRef<HTMLDivElement>(null);
  const [reservedHeight, setReservedHeight] = useState(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const grow = () =>
      setReservedHeight((prev) =>
        Math.max(prev, panel.getBoundingClientRect().height),
      );
    // A width change re-wraps text, so start the measurement over.
    const reset = () => setReservedHeight(panel.getBoundingClientRect().height);

    grow();
    window.addEventListener('resize', reset);
    return () => window.removeEventListener('resize', reset);
  }, [tab]);

  return (
    <section
      id="experience"
      aria-labelledby="experience-education-heading"
      className="scroll-mt-20 lg:pl-3"
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
          id="home-experience-title"
          aria-controls={experiencePanelId}
          aria-selected={tab === 'experience'}
          tabIndex={tab === 'experience' ? 0 : -1}
          onClick={() => setTab('experience')}
          className={[
            'scroll-mt-20 border-b pb-1 text-base transition-colors sm:text-lg',
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
            'border-b pb-1 text-base transition-colors sm:text-lg',
            tab === 'education'
              ? 'border-accent-cyan font-medium text-mist-50'
              : 'border-transparent text-mist-400 hover:text-mist-200',
          ].join(' ')}
        >
          Education
        </button>
      </div>

      <div
        className="mt-8"
        style={reservedHeight ? { minHeight: reservedHeight } : undefined}
      >
        <div ref={panelRef}>
          <div
            role="tabpanel"
            id={experiencePanelId}
            aria-labelledby="home-experience-title"
            hidden={tab !== 'experience'}
          >
            <ol className="relative ml-3 border-l border-ink-600">
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
          >
            <ol className="relative ml-3 border-l border-ink-600">
              {HOMEPAGE_EDUCATION.map((entry) => (
                <EducationItem key={entry.id} {...entry} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
