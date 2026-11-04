'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import RetroComputerAssembly from './RetroComputerAssembly';
import {
  clearIntroSeen,
  hasSeenIntro,
  markIntroSeen,
  prefersReducedMotion,
} from './intro-session';
import { ASSEMBLY_TIMING, INTRO_BACKDROP, PART_ORDER } from './intro-theme';

type Phase = 'init' | 'exploded' | 'assembling' | 'done';

const ASSEMBLY_END_MS =
  (PART_ORDER.length - 1) * ASSEMBLY_TIMING.staggerMs +
  ASSEMBLY_TIMING.moveMs +
  ASSEMBLY_TIMING.ledDelayMs;

/**
 * Homepage hero: 2D retro CRT parts scatter, then snap together.
 * Plays once per session; skip / reduced-motion → assembled frame.
 */
export default function RetroIntroExperience() {
  const [phase, setPhase] = useState<Phase>('init');
  const [assembled, setAssembled] = useState(false);
  const [powerOn, setPowerOn] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const finishAssembled = useCallback(
    (opts: { animate: boolean; markSeen?: boolean }) => {
      clearTimers();
      if (opts.markSeen !== false) markIntroSeen();
      if (opts.animate) {
        setPhase('assembling');
        setAssembled(true);
        const led = window.setTimeout(() => {
          setPowerOn(true);
          setPhase('done');
        }, ASSEMBLY_END_MS);
        timersRef.current.push(led);
      } else {
        setAssembled(true);
        setPowerOn(true);
        setPhase('done');
      }
    },
    [clearTimers],
  );

  const beginAssembly = useCallback(() => {
    clearTimers();
    setPowerOn(false);
    setAssembled(false);
    setPhase('exploded');

    // One frame at exploded positions, then snap inward.
    const start = window.setTimeout(() => {
      setPhase('assembling');
      setAssembled(true);

      const led = window.setTimeout(() => {
        setPowerOn(true);
      }, ASSEMBLY_END_MS);

      const hold = window.setTimeout(() => {
        markIntroSeen();
        setPhase('done');
      }, ASSEMBLY_END_MS + ASSEMBLY_TIMING.holdMs);

      timersRef.current.push(led, hold);
    }, 420);

    timersRef.current.push(start);
  }, [clearTimers]);

  useEffect(() => {
    // Initialize from browser preferences after hydration; cancel on unmount.
    const start = window.setTimeout(() => {
      if (prefersReducedMotion() || hasSeenIntro()) {
        finishAssembled({ animate: false });
      } else {
        beginAssembly();
      }
    }, 0);

    return () => {
      window.clearTimeout(start);
      clearTimers();
    };
  }, [beginAssembly, clearTimers, finishAssembled, replayToken]);

  const skipIntro = () => {
    finishAssembled({ animate: false });
    const target = document.getElementById('introduction') ?? document.getElementById('tech');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const replayIntro = () => {
    clearTimers();
    clearIntroSeen();
    setPhase('init');
    setAssembled(false);
    setPowerOn(false);
    setReplayToken((n) => n + 1);
  };

  if (phase === 'init') {
    return (
      <section
        aria-label="Portfolio intro"
        className="relative flex h-[min(100dvh,920px)] w-full items-center justify-center lg:h-[calc(100dvh-3.5rem)]"
        style={{ background: INTRO_BACKDROP }}
      />
    );
  }

  return (
    <section
      aria-label="Portfolio intro"
      className="relative flex h-[min(100dvh,920px)] w-full items-center justify-center overflow-hidden lg:h-[calc(100dvh-3.5rem)]"
      style={{ background: INTRO_BACKDROP }}
    >
      <div className="flex h-[min(92%,880px)] w-full max-w-[min(96vw,820px)] items-center justify-center px-3 py-4 sm:px-6">
        <RetroComputerAssembly
          assembled={assembled}
          powerOn={powerOn}
          className="h-full max-h-full w-full"
        />
      </div>

      {phase !== 'done' && (
        <button
          type="button"
          onClick={skipIntro}
          className="absolute right-3 top-3 z-40 rounded-md border border-white/15 bg-black/35 px-3 py-1.5 text-xs text-[#c5cad3] backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white sm:right-4 sm:top-4"
        >
          Skip intro
        </button>
      )}

      {process.env.NODE_ENV === 'development' && (
        <button
          type="button"
          onClick={replayIntro}
          className="absolute bottom-3 left-3 z-40 rounded-md border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-100/90 backdrop-blur-sm"
        >
          Replay intro
        </button>
      )}
    </section>
  );
}
