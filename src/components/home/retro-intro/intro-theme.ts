/** Shared palette for the 2D CRT assembly intro. */

export const INTRO_BACKDROP = '#1a1c1e';
export const CRT_BODY = '#6e737c';
export const CRT_BODY_LIGHT = '#8a909a';
export const CRT_BODY_DARK = '#4a4f57';
export const CRT_OUTLINE = '#1a1b1e';
export const CRT_SCREEN = '#2a2d33';
export const CRT_BOARD = '#2f5a45';
export const CRT_LED_OFF = '#3a4038';
export const CRT_LED_ON = '#7CFF4A';

export const SESSION_KEY = 'tangdarren-retro-intro-seen';

/** Assembly timeline (ms). */
export const ASSEMBLY_TIMING = {
  /** Stagger between each part snapping in. */
  staggerMs: 140,
  /** Duration of each part’s travel. */
  moveMs: 580,
  /** Pause after the last part lands before LED on. */
  ledDelayMs: 220,
  /** Hold on the finished machine before marking complete. */
  holdMs: 900,
} as const;

/** Part travel order (and stagger index). */
export const PART_ORDER = [
  'stand',
  'rear',
  'board',
  'glass',
  'bezel',
  'controls',
] as const;

export type PartId = (typeof PART_ORDER)[number];
