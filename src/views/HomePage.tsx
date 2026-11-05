'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Chronicle from '@/components/home/Chronicle';
import Grainient from '@/components/home/Grainient';

import styles from './HomePage.module.css';

type IntroPhase = 'loading' | 'revealing' | 'complete';

const DESCRIPTION = 'I build software and AI tools for real workflows.';
/** When the cursor starts typing the description, after the name lands. */
const TYPE_START_MS = 1150;
const TYPE_CHAR_MS = 24;

/** Reads a CSS time variable in ms (production CSS may normalize 900ms to .9s). */
function cssDurationMs(element: Element, name: string, fallback: number) {
  const value = getComputedStyle(element).getPropertyValue(name).trim();
  return parseFloat(value) * (value.endsWith('ms') ? 1 : 1000) || fallback;
}

/** Name-first intro. The existing portfolio lives in PortfolioContent. */
export default function HomePage() {
  const [phase, setPhase] = useState<IntroPhase>('loading');
  const [typed, setTyped] = useState(0);
  const words = useRef<(HTMLSpanElement | null)[]>([null, null]);
  const startingRects = useRef<DOMRect[]>([]);

  // Move the actual heading words from their loading positions into the hero.
  // Per-word transforms let the phone layout wrap without a text swap.
  useLayoutEffect(() => {
    if (phase !== 'revealing') return;

    const animations: Animation[] = [];
    words.current.forEach((word, index) => {
      const start = startingRects.current[index];
      if (!word || !start || typeof word.animate !== 'function') return;
      const end = word.getBoundingClientRect();
      if (!end.width || !end.height) return;
      const duration = cssDurationMs(word, '--hero-move-duration', 900);
      animations.push(word.animate([
        {
          transform: `translate(${start.left - end.left}px, ${start.top - end.top}px) scale(${start.width / end.width}, ${start.height / end.height})`,
        },
        { transform: 'none' },
      ], {
        duration,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        fill: 'both',
      }));
    });

    const onResize = () => setPhase('complete');
    window.addEventListener('resize', onResize);
    return () => {
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener('resize', onResize);
    };
  }, [phase]);

  // The intro cursor carries on: it types the description, then stays as a caret.
  useEffect(() => {
    if (phase !== 'revealing') return;
    let count = 0;
    let timer = setTimeout(function step() {
      count += 1;
      setTyped(count);
      if (count >= DESCRIPTION.length) setPhase('complete');
      else timer = setTimeout(step, TYPE_CHAR_MS);
    }, TYPE_START_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    let finished = false;
    let onLoad: (() => void) | undefined;

    const finish = () => {
      if (cancelled) return;
      finished = true;
      setPhase('complete');
    };
    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    motion.addEventListener('change', onMotionChange);

    // CSS already shows the finished heading on the first reduced-motion frame.
    if (motion.matches) {
      queueMicrotask(finish);
    } else {
      const delay = (ms: number) => new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });
      const pageReady = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else {
          onLoad = resolve;
          window.addEventListener('load', onLoad, { once: true });
        }
      });
      const fontsReady = document.fonts?.ready.catch(() => undefined);
      // Keep the opening legible, wait for real readiness, and bound failures.
      const assetsReady = Promise.race([
        Promise.all([pageReady, fontsReady]),
        delay(6000),
      ]);
      // The name moves the moment it finishes typing. The CSS typing starts at
      // first paint, before this runs, so wait only for what's left.
      const word = words.current[0];
      const revealMs = word ? cssDurationMs(word, '--hero-reveal-duration', 600) : 600;
      const typedMs = Number(word?.parentElement?.getAnimations?.()[0]?.currentTime ?? 0);
      Promise.all([assetsReady, delay(Math.max(0, revealMs - typedMs))]).then(() => {
        if (cancelled || finished) return;
        if (motion.matches) {
          finish();
          return;
        }
        startingRects.current = words.current.map((word) =>
          word?.getBoundingClientRect() ?? new DOMRect(),
        );
        setPhase('revealing');
        // Also complete if animation events are disabled or interrupted, leaving
        // the typing plenty of room so this never cuts it off.
        timers.push(setTimeout(finish, TYPE_START_MS + DESCRIPTION.length * TYPE_CHAR_MS * 2));
      });
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (onLoad) window.removeEventListener('load', onLoad);
      motion.removeEventListener('change', onMotionChange);
    };
  }, []);

  const shown = phase === 'complete' ? DESCRIPTION.length : typed;

  return (
    <>
    <section
      id="home"
      aria-labelledby="hero-name"
      data-phase={phase}
      className={styles.hero}
    >
      {phase !== 'complete' && (
        <span className={styles.loadingStatus} role="status" aria-label="Loading portfolio">Loading portfolio</span>
      )}
      {/* bleedTop must match .backdrop's negative top. */}
      <Grainient className={styles.backdrop} bleedTop={0.5} />
      <span className={styles.overscrollFix} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="hero-name" className={styles.name}>
          <span className={styles.nameText}>
            <span className={styles.word} ref={(node) => { words.current[0] = node; }}>Darren</span>{' '}
            <span className={styles.word} ref={(node) => { words.current[1] = node; }}>Tang</span>
          </span>
        </h1>
        <div className={styles.details}>
          <p className={styles.role}>Software Engineer · Fremont</p>
          <p className={styles.description}>
            <span className={styles.srOnly}>{DESCRIPTION}</span>
            <span aria-hidden="true">
              {DESCRIPTION.slice(0, shown)}
              <span className={styles.caret} />
              <span className={styles.untyped}>{DESCRIPTION.slice(shown)}</span>
            </span>
          </p>
        </div>
      </div>
      <a href="#education" className={styles.scrollHint} aria-label="Scroll to education and experience">
        <span>Scroll</span>
        <svg viewBox="0 0 16 24" width="16" height="24" aria-hidden="true">
          <path d="M8 2v19M2 15l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
    <Chronicle />
    </>
  );
}
