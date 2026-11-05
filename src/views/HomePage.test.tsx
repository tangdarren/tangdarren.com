import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Layout from '@/components/layout/Layout';
import HomePage from '@/views/HomePage';
import { renderWithProviders } from '@/test/render';

describe('Homepage intro', () => {
  it('shows the introduction, then the timeline, projects and contact, without the header', () => {
    renderWithProviders(<Layout><HomePage /></Layout>, { initialPath: '/' });

    expect(screen.getByRole('heading', { level: 1, name: 'Darren Tang' })).toBeVisible();
    expect(screen.getByText('Software Engineer · Fremont')).toBeVisible();
    // The visible typed copy is aria-hidden; the readable sentence is one node.
    expect(screen.getByText('I build software and AI tools for real workflows.', { ignore: '[aria-hidden="true"] *' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Portfolio intro' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'AI Agent Development Intern, Veracyte' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Education' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Bachelor of Science/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tempest/ })).toHaveAttribute('href', 'https://github.com/tangdarren/stock-market-dashboard');
    expect(screen.getByRole('link', { name: 'tang.darren@gmail.com' })).toHaveAttribute('href', 'mailto:tang.darren@gmail.com');
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
  });
});


describe('More photos', () => {
  it('opens the gallery with every moment from the button after Experience', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    const button = screen.getByRole('button', { name: /More photos/ });
    expect(document.getElementById('experience')).toContainElement(button);
    await user.click(button);

    const dialog = document.querySelector('dialog');
    expect(dialog).toHaveAttribute('open');
    for (const title of ['Visiting Meta', 'Hiking', 'Basketball', 'High school debate', 'Early experiments']) {
      expect(within(dialog as HTMLElement).getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
    }
    expect(within(dialog as HTMLElement).getAllByRole('img')).toHaveLength(11);
  });
});

describe('Intro loading lifecycle', () => {
  const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalFonts) Object.defineProperty(document, 'fonts', originalFonts);
    else Reflect.deleteProperty(document, 'fonts');
  });

  function holdFonts() {
    let release!: () => void;
    const ready = new Promise<void>((resolve) => { release = resolve; });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready },
    });
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
    return release;
  }

  it('waits for the font before revealing the hero, then finishes after typing the description', async () => {
    vi.useFakeTimers();
    const release = holdFonts();
    renderWithProviders(<HomePage />);

    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'loading');
    expect(screen.getByRole('status', { name: 'Loading portfolio' })).toBeInTheDocument();

    await act(async () => { release(); });
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'revealing');
    // The cursor types the description after the name lands, then finishes.
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'revealing');
    await act(() => vi.advanceTimersByTimeAsync(2500));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'complete');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('escapes stalled loading and completes even when the reveal stalls', async () => {
    vi.useFakeTimers();
    holdFonts();
    renderWithProviders(<HomePage />);

    await act(() => vi.advanceTimersByTimeAsync(6000));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'revealing');
    await act(() => vi.advanceTimersByTimeAsync(4000));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'complete');
  });

  it('bypasses the loader for reduced motion without waiting for fonts', async () => {
    vi.useFakeTimers();
    holdFonts();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...media, matches: true });
    renderWithProviders(<HomePage />);

    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'complete');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Darren Tang' })).toBeVisible();
  });
});
