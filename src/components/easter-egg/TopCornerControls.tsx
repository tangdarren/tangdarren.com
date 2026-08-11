'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import EasterEggButton from '@/components/easter-egg/EasterEggButton';
import ThemeToggle from '@/components/theme/ThemeToggle';

const SCROLL_HIDE_PX = 150;

/**
 * Theme toggle + homepage easter-egg control.
 * Egg slot keeps a fixed width so the moon/sun never shifts when the egg fades.
 */
export default function TopCornerControls({
  showEgg = false,
}: {
  showEgg?: boolean;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const eggEnabled = showEgg && isHome;
  const [eggVisible, setEggVisible] = useState(true);

  useEffect(() => {
    if (!eggEnabled) return;

    const update = () => {
      setEggVisible(window.scrollY < SCROLL_HIDE_PX);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [eggEnabled]);

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {eggEnabled ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <EasterEggButton visible={eggVisible} />
        </div>
      ) : null}
    </div>
  );
}

export { SCROLL_HIDE_PX };
