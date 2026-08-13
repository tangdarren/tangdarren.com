'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';

import {
  HOMEPAGE_EDUCATION,
  HOMEPAGE_EXPERIENCE,
} from '@/data/homepage';

type CareerTab = 'experience' | 'education';

function formatIndex(index: number) {
  return String(index + 1).padStart(2, '0');
}

function ExperienceItem({
  index,
  role,
  company,
  type,
  dates,
  description,
}: {
  index: number;
  role: string;
  company: string;
  type: string;
  dates: string;
  description: string;
}) {
  return (
    <li className="flex items-baseline gap-8 pb-8 last:pb-0">
      <span
        aria-hidden
        className="w-7 shrink-0 text-base font-normal tabular-nums text-mist-50"
      >
        {formatIndex(index)}
      </span>
      <div className="min-w-0">
        <p className="text-base font-normal tracking-tight text-mist-50">{role}</p>
        <p className="mt-0.5 text-sm text-mist-300">
          {company} · {type}
        </p>
        <p className="mt-0.5 text-sm text-mist-300">{dates}</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-300">
          {description}
        </p>
      </div>
    </li>
  );
}

function EducationItem({
  index,
  school,
  degree,
  dates,
  description,
}: {
  index: number;
  school: string;
  degree: string;
  dates: string;
  description: string;
}) {
  return (
    <li className="flex items-baseline gap-8 pb-8 last:pb-0">
      <span
        aria-hidden
        className="w-7 shrink-0 text-base font-normal tabular-nums text-mist-50"
      >
        {formatIndex(index)}
      </span>
      <div className="min-w-0">
        <p className="text-base font-normal tracking-tight text-mist-50">
          {degree}
        </p>
        <p className="mt-0.5 text-sm text-mist-300">{school}</p>
        <p className="mt-0.5 text-sm text-mist-300">{dates}</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist-300">
          {description}
        </p>
      </div>
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
      className="scroll-mt-16 lg:scroll-mt-20 lg:pl-3"
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
            'scroll-mt-16 border-b pb-1 text-base transition-colors sm:text-lg lg:scroll-mt-20',
            tab === 'experience'
              ? 'border-accent-cyan font-medium text-mist-50'
              : 'border-transparent text-mist-300 hover:text-mist-200',
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
              : 'border-transparent text-mist-300 hover:text-mist-200',
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
            <ol className="list-none">
              {HOMEPAGE_EXPERIENCE.map((entry, index) => (
                <ExperienceItem key={entry.id} index={index} {...entry} />
              ))}
            </ol>
          </div>

          <div
            role="tabpanel"
            id={educationPanelId}
            aria-labelledby={`${baseId}-tab-education`}
            hidden={tab !== 'education'}
          >
            <ol className="list-none">
              {HOMEPAGE_EDUCATION.map((entry, index) => (
                <EducationItem key={entry.id} index={index} {...entry} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
