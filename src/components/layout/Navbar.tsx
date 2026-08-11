'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowDown, ArrowUp, Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/theme/ThemeToggle';
import { NAV_ITEMS } from '@/data/navigation';

/** `lead` = px a title may still sit below the anchor and already take over. */
const HOME_SCROLL_SECTIONS = [
  { href: '/', id: 'home', lead: 0 },
  { href: '/#experience', id: 'home-experience-title', lead: 160 },
  { href: '/#projects', id: 'projects-heading', lead: 96 },
] as const;

/**
 * Screen line the active nav label sits on. It is derived from the viewport
 * rather than measured, because the page transition's transform turns the rail
 * into a page-relative box while it runs, which would place the line mid-page.
 */
function getAnchorLineTop(anchor: HTMLElement | null): number {
  if (!anchor) return window.innerHeight * 0.35;
  return (window.innerHeight - anchor.offsetHeight) / 2;
}

/**
 * Active section = last section whose content title top has reached the fixed
 * anchor line where the active nav label sits.
 */
function getActiveHrefFromAnchor(anchor: HTMLElement | null): string {
  const anchorTop = getAnchorLineTop(anchor);

  let nextActive: string = '/';

  for (const section of HOME_SCROLL_SECTIONS) {
    if (section.href === '/') continue;

    const title = document.getElementById(section.id);
    if (!title) continue;

    if (title.getBoundingClientRect().top <= anchorTop + section.lead) {
      nextActive = section.href;
    }
  }

  return nextActive;
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

/** Smooth-scrolls in-page section links while on the homepage. */
function scrollToHomeSection(
  event: { preventDefault: () => void },
  pathname: string,
  href: string,
) {
  if (pathname !== '/') return;

  if (href === '/') {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (href.startsWith('/#')) {
    event.preventDefault();
    document
      .getElementById(href.slice(2))
      ?.scrollIntoView({ behavior: 'smooth' });
  }
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

  return (
    <ul className={className}>
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(pathname, item.to, activeHref);
        const className = navLinkClass(isActive, compact);

        return (
          <li key={item.to}>
            <Link
              href={item.to}
              aria-current={isActive ? 'page' : undefined}
              className={className}
              onClick={(event) => {
                scrollToHomeSection(event, pathname, item.to);
                onNavigate?.();
              }}
            >
              <span className={navLabelClass(isActive)}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Share of the divider taken up by the scroll marker. */
const RAIL_MARKER_PCT = 16;

/** Vertical travel between the active line and its adjacent previews. */
const PREVIEW_STEP_REM = 3;
const PREVIEW_SCALE = 0.62;

/**
 * Homepage desktop nav — the active section always sits on one fixed line,
 * with the adjacent sections as small previews above and below it.
 */
function HomeSectionNavigator({
  activeHref,
  anchorRef,
}: {
  activeHref: string;
  anchorRef?: RefObject<HTMLSpanElement>;
}) {
  const pathname = usePathname();
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.to === activeHref),
  );

  return (
    /* Height stays equal to the active line so it centers on the viewport. */
    <div className="relative flex flex-col items-end">
      <div className="relative">
        {/* Sizer holds the width and pins the active label to one fixed line. */}
        <span
          ref={anchorRef}
          aria-hidden
          className="invisible block whitespace-nowrap text-[2.125rem] font-medium leading-tight tracking-tight"
        >
          Experience
        </span>

        {NAV_ITEMS.map((item, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          return (
            <Link
              key={item.to}
              href={item.to}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => scrollToHomeSection(event, pathname, item.to)}
              style={{
                transform: `translateY(${offset * PREVIEW_STEP_REM}rem) scale(${
                  isActive ? 1 : PREVIEW_SCALE
                })`,
              }}
              className={[
                'absolute right-0 top-0 inline-flex origin-right items-center whitespace-nowrap text-[2.125rem] leading-tight tracking-tight',
                'transition-[transform,opacity,color] duration-300 ease-out motion-reduce:transition-none',
                isActive
                  ? 'font-medium text-mist-50'
                  : 'font-normal text-mist-400 hover:text-mist-200 focus-visible:text-mist-200',
                isVisible
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0 focus-visible:opacity-100',
              ].join(' ')}
            >
              <span>{item.label}</span>
              {/* Sits outside the text box so every label shares one right edge. */}
              {offset !== 0 && (
                <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2">
                  {offset === -1 ? (
                    <ArrowUp
                      aria-hidden
                      className="h-[0.75em] w-[0.75em]"
                      strokeWidth={2.25}
                    />
                  ) : (
                    <ArrowDown
                      aria-hidden
                      className="h-[0.75em] w-[0.75em]"
                      strokeWidth={2.25}
                    />
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
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
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [activeHref, setActiveHref] = useState('/');
  const [progress, setProgress] = useState(0);
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
      setActiveHref(getActiveHrefFromAnchor(anchorRef.current));

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      // Quantized so scrolling only re-renders on meaningful movement.
      setProgress(Math.round(Math.min(1, Math.max(0, ratio)) * 200) / 200);

      const footer = document.getElementById('contact');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        setHiddenByFooter(footerTop < window.innerHeight * 0.85);
      }
    };

    updateScrollState();

    /* Section heights aren't final on first paint (fonts/images still settling),
       so re-measure once layout is stable or the browser restores scroll. */
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(updateScrollState),
    );
    window.addEventListener('load', updateScrollState);
    document.fonts?.ready.then(updateScrollState).catch(() => {});

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', updateScrollState);
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [isHome]);

  const railExtras = (
    <>
      <div aria-hidden className="w-9 shrink-0 xl:w-12" />
      <div
        aria-hidden
        className="relative h-[33vh] w-px shrink-0 bg-gradient-to-b from-transparent via-mist-300/35 to-transparent"
      >
        {/* Same gray, just solid — a short marker riding the line as you scroll. */}
        <span
          className="absolute inset-x-0 rounded-full bg-mist-300 transition-[top] duration-150 ease-out motion-reduce:transition-none"
          style={{
            height: `${RAIL_MARKER_PCT}%`,
            top: `${progress * (100 - RAIL_MARKER_PCT)}%`,
          }}
        />
      </div>
    </>
  );

  if (!isHome) {
    return (
      <nav
        aria-label="Primary"
        className="hidden w-fit shrink-0 lg:block lg:pr-0.5 xl:pr-1"
      >
        <NavLinks className="flex flex-col items-end gap-1.5" />
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
          <HomeSectionNavigator activeHref={activeHref} />
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
        <nav aria-label="Primary" className="w-fit shrink-0 lg:pr-0.5 xl:pr-1">
          <HomeSectionNavigator
            activeHref={activeHref}
            anchorRef={anchorRef}
          />
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
      // Mobile has no side rail — activate when each section title reaches below the sticky header.
      const probe = 72;
      let nextActive: string = '/';
      for (const section of HOME_SCROLL_SECTIONS) {
        if (section.href === '/') continue;
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
        </div>

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
