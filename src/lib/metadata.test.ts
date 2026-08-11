import { describe, expect, it } from 'vitest';

import {
  CANONICAL_SITE_URL,
  SITE_DEFAULT_OG_IMAGE,
  SITE_NAME,
  getSitemapPaths,
  resolveSiteUrl,
} from '@/config/site';
import { createPageMetadata, getProjectShareImage } from '@/lib/metadata';
import { PROJECTS, hasCaseStudy } from '@/data/projects';
import { toAbsoluteUrl } from '@/lib/url';

describe('resolveSiteUrl', () => {
  it('defaults to the canonical production origin (never localhost)', () => {
    expect(resolveSiteUrl(undefined)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(null)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('')).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('   ')).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('not-a-url')).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(undefined)).toBe('https://tangdarren.com');
    expect(resolveSiteUrl(undefined)).not.toMatch(/localhost|127\.0\.0\.1/i);
  });

  it('uses an explicit valid SITE_URL override and strips trailing slashes', () => {
    expect(resolveSiteUrl('https://example.com')).toBe('https://example.com');
    expect(resolveSiteUrl('https://example.com/')).toBe('https://example.com');
    expect(resolveSiteUrl('http://localhost:3000')).toBe(
      'http://localhost:3000',
    );
  });
});

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

  it('uses the homepage portfolio title and default Open Graph image', () => {
    const metadata = createPageMetadata({
      title: 'Darren Tang Portfolio',
      path: '/',
    });

    expect(metadata.title).toEqual({ absolute: 'Darren Tang Portfolio' });
    expect(metadata.openGraph?.title).toBe('Darren Tang Portfolio');
    expect(metadata.alternates?.canonical).toBe('/');
    expect(metadata.openGraph?.url).toBe('/');
    expect(metadata.openGraph?.images).toEqual([
      { url: SITE_DEFAULT_OG_IMAGE },
    ]);
    expect(metadata.twitter).toBeUndefined();
  });

  it('resolves homepage absolute social URLs to the canonical production origin', () => {
    const siteUrl = resolveSiteUrl(undefined);
    const metadata = createPageMetadata({
      title: 'Darren Tang Portfolio',
      path: '/',
    });

    const images = metadata.openGraph?.images;
    const imageList = Array.isArray(images) ? images : images ? [images] : [];
    const firstImage = imageList[0];
    const ogImagePath =
      typeof firstImage === 'string'
        ? firstImage
        : firstImage && typeof firstImage === 'object' && 'url' in firstImage
          ? String(firstImage.url)
          : '';

    const canonical = toAbsoluteUrl(
      siteUrl,
      String(metadata.alternates?.canonical ?? ''),
    );
    const ogUrl = toAbsoluteUrl(siteUrl, String(metadata.openGraph?.url ?? ''));
    const ogImage = toAbsoluteUrl(siteUrl, ogImagePath);

    expect(siteUrl).toBe('https://tangdarren.com');
    expect(canonical).toBe('https://tangdarren.com');
    expect(ogUrl).toBe('https://tangdarren.com');
    expect(ogImage).toBe('https://tangdarren.com/opengraph-image.png');

    for (const value of [siteUrl, canonical, ogUrl, ogImage]) {
      expect(value).not.toMatch(/localhost|127\.0\.0\.1/i);
      expect(value.startsWith('https://')).toBe(true);
    }
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

  it('builds sitemap homepage URL without localhost', () => {
    const siteUrl = resolveSiteUrl(undefined);
    expect(toAbsoluteUrl(siteUrl, '/')).toBe('https://tangdarren.com');
    expect(toAbsoluteUrl(siteUrl, '/sitemap.xml')).toBe(
      'https://tangdarren.com/sitemap.xml',
    );
  });
});
