export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
];
