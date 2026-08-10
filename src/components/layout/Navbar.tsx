'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';

import { NAV_ITEMS } from '@/data/navigation';

const HOME_SCROLL_SECTIONS = [
  { href: '/', id: 'home' },
  { href: '/#experience', id: 'experience' },
  { href: '/#projects', id: 'projects' },
] as const;

function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function isNavItemActive(
  pathname: string,
  href: string,
  activeHref: string | null,
): boolean {
  if (pathname === '/' && activeHref) {
    return href === activeHref;
  }
  if (href === '/') return pathname === '/';
  if (href.startsWith('/#')) return false;
  if (href.endsWith('.pdf')) return pathname === '/resume';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean, compact: boolean): string {
  return [
    'group inline-flex items-baseline gap-2.5 transition-colors',
    compact ? 'py-0.5 text-[15px]' : 'py-1 text-xl lg:text-2xl',
    active ? 'text-mist-50' : 'text-mist-300 hover:text-mist-50',
  ].join(' ');
}

function navLabelClass(active: boolean): string {
  return active
    ? 'underline decoration-accent-cyan/70 underline-offset-4'
    : 'group-hover:underline group-hover:decoration-ink-500 group-hover:underline-offset-4';
}

export function NavLinks({
  onNavigate,
  className,
  compact = false,
  activeHref = null,
}: {
  onNavigate?: () => void;
  className?: string;
  compact?: boolean;
  /** Scroll-spy override for homepage section highlighting. */
  activeHref?: string | null;
}) {
  const pathname = usePathname();

  const sectionItems = NAV_ITEMS.filter((item) => !item.external);

  return (
    <ul className={className}>
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(pathname, item.to, activeHref);
        const className = navLinkClass(isActive, compact);
        const sectionIndex = sectionItems.findIndex(
          (entry) => entry.to === item.to,
        );

        if (item.external) {
          return (
            <li key={item.to}>
              <a
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className={className}
              >
                <span className={navLabelClass(isActive)}>{item.label}</span>
                <ArrowUpRight
                  aria-hidden
                  className={[
                    'shrink-0 self-center',
                    compact ? 'h-3.5 w-3.5' : 'h-4 w-4 lg:h-5 lg:w-5',
                  ].join(' ')}
                  strokeWidth={2.25}
                />
              </a>
            </li>
          );
        }

        return (
          <li key={item.to}>
            <Link
              href={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={className}
              onClick={(event) => {
                if (pathname === '/') {
                  if (item.to === '/') {
                    event.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item.to.startsWith('/#')) {
                    event.preventDefault();
                    const id = item.to.slice(2);
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }
                onNavigate?.();
              }}
            >
              <span className={navLabelClass(isActive)}>{item.label}</span>
              <span
                aria-hidden
                className={[
                  'font-mono tabular-nums tracking-wide text-mist-400',
                  compact ? 'text-[10px]' : 'text-xs lg:text-sm',
                ].join(' ')}
              >
                {sectionNumber(sectionIndex)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Desktop nav — on the homepage the nav + divider stay fixed in their initial
 * screen position while scrolling, hide over the footer, and underline the
 * active section.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const slotRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [activeHref, setActiveHref] = useState('/');
  const [hiddenByFooter, setHiddenByFooter] = useState(false);

  useLayoutEffect(() => {
    if (!isHome) return;

    const syncLeft = () => {
      const slot = slotRef.current;
      if (!slot) return;
      setLeft(slot.getBoundingClientRect().left);
    };

    syncLeft();
    window.addEventListener('resize', syncLeft);
    return () => window.removeEventListener('resize', syncLeft);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    const updateScrollState = () => {
      const probe = window.innerHeight * 0.35;
      let nextActive: string = '/';

      for (const section of HOME_SCROLL_SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          nextActive = section.href;
        }
      }
      setActiveHref(nextActive);

      const footer = document.getElementById('contact');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        setHiddenByFooter(footerTop < window.innerHeight * 0.62);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [isHome]);

  const links = (
    <NavLinks
      activeHref={isHome ? activeHref : null}
      className="flex flex-col items-end gap-1.5"
    />
  );

  const railExtras = (
    <>
      <div aria-hidden className="w-9 shrink-0 xl:w-12" />
      <div
        aria-hidden
        className="h-[33vh] w-px shrink-0 bg-gradient-to-b from-transparent via-mist-300/35 to-transparent"
      />
    </>
  );

  if (!isHome) {
    return (
      <nav
        aria-label="Primary"
        className="hidden w-fit shrink-0 lg:block lg:pr-0.5 xl:pr-1"
      >
        {links}
      </nav>
    );
  }

  return (
    <>
      {/* Invisible slot preserves the original flex layout / horizontal position. */}
      <div
        ref={slotRef}
        aria-hidden
        className="invisible hidden shrink-0 items-center lg:flex"
      >
        <div className="w-fit shrink-0 lg:pr-0.5 xl:pr-1">
          <NavLinks className="flex flex-col items-end gap-1.5" />
        </div>
        {railExtras}
      </div>

      <div
        className={[
          'fixed top-1/2 z-40 hidden -translate-y-1/2 items-center lg:flex',
          'transition-opacity duration-200',
          hiddenByFooter
            ? 'pointer-events-none opacity-0'
            : 'pointer-events-auto opacity-100',
        ].join(' ')}
        style={left === null ? { visibility: 'hidden' } : { left }}
      >
        <nav
          aria-label="Primary"
          className="w-fit shrink-0 lg:pr-0.5 xl:pr-1"
        >
          {links}
        </nav>
        {railExtras}
      </div>
    </>
  );
}

/** Compact top bar for tablet/mobile — does not keep the desktop sidebar. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState('/');

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (pathname !== '/') return;

    const updateActive = () => {
      const probe = window.innerHeight * 0.35;
      let nextActive: string = '/';
      for (const section of HOME_SCROLL_SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          nextActive = section.href;
        }
      }
      setActiveHref(nextActive);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [pathname]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-600 bg-ink-950 lg:hidden">
      <div className="flex h-14 items-center justify-between px-[var(--gutter)]">
        <Link
          href="/"
          className="text-sm font-medium text-mist-50"
          aria-label="Darren Tang — Home"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeMenu();
          }}
        >
          Darren Tang
        </Link>

        <button
          type="button"
          className="btn-ghost"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          className="border-t border-ink-600 bg-ink-950"
        >
          <nav aria-label="Mobile" className="px-[var(--gutter)] py-4">
            <NavLinks
              onNavigate={closeMenu}
              compact
              activeHref={pathname === '/' ? activeHref : null}
              className="flex flex-col gap-1"
            />
          </nav>
        </div>
      )}
    </header>
  );
}

/** @deprecated Prefer DesktopNav / MobileNav — kept for existing test imports. */
export default function Navbar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
