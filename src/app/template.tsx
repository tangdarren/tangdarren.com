'use client';

import { usePathname } from 'next/navigation';

import PageTransition from '@/components/layout/PageTransition';

/** Remounts on navigation so enter transitions still run under the App Router. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Keep the prototype immediately visible, including with reduced motion.
  if (pathname === '/') return <>{children}</>;

  return <PageTransition>{children}</PageTransition>;
}
