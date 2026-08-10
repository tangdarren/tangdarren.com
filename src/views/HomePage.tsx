import ExperienceEducationSection from '@/components/home/ExperienceEducationSection';
import HomeIntroduction from '@/components/home/HomeIntroduction';
import ProjectsSection from '@/components/home/ProjectsSection';
import SignatureFooter from '@/components/home/SignatureFooter';
import SocialLinksSection from '@/components/home/SocialLinksSection';
import TechSection from '@/components/home/TechSection';
import { DesktopNav } from '@/components/layout/Navbar';
import { HorizontalSeparator } from '@/components/layout/Separator';

/** Shared content inset — matches Home, Experience, and Projects. */
const CONTENT_COLUMN =
  'min-w-0 w-full flex-1 px-[var(--gutter)] lg:pl-9 lg:pr-8 xl:pl-12';

function HomeProfile() {
  return (
    <div className="w-full">
      <HomeIntroduction />

      <div className="py-6">
        <HorizontalSeparator />
      </div>

      <SocialLinksSection />

      <div className="py-3" />

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
            <div className="w-full max-w-5xl">
              <HomeProfile />
            </div>
          </div>

          <div className="border-t border-ink-600 pt-12 sm:pt-14 lg:border-t-0 lg:pt-8">
            <div className="w-full max-w-5xl space-y-16 sm:space-y-20">
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
