'use client';

import { createContext, useContext } from 'react';

export type EasterEggAnchors = {
  /** "Hi" — spawn + tiny hop */
  hi: HTMLElement | null;
  /** "am" — approach above (never touch), then jump off */
  am: HTMLElement | null;
  /** "Darren" — landing spot */
  darren: HTMLElement | null;
};

type EasterEggContextValue = {
  trigger: () => void;
  isRunning: boolean;
  /** Bridge shows beside San Francisco while true — set by the walker during the sequence. */
  bridgeActive: boolean;
  setBridgeActive: (active: boolean) => void;
  runId: number;
  registerAnchors: (anchors: EasterEggAnchors) => void;
  getAnchors: () => EasterEggAnchors;
  notifyComplete: () => void;
};

export const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function useEasterEgg() {
  const ctx = useContext(EasterEggContext);
  if (!ctx) {
    throw new Error('useEasterEgg must be used within EasterEggProvider');
  }
  return ctx;
}

/** Safe hook when provider may be absent (non-home pages still render controls). */
export function useEasterEggOptional() {
  return useContext(EasterEggContext);
}
