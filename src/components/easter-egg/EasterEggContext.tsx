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

type EasterEggContextValue = {
  trigger: () => void;
  isRunning: boolean;
  /** Bridge rises only while true — set by the walker while the sequence is active. */
  bridgeActive: boolean;
  setBridgeActive: (active: boolean) => void;
  runId: number;
  registerAnchors: (
    start: HTMLElement | null,
    end: HTMLElement | null,
  ) => void;
  getAnchors: () => {
    start: HTMLElement | null;
    end: HTMLElement | null;
  };
  notifyComplete: () => void;
};

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [bridgeActive, setBridgeActiveState] = useState(false);
  const [runId, setRunId] = useState(0);
  const startRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLElement | null>(null);

  const registerAnchors = useCallback(
    (start: HTMLElement | null, end: HTMLElement | null) => {
      startRef.current = start;
      endRef.current = end;
    },
    [],
  );

  const getAnchors = useCallback(
    () => ({ start: startRef.current, end: endRef.current }),
    [],
  );

  const setBridgeActive = useCallback((active: boolean) => {
    setBridgeActiveState(active);
  }, []);

  const notifyComplete = useCallback(() => {
    setBridgeActiveState(false);
    setIsRunning(false);
  }, []);

  const trigger = useCallback(() => {
    if (isRunning) return;
    if (!startRef.current || !endRef.current) return;
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
