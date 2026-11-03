'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './HomePage.module.css';

type IntroPhase = 'loading' | 'revealing' | 'complete';

/** Name-first intro. The existing portfolio lives in PortfolioContent. */
export default function HomePage() {
  const [phase, setPhase] = useState<IntroPhase>('loading');
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
      // Production CSS may normalize 900ms to .9s.
      const cssDuration = getComputedStyle(word)
        .getPropertyValue('--hero-move-duration').trim();
      const duration = parseFloat(cssDuration)
        * (cssDuration.endsWith('ms') ? 1 : 1000) || 900;
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
      Promise.all([assetsReady, delay(900)]).then(() => {
        if (cancelled || finished) return;
        if (motion.matches) {
          finish();
          return;
        }
        startingRects.current = words.current.map((word) =>
          word?.getBoundingClientRect() ?? new DOMRect(),
        );
        setPhase('revealing');
        // Also complete if animation events are disabled or interrupted.
        timers.push(setTimeout(finish, 1800));
      });
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (onLoad) window.removeEventListener('load', onLoad);
      motion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <section
      id="home"
      aria-labelledby="hero-name"
      data-phase={phase}
      className={styles.hero}
    >
      {phase !== 'complete' && (
        <span className={styles.loadingStatus} role="status" aria-label="Loading portfolio">Loading portfolio</span>
      )}
      <div className={styles.content}>
        <h1 id="hero-name" className={styles.name}>
          <span className={styles.nameText}>
            <span className={styles.word} ref={(node) => { words.current[0] = node; }}>Darren</span>{' '}
            <span className={styles.word} ref={(node) => { words.current[1] = node; }}>Tang</span>
          </span>
        </h1>
        <div className={styles.details}>
          <p className={styles.role}>Software Engineer · San Francisco</p>
          <p
            className={styles.description}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setPhase('complete');
            }}
          >
            I build software and AI tools for real workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
