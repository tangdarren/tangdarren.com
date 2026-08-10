import SocialBrandIcon, {
  type SocialBrandId,
} from '@/components/home/SocialBrandIcon';
import {
  RESUME_PDF_PATH,
  SOCIAL_LINKS,
  getSocialDisplayText,
  type SocialLink,
} from '@/data/socials';

interface IntroLink {
  label: string;
  href: string;
  display: string;
  brand: SocialBrandId;
  external?: boolean;
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

/** Intro order matches common portfolio pattern: LinkedIn → GitHub → Email. */
const INTRO_SOCIAL_ORDER = ['LinkedIn', 'GitHub', 'Email'] as const;

const introLinks: IntroLink[] = [
  ...INTRO_SOCIAL_ORDER.flatMap((label) => {
    const link = SOCIAL_LINKS.find((item) => item.label === label);
    if (!link) return [];
    return [
      {
        label: link.label,
        href: link.href,
        display: getSocialDisplayText(link),
        brand: brandIdFor(link),
        external: link.external,
      },
    ];
  }),
  {
    label: 'Resume',
    href: RESUME_PDF_PATH,
    display: 'resume.pdf',
    brand: 'resume',
    external: true,
  },
];

export default function HomeIntroduction() {
  return (
    <section aria-label="Introduction">
      <div className="flex items-start justify-between gap-6 sm:gap-10">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-accent-cyan sm:text-xl">
            Hi, I&apos;m Darren
          </h1>
          <p className="mt-0.5 text-lg font-normal text-mist-300 sm:text-xl">
            Software Engineer
          </p>
        </div>

        <ul className="flex shrink-0 flex-col gap-0.5 pr-2.5 text-[13px] leading-snug text-accent-cyan">
          {introLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                aria-label={`${link.label}: ${link.display}`}
                className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
              >
                <SocialBrandIcon id={link.brand} className="h-3.5 w-3.5" />
                <span>{link.display}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 text-lg font-normal text-mist-300 sm:mt-6 sm:text-xl lg:mt-7">
        Based in San Francisco, I build Full Stack applications and learn along
        the way.
      </p>
    </section>
  );
}
