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
      within(intro).getByText((_, node) => {
        const text = node?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
        return node?.tagName === 'P' && /^Hi, I am$/i.test(text);
      }),
    ).toBeInTheDocument();
    expect(
      within(intro).getByRole('heading', {
        level: 1,
        name: /darren tang/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(intro).getByRole('link', { name: /linkedin profile/i }),
    ).toHaveAttribute('href', 'https://linkedin.com/in/tang-darren');
    expect(
      within(intro).getByRole('link', { name: /github profile/i }),
    ).toHaveAttribute('href', 'https://github.com/tangdarren');
    expect(
      within(intro).getByRole('link', { name: /email darren tang/i }),
    ).toHaveAttribute('href', 'mailto:tang.darren@gmail.com');

    const resume = within(intro).getByRole('link', { name: /^resume$/i });
    expect(resume).toHaveAttribute('href', RESUME_PDF_PATH);
    expect(resume).toHaveAttribute('target', '_blank');

    expect(
      within(intro).getByText('Software Engineer', { selector: 'p' }),
    ).toBeInTheDocument();
    expect(within(intro).getByText('San Francisco')).toBeInTheDocument();
    const portraits = within(intro).getAllByRole('img', {
      name: /professional headshot of darren tang/i,
    });
    expect(portraits.length).toBeGreaterThan(0);
    expect(portraits[0]).toHaveAttribute('src', '/images/darren-headshot.png');
    expect(
      document.querySelector('img[src="/easter-egg/sfbridge.png"]'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/based in san francisco/i),
    ).not.toBeInTheDocument();
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

  it('keeps home, experience, and projects under the same page gutter', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    // Primary nav lives in Layout's SiteHeader, not on the page itself.
    expect(
      screen.queryByRole('navigation', { name: 'Primary' }),
    ).not.toBeInTheDocument();

    const home = document.getElementById('home');
    const experience = document.getElementById('experience');
    const projects = document.getElementById('projects');
    expect(home).toBeTruthy();
    expect(experience).toBeTruthy();
    expect(projects).toBeTruthy();
    expect(document.getElementById('tech')).toBeTruthy();

    // Experience stays in a narrower reading column; Projects is wider.
    expect(experience?.parentElement).not.toBe(projects?.parentElement);
    // Both still sit under the same page gutter wrapper as Home.
    const gutter = home?.parentElement;
    const sections = experience?.parentElement?.parentElement;
    expect(sections).toBe(projects?.parentElement?.parentElement);
    expect(sections?.parentElement).toBe(gutter);
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
        'Building AI workflow tools for automation, including QC flagging, order summarization, and Salesforce-to-TRAF automation targeting 25–40% efficiency improvements.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('DataAnnotation · Contract')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Developed and evaluated containerized LLM workflows using Docker, Kubernetes, MCP tools, and A/B testing across 50+ model outputs.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sonic Engineering Inc. · Internship'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Built Java inventory automation for CNC operations through Azure DevOps CI/CD, reducing delayed reorders by 50%.',
      ),
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
    expect(
      screen.getByText(
        'Relevant coursework: Advanced Algorithms, Advanced Operating Systems, Data Mining, Object-Oriented Programming, Mobile App Development, Technology Entrepreneurship.',
      ),
    ).toBeVisible();
    expect(screen.getByText('University of Wisconsin–Madison')).toBeVisible();
    expect(
      screen.getByText('Bachelor of Science, Computer Science'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Lumen Scholarship Fund Scholar, $40,000 merit-based scholarship.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('AI Agent Development Intern'),
    ).not.toBeVisible();
  });

  it('toggles featured and all portfolio projects', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />, { initialPath: '/' });

    const featuredNames = [
      'Tempest',
      'SafeCall',
      'SQL Detective',
      'TensorDigits',
      'Arc GPT',
    ];
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

  it('renders curated tech cards with names only and a Technical skills heading', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(
      screen.getByRole('heading', { name: 'Technical skills' }),
    ).toBeInTheDocument();

    expect(HOMEPAGE_TECH.map((tech) => tech.name)).toEqual([
      'Python',
      'TypeScript',
      'PostgreSQL',
      'React',
      'Next.js',
      'Spring Boot',
      'Docker',
      'AWS',
    ]);

    for (const tech of HOMEPAGE_TECH) {
      expect(screen.getByText(tech.name)).toBeInTheDocument();
      expect(screen.queryByText(tech.description)).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: `${tech.name} — view related project`,
        }),
      ).toHaveAttribute('href', `/skills/${tech.id}`);
    }

    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('FastAPI')).not.toBeInTheDocument();
    expect(screen.queryByText('Java')).not.toBeInTheDocument();
    expect(screen.queryByText('Azure DevOps')).not.toBeInTheDocument();
    expect(screen.queryByText('Jv')).not.toBeInTheDocument();
    expect(screen.queryByText('Cursor')).not.toBeInTheDocument();
    expect(screen.queryByText('OpenAI')).not.toBeInTheDocument();
  });
});
