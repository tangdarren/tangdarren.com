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

const WALK_MS = 1800;
const PRE_JUMP_PAUSE_MS = 280;
const JUMP_UP_MS = 280;
const JUMP_DOWN_MS = 420;
const JUMP_HEIGHT_DESKTOP = 18;
const JUMP_HEIGHT_MOBILE = 14;
const SPAWN_MS = 450;
const POST_SPAWN_PAUSE_MS = 250;
const SHAKE_MS = 550;
const LANDING_SQUASH_MS = 150;
const STAND_MS = 1800;
const CHAR_FADE_MS = 200;
const BRIDGE_EXIT_MS = 300;

function jumpHeightPx() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 639px)').matches
    ? JUMP_HEIGHT_MOBILE
    : JUMP_HEIGHT_DESKTOP;
}

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
 * Pixel character that walks H → final n, then jumps straight up in place.
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
    let bridgeLeadTimer: number | undefined;

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
      if (cancelled) return;
      setBridgeActive(false);
      setActive(false);
      setPose(null);
      notifyComplete();
    };

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
      const peakY = dy - jumpHeightPx();

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
        finish();
        return;
      }

      // PHASE 1 — Spawn
      await runAnim(
        {
          opacity: [0, 1],
          scale: [0.85, 1.05, 1],
          y: [4, -2, 0],
        },
        { duration: SPAWN_MS / 1000, ease: 'easeOut' },
      );
      if (cancelled) return;

      await wait(POST_SPAWN_PAUSE_MS);
      if (cancelled) return;

      // PHASE 2 — Shake; bridge starts rising at mid-shake
      bridgeLeadTimer = window.setTimeout(() => {
        if (!cancelled) setBridgeActive(true);
      }, SHAKE_MS / 2);

      await runAnim(
        { rotate: [0, -4, 4, -3, 3, 0] },
        { duration: SHAKE_MS / 1000, ease: 'easeInOut' },
      );
      if (cancelled) return;

      // PHASE 3 — Brief pause before the walk
      await wait(150);
      if (cancelled) return;

      // PHASE 4 — Waddle H → n
      await runAnim(
        {
          x: [0, dx],
          y: [0, -2, 0, -2, 0, -2, 0, -2, 0, dy],
          rotate: [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 0],
        },
        { duration: WALK_MS / 1000, ease: 'linear' },
      );
      if (cancelled) return;

      await wait(PRE_JUMP_PAUSE_MS);
      if (cancelled) return;

      // PHASE 5 — Jump straight up and land on the same spot (slow descent)
      const jumpMs = JUMP_UP_MS + JUMP_DOWN_MS;
      await runAnim(
        {
          x: [dx, dx, dx],
          y: [dy, peakY, dy],
          rotate: 0,
        },
        {
          duration: jumpMs / 1000,
          ease: 'linear',
          times: [0, JUMP_UP_MS / jumpMs, 1],
        },
      );
      if (cancelled) return;

      // PHASE 6 — Tiny landing squash
      await runAnim(
        {
          scaleX: [1, 1.05, 1],
          scaleY: [1, 0.92, 1],
        },
        { duration: LANDING_SQUASH_MS / 1000, ease: 'easeOut' },
      );
      if (cancelled) return;

      // PHASE 7 — Brief hold
      await wait(STAND_MS);
      if (cancelled) return;

      // PHASE 8 — Character fades, then bridge sinks
      await runAnim({ opacity: 0 }, { duration: CHAR_FADE_MS / 1000 });
      if (cancelled) return;

      setBridgeActive(false);
      await wait(BRIDGE_EXIT_MS);
      finish();
    };

    void run();

    return () => {
      cancelled = true;
      if (bridgeLeadTimer !== undefined) {
        window.clearTimeout(bridgeLeadTimer);
      }
      stoppers.forEach((c) => c.stop());
      setBridgeActive(false);
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
        opacity: 0,
        transformOrigin: '50% 85%',
      }}
    />
  );
}
