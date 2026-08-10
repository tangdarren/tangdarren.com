import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import HomePage from '@/views/HomePage';
import { HOMEPAGE_TECH } from '@/data/homepage';
import {
  SOCIAL_LINKS,
  getSocialDisplayText,
} from '@/data/socials';
import { renderWithProviders } from '@/test/render';

describe('HomePage', () => {
  it('renders a three-level intro with social, tech, experience, projects, and footer', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(
      screen.getByRole('heading', { level: 1, name: /hi, i'm darren/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Software Engineer', {
        selector: 'section[aria-label="Introduction"] p',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Based in San Francisco, I build full-stack applications and keep learning along the way./i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/full-stack products/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/responsive interfaces to APIs/i),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: /- find me at/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /- tech i know and use/i }),
    ).toBeInTheDocument();
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

  it('renders social links as icon + readable address in LinkedIn → GitHub → Email order', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(SOCIAL_LINKS.map((link) => link.label)).toEqual([
      'LinkedIn',
      'GitHub',
      'Email',
    ]);

    const findMeAt = screen.getByRole('heading', {
      name: /- find me at/i,
    }).closest('section');
    expect(findMeAt).toBeTruthy();

    for (const link of SOCIAL_LINKS) {
      const display = getSocialDisplayText(link);
      const match = within(findMeAt as HTMLElement).getByRole('link', {
        name: new RegExp(`${link.label}:\\s*${display}`, 'i'),
      });
      expect(match).toHaveAttribute('href', link.href);
      expect(match).toHaveTextContent(display);
    }

    expect(getSocialDisplayText(SOCIAL_LINKS[0])).toBe(
      'linkedin.com/in/tang-darren',
    );
    expect(getSocialDisplayText(SOCIAL_LINKS[1])).toBe('github.com/tangdarren');
    expect(getSocialDisplayText(SOCIAL_LINKS[2])).toBe(
      'tang.darren@gmail.com',
    );
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

    expect(screen.getByText('Tempest')).toBeInTheDocument();
    expect(screen.getByText('SafeCall')).toBeInTheDocument();
    expect(screen.getByText('SQL Detective')).toBeInTheDocument();
    expect(screen.queryByText('TensorDigits')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('TensorDigits')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Featured' }));
    expect(screen.queryByText('TensorDigits')).not.toBeInTheDocument();
  });

  it('renders curated tech cards with exact descriptions and no abbreviation marks', () => {
    renderWithProviders(<HomePage />, { initialPath: '/' });

    expect(HOMEPAGE_TECH.map((tech) => tech.name)).toEqual([
      'Java',
      'Python',
      'TypeScript',
      'PostgreSQL',
      'React',
      'Next.js',
      'Spring Boot',
      'Docker',
    ]);

    for (const tech of HOMEPAGE_TECH) {
      expect(screen.getByText(tech.name)).toBeInTheDocument();
      expect(screen.getByText(tech.description)).toBeInTheDocument();
    }

    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('FastAPI')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Azure DevOps')).not.toBeInTheDocument();
    expect(screen.queryByText('Jv')).not.toBeInTheDocument();
    expect(screen.queryByText('Cursor')).not.toBeInTheDocument();
    expect(screen.queryByText('OpenAI')).not.toBeInTheDocument();
  });
});
