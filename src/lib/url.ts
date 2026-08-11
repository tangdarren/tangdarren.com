/** Returns true when the value is an absolute http(s) URL. */
export function isValidHttpUrl(value?: string): value is string {
  if (!value?.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Resolve a site-relative or absolute path to an absolute URL. */
export function toAbsoluteUrl(origin: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = origin.replace(/\/$/, '');
  if (!path || path === '/') return base;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
