# tangdarren.com

My personal website and portfolio, built with Next.js, React, TypeScript, and Tailwind CSS. A little about me, my work, and a few easter eggs.

**[Visit the site](https://tangdarren.com/)**

## Run locally

Use Node.js 24 (the same version as CI).

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

No credentials are needed. For optional settings, copy `.env.example` to `.env`. Leave the contact endpoint blank to use email, and keep private keys out of `NEXT_PUBLIC_` variables—they are visible in the browser. Local env files are ignored.

## Working on the site

- `src/app/` — routes, metadata, and global styles
- `src/views/` and `src/components/` — pages and reusable UI
- `src/data/` — portfolio content
- `public/` — images and resume; everything here is public
- [Homepage history](docs/images/) — screenshots of earlier versions

Before pushing, run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. To preview a production build, run `npm start` afterward.
