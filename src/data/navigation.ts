import { RESUME_PDF_PATH } from '@/data/socials';

export interface NavItem {
  label: string;
  to: string;
  /** Open in a new tab (e.g. resume PDF). */
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Resume', to: RESUME_PDF_PATH, external: true },
];
