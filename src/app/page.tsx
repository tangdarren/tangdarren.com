import type { Metadata, Viewport } from 'next';

import HomePage from '@/views/HomePage';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Darren Tang Portfolio',
  description:
    'Software engineer in San Francisco building reliable full-stack systems, backend services, automation, and intelligent applications.',
  path: '/',
});

export const viewport: Viewport = {
  themeColor: '#17161f',
  colorScheme: 'dark',
};

export default function Page() {
  return <HomePage />;
}
