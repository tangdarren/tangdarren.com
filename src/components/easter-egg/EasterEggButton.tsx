'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { Egg } from 'lucide-react';

import { useEasterEggOptional } from '@/components/easter-egg/EasterEggContext';

function clearMotionStyles(el: HTMLElement | SVGElement) {
  el.style.opacity = '';
  el.style.transform = '';
}

export default function EasterEggButton({
  className = '',
  visible = true,
}: {
  className?: string;
  /** When false, fade/slide out and disable pointer events. */
  visible?: boolean;
}) {
  const egg = useEasterEggOptional();
  const reduce = useReducedMotion();
  const iconRef = useRef<SVGSVGElement>(null);
  const wasRunningRef = useRef(false);
  const busyRef = useRef(false);

  const isRunning = egg?.isRunning ?? false;
  /** True after hatch until respawn finishes — keeps slot empty & non-interactive. */
  const [hatched, setHatched] = useState(false);

  const canClick = visible && !isRunning && !hatched;

  // Respawn when character animation completes (`isRunning` → false).
  useEffect(() => {
    const wasRunning = wasRunningRef.current;
    wasRunningRef.current = isRunning;

    if (!wasRunning || isRunning) return;

    const icon = iconRef.current;
    if (!icon) {
      setHatched(false);
      return;
    }

    busyRef.current = true;

    if (reduce) {
      const controls = animate(
        icon,
        { opacity: [0, 1], scale: 1, rotate: 0 },
        {
          duration: 0.2,
          onComplete: () => {
            clearMotionStyles(icon);
            busyRef.current = false;
            setHatched(false);
          },
        },
      );
      return () => controls.stop();
    }

    const controls = animate(
      icon,
      {
        scale: [0.7, 1.08, 1],
        opacity: [0, 1],
        rotate: 0,
      },
      {
        duration: 0.22,
        ease: 'easeOut',
        onComplete: () => {
          clearMotionStyles(icon);
          busyRef.current = false;
          setHatched(false);
        },
      },
    );

    return () => controls.stop();
  }, [isRunning, reduce]);

  return (
    <button
      type="button"
      onClick={() => {
        if (!canClick || busyRef.current) return;

        egg?.trigger();

        const icon = iconRef.current;
        if (!icon) {
          setHatched(true);
          return;
        }

        if (reduce) {
          icon.style.opacity = '0';
          icon.style.transform = 'scale(0)';
          setHatched(true);
          return;
        }

        busyRef.current = true;
        animate(
          icon,
          {
            rotate: [0, -10, 10, -7, 7, 0],
            scale: [1, 1.12, 1.12, 1.12, 1.12, 0],
            opacity: [1, 1, 1, 1, 1, 0],
          },
          {
            duration: 0.3,
            ease: 'easeInOut',
            onComplete: () => {
              busyRef.current = false;
              setHatched(true);
            },
          },
        );
      }}
      disabled={!canClick}
      aria-label="Trigger easter egg"
      tabIndex={canClick ? 0 : -1}
      aria-hidden={!visible}
      className={[
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-none border text-mist-400 transition-[opacity,transform,color,border-color,background-color] duration-[220ms] ease-out',
        'focus-visible:outline-none',
        'dark:text-mist-300',
        hatched || isRunning
          ? 'border-transparent'
          : 'border-ink-600/80 dark:border-ink-500',
        canClick
          ? [
              'pointer-events-auto translate-y-0 cursor-pointer opacity-100',
              'hover:border-ink-500 hover:bg-brand-50 hover:text-mist-300',
              'dark:hover:border-ink-500 dark:hover:bg-brand-50 dark:hover:text-mist-200',
              '[&:hover_svg]:opacity-75 dark:[&_svg]:opacity-70 dark:[&:hover_svg]:opacity-90',
            ].join(' ')
          : visible
            ? 'pointer-events-none translate-y-0 cursor-default opacity-100'
            : 'pointer-events-none -translate-y-[5px] cursor-default opacity-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Egg
        ref={iconRef}
        className="h-5 w-5 fill-current opacity-60 dark:fill-none dark:opacity-45"
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}
