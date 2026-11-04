/** @type {import('next').NextConfig} */
const nextConfig = {
  // Native Next.js deployment on Vercel (no static-export SPA shim).
  images: {
    unoptimized: true,
  },
  trailingSlash: false,

  // The site used to have separate pages. They now live on the home page,
  // so old links (search results, shared URLs) land in the right section.
  async redirects() {
    return [
      { source: '/about', destination: '/#education', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/resume', destination: '/resume/Darren_Tang_Resume.pdf', permanent: true },
      { source: '/projects', destination: '/#projects', permanent: true },
      { source: '/skills/:skill', destination: '/#projects', permanent: true },
    ];
  },
};

export default nextConfig;
