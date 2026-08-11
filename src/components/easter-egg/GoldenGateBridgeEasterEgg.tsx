'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useEasterEgg } from '@/components/easter-egg/EasterEggContext';

/**
 * Subtle Golden Gate Bridge that rises from behind "San Francisco"
 * while the walker is mid-fall (`bridgeActive`).
 *
 * Sized to 100% of the text span; tucked slightly behind the letter tops.
 */
export default function GoldenGateBridgeEasterEgg() {
  const { bridgeActive } = useEasterEgg();
  const reduce = useReducedMotion();

  return (
    <span
      aria-hidden
      data-easter-egg-bridge
      className="pointer-events-none absolute bottom-[calc(100%-6px)] left-0 z-0 w-full select-none overflow-hidden bg-transparent"
    >
      <motion.img
        src="/easter-egg/sfbridge.png"
        alt=""
        draggable={false}
        className="block h-auto w-full max-w-none bg-transparent"
        style={{
          imageRendering: 'pixelated',
          background: 'transparent',
        }}
        initial={false}
        animate={
          reduce
            ? { opacity: bridgeActive ? 1 : 0, y: '0%' }
            : bridgeActive
              ? { y: '0%', opacity: 1 }
              : { y: '100%', opacity: 0 }
        }
        transition={
          reduce
            ? { duration: 0.2, ease: 'easeOut' }
            : bridgeActive
              ? {
                  y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.22, ease: 'easeOut' },
                }
              : { duration: 0.3, ease: 'easeIn' }
        }
      />
    </span>
  );
}
