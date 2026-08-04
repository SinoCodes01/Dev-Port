import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import {
  getProjectBySlug,
  getTestimonialsForProject,
  projects,
} from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — SinoCodes`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectTestimonials = getTestimonialsForProject(project.id);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/#projects"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Back to projects
        </Link>

        <header className="mt-8 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-bold display-heading">{project.title}</h1>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)] transition-colors"
          >
            Visit live site
          </a>
        </header>

        <ProjectDetail
          project={project}
          testimonials={projectTestimonials}
        />
      </div>
    </div>
  );
}
