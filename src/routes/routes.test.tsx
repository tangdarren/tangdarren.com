import type { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutPage from '@/views/AboutPage';
import ContactPage from '@/views/ContactPage';
import HomePage from '@/views/HomePage';
import NotFoundPage from '@/views/NotFoundPage';
import ProjectsPage from '@/views/ProjectsPage';
import ResumePage from '@/views/ResumePage';
import { renderWithProviders } from '@/test/render';

describe('Portfolio pages', () => {
  it('renders main routes successfully', async () => {
    const routes: Array<{
      path: string;
      ui: ReactElement;
      heading: string | RegExp;
    }> = [
      { path: '/', ui: <HomePage />, heading: /Hi, I'm Darren/i },
      { path: '/about', ui: <AboutPage />, heading: 'About Me' },
      { path: '/projects', ui: <ProjectsPage />, heading: 'Projects' },
      { path: '/resume', ui: <ResumePage />, heading: 'Resume Viewer' },
      { path: '/contact', ui: <ContactPage />, heading: 'Get in Touch' },
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

    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to home/i }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: /browse projects/i }),
    ).toHaveAttribute('href', '/projects');
  });
});
