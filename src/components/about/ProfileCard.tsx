import { Briefcase, GraduationCap, MapPin } from 'lucide-react';

const HEADSHOT_SRC = '/images/darren-headshot.png';
const HEADSHOT_ALT =
  'Professional headshot of Darren Tang smiling, wearing a black suit and tie against a blurred modern building background.';

export default function ProfileCard() {
  return (
    <div className="panel grid gap-6 p-6 md:grid-cols-[220px_minmax(0,1fr)] md:p-8">
      <div className="mx-auto md:mx-0">
        <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-ink-600 bg-brand-50 md:h-52 md:w-52">
          <img
            src={HEADSHOT_SRC}
            alt={HEADSHOT_ALT}
            width={208}
            height={208}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">
            Darren Christopher Tang
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-cyan sm:tracking-[0.22em]">
            Software Engineer · AI Agent Engineer · Full-Stack Engineer
          </p>
        </div>

        <p className="text-sm leading-relaxed text-mist-200 sm:text-base">
          I'm a software engineer focused on building reliable full-stack
          products, AI-powered tools, and workflow automation systems. I am
          pursuing a Master of Science in Computer Science and Engineering at
          Santa Clara University (expected June 2027) after earning my Bachelor
          of Science in Computer Science from the University of
          Wisconsin–Madison.
        </p>

        <p className="text-sm leading-relaxed text-mist-300 sm:text-base">
          I enjoy turning complex requirements into practical software that
          improves real workflows. My interests include full-stack engineering,
          AI agents, applied AI, automation, and data-driven applications.
        </p>

        <div className="mt-1 flex flex-wrap gap-2">
          <span className="tag">
            <GraduationCap className="mr-1.5 h-3 w-3 text-accent-cyan" />
            MS CSE · Santa Clara
          </span>
          <span className="tag">
            <GraduationCap className="mr-1.5 h-3 w-3 text-accent-cyan" />
            BS CS · UW–Madison
          </span>
          <span className="tag">
            <Briefcase className="mr-1.5 h-3 w-3 text-accent-cyan" />
            Currently at Veracyte
          </span>
          <span className="tag">
            <MapPin className="mr-1.5 h-3 w-3 text-accent-cyan" />
            San Francisco, CA
          </span>
        </div>
      </div>
    </div>
  );
}
