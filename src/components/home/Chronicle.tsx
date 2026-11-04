'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { EDUCATION, EXPERIENCE, type EducationDetail } from '@/data/experience';
import { GALLERY_COUNT } from '@/data/gallery';
import { HOMEPAGE_PROJECTS } from '@/data/homepage';
import { RESUME_PDF_PATH, SOCIAL_LINKS } from '@/data/socials';

import PhotoGallery, { type PhotoGalleryHandle } from './PhotoGallery';
import styles from './Chronicle.module.css';

interface TimelineEntry {
  id: string;
  title: string;
  /** Shown under the pinned year. */
  place: string;
  /** Shown under the title; education omits it (the place is pinned beside). */
  org?: string;
  dates: string;
  year: number;
  sortKey: number;
  points?: string[];
  details?: EducationDetail[];
  /** Drop a photo in public/timeline/ and set it here; until then a sized slot shows. */
  photo?: { src: string; alt: string; zoom?: number };
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "June 2026 – Present" → 2026 * 12 + 5, for oldest-first ordering. */
function startOf(dates: string) {
  const match = /([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(dates);
  if (!match) return { year: 0, key: 0 };
  const year = Number(match[2]);
  return { year, key: year * 12 + Math.max(0, MONTHS.indexOf(match[1].toLowerCase())) };
}

const EXPERIENCE_ENTRIES: TimelineEntry[] = EXPERIENCE.map((job) => {
    const start = startOf(job.dates ?? '');
    return {
      id: job.company,
      title: job.role,
      place: job.company,
      org: [job.company, job.location].filter(Boolean).join(' · '),
      dates: job.dates ?? '',
      year: start.year,
      sortKey: start.key,
      points: job.bullets,
      photo: job.photo,
    };
  }).sort((a, b) => a.sortKey - b.sortKey);

const EDUCATION_ENTRIES: TimelineEntry[] = EDUCATION.map((school) => {
    const start = startOf(school.dates);
    return {
      id: school.school,
      title: school.degree,
      place: school.school,
      dates: school.dates,
      year: start.year,
      sortKey: start.key,
      details: school.details,
      photo: school.photo,
    };
  }).sort((a, b) => a.sortKey - b.sortKey);

/**
 * After Education: the spine runs on a little, then turns into a horizontal
 * line across the page, closing Education before Experience begins. It draws
 * in green as you scroll, continuing the spine's fill.
 */
function SpineTurn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.style.setProperty('--down', '1');
      node.style.setProperty('--across', '1');
      return;
    }
    let target = 0;
    let current = 0;
    let frame = 0;
    // 0–1 draws the drop as its top-to-bottom crosses mid-screen; 1–2 then
    // draws the horizontal over the next fifth of the screen.
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      const down = (mid - rect.top) / Math.max(1, rect.height);
      const across = (mid - rect.bottom) / (window.innerHeight * 0.2);
      target = Math.min(1, Math.max(0, down)) + Math.min(1, Math.max(0, across));
    };
    const paint = () => {
      node.style.setProperty('--down', Math.min(1, current).toFixed(4));
      node.style.setProperty('--across', Math.max(0, current - 1).toFixed(4));
    };
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.001) current = target;
      paint();
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    measure();
    current = target;
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={styles.turn} aria-hidden="true">
      <span className={styles.turnDown} />
      <span className={styles.turnAcross} />
    </div>
  );
}

/** The entry's photo, or an empty slot of the same size until one is supplied. */
function EntryPhoto({ entry, className }: { entry: TimelineEntry; className: string }) {
  if (entry.photo) {
    return (
      <div className={className}>
        <img
          src={entry.photo.src}
          alt={entry.photo.alt}
          width={1400}
          height={933}
          loading="lazy"
          decoding="async"
          style={entry.photo.zoom ? { transform: `scale(${entry.photo.zoom})` } : undefined}
        />
      </div>
    );
  }
  return (
    <div className={`${className} ${styles.photoSlot}`} aria-hidden="true">
      <span>Photo · {entry.place}</span>
      <span>3:2, at least 1500 × 1000</span>
    </div>
  );
}

/**
 * One run of the timeline. The year pins beside it; Experience mirrors
 * Education, so the year swaps sides when you cross from one to the other.
 */
function TimelineGroup({
  id,
  title,
  entries,
  side,
  footer,
}: {
  id: string;
  title: string;
  entries: TimelineEntry[];
  side: 'left' | 'right';
  /** Rendered under the timeline, inside the section. */
  footer?: ReactNode;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // The spine eases toward the middle of the viewport each frame. Stops fill
  // in, and the pinned year changes, when the line itself reaches an entry.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let target = 0;
    let current = 0;
    let frame = 0;
    let lastActive = -1;

    const measure = () => {
      const rect = list.getBoundingClientRect();
      target = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - rect.top) / rect.height));
    };
    const paint = () => {
      list.style.setProperty('--spine', current.toFixed(4));
      const height = list.offsetHeight || 1;
      let index = 0;
      Array.from(list.children).forEach((child, i) => {
        const item = child as HTMLElement;
        const reached = item.offsetTop / height <= current + 0.001;
        item.toggleAttribute('data-reached', reached);
        if (reached) index = i;
      });
      if (index !== lastActive) {
        lastActive = index;
        setActive(index);
      }
    };
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0005) current = target;
      paint();
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (reduceMotion) {
        current = target;
        paint();
      } else if (!frame) {
        frame = requestAnimationFrame(tick);
      }
    };

    measure();
    current = target;
    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const current = entries[active] ?? entries[0];

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={styles.timeline}>
      <h2 id={`${id}-title`} className={styles.heading} data-rise>{title}</h2>

      <div className={styles.group} data-side={side}>
        <div className={styles.aside}>
          <div className={styles.asideInner}>
            {/* Phones only: names the pinned bar once the heading scrolls away. */}
            <p className={styles.groupTitle} aria-hidden="true">{title}</p>
            <div className={styles.asideNow} aria-hidden="true">
              <p key={current.year} className={styles.year}>{current.year}</p>
              <p key={current.id} className={styles.asideOrg}>{current.place}</p>
            </div>
          </div>
        </div>

        <ol ref={listRef} className={styles.entries}>
          {entries.map((entry) => (
            <li key={entry.id} className={styles.entry} data-rise>
              {entry.org ? (
                <>
                  <p className={styles.dates}>{entry.dates}</p>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  <p className={styles.org}>{entry.org}</p>
                </>
              ) : (
                <>
                  <h3 className={styles.entryTitle}>
                    {entry.title}
                    {/* The school is pinned beside the year; keep it for screen readers. */}
                    <span className={styles.srOnly}>, {entry.place}</span>
                  </h3>
                  <p className={`${styles.dates} ${styles.datesUnder}`}>{entry.dates}</p>
                </>
              )}
              {entry.points && (entry.points.length > 1 ? (
                <ul className={styles.points}>
                  {entry.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              ) : (
                <p className={styles.point}>{entry.points[0]}</p>
              ))}
              {entry.details?.map((detail) => (
                <p key={detail.label} className={styles.point}>
                  <span className={styles.detailLabel}>{detail.label}:</span> {detail.text}
                </p>
              ))}
              <EntryPhoto entry={entry} className={styles.entryPhoto} />
            </li>
          ))}
        </ol>
      </div>
      {footer}
    </section>
  );
}

/**
 * Below the hero: the intro's typing caret drops into a spine that is drawn
 * down the timeline as you scroll, then the project index and a contact close.
 */
export default function Chronicle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<PhotoGalleryHandle>(null);
  const openPhotos = () => galleryRef.current?.open();

  // Parts below the fold rise in once as they enter. Content is visible by
  // default: only nodes marked data-pending here are hidden, so anything React
  // re-creates later (or anything if script fails) simply shows.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        delete (entry.target as HTMLElement).dataset.pending;
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    const pending = Array.from(root.querySelectorAll<HTMLElement>('[data-rise]')).filter(
      (node) => node.getBoundingClientRect().top > window.innerHeight,
    );
    pending.forEach((node) => {
      node.dataset.pending = '';
      observer.observe(node);
    });
    return () => {
      observer.disconnect();
      pending.forEach((node) => delete node.dataset.pending);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      {/* Oldest first: the story starts at UW–Madison in 2021. */}
      <TimelineGroup
        id="education"
        title="Education"
        entries={EDUCATION_ENTRIES}
        side="left"
        footer={<SpineTurn />}
      />
      <TimelineGroup id="experience" title="Experience" entries={EXPERIENCE_ENTRIES}
        side="left"
        footer={
          <div className={styles.photosCta}>
            <button type="button" className={styles.morePhotos} onClick={openPhotos}>
              More photos <span className={styles.morePhotosCount}>{GALLERY_COUNT}</span>
            </button>
          </div>
        }
      />
      <PhotoGallery ref={galleryRef} />

      <section id="projects" aria-labelledby="projects-title" className={styles.projects}>
        <div className={styles.projectsHead}>
          <h2 id="projects-title" className={styles.heading} data-rise>Projects</h2>
          <p className={styles.lede} data-rise>
            Things I built to learn something properly. Each one opens its code on GitHub.
          </p>
        </div>
        <ul className={styles.projectList}>
          {HOMEPAGE_PROJECTS.map((project) => (
            <li key={project.id} data-rise>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.project}
              >
                <h3 className={styles.projectName}>
                  {project.name}
                  <span className={styles.projectCaret} aria-hidden="true" />
                </h3>
                <p className={styles.projectText}>
                  {project.description}
                  <span className={styles.projectLabel}>{project.label}</span>
                </p>
                <span className={styles.projectArrow} aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer id="contact" aria-labelledby="contact-title" className={styles.close}>
        <h2 id="contact-title" className={styles.closeHeading} data-rise>Let&apos;s build something.</h2>
        <a className={styles.email} href="mailto:tang.darren@gmail.com" data-rise>
          tang.darren@gmail.com
        </a>
        <ul className={styles.links} data-rise>
          {SOCIAL_LINKS.filter((link) => link.label !== 'Email').map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
            </li>
          ))}
          <li>
            <a href={RESUME_PDF_PATH} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
          </li>
        </ul>
        <p className={styles.signoff}>Darren Tang · San Francisco · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
