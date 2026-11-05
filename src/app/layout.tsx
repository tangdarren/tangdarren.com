import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import SiteShell from '@/components/layout/SiteShell';
import ThemeProvider from '@/components/theme/ThemeProvider';
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
  getSiteUrl,
} from '@/config/site';

import './globals.css';

// No `weight` list — loads the variable font so in-between weights (e.g. 550) work.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Full-Stack & AI Agent Engineer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '256x256' }],
  },
  openGraph: {
    type: 'website',
    title: `${SITE_NAME} — Full-Stack & AI Agent Engineer`,
    description: SITE_DEFAULT_DESCRIPTION,
    url: '/',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
};

/**
 * A refresh always starts at the top, so the intro plays where it belongs. Runs
 * before first paint: an effect would be too late to stop the browser restoring
 * the old position. The hash goes too, or a refreshed `/#education` would jump
 * back to that section. Links that arrive with a hash still land on it.
 */
const RESET_SCROLL_ON_REFRESH = `
history.scrollRestoration = 'manual';
if (performance.getEntriesByType('navigation')[0]?.type === 'reload' && location.hash) {
  history.replaceState(history.state, '', location.pathname + location.search);
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: RESET_SCROLL_ON_REFRESH }} />
      </head>
      <body className={`${dmSans.className} antialiased`}>
        <ThemeProvider>
          <div id="root">
            <SiteShell>{children}</SiteShell>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
