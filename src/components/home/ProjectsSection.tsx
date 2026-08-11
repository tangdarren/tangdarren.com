'use client';

import { useState } from 'react';

import {
  HOMEPAGE_PROJECTS,
  type HomepageProject,
} from '@/data/homepage';

type ProjectFilter = 'featured' | 'all';

function ProjectRow({ project }: { project: HomepageProject }) {
  return (
    <li className="border-b border-ink-600 last:border-b-0">
      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="font-display text-base font-normal tracking-tight text-mist-50">
            {project.name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-mist-300">
            {project.description}
          </p>
        </div>
        <div className="flex shrink-0 items-baseline gap-3 text-xs text-mist-400 sm:pt-1 sm:justify-end">
          <p>{project.label}</p>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on GitHub`}
            className="transition-colors hover:text-accent-cyan"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </li>
  );
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const projects =
    filter === 'featured'
      ? HOMEPAGE_PROJECTS.filter((project) => project.featured)
      : [...HOMEPAGE_PROJECTS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="w-full scroll-mt-16 lg:scroll-mt-20 lg:pl-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="projects-heading"
          className="scroll-mt-16 text-base font-medium tracking-tight text-mist-50 sm:text-lg lg:scroll-mt-20"
        >
          Projects
        </h2>

        <div
          role="group"
          aria-label="Project filter"
          className="flex items-center gap-2 text-base font-medium tracking-tight text-mist-400 sm:text-lg"
        >
          <button
            type="button"
            aria-pressed={filter === 'featured'}
            onClick={() => setFilter('featured')}
            className={[
              'transition-colors',
              filter === 'featured'
                ? 'text-mist-50'
                : 'hover:text-mist-200',
            ].join(' ')}
          >
            Featured
          </button>
          <span aria-hidden>/</span>
          <button
            type="button"
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
            className={[
              'transition-colors',
              filter === 'all' ? 'text-mist-50' : 'hover:text-mist-200',
            ].join(' ')}
          >
            All
          </button>
        </div>
      </div>

      <ul className="mt-6 border-t border-ink-600">
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </ul>
    </section>
  );
}
