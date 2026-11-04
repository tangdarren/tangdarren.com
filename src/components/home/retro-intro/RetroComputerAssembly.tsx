'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import {
  ASSEMBLY_TIMING,
  CRT_BOARD,
  CRT_BODY,
  CRT_BODY_DARK,
  CRT_BODY_LIGHT,
  CRT_LED_OFF,
  CRT_LED_ON,
  CRT_OUTLINE,
  CRT_SCREEN,
  PART_ORDER,
  type PartId,
} from './intro-theme';

interface RetroComputerAssemblyProps {
  assembled: boolean;
  powerOn: boolean;
  className?: string;
}

/** Exploded offsets in viewBox units — final pose is always (0, 0). */
const PART_ORIGIN: Record<PartId, { x: number; y: number }> = {
  stand: { x: 0, y: 48 },
  rear: { x: -46, y: -38 },
  board: { x: 48, y: -36 },
  glass: { x: -52, y: 18 },
  bezel: { x: 50, y: 20 },
  controls: { x: 36, y: 46 },
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Front-facing chunky CRT in one SVG viewBox.
 * Parts share final coordinates; Framer moves them in viewBox space
 * so they stay aligned at every size.
 */
export default function RetroComputerAssembly({
  assembled,
  powerOn,
  className = '',
}: RetroComputerAssemblyProps) {
  return (
    <svg
      className={`crt-assembly ${className}`}
      viewBox="-28 -24 256 284"
      role="img"
      aria-label="Retro computer assembling"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse
        cx="100"
        cy="218"
        rx="54"
        ry="6"
        fill="#000"
        opacity="0.28"
      />

      <Part id="stand" assembled={assembled}>
        <rect
          x="86"
          y="168"
          width="28"
          height="22"
          rx="2"
          fill={CRT_BODY_DARK}
          stroke={CRT_OUTLINE}
          strokeWidth="1.5"
        />
        <rect
          x="90"
          y="170"
          width="6"
          height="18"
          fill={CRT_BODY}
          opacity="0.35"
        />
        <path
          d="M58 190 H142 L152 208 H48 Z"
          fill={CRT_BODY}
          stroke={CRT_OUTLINE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M64 194 H136 L142 204 H58 Z"
          fill={CRT_BODY_LIGHT}
          opacity="0.35"
        />
      </Part>

      <Part id="rear" assembled={assembled}>
        <rect
          x="28"
          y="18"
          width="148"
          height="154"
          rx="6"
          fill={CRT_BODY_DARK}
          stroke={CRT_OUTLINE}
          strokeWidth="1.5"
        />
        <rect
          x="22"
          y="12"
          width="148"
          height="154"
          rx="6"
          fill={CRT_BODY}
          stroke={CRT_OUTLINE}
          strokeWidth="1.75"
        />
        <path
          d="M28 20 H164 Q168 20 168 24 V30 H28 Z"
          fill={CRT_BODY_LIGHT}
          opacity="0.45"
        />
        <rect
          x="24"
          y="32"
          width="5"
          height="120"
          fill={CRT_BODY_LIGHT}
          opacity="0.28"
        />
      </Part>

      <Part id="board" assembled={assembled}>
        <rect
          x="40"
          y="36"
          width="112"
          height="100"
          rx="2"
          fill={CRT_BOARD}
          stroke={CRT_OUTLINE}
          strokeWidth="1.25"
        />
        <rect x="52" y="48" width="28" height="18" rx="1" fill="#1a2e24" />
        <rect x="92" y="52" width="40" height="14" rx="1" fill="#1a2e24" />
        <rect x="52" y="78" width="18" height="22" rx="1" fill="#243830" />
        <rect x="80" y="80" width="48" height="20" rx="1" fill="#1a2e24" />
        <rect x="58" y="112" width="72" height="10" rx="1" fill="#243830" />
        <path
          d="M56 70 H88 V78 M112 66 V80 M70 100 H120"
          stroke="#4a8f6c"
          strokeWidth="1.2"
          fill="none"
          opacity="0.7"
        />
      </Part>

      <Part id="glass" assembled={assembled}>
        <rect
          x="40"
          y="36"
          width="112"
          height="100"
          rx="3"
          fill={CRT_SCREEN}
          stroke={CRT_OUTLINE}
          strokeWidth="1.25"
        />
        <rect
          x="46"
          y="42"
          width="40"
          height="88"
          rx="2"
          fill="#3a4048"
          opacity="0.18"
        />
      </Part>

      <Part id="bezel" assembled={assembled}>
        <path
          d="M34 28 H158 Q164 28 164 34 V148 Q164 154 158 154 H34 Q28 154 28 148 V34 Q28 28 34 28 Z
             M42 40 H150 Q154 40 154 44 V136 Q154 140 150 140 H42 Q38 140 38 136 V44 Q38 40 42 40 Z"
          fill={CRT_BODY}
          fillRule="evenodd"
          stroke={CRT_OUTLINE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect
          x="38"
          y="40"
          width="116"
          height="100"
          rx="3"
          fill="none"
          stroke={CRT_BODY_DARK}
          strokeWidth="2"
          opacity="0.55"
        />
        {[
          [36, 32],
          [156, 32],
          [36, 146],
          [156, 146],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="2.2"
            fill={CRT_BODY_DARK}
            stroke={CRT_OUTLINE}
            strokeWidth="0.8"
          />
        ))}
      </Part>

      <Part id="controls" assembled={assembled}>
        <rect
          x="118"
          y="148"
          width="40"
          height="10"
          rx="1.5"
          fill={CRT_BODY_DARK}
          stroke={CRT_OUTLINE}
          strokeWidth="1"
        />
        {[124, 132, 140].map((cx) => (
          <circle key={cx} cx={cx} cy="153" r="1.6" fill="#2a2e34" />
        ))}
        <motion.rect
          x="148"
          y="150.5"
          width="7"
          height="5"
          rx="1"
          animate={{
            fill: powerOn ? CRT_LED_ON : CRT_LED_OFF,
          }}
          transition={{ duration: 0.18 }}
          style={{
            filter: powerOn ? `drop-shadow(0 0 2.5px ${CRT_LED_ON})` : undefined,
          }}
        />
      </Part>
    </svg>
  );
}

function Part({
  id,
  assembled,
  children,
}: {
  id: PartId;
  assembled: boolean;
  children: ReactNode;
}) {
  const origin = PART_ORIGIN[id];
  const index = PART_ORDER.indexOf(id);

  return (
    <motion.g
      className={`part part-${id}`}
      initial={false}
      animate={{
        x: assembled ? 0 : origin.x,
        y: assembled ? 0 : origin.y,
      }}
      transition={{
        duration: ASSEMBLY_TIMING.moveMs / 1000,
        delay: assembled ? (index * ASSEMBLY_TIMING.staggerMs) / 1000 : 0,
        ease,
      }}
    >
      {children}
    </motion.g>
  );
}
