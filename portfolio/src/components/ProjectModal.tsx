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

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        router.back();
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
  }, [router]);

  function close() {
    router.back();
  }

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
