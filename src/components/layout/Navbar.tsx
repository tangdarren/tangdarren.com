'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import EasterEggButton from '@/components/easter-egg/EasterEggButton';
import TopCornerControls from '@/components/easter-egg/TopCornerControls';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { NAV_ITEMS, SITE_CONTENT_MAX_CLASS } from '@/data/navigation';

/** Sticky header height (h-14). */
export const SITE_HEADER_HEIGHT_PX = 56;

/**
 * Space kept between the header and section titles when scrolling / spy-switching.
 * Matches `.home-scroll-target` scroll-margin-top (3.5rem + 2rem).
 */
export const SECTION_SCROLL_GAP_PX = 32;

/** Titles watched for homepage scroll-spy (trigger at header + gap). */
const HOME_SCROLL_SECTIONS = [
  { href: '/', id: 'home' },
  { href: '/#experience', id: 'home-experience-title' },
  { href: '/#projects', id: 'projects-heading' },
] as const;

/**
 * Active section = last section whose title has reached the same line
 * scroll-margin leaves below the sticky header (so underline and click-scroll match).
 */
function getActiveHrefFromScroll(): string {
  const probe = SITE_HEADER_HEIGHT_PX + SECTION_SCROLL_GAP_PX;
  let nextActive: string = '/';

  for (const section of HOME_SCROLL_SECTIONS) {
    if (section.href === '/') continue;

    const title = document.getElementById(section.id);
    if (!title) continue;

    if (title.getBoundingClientRect().top <= probe) {
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

type HomeSectionScrollOptions = {
  beforeScroll?: () => void;
};

/** Smooth-scrolls in-page section links while on the homepage. */
function scrollToHomeSection(
  event: { preventDefault: () => void },
  pathname: string,
  href: string,
  options?: HomeSectionScrollOptions,
) {
  if (pathname !== '/') return;

  const isHomeTop = href === '/';
  const isHomeSection = href.startsWith('/#');
  if (!isHomeTop && !isHomeSection) return;

  event.preventDefault();

  const runScroll = () => {
    if (isHomeTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    document
      .getElementById(href.slice(2))
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  if (options?.beforeScroll) {
    options.beforeScroll();
    requestAnimationFrame(() => {
      requestAnimationFrame(runScroll);
    });
    return;
  }

  runScroll();
}

export function NavLinks({
  onNavigate,
  className,
  activeHref = null,
  variant = 'horizontal',
}: {
  onNavigate?: () => void;
  className?: string;
  /** Scroll-spy override for homepage section highlighting. */
  activeHref?: string | null;
  /** Horizontal underline indicator only for the desktop bar. */
  variant?: 'horizontal' | 'vertical';
}) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    // Vertical menus never render the underline; skip measurement entirely
    // so we never reset indicator state from an effect.
    if (variant !== 'horizontal') return;

    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const activeLink = list.querySelector<HTMLElement>(
        'a[aria-current="page"]',
      );
      const item = activeLink?.closest('li');
      if (!(item instanceof HTMLElement)) {
        setIndicator(null);
        return;
      }

      // Measure the flex item so gap + larger type stay aligned.
      setIndicator({
        left: item.offsetLeft,
        width: item.offsetWidth,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    list.querySelectorAll('li').forEach((item) => ro.observe(item));
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pathname, activeHref, variant]);

  return (
    <ul
      ref={listRef}
      className={['relative', className].filter(Boolean).join(' ')}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isNavItemActive(pathname, item.to, activeHref);
        const linkClass = [
          'inline-flex transition-colors',
          variant === 'vertical'
            ? 'w-full py-2.5 text-base'
            : 'relative py-1 text-lg',
          isActive ? 'text-mist-50' : 'text-mist-300 hover:text-mist-50',
        ].join(' ');

        return (
          <li key={item.to}>
            {item.external ? (
              <a
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                onClick={() => onNavigate?.()}
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.to}
                aria-current={isActive ? 'page' : undefined}
                className={linkClass}
                onClick={(event) => {
                  const isInPageHomeLink =
                    pathname === '/' &&
                    (item.to === '/' || item.to.startsWith('/#'));

                  if (isInPageHomeLink && onNavigate) {
                    scrollToHomeSection(event, pathname, item.to, {
                      beforeScroll: onNavigate,
                    });
                    return;
                  }

                  scrollToHomeSection(event, pathname, item.to);
                  onNavigate?.();
                }}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}

      {variant === 'horizontal' && indicator && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-px bg-accent-cyan/70 transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
    </ul>
  );
}

/**
 * Persistent top bar — desktop editorial links; mobile Menu + theme.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [activeHref, setActiveHref] = useState('/');
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Track the pathname the menu was last reconciled with so back/forward
  // (and any other route change) closes it without an effect-driven reset.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 24);
      setPastHero(window.scrollY > window.innerHeight * 0.55);

      if (pathname === '/') {
        setActiveHref(getActiveHrefFromScroll());
      }
    };

    update();

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(update),
    );
    window.addEventListener('load', update);
    document.fonts?.ready.then(update).catch(() => {});
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const homeActiveHref = isHome ? activeHref : null;

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out motion-reduce:transition-none',
        scrolled || menuOpen
          ? 'border-ink-600/90 bg-ink-950/85 backdrop-blur-md'
          : 'border-ink-600/40 bg-ink-950/70 backdrop-blur-sm',
      ].join(' ')}
    >
      {/* Mobile — brand left; theme immediately left of Menu; egg hidden */}
      <div className="flex h-14 items-center justify-between gap-3 px-[var(--gutter)] lg:hidden">
        <Link
          href="/"
          aria-label="Darren Tang — home"
          className={[
            'min-w-0 truncate text-[15px] font-medium tracking-tight text-mist-50 transition-opacity',
            isHome && !pastHero && !menuOpen
              ? 'pointer-events-none opacity-0'
              : 'opacity-100',
          ].join(' ')}
          onClick={(event) => {
            closeMenu();
            scrollToHomeSection(event, pathname, '/');
          }}
          tabIndex={isHome && !pastHero && !menuOpen ? -1 : undefined}
        >
          Darren Tang
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-ink-600 bg-transparent text-mist-200 transition-colors hover:border-ink-500 hover:bg-ink-850 hover:text-mist-50 focus-visible:outline-none"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <X className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <Menu className="h-4 w-4 shrink-0" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* In-flow panel — expands the sticky header and pushes page content down. */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-ink-600 bg-ink-950 lg:hidden"
        >
          <nav aria-label="Primary" className="px-[var(--gutter)] py-3">
            <NavLinks
              variant="vertical"
              activeHref={homeActiveHref}
              onNavigate={closeMenu}
              className="flex flex-col"
            />
          </nav>
        </div>
      )}

      {/*
        Desktop — same shell as the home hero. Left slot: egg at top of home,
        swaps to “Darren Tang” once you scroll past the hero. Theme stays right.
      */}
      <div className="hidden px-[var(--gutter)] lg:block">
        <div
          className={`relative mx-auto flex h-14 w-full items-center ${SITE_CONTENT_MAX_CLASS}`}
        >
          <div className="relative z-10 flex h-9 min-w-0 flex-1 items-center">
            {isHome && (
              <div
                className={[
                  'absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 motion-reduce:transition-none',
                  pastHero
                    ? 'pointer-events-none opacity-0'
                    : 'opacity-100',
                ].join(' ')}
              >
                <EasterEggButton visible={!pastHero} />
              </div>
            )}
            <Link
              href="/"
              aria-label="Darren Tang — home"
              className={[
                'text-lg font-medium tracking-tight text-mist-50 transition-opacity duration-300 motion-reduce:transition-none',
                isHome && !pastHero
                  ? 'pointer-events-none opacity-0'
                  : 'opacity-100',
              ].join(' ')}
              onClick={(event) => {
                scrollToHomeSection(event, pathname, '/');
              }}
              tabIndex={isHome && !pastHero ? -1 : undefined}
            >
              Darren Tang
            </Link>
          </div>

          <nav
            aria-label="Primary"
            className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
          >
            <NavLinks
              activeHref={homeActiveHref}
              className="flex items-center gap-5 md:gap-7 lg:gap-8"
            />
          </nav>

          <div className="relative z-10 flex min-w-0 flex-1 items-center justify-end">
            <TopCornerControls />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
