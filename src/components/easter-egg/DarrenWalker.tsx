'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { animate, useReducedMotion } from 'framer-motion';

import { useEasterEgg } from '@/components/easter-egg/EasterEggContext';

/** Source PNG metrics (opaque content bbox from the asset). */
const IMG_W = 334;
const IMG_H = 378;
const CONTENT_H = 317;
const FEET_X = (71 + 300) / 2;
const FEET_Y = 354;

const VISIBLE_H_DESKTOP = 36;
const VISIBLE_H_MOBILE = 28;

/** Keep clear of letter tops so feet never "touch" the text. */
const CLEARANCE_PX = 10;

const SPAWN_MS = 260;
const TINY_HOP_MS = 240;
const TINY_HOP_PX = 3;
const WALK_TO_AM_MS = 780;
const JUMP_OFF_MS = 780;
const LAND_PAUSE_MS = 700;
const CHAR_FADE_MS = 150;
const BRIDGE_EXIT_MS = 180;
/** Small forward nudge so the hop never goes backward. */
const LAND_FORWARD_MIN_PX = 14;
/** Peak height of the semicircle above the straight line between am → land. */
const JUMP_ARC_PX = 18;
/** Samples along the arc (more = smoother). */
const JUMP_ARC_STEPS = 20;

function displaySize() {
  const visibleH =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 639px)').matches
      ? VISIBLE_H_MOBILE
      : VISIBLE_H_DESKTOP;
  const scale = visibleH / CONTENT_H;
  return {
    width: IMG_W * scale,
    height: IMG_H * scale,
    feetOffsetX: FEET_X * scale,
    feetOffsetY: FEET_Y * scale,
  };
}

type Pose = { left: number; top: number };
type Size = ReturnType<typeof displaySize>;

/** Feet on a letter's top edge (+ optional clearance). `xRatio` 0=left, 1=right. */
function poseAboveLetter(
  letter: DOMRect,
  container: DOMRect,
  size: Size,
  clearance = 0,
  xRatio = 0.5,
): Pose {
  const feetX = letter.left + letter.width * xRatio - container.left;
  const feetY = letter.top - container.top - clearance;
  return {
    left: feetX - size.feetOffsetX,
    top: feetY - size.feetOffsetY,
  };
}

/** Semicircle path from start → end (bulges upward on screen). */
function semicircleArc(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  height: number,
  steps: number,
): { x: number[]; y: number[]; rotate: number[] } {
  const x: number[] = [];
  const y: number[] = [];
  const rotate: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const chordX = x0 + (x1 - x0) * t;
    const chordY = y0 + (y1 - y0) * t;
    // sin(πt) peaks at mid — classic semicircle offset from the chord
    const lift = Math.sin(Math.PI * t) * height;
    x.push(chordX);
    y.push(chordY - lift);

    // Slight lean following the arc tangent
    const nextT = Math.min(1, t + 1 / steps);
    const nextLift = Math.sin(Math.PI * nextT) * height;
    const nextX = x0 + (x1 - x0) * nextT;
    const nextY = y0 + (y1 - y0) * nextT - nextLift;
    const angle = (Math.atan2(nextY - (chordY - lift), nextX - chordX) * 180) / Math.PI;
    rotate.push(Math.max(-12, Math.min(12, angle * 0.35)));
  }

  rotate[rotate.length - 1] = 0;
  return { x, y, rotate };
}

/**
 * Spawns above Hi → tiny hop → walks above am (never touches) →
 * jumps off onto Darren → fades out.
 */
export default function DarrenWalker({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { runId, getAnchors, notifyComplete, setBridgeActive } = useEasterEgg();
  const reduce = useReducedMotion();
  const imgRef = useRef<HTMLImageElement>(null);
  const [pose, setPose] = useState<Pose | null>(null);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    if (runId === 0) return;

    const container = containerRef.current;
    const { hi, am, darren } = getAnchors();
    if (!container || !hi || !am || !darren) {
      notifyComplete();
      return;
    }

    const size = displaySize();
    const cRect = container.getBoundingClientRect();
    setPose(poseAboveLetter(hi.getBoundingClientRect(), cRect, size));
    setActive(true);
  }, [runId, containerRef, getAnchors, notifyComplete]);

  useEffect(() => {
    if (!active || runId === 0) return;

    const el = imgRef.current;
    const container = containerRef.current;
    const { hi, am, darren } = getAnchors();
    if (!el || !container || !hi || !am || !darren || !pose) return;

    let cancelled = false;
    let settled = false;
    const stoppers: Array<{ stop: () => void }> = [];

    /** Keep opacity under imperative control so React re-renders can't flash him back. */
    const lockHidden = () => {
      el.style.opacity = '0';
    };

    const runAnim = (
      keyframes: Parameters<typeof animate>[1],
      options: Parameters<typeof animate>[2] = {},
    ) =>
      new Promise<void>((resolve) => {
        const controls = animate(el, keyframes, {
          ...options,
          onComplete: () => resolve(),
        });
        stoppers.push(controls);
      });

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
      });

    const finish = () => {
      if (cancelled || settled) return;
      settled = true;
      lockHidden();
      setBridgeActive(false);
      setActive(false);
      setPose(null);
      notifyComplete();
    };

    const run = async () => {
      const size = displaySize();
      const cRect = container.getBoundingClientRect();

      const hiPose = poseAboveLetter(hi.getBoundingClientRect(), cRect, size);
      // Hover above am — clearance so feet never touch the letters.
      const amPose = poseAboveLetter(
        am.getBoundingClientRect(),
        cRect,
        size,
        CLEARANCE_PX,
      );
      // Prefer the right half of "Darren"; clamp so we never jump backward past am.
      const landPose = poseAboveLetter(
        darren.getBoundingClientRect(),
        cRect,
        size,
        0,
        0.7,
      );

      const amDx = amPose.left - hiPose.left;
      const amDy = amPose.top - hiPose.top;
      const landDx = Math.max(
        landPose.left - hiPose.left,
        amDx + LAND_FORWARD_MIN_PX,
      );
      const landDy = landPose.top - hiPose.top;

      el.style.left = `${hiPose.left}px`;
      el.style.top = `${hiPose.top}px`;
      el.style.width = `${size.width}px`;
      el.style.height = `${size.height}px`;
      lockHidden();

      if (reduce) {
        setBridgeActive(true);
        await runAnim(
          { opacity: [0, 1], scale: [0.9, 1] },
          { duration: 0.2 },
        );
        if (cancelled) return;
        await wait(400);
        if (cancelled) return;
        await runAnim({ opacity: 0 }, { duration: 0.2 });
        lockHidden();
        finish();
        return;
      }

      setBridgeActive(true);

      // PHASE 1 — Spawn above Hi
      await runAnim(
        {
          opacity: [0, 1],
          scale: [0.9, 1.04, 1],
          y: [3, 0],
        },
        { duration: SPAWN_MS / 1000, ease: 'easeOut' },
      );
      if (cancelled) return;

      // PHASE 2 — Very tiny hop on Hi
      await runAnim(
        { y: [0, -TINY_HOP_PX, 0] },
        { duration: TINY_HOP_MS / 1000, ease: 'easeInOut' },
      );
      if (cancelled) return;

      // PHASE 3 — Walk to hover above am (clearance kept)
      await runAnim(
        {
          x: [0, amDx],
          y: [0, -1.2, 0, -1.2, 0, amDy],
          rotate: [-1, 1, -1, 1, -1, 0],
        },
        { duration: WALK_TO_AM_MS / 1000, ease: 'linear' },
      );
      if (cancelled) return;

      // PHASE 4 — Smooth semicircle arc onto Darren
      const arc = semicircleArc(
        amDx,
        amDy,
        landDx,
        landDy,
        JUMP_ARC_PX,
        JUMP_ARC_STEPS,
      );
      await runAnim(
        { x: arc.x, y: arc.y, rotate: arc.rotate },
        { duration: JUMP_OFF_MS / 1000, ease: 'linear' },
      );
      if (cancelled) return;

      await wait(LAND_PAUSE_MS);
      if (cancelled) return;

      // PHASE 5 — Fade out; bridge exits
      await runAnim({ opacity: [1, 0] }, { duration: CHAR_FADE_MS / 1000 });
      if (cancelled) return;
      // Lock hidden BEFORE stopping animations / unmount — stop() can snap opacity back to 1.
      lockHidden();

      setBridgeActive(false);
      await wait(BRIDGE_EXIT_MS);
      finish();
    };

    void run();

    return () => {
      cancelled = true;
      lockHidden();
      stoppers.forEach((c) => c.stop());
      // Re-assert after stop() — framer-motion may restore pre-animation opacity.
      lockHidden();
      if (!settled) setBridgeActive(false);
    };
  }, [
    active,
    runId,
    pose,
    reduce,
    containerRef,
    getAnchors,
    notifyComplete,
    setBridgeActive,
  ]);

  if (!active || !pose) return null;

  const size = displaySize();

  return (
    <img
      ref={imgRef}
      src="/easter-egg/darren-character.png"
      alt=""
      aria-hidden
      draggable={false}
      width={size.width}
      height={size.height}
      className="pointer-events-none absolute z-30 select-none"
      style={{
        left: pose.left,
        top: pose.top,
        width: size.width,
        height: size.height,
        imageRendering: 'pixelated',
        // Opacity is owned by the animation effect — putting it here made React
        // re-apply `0`/`1` fights with framer-motion and caused an end flicker.
        transformOrigin: '50% 85%',
      }}
    />
  );
}
