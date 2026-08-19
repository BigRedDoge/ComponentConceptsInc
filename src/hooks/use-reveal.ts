import { useEffect, useRef } from 'react';

/**
 * Attaches IntersectionObserver to the returned ref. When the element enters
 * the viewport (threshold 0.15), the 'reveal' class transitions to 'visible'.
 * Unobserves after firing so the animation only plays once.
 *
 * Children can opt into staggered animation by setting a CSS custom property:
 *   style={{ '--stagger-index': i } as React.CSSProperties}
 *
 * Respects prefers-reduced-motion — the CSS handles that entirely.
 */
export function useReveal<T extends Element = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.querySelectorAll<HTMLElement>('.reveal').forEach((child) => {
        child.classList.add('visible');
      });
      // Also handle the container itself if it has .reveal
      if (el.classList.contains('reveal')) {
        el.classList.add('visible');
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll<HTMLElement>('.reveal').forEach((child) => {
            child.classList.add('visible');
          });
          if (entry.target.classList.contains('reveal')) {
            entry.target.classList.add('visible');
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
