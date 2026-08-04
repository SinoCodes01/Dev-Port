import type { Project, Testimonial } from "@/data/projects";

type ProjectDetailProps = {
  project: Project;
  testimonials: Testimonial[];
};

export function ProjectDetail({
  project,
  testimonials,
}: ProjectDetailProps) {
  return (
    <div className="space-y-10">
      <section>
        <p className="text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-2">
          {project.period}
        </p>
        <p className="text-lg text-[var(--text-secondary)]">
          {project.description}
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-semibold display-heading">Case study</h3>
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
            Challenge
          </h4>
          <p className="text-[var(--text-secondary)]">{project.challenge}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
            Approach
          </h4>
          <p className="text-[var(--text-secondary)]">{project.approach}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-2">
            Outcome
          </h4>
          <p className="text-[var(--text-secondary)]">{project.outcome}</p>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold display-heading mb-4">Stack</h3>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {testimonials.length > 0 ? (
        <section>
          <h3 className="text-xl font-semibold display-heading mb-4">
            Testimonials
          </h3>
          <div className="space-y-4">
            {testimonials.map((quote) => (
              <blockquote key={quote.id} className="quote-card">
                <p className="text-[var(--text-primary)] mb-4 italic relative z-10">
                  {quote.text}
                </p>
                <footer className="text-sm font-medium text-[var(--text-primary)] relative z-10">
                  {quote.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
