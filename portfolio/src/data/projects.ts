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
    description: "E-commerce store for retail iPhone and Apple devices",
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
    description: "Developer portfolio showcase platform with dynamic routing",
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
