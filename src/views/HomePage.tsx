import ExperienceEducationSection from '@/components/home/ExperienceEducationSection';
import HomeIntroduction from '@/components/home/HomeIntroduction';
import ProjectsSection from '@/components/home/ProjectsSection';
import SignatureFooter from '@/components/home/SignatureFooter';
import TechSection from '@/components/home/TechSection';
import { DesktopNav } from '@/components/layout/Navbar';

/** Shared content inset — matches Home, Experience, and Projects. */
const CONTENT_COLUMN =
  'min-w-0 w-full flex-1 px-[var(--gutter)] lg:pl-9 lg:pr-8 xl:pl-12';

/** Midpoint between max-w-2xl (42rem) and max-w-3xl (48rem). */
const CONTENT_WIDTH = 'w-full max-w-[45rem]';

function HomeProfile() {
  return (
    <div className="w-full">
      <HomeIntroduction />

      <div className="py-6" />

      <TechSection />
    </div>
  );
}

/**
 * Desktop: fixed nav + divider, then one shared content column so Home,
 * Experience, and Projects share the same left edge and max width.
 */
export default function HomePage() {
  return (
    <>
      <div className="lg:flex lg:items-start">
        {/* Invisible rail slot + fixed nav/divider */}
        <DesktopNav />

        <div className={CONTENT_COLUMN}>
          <div
            id="home"
            className="scroll-mt-20 py-8 lg:flex lg:h-dvh lg:items-center lg:py-0"
          >
            <div className={CONTENT_WIDTH}>
              <HomeProfile />
            </div>
          </div>

          <div className="border-t border-ink-600 pt-12 sm:pt-14 lg:border-t-0 lg:pt-4">
            <div className={`${CONTENT_WIDTH} space-y-48 sm:space-y-64`}>
              <ExperienceEducationSection />
              <ProjectsSection />
            </div>
          </div>
        </div>
      </div>

      <SignatureFooter />
    </>
  );
}
