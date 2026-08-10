import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import Layout from '@/components/layout/Layout';
import { DesktopNav, MobileNav, NavLinks } from '@/components/layout/Navbar';
import { RESUME_PDF_PATH } from '@/data/socials';
import { renderWithProviders } from '@/test/render';

describe('DesktopNav', () => {
  it('shows Home, Experience, Projects, and Resume without About or Contact', () => {
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

    const resume = within(primary).getByRole('link', { name: 'Resume' });
    expect(resume).toHaveAttribute('href', RESUME_PDF_PATH);
    expect(resume).toHaveAttribute('target', '_blank');
    expect(resume.querySelector('svg')).toBeTruthy();

    expect(within(primary).getByText('01')).toBeInTheDocument();
    expect(within(primary).getByText('02')).toBeInTheDocument();
    expect(within(primary).getByText('03')).toBeInTheDocument();

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
