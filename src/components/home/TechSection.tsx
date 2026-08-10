import { HOMEPAGE_TECH } from '@/data/homepage';

import TechIcon from '@/components/home/TechIcon';

function TechCard({
  id,
  name,
  description,
}: {
  id: (typeof HOMEPAGE_TECH)[number]['id'];
  name: string;
  description: string;
}) {
  return (
    <li className="flex h-full w-full items-center border border-ink-600 bg-ink-900">
      <span
        aria-hidden
        className="m-2 flex shrink-0 items-center justify-center bg-ink-850 p-3 text-mist-300"
      >
        <TechIcon id={id} />
      </span>
      <div className="whitespace-nowrap py-2 pr-3.5 leading-tight">
        <p className="text-sm text-mist-50">{name}</p>
        <p className="text-xs font-extralight leading-tight text-mist-400">
          {description}
        </p>
      </div>
    </li>
  );
}

export default function TechSection() {
  return (
    <section id="tech" aria-labelledby="tech-heading" className="scroll-mt-20">
      <h2 id="tech-heading" className="text-sm font-normal text-mist-300">
        - Tech I know and use
      </h2>

      <ul className="mt-2 inline-grid max-w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:mb-0 lg:grid-cols-[repeat(4,1fr)]">
        {HOMEPAGE_TECH.map((tech) => (
          <TechCard key={tech.id} {...tech} />
        ))}
      </ul>
    </section>
  );
}
