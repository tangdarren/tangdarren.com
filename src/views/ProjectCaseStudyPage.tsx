'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

import PageHeader from '@/components/layout/PageHeader';
import ProjectArchitectureFlow from '@/components/projects/ProjectArchitectureFlow';
import ProjectCaseStudyNav from '@/components/projects/ProjectCaseStudyNav';
import ProjectScreenshotGallery from '@/components/projects/ProjectScreenshotGallery';
import { PROJECTS_LIST_PATH, type Project } from '@/data/projects';
import { isValidHttpUrl } from '@/lib/url';

function hasText(value?: string): value is string {
  return Boolean(value?.trim());
}

function hasItems(value?: string[]): value is string[] {
  return Boolean(value && value.length > 0);
}

interface ProjectCaseStudyPageProps {
  project: Project;
}

export default function ProjectCaseStudyPage({
  project,
}: ProjectCaseStudyPageProps) {
  return (
    <div className="container-page py-10 sm:py-14">
      <ProjectCaseStudyShell project={project} />
    </div>
  );
}

function ProjectCaseStudyShell({ project }: { project: Project }) {
  const caseStudy = project.caseStudy;
  const screenshots = caseStudy?.screenshots ?? project.screenshots;
  const githubUrl = isValidHttpUrl(project.githubUrl)
    ? project.githubUrl
    : undefined;
  const liveUrl = isValidHttpUrl(project.liveUrl) ? project.liveUrl : undefined;
  const metaItems = [
    caseStudy?.role ? { label: 'Role', value: caseStudy.role } : null,
    caseStudy?.timeline ? { label: 'Context', value: caseStudy.timeline } : null,
    caseStudy?.status ? { label: 'Status', value: caseStudy.status } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  const challenge = caseStudy?.challenge ?? project.details.problem;
  const approach = caseStudy?.approach;
  const solution = project.details.solution;
  const keyFeatures = project.details.keyFeatures;
  const technicalDecisions = project.details.technicalDecisions;
  const architecture = caseStudy?.architecture;
  const outcome = caseStudy?.outcome;
  const lessonsLearned = caseStudy?.lessonsLearned;

  return (
    <>
      <Link
        href={PROJECTS_LIST_PATH}
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mist-300 transition-colors hover:text-accent-cyan"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        Back to Projects
      </Link>

      <div className="mt-6 break-words">
        <PageHeader
          eyebrow="Case Study"
          title={project.name}
          description={project.summary}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <span
            key={category}
            className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-cyan"
          >
            {category}
          </span>
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech} className="tag max-w-full break-words">
            {tech}
          </li>
        ))}
      </ul>

      {metaItems.length > 0 && (
        <dl className="panel mt-8 grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {metaItems.map((item) => (
            <MetaItem key={item.label} label={item.label}>
              {item.value}
            </MetaItem>
          ))}
        </dl>
      )}

      {(githubUrl || liveUrl) && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-secondary"
              aria-label={`GitHub repository for ${project.name}`}
            >
              <Github className="h-4 w-4" />
              Repository
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary"
              aria-label={`Live demo of ${project.name}`}
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      )}

      <div className="mt-12 space-y-10 sm:mt-14 sm:space-y-12">
        {hasText(challenge) && (
          <CaseSection title="The challenge">{challenge}</CaseSection>
        )}

        {hasText(approach) && (
          <CaseSection title="My approach">{approach}</CaseSection>
        )}

        {hasText(solution) && (
          <CaseSection title="The solution">{solution}</CaseSection>
        )}

        {hasItems(keyFeatures) && (
          <CaseSection title="Key features">
            <BulletList items={keyFeatures} />
          </CaseSection>
        )}

        {hasItems(technicalDecisions) && (
          <CaseSection title="Technical decisions">
            <BulletList items={technicalDecisions} />
          </CaseSection>
        )}

        {architecture && architecture.length > 0 && (
          <ProjectArchitectureFlow stages={architecture} />
        )}

        {hasText(outcome) && (
          <CaseSection title="Outcome">{outcome}</CaseSection>
        )}

        {hasItems(lessonsLearned) && (
          <CaseSection title="Lessons learned">
            <BulletList items={lessonsLearned} />
          </CaseSection>
        )}

        {screenshots && screenshots.length > 0 && (
          <ProjectScreenshotGallery
            screenshots={screenshots}
            projectName={project.name}
          />
        )}
      </div>

      <ProjectCaseStudyNav project={project} />
    </>
  );
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-cyan">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm leading-relaxed text-mist-200">
        {children}
      </dd>
    </div>
  );
}

function CaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-cyan">
        {title}
      </h2>
      <div className="mt-3 max-w-3xl break-words text-sm leading-relaxed text-mist-200 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            aria-hidden
            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent-cyan"
          />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}
