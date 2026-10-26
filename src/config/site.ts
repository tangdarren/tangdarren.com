/** Shared site metadata for SEO, Open Graph, and sitemap generation. */

import { HOMEPAGE_TECH } from '@/data/homepage';
import { PROJECTS, hasCaseStudy } from '@/data/projects';
import { isValidHttpUrl } from '@/lib/url';

export const SITE_NAME = 'Darren Christopher Tang';

export const SITE_DEFAULT_DESCRIPTION =
  'Portfolio of Darren Christopher Tang — a full-stack and AI agent engineer building practical applications, automation systems, and financial tools.';

/** Default social-preview image (App Router opengraph-image file convention). */
export const SITE_DEFAULT_OG_IMAGE = '/opengraph-image.png';

/**
 * Canonical public origin used for metadata when `SITE_URL` is unset or invalid.
 * Production must never fall back to localhost.
 */
export const CANONICAL_SITE_URL = 'https://tangdarren.com';

/** Static app routes included in the sitemap (excluding the 404 catch-all). */
export const SITE_STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/resume',
  '/contact',
] as const;

/**
 * Public site origin for canonical URLs, Open Graph, robots.txt, and sitemap.xml.
 * Prefers an explicit valid `SITE_URL`, otherwise the canonical production origin.
 */
export function getSiteUrl(): string {
  return resolveSiteUrl(process.env.SITE_URL);
}

/**
 * Normalize a configured origin.
 * Invalid / empty values fall back to {@link CANONICAL_SITE_URL} (never localhost).
 */
export function resolveSiteUrl(envValue?: string | null): string {
  const trimmed = envValue?.trim();
  if (!trimmed || !isValidHttpUrl(trimmed)) {
    return CANONICAL_SITE_URL;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return CANONICAL_SITE_URL;
  }
}

/** All indexable paths: static routes, skill project pages, and case studies. */
export function getSitemapPaths(): string[] {
  const skillPaths = HOMEPAGE_TECH.map((tech) => `/skills/${tech.id}`);
  const caseStudyPaths = PROJECTS.filter(hasCaseStudy).map(
    (project) => `/projects/${project.id}`,
  );
  return [...SITE_STATIC_ROUTES, ...skillPaths, ...caseStudyPaths];
}
