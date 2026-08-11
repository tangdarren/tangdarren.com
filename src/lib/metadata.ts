import type { Metadata } from 'next';

import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
} from '@/config/site';
import type { Project } from '@/data/projects';

export interface PageMetadataInput {
  /** Full document title (already includes the site name when needed). */
  title: string;
  description?: string;
  /** Site-relative path used for canonical + Open Graph URL. */
  path: string;
  /** Site-relative or absolute social preview image. */
  image?: string;
  /** When true, asks crawlers not to index the page (e.g. 404). */
  noindex?: boolean;
}

/** Build consistent Next.js Metadata for static and dynamic routes. */
export function createPageMetadata({
  title,
  description,
  path,
  image,
  noindex = false,
}: PageMetadataInput): Metadata {
  const finalDescription = description ?? SITE_DEFAULT_DESCRIPTION;
  const socialImage = image?.trim() ? image : SITE_DEFAULT_OG_IMAGE;

  return {
    title: {
      absolute: title,
    },
    description: finalDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description: finalDescription,
      url: path,
      images: [{ url: socialImage }],
    },
    ...(noindex ? { robots: 'noindex, nofollow' } : {}),
  };
}

/** Prefer project cover, then first screenshot, for social previews. */
export function getProjectShareImage(project: Project): string | undefined {
  return (
    project.image ??
    project.screenshots?.[0]?.src ??
    project.caseStudy?.screenshots?.[0]?.src
  );
}
