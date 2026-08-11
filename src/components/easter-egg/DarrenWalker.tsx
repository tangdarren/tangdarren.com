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
const FEET_X = (71 + 300) / 2; // horizontal center of opaque body
const FEET_Y = 354; // bottom of opaque feet

const VISIBLE_H_DESKTOP = 36;
const VISIBLE_H_MOBILE = 28;

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

function poseAboveLetter(
  letter: DOMRect,
  container: DOMRect,
  size: ReturnType<typeof displaySize>,
): Pose {
  const feetX = letter.left + letter.width / 2 - container.left;
  const feetY = letter.top - container.top;
  return {
    left: feetX - size.feetOffsetX,
    top: feetY - size.feetOffsetY,
  };
}

/**
 * Pixel character that walks H → final n on the intro heading.
 * Absolutely positioned inside a relative heading wrapper — scrolls with the page.
 */
export default function DarrenWalker({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { runId, getAnchors, notifyComplete } = useEasterEgg();
  const reduce = useReducedMotion();
  const imgRef = useRef<HTMLImageElement>(null);
  const [pose, setPose] = useState<Pose | null>(null);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    if (runId === 0) return;

    const container = containerRef.current;
    const { start, end } = getAnchors();
    if (!container || !start || !end) {
      notifyComplete();
      return;
    }

    const size = displaySize();
    const cRect = container.getBoundingClientRect();
    const startPose = poseAboveLetter(
      start.getBoundingClientRect(),
      cRect,
      size,
    );

    setPose(startPose);
    setActive(true);
  }, [runId, containerRef, getAnchors, notifyComplete]);

  useEffect(() => {
    if (!active || runId === 0) return;

    const el = imgRef.current;
    const container = containerRef.current;
    const { start, end } = getAnchors();
    if (!el || !container || !start || !end || !pose) return;

    let cancelled = false;
    const stoppers: Array<{ stop: () => void }> = [];

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

    const run = async () => {
      const size = displaySize();
      const cRect = container.getBoundingClientRect();
      const startPose = poseAboveLetter(
        start.getBoundingClientRect(),
        cRect,
        size,
      );
      const endPose = poseAboveLetter(end.getBoundingClientRect(), cRect, size);
      const dx = endPose.left - startPose.left;
      const dy = endPose.top - startPose.top;

      el.style.left = `${startPose.left}px`;
      el.style.top = `${startPose.top}px`;
      el.style.width = `${size.width}px`;
      el.style.height = `${size.height}px`;

      if (reduce) {
        await runAnim(
          { opacity: [0, 1], scale: [0.9, 1] },
          { duration: 0.2 },
        );
        if (cancelled) return;
        await wait(500);
        if (cancelled) return;
        await runAnim({ opacity: 0 }, { duration: 0.25 });
        if (!cancelled) {
          setActive(false);
          setPose(null);
          notifyComplete();
        }
        return;
      }

      // PHASE 1 — Spawn
      await runAnim(
        {
          opacity: [0, 1],
          scale: [0.85, 1.05, 1],
          y: [4, -2, 0],
        },
        { duration: 0.28, ease: 'easeOut' },
      );
      if (cancelled) return;

      // PHASE 2 — Shake
      await runAnim(
        { rotate: [0, -4, 4, -3, 3, 0] },
        { duration: 0.4, ease: 'easeInOut' },
      );
      if (cancelled) return;

      // PHASE 3 — Brief pause
      await wait(150);
      if (cancelled) return;

      // PHASE 4 — Waddle H → n (~2.1s)
      await runAnim(
        {
          x: [0, dx],
          y: [0, -2, 0, -2, 0, -2, 0, -2, 0, dy],
          rotate: [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 0],
        },
        { duration: 2.1, ease: 'linear' },
      );
      if (cancelled) return;

      // Brief pause on the n
      await wait(100);
      if (cancelled) return;

      // PHASE 5 — Fall off
      await runAnim(
        {
          x: dx + 14,
          y: dy + 75,
          rotate: 26,
          opacity: [1, 1, 0],
        },
        { duration: 0.48, ease: [0.4, 0, 0.8, 0.4] },
      );

      if (!cancelled) {
        setActive(false);
        setPose(null);
        notifyComplete();
      }
    };

    void run();

    return () => {
      cancelled = true;
      stoppers.forEach((c) => c.stop());
    };
  }, [active, runId, pose, reduce, containerRef, getAnchors, notifyComplete]);

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
      className="pointer-events-none absolute z-20 select-none"
      style={{
        left: pose.left,
        top: pose.top,
        width: size.width,
        height: size.height,
        imageRendering: 'pixelated',
        opacity: 0,
        transformOrigin: '50% 85%',
      }}
    />
  );
}
