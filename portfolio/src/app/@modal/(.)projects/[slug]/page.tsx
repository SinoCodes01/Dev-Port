import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { ProjectModal } from "@/components/ProjectModal";
import {
  getProjectBySlug,
  getTestimonialsForProject,
} from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectTestimonials = getTestimonialsForProject(project.id);

  return (
    <ProjectModal title={project.title} liveUrl={project.url}>
      <ProjectDetail
        project={project}
        testimonials={projectTestimonials}
      />
    </ProjectModal>
  );
}
