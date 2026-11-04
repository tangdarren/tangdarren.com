'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import { EasterEggContext, type EasterEggAnchors } from './EasterEggContext';

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

