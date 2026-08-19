import { cn } from '../../lib/utils';

interface Props {
  eyebrow?: string;
  heading?: string;
  /** Toggles --color-surface background instead of white */
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Section({ eyebrow, heading, alt, className, children }: Props) {
  return (
    <section className={cn(alt ? 'bg-surface' : 'bg-white', 'py-14 md:py-20', className)}>
      <div className="max-w-[72rem] mx-auto px-6 md:px-8">
        {(eyebrow || heading) && (
          <div className="mb-10 md:mb-14">
            {eyebrow && (
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink"
              >
                {heading}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
