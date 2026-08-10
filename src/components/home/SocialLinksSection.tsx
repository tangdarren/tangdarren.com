import {
  SOCIAL_LINKS,
  getSocialDisplayText,
} from '@/data/socials';

export default function SocialLinksSection() {
  return (
    <section aria-labelledby="social-links-heading">
      <h2
        id="social-links-heading"
        className="text-sm font-normal text-mist-300"
      >
        - Find me at
      </h2>

      <ul className="mt-2 flex flex-col gap-2">
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
                className="inline-flex items-center gap-2.5 text-sm text-mist-200 transition-colors hover:text-accent-cyan"
              >
                <Icon className="h-4 w-4 shrink-0 text-mist-300" aria-hidden />
                <span>{display}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
