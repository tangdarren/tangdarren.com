import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

import { nextRouterState } from '@/test/next-router-state';

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-mode"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialPath?: string },
) {
  const { initialPath, ...renderOptions } = options ?? {};
  if (initialPath !== undefined) {
    nextRouterState.reset(initialPath);
  }

  return render(ui, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
    ...renderOptions,
  });
}
