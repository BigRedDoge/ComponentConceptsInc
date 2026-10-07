import { ArrowRight } from 'lucide-react';
import { offerings } from '../data/offerings';
import { company } from '../data/company';
import { Section } from '../components/layout/Section';
import { Photo } from '../components/media/Photo';
import { useReveal } from '../hooks/use-reveal';
import { Button } from '../components/ui/button';

export function Home() {
  const heroRef = useReveal<HTMLDivElement>();
  const offeringsRef = useReveal<HTMLDivElement>();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-white pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="max-w-[72rem] mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center" ref={heroRef}>
            {/* Copy */}
            <div>
              <p className="reveal text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-4">
                Transit vehicle components
              </p>
              <h1
                className="reveal text-[clamp(2.25rem,5vw,3.5rem)] font-medium tracking-[-0.025em] leading-[1.1] text-ink mb-6"
                style={{ '--stagger-index': 1 } as React.CSSProperties}
              >
                {company.tagline !== 'TODO(sean): one-line company tagline'
                  ? company.tagline
                  : 'Precision components for bus and rail.'}
              </h1>
              <p
                className="reveal text-[1rem] leading-[1.7] text-body max-w-[55ch] mb-8"
                style={{ '--stagger-index': 2 } as React.CSSProperties}
              >
                {company.legalName} builds door chimes, fire alarm switches, and lighting for bus
                and rail fleets, and supplies components to transit operators.
              </p>
              <div
                className="reveal flex flex-wrap gap-3"
                style={{ '--stagger-index': 3 } as React.CSSProperties}
              >
                <Button asChild size="lg" className="bg-brand hover:bg-brand-hover text-white active:scale-[0.98] transition-transform duration-100">
                  <a href="#contact">
                    Get in touch
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Hero photo */}
            <div
              className="reveal hidden md:block aspect-[4/3] overflow-hidden rounded-[10px] bg-surface"
              style={{ '--stagger-index': 1 } as React.CSSProperties}
            >
              {/* TODO(sean): replace src with the hero photo once sourced */}
              <Photo
                src="/images/hero.webp"
                alt="Empty bus interior showing rows of seats and the forward doorway"
                width={800}
                height={600}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── What we make ───────────────────────────────────────── */}
      <Section eyebrow="Products" heading="What we make" alt>
        <p className="text-[1rem] leading-[1.7] text-body max-w-[60ch] mb-10">
          We design and build electrical components for transit vehicles, and supply parts for
          fleets that need them.
        </p>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10" ref={offeringsRef}>
          {offerings.map(({ name, description, icon: Icon }, i) => (
            <div
              key={name}
              className="reveal flex gap-4"
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <div
                className="shrink-0 size-11 rounded-[10px] bg-white flex items-center justify-center"
                aria-hidden="true"
              >
                <Icon className="size-5 text-brand" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[1.125rem] font-medium text-ink mb-2">{name}</h3>
                <p className="text-[1rem] leading-[1.7] text-body">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
