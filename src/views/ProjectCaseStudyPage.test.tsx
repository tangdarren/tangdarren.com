import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  PROJECTS,
  getProjectById,
  PROJECTS_LIST_PATH,
  hasCaseStudy,
} from '@/data/projects';
import ProjectCaseStudyPage from '@/views/ProjectCaseStudyPage';
import { renderWithProviders } from '@/test/render';

describe('Project case studies', () => {
  it('renders a valid case study that links back to the home project list', async () => {
    const project = PROJECTS.find(hasCaseStudy);
    expect(project).toBeDefined();
    if (!project) return;

    renderWithProviders(<ProjectCaseStudyPage project={project} />, {
      initialPath: `/projects/${project.id}`,
    });

    expect(
      await screen.findByRole('heading', { level: 1, name: project.name }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /back to projects/i }),
    ).toHaveAttribute('href', PROJECTS_LIST_PATH);

    expect(
      screen.getByRole('link', { name: /^projects$/i }),
    ).toHaveAttribute('href', PROJECTS_LIST_PATH);
  });

  it('treats unknown project IDs as invalid case studies', () => {
    expect(getProjectById('not-a-real-project')).toBeUndefined();
    expect(
      PROJECTS.some(
        (project) => project.id === 'not-a-real-project' && hasCaseStudy(project),
      ),
    ).toBe(false);
  });

  it('only exposes case-study routes for projects that have case studies', () => {
    const caseStudyIds = PROJECTS.filter(hasCaseStudy).map((project) => project.id);
    expect(caseStudyIds.length).toBeGreaterThan(0);
    expect(caseStudyIds).toEqual(
      expect.arrayContaining([
        'spy-market-intelligence',
        'expensense',
        'sql-detective',
        'musicbloom',
        'vr-first-responder-training',
      ]),
    );
  });
});
