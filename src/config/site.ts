/** Shared site metadata for SEO, Open Graph, and sitemap generation. */

import { PROJECTS, hasCaseStudy } from '@/data/projects';

export const SITE_NAME = 'Darren Christopher Tang';

export const SITE_DEFAULT_DESCRIPTION =
  'Portfolio of Darren Christopher Tang — a full-stack and AI agent engineer building practical applications, automation systems, and financial tools.';

/** Default social-preview image (App Router opengraph-image file convention). */
export const SITE_DEFAULT_OG_IMAGE = '/opengraph-image.png';

/** Static app routes included in the sitemap (excluding the 404 catch-all). */
export const SITE_STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/resume',
  '/contact',
] as const;

const LOCAL_DEV_ORIGIN = 'http://localhost:3000';

/**
 * Public site origin for canonical URLs, Open Graph, robots.txt, and sitemap.xml.
 * Set via the server-only `SITE_URL` environment variable.
 */
export function getSiteUrl(): string {
  return resolveSiteUrl(process.env.SITE_URL);
}

/** Normalize a configured origin, falling back to the local Next.js URL. */
export function resolveSiteUrl(envValue?: string | null): string {
  const trimmed = envValue?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;
  return LOCAL_DEV_ORIGIN;
}

/** All indexable paths: static routes plus project case-study pages. */
export function getSitemapPaths(): string[] {
  const caseStudyPaths = PROJECTS.filter(hasCaseStudy).map(
    (project) => `/projects/${project.id}`,
  );
  return [...SITE_STATIC_ROUTES, ...caseStudyPaths];
}
