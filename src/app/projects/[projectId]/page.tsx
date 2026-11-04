import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  PROJECTS,
  getProjectById,
  hasCaseStudy,
} from '@/data/projects';
import ProjectCaseStudyPage from '@/views/ProjectCaseStudyPage';
import { createPageMetadata, getProjectShareImage } from '@/lib/metadata';

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export function generateStaticParams() {
  return PROJECTS.filter(hasCaseStudy).map((project) => ({
    projectId: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project || !hasCaseStudy(project)) {
    return createPageMetadata({
      title: '404 · Not Found | Darren Christopher Tang',
      description: "The page you're looking for doesn't exist.",
      path: `/projects/${projectId}`,
      noindex: true,
    });
  }

  return createPageMetadata({
    title: `${project.name} | Darren Christopher Tang`,
    description: project.summary,
    path: `/projects/${project.id}`,
    image: getProjectShareImage(project),
  });
}

export default async function Page({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project || !hasCaseStudy(project)) {
    notFound();
  }

  return <ProjectCaseStudyPage project={project} />;
}
