import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import type { HomepageProject, HomepageTech } from '@/data/homepage';

interface SkillProjectPageProps {
  tech: HomepageTech;
  project: HomepageProject;
}

/**
 * Design scaffold for skill → project pages.
 * Layout: media · title · skills · description (content filled in later).
 */
export default function SkillProjectPage({
  tech,
  project,
}: SkillProjectPageProps) {
  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-mist-300 transition-colors hover:text-mist-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Technical skills
      </Link>

      <article className="mt-8 sm:mt-10">
        {/* Media — image or video of the app */}
        <div
          className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-ink-600 bg-ink-850"
          role="img"
          aria-label={`${project.name} media placeholder`}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-300">
            Image / video
          </p>
        </div>

        <header className="mt-8 sm:mt-10">
          <p className="text-sm text-mist-300">{tech.name}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-mist-50 sm:text-4xl">
            {project.name}
          </h1>
        </header>

        <ul
          className="mt-5 flex flex-wrap gap-x-4 gap-y-2"
          aria-label="Project skills"
        >
          {tech.projectSkills.map((skill) => (
            <li key={skill} className="text-sm text-mist-200 sm:text-base">
              {skill}
            </li>
          ))}
        </ul>

        {/* Description — intentionally empty for design iteration */}
        <div
          className="mt-8 min-h-[8rem] border-t border-ink-600 pt-8 sm:mt-10 sm:min-h-[10rem]"
          aria-label="Project description"
        />

        <p className="mt-8">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-mist-300 transition-colors hover:text-accent-cyan"
          >
            View on GitHub ↗
          </a>
        </p>
      </article>
    </div>
  );
}
