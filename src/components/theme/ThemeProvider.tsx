'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="data-mode" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
