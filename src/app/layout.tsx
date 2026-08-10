import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import SiteShell from '@/components/layout/SiteShell';
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSiteUrl,
} from '@/config/site';

import '../index.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
        <div id="root">
          <SiteShell>{children}</SiteShell>
        </div>
      </body>
    </html>
  );
}
