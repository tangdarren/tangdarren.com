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

  const notifyComplete = useCallback(() => {
    setIsRunning(false);
  }, []);

  const trigger = useCallback(() => {
    if (isRunning) return;
    if (!startRef.current || !endRef.current) return;
    setIsRunning(true);
    setRunId((id) => id + 1);
  }, [isRunning]);

  const value = useMemo(
    () => ({
      trigger,
      isRunning,
      runId,
      registerAnchors,
      getAnchors,
      notifyComplete,
    }),
    [
      trigger,
      isRunning,
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
