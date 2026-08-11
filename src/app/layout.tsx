import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import SiteShell from '@/components/layout/SiteShell';
import ThemeProvider from '@/components/theme/ThemeProvider';
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteUrl,
} from '@/config/site';

import '../index.css';

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
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Full-Stack & AI Agent Engineer`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [{ url: SITE_DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Full-Stack & AI Agent Engineer`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [SITE_DEFAULT_OG_IMAGE],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
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
