import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Layout from '@/components/layout/Layout';
import { SiteHeader } from '@/components/layout/Navbar';
import { renderWithProviders } from '@/test/render';

describe('SiteHeader', () => {
  it('links back into the home page sections', () => {
    renderWithProviders(<SiteHeader />, { initialPath: '/projects/expensense' });

    const primary = screen.getAllByRole('navigation', { name: 'Primary' })[0];
    expect(within(primary).getByRole('link', { name: 'Education' })).toHaveAttribute('href', '/#education');
    expect(within(primary).getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '/#experience');
    expect(within(primary).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects');
    expect(screen.getAllByRole('link', { name: 'Darren Tang — home' })[0]).toHaveAttribute('href', '/');

    for (const removed of [/^about$/i, /^contact$/i, /^résumé$/i]) {
      expect(screen.queryByRole('link', { name: removed })).not.toBeInTheDocument();
    }
  });

  it('opens and closes the phone menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />, { initialPath: '/projects/expensense' });

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.getElementById('mobile-navigation')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(document.getElementById('mobile-navigation')).not.toBeInTheDocument();
  });
});

describe('Layout', () => {
  it('hides the header on the home page and shows it elsewhere', () => {
    const { unmount } = renderWithProviders(<Layout><p>home</p></Layout>, { initialPath: '/' });
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    unmount();

    renderWithProviders(<Layout><p>case study</p></Layout>, { initialPath: '/projects/expensense' });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
