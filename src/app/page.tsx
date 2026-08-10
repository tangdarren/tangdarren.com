import type { Metadata } from 'next';

import HomePage from '@/views/HomePage';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Home | Darren Christopher Tang',
  description:
    'Software engineer in San Francisco building reliable full-stack systems, backend services, automation, and intelligent applications.',
  path: '/',
});

export default function Page() {
  return <HomePage />;
}
