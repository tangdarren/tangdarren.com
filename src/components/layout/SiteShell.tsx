'use client';

import type { ReactNode } from 'react';

import { EasterEggProvider } from '@/components/easter-egg/EasterEggContext';
import Layout from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <EasterEggProvider>
      <Layout>
        <ScrollToTop />
        {children}
      </Layout>
    </EasterEggProvider>
  );
}
