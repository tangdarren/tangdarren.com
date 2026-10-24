import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Layout from '@/components/layout/Layout';
import { NavLinks, SiteHeader } from '@/components/layout/Navbar';
import { renderWithProviders } from '@/test/render';

function getPrimaryNav() {
  return screen.getAllByRole('navigation', { name: 'Primary' })[0];
}

describe('SiteHeader', () => {
  it('shows Home, Experience, and Projects without Résumé, About, or Contact', () => {
    renderWithProviders(<SiteHeader />, { initialPath: '/' });

    const primary = getPrimaryNav();
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

    expect(
      within(primary).queryByRole('link', { name: 'Résumé' }),
    ).not.toBeInTheDocument();

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

  it('keeps Experience and Projects as hash links and scrolls on the homepage', async () => {
    const user = userEvent.setup();

    const target = document.createElement('section');
    target.id = 'experience';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    try {
      renderWithProviders(<SiteHeader />, { initialPath: '/' });

      const experience = within(getPrimaryNav()).getByRole('link', {
        name: 'Experience',
      });
      expect(experience).toHaveAttribute('href', '/#experience');
      expect(
        within(getPrimaryNav()).getByRole('link', { name: 'Projects' }),
      ).toHaveAttribute('href', '/#projects');

      await user.click(experience);

      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    } finally {
      target.remove();
    }
  });

  it('exposes theme controls in the sticky header', () => {
    renderWithProviders(<SiteHeader />, { initialPath: '/' });

    expect(
      screen.getAllByRole('button', {
        name: /switch to (light|dark) mode/i,
      }).length,
    ).toBeGreaterThan(0);
  });

  it('opens, closes, and responds to Escape on the mobile menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />, { initialPath: '/' });

    const openButton = screen.getByRole('button', { name: /open menu/i });
    expect(document.getElementById('mobile-navigation')).toBeNull();

    await user.click(openButton);

    expect(document.getElementById('mobile-navigation')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close menu/i }),
    ).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(document.getElementById('mobile-navigation')).toBeNull();
    });
    expect(
      screen.getByRole('button', { name: /open menu/i }),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the mobile menu before scrolling to a section', async () => {
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
      renderWithProviders(<SiteHeader />, { initialPath: '/' });

      await user.click(screen.getByRole('button', { name: /open menu/i }));
      const panel = document.getElementById('mobile-navigation');
      expect(panel).toBeTruthy();
      const experience = within(panel as HTMLElement).getByRole('link', {
        name: 'Experience',
      });

      await user.click(experience);

      expect(document.getElementById('mobile-navigation')).toBeNull();
      expect(scrollIntoView).not.toHaveBeenCalled();

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
      screen.getAllByRole('navigation', { name: 'Primary' }).length,
    ).toBeGreaterThan(0);
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

  it('renders a sticky header with brand and menu or primary links', () => {
    renderWithProviders(
      <Layout>
        <div>Home content</div>
      </Layout>,
      { initialPath: '/' },
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Darren Tang — home' }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: /open menu/i }),
    ).toBeInTheDocument();
  });
});

describe('NavLinks', () => {
  it('renders the shared destination list', () => {
    renderWithProviders(<NavLinks />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Résumé' }),
    ).not.toBeInTheDocument();
  });
});
