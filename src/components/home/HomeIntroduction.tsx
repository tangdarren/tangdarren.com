import SocialBrandIcon, {
  type SocialBrandId,
} from '@/components/home/SocialBrandIcon';
import {
  SOCIAL_LINKS,
  getSocialDisplayText,
  type SocialLink,
} from '@/data/socials';

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

/** Intro order matches common portfolio pattern: LinkedIn → GitHub → Email. */
const INTRO_SOCIAL_ORDER = ['LinkedIn', 'GitHub', 'Email'] as const;

const introSocials = INTRO_SOCIAL_ORDER.flatMap((label) => {
  const link = SOCIAL_LINKS.find((item) => item.label === label);
  return link ? [link] : [];
});

export default function HomeIntroduction() {
  return (
    <section aria-label="Introduction">
      <div className="flex items-start justify-between gap-6 sm:gap-10">
        <div>
          <h1 className="text-base font-medium tracking-tight text-accent-cyan sm:text-lg">
            Hi, I&apos;m Darren
          </h1>
          <p className="mt-1 text-base font-normal text-mist-300 sm:text-lg">
            Software Engineer
          </p>
        </div>

        <ul className="flex shrink-0 flex-col gap-1 text-sm text-accent-cyan">
          {introSocials.map((link) => {
            const display = getSocialDisplayText(link);
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={`${link.label}: ${display}`}
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
                >
                  <SocialBrandIcon id={brandIdFor(link)} className="h-3.5 w-3.5" />
                  <span>{display}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-8 text-base font-normal text-mist-300 sm:mt-10 sm:text-lg lg:mt-12">
        Based in San Francisco, I build full-stack applications and keep
        learning along the way.
      </p>
    </section>
  );
}
