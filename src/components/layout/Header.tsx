import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { company } from '../../data/company';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-md focus-visible:bg-brand focus-visible:text-white focus-visible:text-sm focus-visible:font-medium"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_var(--color-line)]'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-[72rem] mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-8">
          {/* Wordmark */}
          <Link
            to="/"
            className="font-medium text-[0.9375rem] tracking-[-0.01em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            {company.legalName}
          </Link>

          {/* CTA */}
          <div>
            <Button asChild size="sm" className="bg-brand hover:bg-brand-hover text-white active:scale-[0.98] transition-transform duration-100">
              <a href="#contact">Contact</a>
            </Button>
          </div>

        </div>
      </header>
    </>
  );
}
