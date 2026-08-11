'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Resets scroll on route changes, but leaves hash targets alone so
 * navigations like `/#experience` (e.g. from 404) can land on the section.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash || hash === '#') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;

    let cancelled = false;
    let outerRaf = 0;
    let innerRaf = 0;

    // Wait for the destination page to commit/layout before resolving the hash,
    // so CSS scroll-margin-top (including mobile sticky-header offset) applies.
    outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        if (cancelled) return;
        document.getElementById(id)?.scrollIntoView();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    };
  }, [pathname]);

  return null;
}
