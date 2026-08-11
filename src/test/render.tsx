import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useSearchParams } from 'next/navigation';

import { EasterEggProvider } from '@/components/easter-egg/EasterEggContext';
import { nextRouterState } from '@/test/next-router-state';

function LocationProbe() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return (
    <div
      data-testid="location"
      data-pathname={pathname}
      data-search={query ? `?${query}` : ''}
      hidden
    />
  );
}

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
      <EasterEggProvider>
        <LocationProbe />
        {children}
      </EasterEggProvider>
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

export function getLocationProbe() {
  const node = document.querySelector('[data-testid="location"]');
  if (!(node instanceof HTMLElement)) {
    throw new Error('Location probe not found');
  }
  return {
    pathname: node.dataset.pathname ?? '',
    search: node.dataset.search ?? '',
  };
}
