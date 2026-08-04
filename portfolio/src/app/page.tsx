"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";

export default function Home() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
          <h1 className="text-lg font-semibold display-heading">
            SinoCodes
          </h1>
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#about" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            About
          </a>
          <a href="#projects" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Projects
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24">
        <section className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div
            className="relative w-56 h-56 rounded-full overflow-hidden animate-avatar-float"
            data-reveal-index={0}
          >
            <div className="absolute inset-0 animate-gradient-border rounded-full pointer-events-none"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-transparent">
              <Image
                src="/Pfp.png"
                alt="Sinovuyo Ngqazolo"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="text-center md:text-left" data-reveal-index={1}>
            <h2 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 display-heading">
              Hello, I&apos;m Sinovuyo
            </h2>
            <h3 className="text-2xl font-semibold text-[var(--accent)] mb-4 display-subheading">
              Full-Stack Developer
            </h3>
            <p className="text-lg text-[var(--text-secondary)] max-w-md mb-6">
              Building modern native apps, web applications and e-commerce solutions that scale. Specializing in Next.js, TypeScript, Supabase, Expo React Native and clean architecture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#projects"
                className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                View Projects
              </a>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-24" data-reveal-index={2}>
          <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-12 display-heading">
            Projects
          </h3>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="border-t border-[var(--border-subtle)] pt-8">
          <p className="text-[var(--text-secondary)] mb-4">
            &copy; {new Date().getFullYear()} SinoCodes. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
