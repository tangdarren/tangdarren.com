import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScrollToTop from '@/components/layout/ScrollToTop';
import { nextRouterState } from '@/test/next-router-state';

describe('ScrollToTop', () => {
  beforeEach(() => {
    nextRouterState.reset('/about');
    window.history.replaceState({}, '', '/about');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.getElementById('experience')?.remove();
    document.getElementById('projects')?.remove();
    window.history.replaceState({}, '', '/');
    nextRouterState.reset('/');
  });

  it('scrolls to the top on non-hash route changes', () => {
    render(<ScrollToTop />);
    vi.mocked(window.scrollTo).mockClear();

    act(() => {
      window.history.replaceState({}, '', '/resume');
      nextRouterState.navigate('/resume');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });

  it('does not override hash navigation to /#experience', () => {
    const target = document.createElement('section');
    target.id = 'experience';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(<ScrollToTop />);
    vi.mocked(window.scrollTo).mockClear();

    act(() => {
      window.history.replaceState({}, '', '/#experience');
      nextRouterState.navigate('/');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('does not override hash navigation to /#projects', () => {
    const target = document.createElement('section');
    target.id = 'projects';
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(<ScrollToTop />);
    vi.mocked(window.scrollTo).mockClear();

    act(() => {
      window.history.replaceState({}, '', '/#projects');
      nextRouterState.navigate('/');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
