'use client';

import type { ReactNode } from 'react';

import { SiteHeader } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Site shell with a persistent editorial top header.
 * Content is full-width; page views own their own column width.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-cyan focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main-content" className="w-full">
        {children}
      </main>
    </div>
  );
}
