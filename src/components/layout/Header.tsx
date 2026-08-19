import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from '../ui/sheet';
import { company } from '../../data/company';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products', end: false },
];

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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-md text-[0.875rem] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                    isActive
                      ? 'text-brand-text'
                      : 'text-body hover:text-ink',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button asChild size="sm" className="bg-brand hover:bg-brand-hover text-white active:scale-[0.98] transition-transform duration-100">
              <a href="#contact">Contact</a>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="text-ink hover:bg-surface"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-white border-line">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-1 mt-8" aria-label="Mobile navigation">
                  {navLinks.map(({ to, label, end }) => (
                    <SheetClose asChild key={to}>
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          cn(
                            'px-4 py-2.5 rounded-md text-[0.9375rem] font-medium transition-colors duration-150',
                            isActive
                              ? 'text-brand-text bg-brand-tint'
                              : 'text-body hover:text-ink hover:bg-surface',
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    </SheetClose>
                  ))}
                  <div className="mt-4 px-4">
                    <SheetClose asChild>
                      <Button asChild className="w-full bg-brand hover:bg-brand-hover text-white">
                        <a href="#contact">Contact</a>
                      </Button>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
