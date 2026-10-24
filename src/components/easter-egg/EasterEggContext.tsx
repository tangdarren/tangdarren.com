'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

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

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

const EMPTY_ANCHORS: EasterEggAnchors = {
  hi: null,
  am: null,
  darren: null,
};

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [bridgeActive, setBridgeActiveState] = useState(false);
  const [runId, setRunId] = useState(0);
  const anchorsRef = useRef<EasterEggAnchors>(EMPTY_ANCHORS);

  const registerAnchors = useCallback((anchors: EasterEggAnchors) => {
    anchorsRef.current = anchors;
  }, []);

  const getAnchors = useCallback(() => anchorsRef.current, []);

  const setBridgeActive = useCallback((active: boolean) => {
    setBridgeActiveState(active);
  }, []);

  const notifyComplete = useCallback(() => {
    setBridgeActiveState(false);
    setIsRunning(false);
  }, []);

  const trigger = useCallback(() => {
    if (isRunning) return;
    const { hi, am, darren } = anchorsRef.current;
    if (!hi || !am || !darren) return;
    setBridgeActiveState(false);
    setIsRunning(true);
    setRunId((id) => id + 1);
  }, [isRunning]);

  const value = useMemo(
    () => ({
      trigger,
      isRunning,
      bridgeActive,
      setBridgeActive,
      runId,
      registerAnchors,
      getAnchors,
      notifyComplete,
    }),
    [
      trigger,
      isRunning,
      bridgeActive,
      setBridgeActive,
      runId,
      registerAnchors,
      getAnchors,
      notifyComplete,
    ],
  );

  return (
    <EasterEggContext.Provider value={value}>
      {children}
    </EasterEggContext.Provider>
  );
}

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
