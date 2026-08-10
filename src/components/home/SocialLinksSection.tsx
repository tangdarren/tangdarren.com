'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

import {
  SOCIAL_LINKS,
  getSocialDisplayText,
  type SocialLink,
} from '@/data/socials';

function linkProps(link: SocialLink) {
  return link.external
    ? ({
        target: '_blank',
        rel: 'noopener noreferrer',
      } as const)
    : {};
}

function DesktopSocialRow({ link }: { link: SocialLink }) {
  const Icon = link.icon;
  const display = getSocialDisplayText(link);

  return (
    <div className="group z-10 flex justify-between transition-colors duration-200 hover:text-mist-200">
      <a
        href={link.href}
        {...linkProps(link)}
        className="flex items-center gap-1"
        aria-label={`${link.label}: ${display}`}
      >
        {display}
        <span
          aria-hidden
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
        </span>
      </a>

      <a
        href={link.href}
        {...linkProps(link)}
        className="flex items-center gap-2"
        aria-label={link.label}
        tabIndex={-1}
      >
        <span>{link.label}</span>
        <Icon
          aria-hidden
          className="size-4 text-mist-400/50 transition-colors duration-200 group-hover:text-mist-300"
        />
      </a>
    </div>
  );
}

function MobileSocialCard({ link }: { link: SocialLink }) {
  const Icon = link.icon;
  const display = getSocialDisplayText(link);

  return (
    <a
      href={link.href}
      {...linkProps(link)}
      aria-label={`${link.label}: ${display}`}
      className="flex h-fit w-full flex-col items-center justify-center gap-0.5 border border-ink-600 py-5 text-mist-300 transition-colors duration-150 hover:bg-ink-800/60 hover:text-mist-100"
    >
      <Icon aria-hidden className="size-5" />
      <span className="text-sm">{link.label}</span>
    </a>
  );
}

/** Find-me-at link rows — width matched to the tech card grid on desktop. */
export function FindMeAtLinks() {
  const desktopRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;

    const syncWidthToTechGrid = () => {
      const techGrid = document.querySelector<HTMLElement>('[data-tech-grid]');
      if (!techGrid || !window.matchMedia('(min-width: 640px)').matches) {
        desktop.style.width = '';
        return;
      }

      desktop.style.width = `${techGrid.getBoundingClientRect().width}px`;
    };

    syncWidthToTechGrid();

    const techGrid = document.querySelector<HTMLElement>('[data-tech-grid]');
    const observer = new ResizeObserver(syncWidthToTechGrid);
    if (techGrid) observer.observe(techGrid);

    window.addEventListener('resize', syncWidthToTechGrid);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncWidthToTechGrid);
    };
  }, []);

  return (
    <>
      <div
        ref={desktopRef}
        className="hidden max-w-full text-base text-mist-400 sm:block *:cursor-pointer"
      >
        {SOCIAL_LINKS.map((link) => (
          <DesktopSocialRow key={link.label} link={link} />
        ))}
      </div>

      <div className="mt-2 flex gap-2 sm:hidden">
        {SOCIAL_LINKS.map((link) => (
          <MobileSocialCard key={link.label} link={link} />
        ))}
      </div>
    </>
  );
}

export default function SocialLinksSection() {
  return (
    <section aria-labelledby="social-links-heading">
      <h2
        id="social-links-heading"
        className="text-sm font-normal text-mist-300"
      >
        - Find me at
      </h2>

      <div className="mt-2">
        <FindMeAtLinks />
      </div>
    </section>
  );
}
