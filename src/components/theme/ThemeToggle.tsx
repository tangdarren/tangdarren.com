'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { useTheme } from 'next-themes';

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={[
          'inline-flex h-8 w-8 shrink-0 border border-transparent',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-ink-600/70 text-mist-500 transition-colors',
        'hover:border-ink-500 hover:bg-brand-50 hover:text-mist-400',
        'dark:border-ink-500 dark:text-mist-300',
        'dark:hover:border-ink-500 dark:hover:bg-brand-50 dark:hover:text-mist-200',
        'focus-visible:outline-none',
        '[&:hover_svg]:opacity-70 dark:[&_svg]:opacity-70 dark:[&:hover_svg]:opacity-90',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 opacity-45" aria-hidden />
      ) : (
        <MoonIcon className="h-4 w-4 opacity-45" aria-hidden />
      )}
    </button>
  );
}
