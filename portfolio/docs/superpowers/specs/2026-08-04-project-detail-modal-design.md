# Project Detail Modal — Design Spec

**Date:** 2026-08-04  
**Status:** Approved for planning  
**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4

## Goal

When a project card on the home page is pressed, open a project detail experience that presents a case-study description and any testimonials for that project. Soft navigation shows this as a modal over the home page; direct URLs and refreshes show a full page with the same content.

## Decisions

| Decision | Choice |
| --- | --- |
| Card click | Opens project detail (not the live site) |
| Live site link | Only on the detail modal/page (“Visit live site”) |
| Case study copy | Draft realistic sample content from existing project context |
| Empty testimonials | Omit the testimonials section entirely |
| Home testimonials | Remove the home-page Testimonials section, nav link, and hero CTA |
| Architecture | Shared data module + dynamic `[slug]` route + intercepting modal |

## Architecture

### Data

Create `src/data/projects.ts` as the single source of truth:

- **Projects:** `id`, `slug`, `title`, `description`, `url`, `tech[]`, `period`, and case-study fields (`challenge`, `approach`, `outcome`)
- **Testimonials:** `id`, `projectId`, `text`, `author`, `rating`
- Helpers: `getProjectBySlug(slug)`, `getTestimonialsForProject(projectId)`

Home page and project routes both import from this module. No duplicated sample arrays on the home page.

### Routing

| Scenario | Behavior |
| --- | --- |
| Soft navigation from home card | Intercepting route opens modal over home at `/projects/[slug]` |
| Direct visit / refresh / shared link | Full page at `/projects/[slug]` with same content |
| Close modal (X, backdrop, Escape) | Navigate back to `/` |
| Unknown slug | `notFound()` |

**Route shape (App Router parallel + intercepting routes):**

- `src/app/@modal/(.)projects/[slug]/page.tsx` — modal UI for soft nav
- `src/app/projects/[slug]/page.tsx` — full page for hard nav
- `src/app/@modal/default.tsx` — `null` when no modal is active
- Root `layout.tsx` renders `{children}` and `{modal}` (or equivalent slot name)

Shared presentation lives in a reusable component (e.g. `ProjectDetail`) used by both the modal and the full page so content stays in sync.

### Home page changes

- Project cards become links to `/projects/[slug]` (entire card clickable)
- Remove `#quotes` Testimonials section
- Remove Testimonials from header nav
- Remove Testimonials from hero secondary CTA (keep primary “View Projects”)

## UI / Layout

### Visual language

Match the existing portfolio: dark tokens (`--bg-primary`, `--bg-secondary`, `--border-subtle`, blue `--accent`). No new visual system. Modal panel should feel like an elevated project/quote card, not a separate brand.

### Modal shell

- Dimmed backdrop over the home page
- Centered panel with sticky header: project title + close control
- Scrollable body
- Primary CTA: “Visit live site” (external, `rel="noopener noreferrer"`) in header or directly under the title
- Close via X, backdrop click, and Escape

### Content order (modal and full page)

1. **Overview** — short pitch (from / expanded card description)
2. **Case study** — Challenge → Approach → Outcome
3. **Stack** — existing tech tags
4. **Testimonials** — only if the project has any; show full quote text (not truncated); omit section when empty

### Full page differences

Same sections and copy as the modal. Use a normal page layout with a “Back to projects” link instead of close/backdrop.

### Sample content plan

| Project | Slug | Testimonials |
| --- | --- | --- |
| AdvocatesIphones | `advocatesiphones` | Existing CEO quote, linked via `projectId` |
| Cohort | `cohort` | None — section omitted |
| Dev Portfolio | `dev-portfolio` | None — section omitted |

Case study copy is drafted for all three from current descriptions and known product context; editable later in the data module.

## Motion & accessibility

- Backdrop fade and panel enter consistent with existing reveal/hover motion; respect `prefers-reduced-motion`
- Focus trap inside the modal while open; restore focus to the triggering card on close
- Visible focus styles using existing accent outline
- Modal labeled appropriately for assistive tech (`role="dialog"`, `aria-modal`, labelled by title)

## Out of scope

- CMS or admin editing for case studies
- Images/screenshots galleries
- Filtering or search on projects
- Changing the home page’s overall visual identity beyond removing testimonials and linking cards

## Success criteria

- Clicking a project card from home opens a modal with case study content without leaving the home scroll context in the soft-nav case
- `/projects/[slug]` is shareable and works on hard load
- AdvocatesIphones detail shows its testimonial; Cohort and Dev Portfolio do not show a testimonials block
- Home page no longer lists testimonials globally
- “Visit live site” is available only on the detail experience
