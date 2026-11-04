'use client';

import type { ReactNode } from 'react';

import Layout from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <ScrollToTop />
      {children}
    </Layout>
  );
}
