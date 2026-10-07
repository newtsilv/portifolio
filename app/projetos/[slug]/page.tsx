import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectStage from "../../../components/projects/ProjectStage";
import { projects } from "../../../data/portfolio";

type ProjectPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((item) => item.id === params.slug);
  return project
    ? {
        title: `${project.title} · Newt OS`,
        description: project.shortDescription,
      }
    : {};
}

/** Projeto aberto como programa em tela cheia (aberto pela pasta Projetos). */
export default function ProjectPage({ params }: ProjectPageProps) {
  const index = projects.findIndex((item) => item.id === params.slug);
  const project = projects[index];
  if (!project) notFound();

  const total = projects.length;
  const prev = total > 1 ? projects[(index - 1 + total) % total] : undefined;
  const next = total > 1 ? projects[(index + 1) % total] : undefined;

  return (
    <ProjectStage
      project={project}
      position={index + 1}
      total={total}
      prev={prev !== next ? prev : undefined}
      next={next}
    />
  );
}
