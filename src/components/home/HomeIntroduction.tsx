'use client';

import { useEffect, useRef } from 'react';

import DarrenWalker from '@/components/easter-egg/DarrenWalker';
import GoldenGateBridgeEasterEgg from '@/components/easter-egg/GoldenGateBridgeEasterEgg';
import { useEasterEgg } from '@/components/easter-egg/EasterEggContext';
import SocialBrandIcon, {
  type SocialBrandId,
} from '@/components/home/SocialBrandIcon';
import {
  RESUME_PDF_PATH,
  SOCIAL_LINKS,
  type SocialLink,
} from '@/data/socials';

const HEADSHOT_SRC = '/images/darren-headshot.png';
const HEADSHOT_ALT =
  'Professional headshot of Darren Tang smiling, wearing a black suit and tie against a blurred modern building background.';

/** Shared control styles — taller touch targets on mobile. */
const INTRO_ACTION =
  'inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3.5 text-[15px] font-medium tracking-wide transition-colors focus-visible:outline-none sm:min-h-10 sm:text-base';

const INTRO_ICON_CLASS = 'h-4 w-4 shrink-0';

interface IntroLink {
  label: string;
  href: string;
  brand: SocialBrandId;
  external?: boolean;
  ariaLabel: string;
}

function brandIdFor(link: SocialLink): SocialBrandId {
  switch (link.label) {
    case 'GitHub':
      return 'github';
    case 'LinkedIn':
      return 'linkedin';
    case 'Email':
      return 'gmail';
    default:
      return 'github';
  }
}

/** Grid order: Resume · LinkedIn / GitHub · Email */
const CONTACT_ACTIONS: IntroLink[] = [
  {
    label: 'Resume',
    href: RESUME_PDF_PATH,
    brand: 'resume',
    external: true,
    ariaLabel: 'Resume',
  },
  ...(['LinkedIn', 'GitHub', 'Email'] as const).flatMap((label) => {
    const link = SOCIAL_LINKS.find((item) => item.label === label);
    if (!link) return [];
    return [
      {
        label: link.label,
        href: link.href,
        brand: brandIdFor(link),
        external: link.external,
        ariaLabel:
          link.label === 'Email'
            ? 'Email Darren Tang'
            : `${link.label} profile`,
      },
    ];
  }),
];

function Portrait({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-ink-500 bg-ink-850">
        <img
          src={HEADSHOT_SRC}
          alt={HEADSHOT_ALT}
          width={204}
          height={255}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-top saturate-[0.85] brightness-[1.03]"
        />
        {/* Soften the darker left-side background in the headshot. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/18 via-white/5 to-transparent mix-blend-soft-light"
        />
      </div>
    </div>
  );
}

export default function HomeIntroduction() {
  const { registerAnchors } = useEasterEgg();
  const wrapRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<HTMLSpanElement>(null);
  const amRef = useRef<HTMLSpanElement>(null);
  const darrenRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerAnchors({
      hi: hiRef.current,
      am: amRef.current,
      darren: darrenRef.current,
    });
    return () =>
      registerAnchors({ hi: null, am: null, darren: null });
  }, [registerAnchors]);

  return (
    <section aria-label="Introduction">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="min-w-0 flex-1">
          {/* Mobile: text left + portrait right; desktop text only in this column */}
          <div className="flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div ref={wrapRef} className="relative z-20">
                <p className="home-greeting">
                  <span ref={hiRef}>Hi</span>, I{' '}
                  <span ref={amRef}>am</span>
                </p>
                <h1 className="home-name">
                  <span ref={darrenRef}>Darren</span> Tang
                </h1>
                <DarrenWalker containerRef={wrapRef} />
              </div>

              <p className="home-role">Software Engineer</p>
              <p className="home-location">
                <span className="relative inline-block">
                  San Francisco
                  <GoldenGateBridgeEasterEgg />
                </span>
              </p>
            </div>

            {/*
              Mobile portrait: hidden under ~340px so text isn’t cramped;
              64px → 80px → 96px as width allows. Desktop uses the right column.
            */}
            <Portrait className="hidden w-20 shrink-0 min-[340px]:block min-[380px]:w-24 sm:w-28 lg:hidden" />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:inline-grid sm:grid-cols-4 lg:mt-9">
            {CONTACT_ACTIONS.map((link) => (
              <li key={link.label} className="min-w-0 sm:w-[8.75rem]">
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={link.ariaLabel}
                  className={`${INTRO_ACTION} border-ink-600 bg-transparent text-mist-200 hover:border-ink-500 hover:bg-ink-850 hover:text-mist-50`}
                >
                  {link.brand === 'resume' ? (
                    // Fixed h-4 slot keeps the button box identical; icon draws larger inside.
                    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-visible">
                      <SocialBrandIcon
                        id="resume"
                        className="pointer-events-none absolute left-1/2 top-1/2 h-[21px] w-[21px] -translate-x-1/2 -translate-y-1/2"
                      />
                    </span>
                  ) : link.brand === 'github' ? (
                    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-visible">
                      <SocialBrandIcon
                        id="github"
                        className="pointer-events-none absolute left-1/2 top-1/2 h-[1.125rem] w-[1.125rem] -translate-x-1/2 -translate-y-1/2"
                      />
                    </span>
                  ) : (
                    <SocialBrandIcon
                      id={link.brand}
                      className={INTRO_ICON_CLASS}
                    />
                  )}
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: portrait on the right of the intro */}
        <Portrait className="hidden w-[12.75rem] shrink-0 lg:block" />
      </div>
    </section>
  );
}
