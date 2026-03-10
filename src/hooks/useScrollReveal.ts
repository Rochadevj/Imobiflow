import { useEffect } from "react";

/**
 * Observes all `[data-reveal]` elements inside the given root (or document)
 * and adds the `.revealed` class when they enter the viewport.
 *
 * Supports `data-reveal-delay="<ms>"` for staggered children.
 * Call once per page component — lightweight, no external deps.
 */
export function useScrollReveal(rootRef?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef?.current ?? document;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;

          if (delay) {
            window.setTimeout(() => el.classList.add("revealed"), Number(delay));
          } else {
            el.classList.add("revealed");
          }

          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    for (const el of targets) observer.observe(el);

    return () => observer.disconnect();
  }, [rootRef]);
}
