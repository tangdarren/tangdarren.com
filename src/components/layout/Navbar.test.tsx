import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Layout from '@/components/layout/Layout';
import { DesktopNav, MobileNav, NavLinks } from '@/components/layout/Navbar';
import { renderWithProviders } from '@/test/render';

describe('DesktopNav', () => {
  it('shows Home, Experience, and Projects without Resume, About, or Contact', () => {
    renderWithProviders(<DesktopNav />, { initialPath: '/' });

    const primary = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(primary).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      within(primary).getByRole('link', { name: 'Experience' }),
    ).toHaveAttribute('href', '/#experience');
    expect(
      within(primary).getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('href', '/#projects');

    // Resume now lives with the intro contact links, not the nav.
    expect(
      within(primary).queryByRole('link', { name: 'Resume' }),
    ).not.toBeInTheDocument();

    // Home is the initial active section; Projects is only a preview away.
    expect(within(primary).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      within(primary).getByRole('link', { name: 'Experience' }),
    ).not.toHaveAttribute('aria-current');

    expect(
      screen.queryByRole('link', { name: /^contact$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /^tech$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /^about$/i }),
    ).not.toBeInTheDocument();
  });
});

describe('MobileNav', () => {
  it('opens, closes, and responds to Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileNav />);

    const openButton = screen.getByRole('button', { name: /open menu/i });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(openButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /mobile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close menu/i }),
    ).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: /open menu/i }),
    ).toHaveAttribute('aria-expanded', 'false');

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close menu/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('keeps Experience and Projects as hash links and closes before scrolling', async () => {
    const user = userEvent.setup();
    const pendingFrames: FrameRequestCallback[] = [];
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => {
        pendingFrames.push(cb);
        return pendingFrames.length;
      });

    const target = document.createElement('section');
    target.id = 'experience';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    try {
      renderWithProviders(<MobileNav />, { initialPath: '/' });

      await user.click(screen.getByRole('button', { name: /open menu/i }));
      const experience = screen.getByRole('link', { name: 'Experience' });
      expect(experience).toHaveAttribute('href', '/#experience');
      expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute(
        'href',
        '/#projects',
      );

      await user.click(experience);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(scrollIntoView).not.toHaveBeenCalled();

      // Flush the deferred double-rAF scroll after the menu has collapsed.
      const firstPass = pendingFrames.splice(0);
      firstPass.forEach((cb) => cb(0));
      const secondPass = pendingFrames.splice(0);
      secondPass.forEach((cb) => cb(0));

      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    } finally {
      rafSpy.mockRestore();
      target.remove();
    }
  });
});


describe('Layout', () => {
  it('keeps the document scrollable and exposes primary navigation on non-home routes', () => {
    renderWithProviders(
      <Layout>
        <div>Projects content</div>
      </Layout>,
      { initialPath: '/projects' },
    );

    expect(
      screen.getByRole('navigation', { name: 'Primary' }),
    ).toBeInTheDocument();
    expect(document.documentElement.style.overflow).not.toBe('hidden');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('does not mount a detached site complementary rail', () => {
    renderWithProviders(
      <Layout>
        <div>Home content</div>
      </Layout>,
      { initialPath: '/' },
    );

    expect(
      screen.queryByRole('complementary', { name: 'Site' }),
    ).not.toBeInTheDocument();
  });
});

describe('NavLinks', () => {
  it('renders the shared destination list', () => {
    renderWithProviders(<NavLinks />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });
});
