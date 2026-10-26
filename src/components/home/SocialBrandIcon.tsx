/**
 * Official brand marks (Simple Icons) for intro social links, plus a matching
 * filled document glyph for the resume (which has no brand mark).
 *
 * All icons share a 24×24 viewBox and render into the same square so button
 * rows stay optically aligned. Pass `monochrome` to inherit the parent text
 * color (e.g. footer on blue) instead of brand fills.
 */
export type SocialBrandId = 'github' | 'linkedin' | 'gmail' | 'resume';

/** Official Simple Icons brand hex (resume uses accent blue). */
const BRAND_FILL: Record<Exclude<SocialBrandId, 'github'>, string> = {
  linkedin: '#0A66C2',
  gmail: '#EA4335',
  resume: '#2563EB',
};

export default function SocialBrandIcon({
  id,
  className = 'h-4 w-4',
  monochrome = false,
}: {
  id: SocialBrandId;
  className?: string;
  /** When true, fill inherits `currentColor` instead of brand colors. */
  monochrome?: boolean;
}) {
  const baseClass = ['block shrink-0', className].filter(Boolean).join(' ');
  const shared = {
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    focusable: false as const,
  };

  const brandedGithubClass = monochrome
    ? baseClass
    : `${baseClass} text-[#181717] dark:text-neutral-100`;
  const fillFor = (brand: Exclude<SocialBrandId, 'github'>) =>
    monochrome ? 'currentColor' : BRAND_FILL[brand];

  switch (id) {
    case 'github':
      return (
        <svg
          {...shared}
          className={brandedGithubClass}
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...shared} className={baseClass} fill={fillFor('linkedin')}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'gmail':
      return (
        <svg {...shared} className={baseClass} fill={fillFor('gmail')}>
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
        </svg>
      );
    case 'resume':
      return (
        <svg
          {...shared}
          className={baseClass}
          fill={fillFor('resume')}
          fillRule="evenodd"
          clipRule="evenodd"
        >
          <path d="M7 3.5A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V9h-4A1.5 1.5 0 0 1 13 7.5v-4H7Zm1.25 5.25h3.5v1.25h-3.5V8.75Zm0 3h7.5v1.25h-7.5V11.75Zm0 3h7.5v1.25h-7.5V14.75Zm0 3h5.25v1.25H8.25V17.75Z" />
          <path d="M14.25 3.85 19.15 8.75h-3.4A1.5 1.5 0 0 1 14.25 7.25V3.85Z" />
        </svg>
      );
    default:
      return null;
  }
}
