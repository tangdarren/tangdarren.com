'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BookOpen, ExternalLink, Github, X } from 'lucide-react';

import {
  hasCaseStudy,
  projectCaseStudyPath,
  type Project,
  type ProjectFilter,
} from '@/data/projects';
import { isValidHttpUrl } from '@/lib/url';

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
  filter?: ProjectFilter;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectDetails({
  project,
  onClose,
  filter = 'All',
}: ProjectDetailsProps) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape, trap focus, restore focus, lock body scroll
  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = original;
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  const githubUrl = project && isValidHttpUrl(project.githubUrl)
    ? project.githubUrl
    : undefined;
  const liveUrl = project && isValidHttpUrl(project.liveUrl)
    ? project.liveUrl
    : undefined;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-mist-50/40 backdrop-blur-sm dark:bg-black/50 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reduce ? 0.01 : 0.25 }}
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-ink-600 bg-ink-900 shadow-card sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-600 bg-ink-850 px-6 py-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cyan">
                  Project · Details
                </p>
                <h2
                  id="project-details-title"
                  className="mt-1 break-words font-display text-xl font-semibold text-mist-50 sm:text-2xl"
                >
                  {project.name}
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="btn-ghost -mr-2"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap gap-2">
                {project.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-cyan"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-mist-200">{project.description}</p>

              <Section title="Problem">
                <p>{project.details.problem}</p>
              </Section>

              <Section title="Solution">
                <p>{project.details.solution}</p>
              </Section>

              <Section title="Key features">
                <ul className="space-y-1.5">
                  {project.details.keyFeatures.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent-cyan"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Technical decisions">
                <ul className="space-y-1.5">
                  {project.details.technicalDecisions.map((d) => (
                    <li key={d} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-accent-cyan"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Technologies">
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </Section>

              {project.screenshots && project.screenshots.length > 0 && (
                <Section title="Screenshots">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {project.screenshots.map((shot) => (
                      <div
                        key={shot.src}
                        className="overflow-hidden rounded-md border border-ink-600 bg-ink-800/70"
                      >
                        <img
                          src={shot.src}
                          alt={shot.alt}
                          loading="lazy"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-ink-600 bg-ink-850 px-6 py-4">
              {hasCaseStudy(project) && (
                <Link
                  href={projectCaseStudyPath(project.id, filter)}
                  className="btn-primary"
                  onClick={onClose}
                >
                  <BookOpen className="h-4 w-4" />
                  View Case Study
                </Link>
              )}
              {githubUrl && (
                <ModalLink
                  href={githubUrl}
                  label="Repository"
                  icon={<Github className="h-4 w-4" />}
                />
              )}
              {liveUrl && (
                <ModalLink
                  href={liveUrl}
                  label="Live demo"
                  icon={<ExternalLink className="h-4 w-4" />}
                />
              )}
              <div className="grow" />
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-cyan">
        {title}
      </h3>
      <div className="mt-2 text-sm text-mist-200">{children}</div>
    </section>
  );
}

function ModalLink({
  href,
  label,
  icon,
  variant = 'secondary',
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={base}
    >
      {icon}
      {label}
    </a>
  );
}
