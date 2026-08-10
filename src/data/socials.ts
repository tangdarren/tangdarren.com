import type { LucideIcon } from 'lucide-react';
import { Github, Linkedin, Mail } from 'lucide-react';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
  handle: string;
  external?: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/tang-darren',
    icon: Linkedin,
    handle: 'tang-darren',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/tangdarren',
    icon: Github,
    handle: 'tangdarren',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:tang.darren@gmail.com',
    icon: Mail,
    handle: 'tang.darren@gmail.com',
  },
];

export const RESUME_PDF_PATH = '/resume/Darren_Tang_Resume.pdf';

/** Readable address for display (no protocol / www). */
export function getSocialDisplayText(link: SocialLink): string {
  if (link.href.startsWith('mailto:')) {
    return link.handle;
  }

  try {
    const url = new URL(link.href);
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/$/, '');
    return `${host}${path}`;
  } catch {
    return link.handle;
  }
}
