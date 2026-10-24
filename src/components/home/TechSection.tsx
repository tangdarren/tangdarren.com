import { HOMEPAGE_TECH } from '@/data/homepage';

import TechIcon from '@/components/home/TechIcon';

function TechCard({
  id,
  name,
}: {
  id: (typeof HOMEPAGE_TECH)[number]['id'];
  name: string;
}) {
  return (
    <li className="flex min-w-0 w-full items-center rounded-md border border-ink-600 bg-[#fafafa] py-3 pl-6 pr-3 dark:bg-ink-900">
      <span
        aria-hidden
        className="mr-3.5 flex h-5 w-5 shrink-0 items-center justify-center text-[#64748B] dark:text-slate-400 [&_svg]:h-full [&_svg]:w-full"
      >
        <TechIcon id={id} />
      </span>
      <p className="home-skill-name min-w-0 leading-snug">{name}</p>
    </li>
  );
}

export default function TechSection() {
  return (
    <section
      id="tech"
      aria-labelledby="technical-skills-heading"
      className="home-scroll-target"
    >
      <h2
        id="technical-skills-heading"
        className="home-section-title mb-4 font-medium"
      >
        Technical skills
      </h2>
      <ul className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
        {HOMEPAGE_TECH.map((tech) => (
          <TechCard key={tech.id} id={tech.id} name={tech.name} />
        ))}
      </ul>
    </section>
  );
}
