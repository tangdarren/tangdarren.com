declare namespace NodeJS {
  interface ProcessEnv {
    /** Server-only public site origin for metadata, robots.txt, and sitemap.xml. */
    SITE_URL?: string;
  }
}
