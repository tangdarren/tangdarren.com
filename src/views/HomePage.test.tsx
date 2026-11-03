import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Layout from '@/components/layout/Layout';
import HomePage from '@/views/HomePage';
import { renderWithProviders } from '@/test/render';

describe('Homepage intro', () => {
  it('shows the complete introduction without the portfolio or header', () => {
    renderWithProviders(<Layout><HomePage /></Layout>, { initialPath: '/' });

    expect(screen.getByRole('heading', { level: 1, name: 'Darren Tang' })).toBeVisible();
    expect(screen.getByText('Software Engineer · San Francisco')).toBeVisible();
    expect(screen.getByText('I build software and AI tools for real workflows.')).toBeVisible();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Portfolio intro' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Projects' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
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

  it('waits for the font before revealing the hero, then finishes on the description', async () => {
    vi.useFakeTimers();
    const release = holdFonts();
    renderWithProviders(<HomePage />);

    await act(() => vi.advanceTimersByTimeAsync(900));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'loading');
    expect(screen.getByRole('status', { name: 'Loading portfolio' })).toBeInTheDocument();

    await act(async () => { release(); });
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'revealing');
    // JSDOM exposes WebkitAnimation but no AnimationEvent, so React uses this event.
    fireEvent(
      screen.getByText('I build software and AI tools for real workflows.'),
      new Event('webkitAnimationEnd', { bubbles: true }),
    );
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'complete');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('escapes stalled loading and completes even when animation events never fire', async () => {
    vi.useFakeTimers();
    holdFonts();
    renderWithProviders(<HomePage />);

    await act(() => vi.advanceTimersByTimeAsync(6000));
    expect(document.getElementById('home')).toHaveAttribute('data-phase', 'revealing');
    await act(() => vi.advanceTimersByTimeAsync(1800));
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
