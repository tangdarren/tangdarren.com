import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  HOMEPAGE_TECH,
  getHomepageProjectById,
  getHomepageTechById,
} from '@/data/homepage';
import { createPageMetadata } from '@/lib/metadata';
import SkillProjectPage from '@/views/SkillProjectPage';

type SkillPageProps = {
  params: Promise<{ skillId: string }>;
};

export function generateStaticParams() {
  return HOMEPAGE_TECH.map((tech) => ({
    skillId: tech.id,
  }));
}

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { skillId } = await params;
  const tech = getHomepageTechById(skillId);
  const project = tech
    ? getHomepageProjectById(tech.projectId)
    : undefined;

  if (!tech || !project) {
    return createPageMetadata({
      title: '404 · Not Found | Darren Christopher Tang',
      description: "The page you're looking for doesn't exist.",
      path: `/skills/${skillId}`,
      noindex: true,
    });
  }

  return createPageMetadata({
    title: `${tech.name} · ${project.name} | Darren Christopher Tang`,
    description: `${tech.name} project highlight: ${project.name}. ${project.description}`,
    path: `/skills/${tech.id}`,
  });
}

export default async function Page({ params }: SkillPageProps) {
  const { skillId } = await params;
  const tech = getHomepageTechById(skillId);
  const project = tech
    ? getHomepageProjectById(tech.projectId)
    : undefined;

  if (!tech || !project) {
    notFound();
  }

  return <SkillProjectPage tech={tech} project={project} />;
}
