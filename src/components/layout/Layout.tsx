'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { SiteHeader } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Site shell. The home page has no header (its hero is the first thing you
 * see); case studies and the 404 page get the top bar.
 */
export default function Layout({ children }: LayoutProps) {
  const isHome = usePathname() === '/';

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-cyan focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {!isHome && <SiteHeader />}

      <main id="main-content" className="w-full">
        {children}
      </main>
    </div>
  );
}
