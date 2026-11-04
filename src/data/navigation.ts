export interface NavItem {
  label: string;
  to: string;
  /** Open in a new tab when set. */
  external?: boolean;
}

/** Header links on case-study and 404 pages, back into the home page. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Education', to: '/#education' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
];

/** Shared max width for the header and case-study pages. */
export const SITE_CONTENT_MAX_CLASS = 'max-w-[58rem]';
