import { describe, expect, it } from 'vitest';

import {
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSitemapPaths,
  resolveSiteUrl,
} from '@/config/site';
import { createPageMetadata, getProjectShareImage } from '@/lib/metadata';
import { PROJECTS, hasCaseStudy } from '@/data/projects';
import { toAbsoluteUrl } from '@/lib/url';

describe('createPageMetadata', () => {
  it('emits absolute canonical and social image URLs via metadataBase-relative paths', () => {
    const siteUrl = resolveSiteUrl(process.env.SITE_URL);
    const imagePath = '/projects/demo/cover.png';
    const metadata = createPageMetadata({
      title: 'Case Study | Darren Christopher Tang',
      description: 'A focused project summary.',
      path: '/projects/demo',
      image: imagePath,
    });

    expect(metadata.alternates?.canonical).toBe('/projects/demo');
    expect(metadata.openGraph?.url).toBe('/projects/demo');
    expect(metadata.openGraph?.images).toEqual([{ url: imagePath }]);
    expect(metadata.openGraph?.siteName).toBe(SITE_NAME);
    expect(metadata.twitter).toBeUndefined();

    // Relative paths resolve against the configured site origin at runtime.
    expect(toAbsoluteUrl(siteUrl, '/projects/demo')).toBe(
      `${siteUrl}/projects/demo`,
    );
    expect(toAbsoluteUrl(siteUrl, imagePath)).toBe(`${siteUrl}${imagePath}`);
  });

  it('falls back to the default social preview image', () => {
    const metadata = createPageMetadata({
      title: 'Home | Darren Christopher Tang',
      path: '/',
    });

    expect(metadata.openGraph?.images).toEqual([
      { url: SITE_DEFAULT_OG_IMAGE },
    ]);
    expect(metadata.twitter).toBeUndefined();
  });

  it('marks pages as noindex when requested', () => {
    const metadata = createPageMetadata({
      title: '404',
      description: 'Missing',
      path: '/404',
      noindex: true,
    });

    expect(metadata.robots).toBe('noindex, nofollow');
  });
});

describe('project share images and sitemap paths', () => {
  it('prefers project image then screenshots for social previews', () => {
    const withImage = PROJECTS.find((project) => project.image);
    if (withImage) {
      expect(getProjectShareImage(withImage)).toBe(withImage.image);
    }

    const withScreenshot = PROJECTS.find(
      (project) =>
        !project.image &&
        (project.screenshots?.[0]?.src ||
          project.caseStudy?.screenshots?.[0]?.src),
    );
    if (withScreenshot) {
      expect(getProjectShareImage(withScreenshot)).toBe(
        withScreenshot.screenshots?.[0]?.src ??
          withScreenshot.caseStudy?.screenshots?.[0]?.src,
      );
    }
  });

  it('includes static routes and case-study paths in the sitemap', () => {
    const paths = getSitemapPaths();
    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/about',
        '/projects',
        '/resume',
        '/contact',
      ]),
    );

    for (const project of PROJECTS.filter(hasCaseStudy)) {
      expect(paths).toContain(`/projects/${project.id}`);
    }
  });
});
