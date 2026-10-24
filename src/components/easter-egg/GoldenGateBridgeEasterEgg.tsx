'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useEasterEgg } from '@/components/easter-egg/EasterEggContext';

/**
 * Golden Gate Bridge that rises directly beside "San Francisco"
 * while the walker sequence is active (`bridgeActive`).
 */
export default function GoldenGateBridgeEasterEgg() {
  const { bridgeActive } = useEasterEgg();
  const reduce = useReducedMotion();

  return (
    <span
      aria-hidden
      data-easter-egg-bridge
      className="pointer-events-none absolute bottom-[0.12em] left-full z-0 ml-2.5 h-[1.85em] w-[4.25em] select-none overflow-hidden bg-transparent"
    >
      <motion.img
        src="/easter-egg/sfbridge.png"
        alt=""
        draggable={false}
        className="block h-full w-full max-w-none bg-transparent object-contain object-left-bottom"
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
              : { y: '110%', opacity: 0 }
        }
        transition={
          reduce
            ? { duration: 0.12, ease: 'easeOut' }
            : bridgeActive
              ? {
                  y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.12, ease: 'easeOut' },
                }
              : { duration: 0.18, ease: 'easeIn' }
        }
      />
    </span>
  );
}
