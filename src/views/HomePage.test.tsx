import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import HomePage from '@/views/HomePage';
import { HOMEPAGE_PROJECTS, HOMEPAGE_TECH } from '@/data/homepage';
import { RESUME_PDF_PATH } from '@/data/socials';
import { renderWithProviders } from '@/test/render';

describe('HomePage', () => {
  it('renders a three-level intro with tech, experience, projects, and footer', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    const intro = screen.getByRole('region', { name: 'Introduction' });
    expect(
      within(intro).getByRole('heading', { level: 1, name: /hi, i'm darren/i }),
    ).toBeInTheDocument();
    expect(
      within(intro).getByRole('link', {
        name: /linkedin: linkedin\.com\/in\/tang-darren/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(intro).getByRole('link', {
        name: /github: github\.com\/tangdarren/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(intro).getByRole('link', {
        name: /email: tang\.darren@gmail\.com/i,
      }),
    ).toBeInTheDocument();

    const resume = within(intro).getByRole('link', {
      name: /resume: resume\.pdf/i,
    });
    expect(resume).toHaveAttribute('href', RESUME_PDF_PATH);
    expect(resume).toHaveAttribute('target', '_blank');

    expect(
      within(intro).getByText('Software Engineer', { selector: 'p' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, node) => {
        const text = node?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        return (
          node?.tagName === 'P' &&
          /Based in San Francisco, I build Full Stack applications and learn along the way\./i.test(
            text,
          )
        );
      }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('img[src="/easter-egg/sfbridge.png"]'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/full-stack products/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/responsive interfaces to APIs/i),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: /- find me at/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: 'Darren Tang' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /- tech i know and use/i }),
    ).not.toBeInTheDocument();
    expect(document.getElementById('tech')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: /experience and education/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Projects' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Contact' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /Interested in working together\? Reach out and we can talk about what you're building\./i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back to top/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Darren Tang')).toBeInTheDocument();

    expect(document.getElementById('experience')).toBeTruthy();
    expect(document.getElementById('projects')).toBeTruthy();
    expect(document.getElementById('tech')).toBeTruthy();
    expect(document.getElementById('contact')).toBeTruthy();
  });

  it('uses a desktop flex composition with nav before the profile content', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(
      screen.getByRole('navigation', { name: 'Primary' }),
    ).toBeInTheDocument();
    expect(document.getElementById('tech')).toBeTruthy();
    expect(document.getElementById('projects')).toBeTruthy();
  });

  it('renders experience timeline and switches to education', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(
      screen.getByText('AI Agent Development Intern'),
    ).toBeInTheDocument();
    expect(screen.getByText('Veracyte, Inc. · Internship')).toBeInTheDocument();
    expect(screen.getByText('Jun 2026 – Present')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Built AI-powered workflow automation for internal operations.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('DataAnnotation · Contract')).toBeInTheDocument();
    expect(
      screen.getByText('Sonic Engineering Inc. · Internship'),
    ).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Education' })).toHaveAttribute(
      'aria-selected',
      'false',
    );

    await user.click(screen.getByRole('tab', { name: 'Education' }));

    expect(screen.getByRole('tab', { name: 'Education' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Santa Clara University')).toBeVisible();
    expect(
      screen.getByText('Master of Science, Computer Science and Engineering'),
    ).toBeVisible();
    expect(screen.getByText('Sep 2025 – Mar 2027')).toBeVisible();
    expect(screen.getByText('University of Wisconsin–Madison')).toBeVisible();
    expect(
      screen.getByText('Bachelor of Science, Computer Science'),
    ).toBeVisible();
    expect(screen.getByText('Lumen Scholarship recipient.')).toBeVisible();
    expect(
      screen.getByText('AI Agent Development Intern'),
    ).not.toBeVisible();
  });

  it('toggles featured and all portfolio projects', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />, { initialPath: '/' });

    const featuredNames = ['Tempest', 'SafeCall', 'SQL Detective', 'TensorDigits'];
    const allOnlyNames = [
      'ExpenSense',
      'MusicBloom',
      'GoDo',
      'SafeCall Web',
      'Water Reminder',
    ];
    const allNamesAlphabetical = [...HOMEPAGE_PROJECTS]
      .map((project) => project.name)
      .sort((a, b) => a.localeCompare(b));

    // Every project shows by default (All), alphabetically; Featured narrows the list.
    const projects = screen.getByRole('region', { name: 'Projects' });
    const list = within(projects).getByRole('list');
    expect(
      [...list.querySelectorAll('li p.font-display')].map((el) => el.textContent),
    ).toEqual(allNamesAlphabetical);

    await user.click(screen.getByRole('button', { name: 'Featured' }));
    for (const name of featuredNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    for (const name of allOnlyNames) {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(HOMEPAGE_PROJECTS.filter((project) => project.featured).map((p) => p.name)).toEqual(
      featuredNames,
    );
    expect(
      [...list.querySelectorAll('li p.font-display')].map((el) => el.textContent),
    ).toEqual(allNamesAlphabetical);

    expect(screen.getByRole('link', { name: 'Tempest on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/stock-market-dashboard',
    );
    expect(screen.getByRole('link', { name: 'SafeCall on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/safecall-vr',
    );
    expect(screen.getByRole('link', { name: 'SafeCall Web on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/safecall-website',
    );
    expect(screen.getByRole('link', { name: 'ExpenSense on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/expensense',
    );
    expect(screen.getByRole('link', { name: 'MusicBloom on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/musicbloom',
    );
    expect(screen.getByRole('link', { name: 'GoDo on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/godo-social-app',
    );
    expect(screen.getByRole('link', { name: 'Water Reminder on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/tangdarren/water-reminder-app',
    );
  });

  it('renders curated tech cards with exact descriptions and no abbreviation marks', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(HOMEPAGE_TECH.map((tech) => tech.name)).toEqual([
      'Python',
      'TypeScript',
      'PostgreSQL',
      'React',
      'Node.js',
      'Spring Boot',
      'Docker',
      'AWS',
    ]);

    for (const tech of HOMEPAGE_TECH) {
      expect(screen.getByText(tech.name)).toBeInTheDocument();
      expect(screen.getByText(tech.description)).toBeInTheDocument();
    }

    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('FastAPI')).not.toBeInTheDocument();
    expect(screen.queryByText('Java')).not.toBeInTheDocument();
    expect(screen.queryByText('Azure DevOps')).not.toBeInTheDocument();
    expect(screen.queryByText('Jv')).not.toBeInTheDocument();
    expect(screen.queryByText('Cursor')).not.toBeInTheDocument();
    expect(screen.queryByText('OpenAI')).not.toBeInTheDocument();
  });
});
