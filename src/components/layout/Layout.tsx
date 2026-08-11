'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { DesktopNav, MobileNav } from './Navbar';
import { VerticalSeparator } from './Separator';
import TopCornerControls from '@/components/easter-egg/TopCornerControls';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Site shell modeled on Filyys FullContent:
 * desktop = nav | short separator | main, centered as a composition.
 * Homepage owns its first-viewport row so Projects can sit below the fold
 * without vertically centering the nav against the full document height.
 */
export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-cyan focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <MobileNav />

      <div className="fixed left-2 top-2 z-50 hidden lg:left-3 lg:top-3 lg:block">
        <TopCornerControls showEgg />
      </div>

      <div className="flex min-h-screen justify-center">
        {isHome ? (
          <div className="w-full">
            <main id="main-content" className="w-full">
              {children}
            </main>
          </div>
        ) : (
          <div className="flex w-full max-w-7xl flex-col lg:min-h-dvh lg:flex-row lg:items-center">
            <DesktopNav />
            <div aria-hidden className="hidden w-9 shrink-0 lg:block xl:w-12" />
            <VerticalSeparator />
            <main
              id="main-content"
              className="min-w-0 w-full flex-1 px-[var(--gutter)] py-8 lg:py-10 lg:pl-9 lg:pr-8 xl:pl-12"
            >
              <div className="w-full max-w-5xl">{children}</div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
