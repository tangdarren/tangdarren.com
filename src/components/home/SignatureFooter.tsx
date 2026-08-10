'use client';

import { ArrowUp } from 'lucide-react';

import { SOCIAL_LINKS, getSocialDisplayText } from '@/data/socials';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function SignatureFooter() {
  return (
    <footer
      id="contact"
      className="relative mt-24 max-w-none scroll-mt-20 sm:mt-28 lg:mt-32"
      style={{
        width: '94vw',
        /* Escape the asymmetric home shell so left/right page margins stay equal. */
        marginLeft: 'calc(3vw - 2 * var(--page-side-inset))',
      }}
    >
      <div className="relative h-[22rem] overflow-hidden rounded-t-[1.75rem] bg-accent-cyan sm:h-[26rem] sm:rounded-t-[2rem] lg:h-[520px] lg:rounded-t-[34px]">
        <nav aria-label="Footer" className="absolute inset-x-0 top-0 z-20">
          <div className="flex justify-center px-4 pt-5 sm:pt-6 lg:pt-7">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2.5 text-base text-white/90 transition-colors hover:text-white"
            >
              <ArrowUp className="h-5 w-5 shrink-0" aria-hidden />
              <span>Back to top</span>
            </button>
          </div>

          <ul className="absolute inset-x-0 top-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 text-base text-white/90 sm:top-16 sm:gap-x-10 lg:top-[150px] lg:gap-x-11">
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              const display = getSocialDisplayText(link);
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    aria-label={`${link.label}: ${display}`}
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    <span>{display}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="absolute left-1/2 top-[52%] w-max max-w-[96%] -translate-x-1/2 select-none whitespace-nowrap text-center font-sans text-[clamp(2.75rem,12.5vw,14.5rem)] font-bold leading-none tracking-tight text-white/[0.95] [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] lg:top-[290px] lg:max-w-none lg:translate-y-[18%] lg:text-[length:min(220px,13.5vw)] lg:[mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]">
          Darren Tang
        </p>
      </div>
    </footer>
  );
}
