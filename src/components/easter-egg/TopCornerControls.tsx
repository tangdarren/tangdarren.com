'use client';

import ThemeToggle from '@/components/theme/ThemeToggle';

/**
 * Theme toggle for the header (egg lives on the desktop brand slot).
 */
export default function TopCornerControls({
  showEgg: _showEgg = false,
}: {
  /** @deprecated Egg is rendered next to the brand on desktop. */
  showEgg?: boolean;
}) {
  return <ThemeToggle />;
}
