'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/theme/ThemeToggle';
import { NAV_ITEMS, SITE_CONTENT_MAX_CLASS } from '@/data/navigation';

/**
 * Links back into the home page's sections. The home page itself has no
 * header, so these are plain links that land on `/#section`.
 */
export function NavLinks({
  onNavigate,
  className,
  variant = 'horizontal',
}: {
  onNavigate?: () => void;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}) {
  return (
    <ul className={className}>
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <Link
            href={item.to}
            className={[
              'inline-flex text-mist-300 transition-colors hover:text-mist-50',
              variant === 'vertical' ? 'w-full py-2.5 text-base' : 'py-1 text-lg',
            ].join(' ')}
            onClick={() => onNavigate?.()}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Top bar for pages other than home: case studies and the 404 page. */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Close the menu on any route change without an effect-driven reset.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const brand = (
    <Link
      href="/"
      aria-label="Darren Tang — home"
      className="min-w-0 truncate text-lg font-medium tracking-tight text-mist-50"
      onClick={closeMenu}
    >
      Darren Tang
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink-600/90 bg-ink-950">
      {/* Phones: name, theme, and a menu button. */}
      <div className="flex h-14 items-center justify-between gap-3 px-[var(--gutter)] lg:hidden">
        {brand}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-600 bg-transparent text-mist-200 transition-colors hover:border-ink-500 hover:bg-ink-850 hover:text-mist-50"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-ink-600 bg-ink-950 lg:hidden">
          <nav aria-label="Primary" className="px-[var(--gutter)] py-3">
            <NavLinks variant="vertical" onNavigate={closeMenu} className="flex flex-col" />
          </nav>
        </div>
      )}

      {/* Desktop: name left, section links centred, theme right. */}
      <div className="hidden px-[var(--gutter)] lg:block">
        <div className={`relative mx-auto flex h-14 w-full items-center justify-between ${SITE_CONTENT_MAX_CLASS}`}>
          {brand}
          <nav aria-label="Primary" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavLinks className="flex items-center gap-8" />
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
