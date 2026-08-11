'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Align the character under the centered “0” in 404. */
const REST_OFFSET_X = 0;

/**
 * Mostly-static 404 character using the existing Easter egg asset.
 * Optionally slides once into its resting offset; reduced-motion users
 * see it already in place. Does not touch the homepage Easter egg.
 */
export default function NotFoundCharacter() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative inline-block"
      initial={
        reduce
          ? { x: REST_OFFSET_X, opacity: 1 }
          : { x: REST_OFFSET_X - 40, opacity: 0 }
      }
      animate={{ x: REST_OFFSET_X, opacity: 1 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <img
        src="/easter-egg/darren-character.png"
        alt=""
        aria-hidden
        draggable={false}
        width={106}
        height={120}
        className="pointer-events-none h-24 w-auto select-none sm:h-[120px]"
        style={{ imageRendering: 'pixelated' }}
      />
      <motion.img
        src="/easter-egg/confusedmark.png"
        alt=""
        aria-hidden
        draggable={false}
        width={34}
        height={34}
        className="pointer-events-none absolute -right-3.5 -top-3.5 h-8 w-8 select-none sm:-right-3 sm:-top-4 sm:h-9 sm:w-9"
        style={{ imageRendering: 'pixelated' }}
        animate={reduce ? { y: 0 } : { y: [0, -6, 0] }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 2.4, ease: 'easeInOut', repeat: Infinity }
        }
      />

    </motion.div>
  );
}
