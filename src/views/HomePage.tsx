import ExperienceEducationSection from '@/components/home/ExperienceEducationSection';
import HomeIntroduction from '@/components/home/HomeIntroduction';
import ProjectsSection from '@/components/home/ProjectsSection';
import SignatureFooter from '@/components/home/SignatureFooter';
import TechSection from '@/components/home/TechSection';
import { SITE_CONTENT_MAX_CLASS } from '@/data/navigation';

/** Shared content inset — ~20–24px on mobile via --gutter. */
const CONTENT_COLUMN = 'min-w-0 max-w-full px-[var(--gutter)]';

/** Hero width — matches sticky header content. */
const HERO_WIDTH = `w-full ${SITE_CONTENT_MAX_CLASS}`;

/** Reading column for Experience / Projects. */
const SECTION_WIDTH = 'w-full max-w-[45rem] lg:w-[45rem]';

function HomeProfile() {
  return (
    <div className="w-full">
      <HomeIntroduction />

      {/* ~32–40px between intro and skills on mobile; tighter on desktop */}
      <div className="mt-8 sm:mt-9 lg:mt-6" />

      <TechSection />
    </div>
  );
}

/**
 * Mobile: natural flow under the sticky header (no forced hero height).
 * Desktop: pull under the header and vertically center in the viewport.
 */
export default function HomePage() {
  return (
    <>
      <div className={CONTENT_COLUMN}>
        <div
          id="home"
          className="home-scroll-target flex justify-center py-8 sm:py-10 lg:-mt-14 lg:min-h-dvh lg:items-center lg:py-0"
        >
          <div className={`${HERO_WIDTH} w-full lg:py-16`}>
            <HomeProfile />
          </div>
        </div>

        <div className="mt-10 flex justify-center border-t border-ink-600 pt-10 sm:mt-12 sm:pt-12 lg:mt-0 lg:border-t-0 lg:pt-8">
          <div className={`${SECTION_WIDTH} space-y-16 sm:space-y-24 lg:space-y-48 xl:space-y-64`}>
            <ExperienceEducationSection />
            <ProjectsSection />
          </div>
        </div>
      </div>

      <SignatureFooter />
    </>
  );
}
