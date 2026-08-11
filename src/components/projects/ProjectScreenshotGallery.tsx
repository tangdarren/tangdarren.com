'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Expand, X } from 'lucide-react';

import type { ProjectScreenshot } from '@/data/projects';

interface ProjectScreenshotGalleryProps {
  screenshots: ProjectScreenshot[];
  projectName: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProjectScreenshotGallery({
  screenshots,
  projectName,
}: ProjectScreenshotGalleryProps) {
  const reduce = useReducedMotion();
  const headingId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  if (screenshots.length === 0) return null;

  const activeShot =
    activeIndex !== null ? screenshots[activeIndex] : undefined;

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-cyan"
      >
        Screenshots
      </h2>

      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {screenshots.map((shot, index) => (
          <li key={shot.src}>
            <button
              type="button"
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              onClick={() => setActiveIndex(index)}
              className="group relative w-full overflow-hidden rounded-md border border-ink-600 bg-ink-800/70 text-left transition-colors hover:border-accent-cyan/50"
              aria-label={`Open larger view: ${shot.alt}`}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-600 bg-ink-900/90 text-mist-200 opacity-90 transition-opacity group-hover:opacity-100"
              >
                <Expand className="h-4 w-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ScreenshotLightbox
        shot={activeShot}
        projectName={projectName}
        reduceMotion={Boolean(reduce)}
        onClose={closeLightbox}
      />
    </section>
  );
}

function ScreenshotLightbox({
  shot,
  projectName,
  reduceMotion,
  onClose,
}: {
  shot?: ProjectScreenshot;
  projectName: string;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const open = Boolean(shot);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {shot && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-mist-50/50 p-4 backdrop-blur-sm dark:bg-black/60 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-ink-600 bg-ink-900 shadow-card"
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-600 bg-ink-850 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cyan">
                  {projectName}
                </p>
                <h2
                  id={titleId}
                  className="mt-1 break-words font-display text-sm font-semibold text-mist-50 sm:text-base"
                >
                  {shot.alt}
                </h2>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="btn-ghost -mr-1 shrink-0"
                aria-label="Close screenshot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-ink-950/40 p-3 sm:p-5">
              <img
                src={shot.src}
                alt={shot.alt}
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
