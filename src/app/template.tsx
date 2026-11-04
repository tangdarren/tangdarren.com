'use client';

import { usePathname } from 'next/navigation';

import PageTransition from '@/components/layout/PageTransition';

/** Remounts on navigation so enter transitions still run under the App Router. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The home page runs its own intro, so it skips the page transition.
  if (pathname === '/') return <>{children}</>;

  return <PageTransition>{children}</PageTransition>;
}
