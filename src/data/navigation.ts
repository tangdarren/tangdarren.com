export interface NavItem {
  label: string;
  to: string;
  /** Open in a new tab when set. */
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
];

/** Shared max width so the sticky header lines up with the homepage hero. */
export const SITE_CONTENT_MAX_CLASS = 'max-w-[58rem]';
