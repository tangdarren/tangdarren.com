import Link from 'next/link';

import NotFoundCharacter from '@/components/not-found/NotFoundCharacter';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center py-8 lg:min-h-[60vh] lg:py-0">
      <div className="mx-auto w-full max-w-sm text-center sm:max-w-md">
        <p className="font-display text-4xl font-semibold tracking-tight text-mist-50 sm:text-5xl">
          404
        </p>
        <h1 className="mt-3 text-lg font-semibold tracking-tight text-mist-50 sm:text-xl">
          I think we might be lost.
        </h1>
        <p className="mt-2 text-sm text-mist-300 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block text-[13px] leading-snug text-[rgb(0,100,250)] transition-opacity hover:opacity-70 sm:text-sm"
        >
          ← Let&apos;s go home
        </Link>
        <div className="mt-8 flex justify-center sm:mt-10">
          <NotFoundCharacter />
        </div>
      </div>
    </div>
  );
}
