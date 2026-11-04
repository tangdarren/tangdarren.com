import type { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '@/views/HomePage';
import NotFoundPage from '@/views/NotFoundPage';
import { renderWithProviders } from '@/test/render';

describe('Portfolio pages', () => {
  it('renders main routes successfully', async () => {
    const routes: Array<{
      path: string;
      ui: ReactElement;
      heading: string | RegExp;
    }> = [
      { path: '/', ui: <HomePage />, heading: /Darren Tang/i },
    ];

    for (const route of routes) {
      const { unmount } = renderWithProviders(route.ui, {
        initialPath: route.path,
      });
      expect(
        await screen.findByRole('heading', { level: 1, name: route.heading }),
      ).toBeInTheDocument();
      unmount();
    }
  });

  it('displays the custom 404 page', async () => {
    renderWithProviders(<NotFoundPage />, {
      initialPath: '/this-route-does-not-exist',
    });

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /i think we might be lost/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /let's go home/i }),
    ).toHaveAttribute('href', '/');
    const images = screen.getAllByRole('presentation', { hidden: true });
    expect(
      images.some(
        (img) => img.getAttribute('src') === '/not-found/darren-character.png',
      ),
    ).toBe(true);
    expect(
      images.some(
        (img) => img.getAttribute('src') === '/not-found/confusedmark.png',
      ),
    ).toBe(true);
  });
});



