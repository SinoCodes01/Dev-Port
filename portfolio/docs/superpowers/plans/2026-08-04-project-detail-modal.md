# Project Detail Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking a project card opens a case-study detail (modal on soft nav, full page on hard nav) with project-linked testimonials; remove the home-page testimonials section.

**Architecture:** Shared `src/data/projects.ts` feeds the home page and both detail surfaces. Soft navigation uses App Router parallel + intercepting routes (`@modal/(.)projects/[slug]`) to overlay a modal on the home page; hard navigation hits `projects/[slug]` as a full page. Both surfaces render the same `ProjectDetail` content component.

**Tech Stack:** Next.js 16.2.12 App Router, React 19, TypeScript, Tailwind CSS 4, existing CSS variables in `globals.css`

## Global Constraints

- Match existing dark portfolio tokens (`--bg-primary`, `--bg-secondary`, `--border-subtle`, `--accent`); no new visual system
- Live site CTA only on detail modal/page — not on home cards
- Omit testimonials section when a project has none
- Remove home Testimonials section, nav link, and hero secondary CTA
- No test runner configured — verify with `npm run build`, `npm run lint`, and manual checks listed per task
- Prefer path alias `@/*` → `./src/*`
- Working directory for all commands: `portfolio/` (repo root is parent `Dev-Port`)

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/data/projects.ts` | Projects + testimonials + lookup helpers |
| `src/components/ProjectDetail.tsx` | Shared case-study + testimonials + stack markup |
| `src/components/ProjectModal.tsx` | Client modal shell (backdrop, close, focus, Escape) |
| `src/app/projects/[slug]/page.tsx` | Full-page detail for hard navigation |
| `src/app/@modal/default.tsx` | Renders `null` when no modal is active |
| `src/app/@modal/(.)projects/[slug]/page.tsx` | Intercepted soft-nav modal route |
| `src/app/layout.tsx` | Render `{children}` + `{modal}` parallel slot |
| `src/app/page.tsx` | Import shared data; card links; strip testimonials |
| `src/app/globals.css` | Modal backdrop/panel utilities if needed |

---

### Task 1: Shared projects data module

**Files:**
- Create: `src/data/projects.ts`
- Modify: none yet (home still has inline data until Task 5)

**Interfaces:**
- Consumes: none
- Produces:
  - `export type Project = { id: number; slug: string; title: string; description: string; url: string; tech: string[]; period: string; challenge: string; approach: string; outcome: string }`
  - `export type Testimonial = { id: number; projectId: number; text: string; author: string; rating: number }`
  - `export const projects: Project[]`
  - `export const testimonials: Testimonial[]`
  - `export function getProjectBySlug(slug: string): Project | undefined`
  - `export function getTestimonialsForProject(projectId: number): Testimonial[]`

- [ ] **Step 1: Create `src/data/projects.ts`**

```ts
export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  url: string;
  tech: string[];
  period: string;
  challenge: string;
  approach: string;
  outcome: string;
};

export type Testimonial = {
  id: number;
  projectId: number;
  text: string;
  author: string;
  rating: number;
};

export const projects: Project[] = [
  {
    id: 1,
    slug: "advocatesiphones",
    title: "AdvocatesIphones",
    description:
      "E-commerce store for retail iPhone and Apple devices",
    url: "https://www.advocatesiphones.co.za/",
    tech: ["Next.js", "Supabase", "Tailwind CSS", "Typescript", "Vercel"],
    period: "2026",
    challenge:
      "The retailer needed a trustworthy online storefront for iPhones and Apple accessories — fast browsing, clear product detail, and a checkout flow customers would trust on mobile.",
    approach:
      "Built a Next.js storefront backed by Supabase for catalog and orders, with TypeScript end-to-end and Tailwind for a clean retail UI. Deployed on Vercel for fast global delivery.",
    outcome:
      "A live production store at advocatesiphones.co.za that supports browsing and purchasing Apple devices with a maintainable stack the business can grow on.",
  },
  {
    id: 2,
    slug: "cohort",
    title: "Cohort",
    description:
      "Centralised campus social media app, with institution isolation",
    url: "https://yourcohort.co.za",
    tech: [
      "Expo React Native",
      "Firebase Cloud Messaging",
      "Supabase",
      "Typescript",
    ],
    period: "In Construction",
    challenge:
      "Campus communities were fragmented across generic social apps with no reliable way to keep each institution’s feed, people, and notifications isolated.",
    approach:
      "Designing a native Expo app with Supabase-backed data and Firebase Cloud Messaging, enforcing institution-level isolation so students only see their campus graph.",
    outcome:
      "An in-progress campus social product at yourcohort.co.za aimed at safer, more relevant student connection within each institution.",
  },
  {
    id: 3,
    slug: "dev-portfolio",
    title: "Dev Portfolio",
    description:
      "Developer portfolio showcase platform with dynamic routing",
    url: "https://SinoCodes.vercel.app",
    tech: ["Next.js 16", "TypeScript", "Vercel"],
    period: "2024",
    challenge:
      "Needed a personal site that presents projects clearly and supports deep links to individual case studies without a CMS.",
    approach:
      "Built with Next.js App Router and TypeScript, using shared project data and dynamic routes so each project can have a shareable detail URL.",
    outcome:
      "A deployed portfolio at SinoCodes.vercel.app that doubles as a living showcase of the same patterns used in client work.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    projectId: 1,
    text: "Sinovuyo delivered a robust e-commerce solution that exceeded our expectations. His technical expertise and attention to detail were exceptional.",
    author: "Masakhe Mvunelo, CEO of AdvocatesIphones",
    rating: 5,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getTestimonialsForProject(
  projectId: number
): Testimonial[] {
  return testimonials.filter((t) => t.projectId === projectId);
}
```

- [ ] **Step 2: Verify TypeScript resolves the module**

Run from `portfolio/`:

```bash
npx tsc --noEmit --pretty false 2>&1 | Select-String "data/projects" 
```

Expected: no errors mentioning `src/data/projects.ts` (full project may still have unrelated issues; if `tsc` is not wired, skip to Step 3).

- [ ] **Step 3: Commit**

```bash
git add portfolio/src/data/projects.ts
git commit -m "Add shared projects and testimonials data module"
```

---

### Task 2: Shared `ProjectDetail` content component

**Files:**
- Create: `src/components/ProjectDetail.tsx`

**Interfaces:**
- Consumes: `Project`, `Testimonial` from `@/data/projects`
- Produces: `export function ProjectDetail({ project, testimonials }: { project: Project; testimonials: Testimonial[] }): JSX.Element`

- [ ] **Step 1: Create `src/components/ProjectDetail.tsx`**

Server-friendly presentational component (no `"use client"`):

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add portfolio/src/components/ProjectDetail.tsx
git commit -m "Add shared ProjectDetail case study component"
```

---

### Task 3: Full-page project route

**Files:**
- Create: `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProjectBySlug`, `getTestimonialsForProject`, `projects`, `ProjectDetail`
- Produces: route at `/projects/[slug]` with `generateStaticParams` and `notFound()` for unknown slugs

- [ ] **Step 1: Create `src/app/projects/[slug]/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify hard-nav page builds**

```bash
npm run build
```

Expected: build succeeds; routes include `/projects/advocatesiphones`, `/projects/cohort`, `/projects/dev-portfolio`.

- [ ] **Step 3: Manual check**

```bash
npm run dev
```

Open `http://localhost:3000/projects/advocatesiphones` — full page with case study + testimonial.  
Open `http://localhost:3000/projects/cohort` — case study, **no** testimonials block.  
Open `http://localhost:3000/projects/nope` — 404.

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/app/projects/[slug]/page.tsx
git commit -m "Add full-page project detail route"
```

---

### Task 4: Modal shell + intercepting parallel route

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/ProjectModal.tsx`
- Create: `src/app/@modal/default.tsx`
- Create: `src/app/@modal/(.)projects/[slug]/page.tsx`
- Modify: `src/app/globals.css` (modal animation utilities)

**Interfaces:**
- Consumes: `ProjectDetail`, `getProjectBySlug`, `getTestimonialsForProject`, `useRouter` from `next/navigation`
- Produces:
  - Layout prop `modal: React.ReactNode`
  - `ProjectModal({ title, liveUrl, children }: { title: string; liveUrl: string; children: React.ReactNode })`
  - Soft nav to `/projects/[slug]` opens modal over home

- [ ] **Step 1: Update root layout to accept the `@modal` slot**

In `src/app/layout.tsx`, change the component signature and body to:

```tsx
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {modal}
      </body>
    </html>
  );
}
```

Keep existing font and metadata imports unchanged.

- [ ] **Step 2: Create `src/app/@modal/default.tsx`**

```tsx
export default function Default() {
  return null;
}
```

- [ ] **Step 3: Create `src/components/ProjectModal.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type ProjectModalProps = {
  title: string;
  liveUrl: string;
  children: React.ReactNode;
};

export function ProjectModal({
  title,
  liveUrl,
  children,
}: ProjectModalProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function close() {
    router.back();
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      className="project-modal-root fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close project details"
        className="project-modal-backdrop absolute inset-0 bg-black/70 border-0 cursor-pointer"
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="project-modal-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-xl sm:rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] shadow-2xl"
      >
        <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--card-bg)] px-6 py-4 rounded-t-xl">
          <div className="min-w-0">
            <h2
              id="project-modal-title"
              className="text-2xl font-bold display-heading truncate"
            >
              {title}
            </h2>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
            >
              Visit live site
            </a>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="shrink-0 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
```

Note: `close` is stable enough for this effect; do not add `router` to the dependency array in a way that re-runs focus restore on every render. If the linter complains about `close`/exhaustive-deps, inline `router.back()` in the effect handlers instead of calling an outer `close`.

- [ ] **Step 4: Create intercepting modal page `src/app/@modal/(.)projects/[slug]/page.tsx`**

```tsx
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
```

- [ ] **Step 5: Add modal motion styles to `src/app/globals.css`**

Append:

```css
@keyframes modal-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-panel-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-modal-backdrop {
  animation: modal-backdrop-in 0.2s ease-out;
}

.project-modal-panel {
  animation: modal-panel-in 0.25s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .project-modal-backdrop,
  .project-modal-panel {
    animation: none;
  }
}
```

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: success. Soft-nav modal cannot be fully proven by build alone — covered in Task 5 manual check.

- [ ] **Step 7: Commit**

```bash
git add portfolio/src/app/layout.tsx portfolio/src/components/ProjectModal.tsx portfolio/src/app/@modal/default.tsx "portfolio/src/app/@modal/(.)projects/[slug]/page.tsx" portfolio/src/app/globals.css
git commit -m "Add intercepting project detail modal over home"
```

---

### Task 5: Wire home page cards and remove testimonials

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `projects` from `@/data/projects`, `Link` from `next/link`
- Produces: entire project card navigates to `/projects/[slug]`; no home testimonials UI

- [ ] **Step 1: Replace inline data and testimonials UI in `src/app/page.tsx`**

Concrete edits:

1. Add imports:

```tsx
import Link from "next/link";
import { projects } from "@/data/projects";
```

2. Delete the inline `projects` array, `quotes` array, and `truncateText` helper.

3. In the header `<nav>`, remove the Testimonials anchor; keep About and Projects:

```tsx
<nav className="hidden md:flex gap-8">
  <a href="#about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
    About
  </a>
  <a href="#projects" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
    Projects
  </a>
</nav>
```

4. In the hero CTA group, remove the Testimonials button; keep only View Projects:

```tsx
<div className="flex flex-col sm:flex-row gap-4">
  <a
    href="#projects"
    className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
  >
    View Projects
  </a>
</div>
```

5. Replace each project card so the **entire card** is a `Link` to `/projects/${project.slug}` — remove the external title link and the “View Project” button:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project, index) => (
    <Link
      key={project.id}
      href={`/projects/${project.slug}`}
      className="project-card animate-fade-in-up block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {project.title}
      </h3>
      <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>
      <div className="mb-4">
        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
          {project.period}
        </span>
      </div>
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
    </Link>
  ))}
</div>
```

6. Delete the entire `{/* Testimonials Section */}` block (`<section id="quotes" ...>` through its closing `</section>`).

- [ ] **Step 2: Lint and build**

```bash
npm run lint
npm run build
```

Expected: both succeed.

- [ ] **Step 3: Manual end-to-end check**

```bash
npm run dev
```

Checklist:

- [ ] Home has no Testimonials nav, hero CTA, or section
- [ ] Click AdvocatesIphones card → modal over home with case study + testimonial + “Visit live site”
- [ ] Close via X / backdrop / Escape → returns to home
- [ ] Click Cohort → modal, no testimonials section
- [ ] Refresh while modal URL is open → full page (not modal)
- [ ] Open `/projects/advocatesiphones` in a new tab → full page
- [ ] “Visit live site” opens the external URL

- [ ] **Step 4: Commit**

```bash
git add portfolio/src/app/page.tsx
git commit -m "Link project cards to detail modal and remove home testimonials"
```

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Shared data module with slug + case study + linked testimonials | Task 1 |
| Shared detail content (overview, case study, stack, conditional testimonials) | Task 2 |
| Full page hard nav + `notFound` + Back link + Visit live site | Task 3 |
| Intercepting modal, layout slot, default null, close behaviors, a11y | Task 4 |
| Home cards link to `/projects/[slug]`; remove home testimonials UI | Task 5 |
| Match existing visual tokens; reduced motion | Tasks 2–4 |
| Draft sample case studies for all three projects | Task 1 |

---

## Self-review notes

- No placeholders left; helpers and props named consistently (`getProjectBySlug`, `getTestimonialsForProject`, `ProjectDetail`, `ProjectModal`).
- Next.js 16 `params` typed as `Promise<{ slug: string }>` and awaited in pages.
- Verification uses build/lint/manual checks because the repo has no test runner (per AGENTS.md).
