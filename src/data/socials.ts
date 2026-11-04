/** Contact links shown at the bottom of the home page. */

export interface SocialLink {
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/tangdarren' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tang-darren' },
  { label: 'Email', href: 'mailto:tang.darren@gmail.com' },
];

export const RESUME_PDF_PATH = '/resume/Darren_Tang_Resume.pdf';
