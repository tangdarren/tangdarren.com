import Link from 'next/link';
import { ArrowLeft, ArrowRight, GalleryHorizontalEnd } from 'lucide-react';

import {
  PROJECTS_LIST_PATH,
  getCaseStudyNeighbors,
  projectCaseStudyPath,
  type Project,
} from '@/data/projects';

export default function ProjectCaseStudyNav({ project }: { project: Project }) {
  const { previous, next } = getCaseStudyNeighbors(project.id);

  return (
    <nav
      aria-label="Case study navigation"
      className="mt-14 border-t border-ink-600 pt-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
        {previous ? (
          <Link
            href={projectCaseStudyPath(previous.id)}
            className="panel panel-hover flex min-w-0 flex-1 flex-col gap-1 p-4"
            aria-label={`Previous case study: ${previous.name}`}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist-400">
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              Previous
            </span>
            <span
              className="break-words font-display text-sm font-semibold text-mist-50 sm:line-clamp-2"
              title={previous.name}
            >
              {previous.name}
            </span>
          </Link>
        ) : (
          <div className="hidden flex-1 sm:block" aria-hidden />
        )}

        <Link href={PROJECTS_LIST_PATH} className="btn-secondary self-center shrink-0">
          <GalleryHorizontalEnd className="h-4 w-4" />
          Projects
        </Link>

        {next ? (
          <Link
            href={projectCaseStudyPath(next.id)}
            className="panel panel-hover flex min-w-0 flex-1 flex-col gap-1 p-4 text-left sm:items-end sm:text-right"
            aria-label={`Next case study: ${next.name}`}
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist-400">
              Next
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </span>
            <span
              className="break-words font-display text-sm font-semibold text-mist-50 sm:line-clamp-2"
              title={next.name}
            >
              {next.name}
            </span>
          </Link>
        ) : (
          <div className="hidden flex-1 sm:block" aria-hidden />
        )}
      </div>
    </nav>
  );
}
