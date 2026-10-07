import { ArrowRight } from 'lucide-react';
import { offerings } from '../data/offerings';
import { company } from '../data/company';
import { Section } from '../components/layout/Section';
import { Photo } from '../components/media/Photo';
import { useReveal } from '../hooks/use-reveal';
import { Button } from '../components/ui/button';

// TODO(sean): confirm this step matches how the process actually works
const PROCESS = [
  {
    heading: 'You send the requirement',
    body: 'A drawing, a sample part, or a description of what you need.',
  },
  {
    heading: 'We quote and prototype',
    body: "We'll examine your requirements, develop a quote, and prototype if required.",
  },
  {
    heading: 'We build to order',
    body: 'Manufacture and stock the components required to satisfy your needs.',
  },
];

export function Home() {
  const heroRef = useReveal<HTMLDivElement>();
  const offeringsRef = useReveal<HTMLDivElement>();
  const customRef = useReveal<HTMLDivElement>();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="bg-white pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="max-w-[72rem] mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center" ref={heroRef}>
            {/* Copy */}
            <div>
              <p className="reveal text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-4">
                Electrical components
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
                Component Concepts builds custom electrical components in the heavy transit,
                life safety, and other industrial markets.
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

      {/* ── Custom manufacturing ──────────────────────────────────── */}
      <section className="bg-white pt-14 pb-14 md:pt-20 md:pb-20" ref={customRef}>
        <div className="max-w-[72rem] mx-auto px-6 md:px-8">
          <p className="reveal text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-3">
            Custom manufacturing
          </p>
          <h2
            className="reveal text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink mb-6"
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            Built to order.
          </h2>
          <p
            className="reveal text-[1rem] leading-[1.7] text-body max-w-[60ch] mb-10 md:mb-14"
            style={{ '--stagger-index': 2 } as React.CSSProperties}
          >
            {/* TODO(sean): confirm this is how the process actually works */}
            Most of what we build starts with a customer's requirement, not a catalog. Send
            us a drawing, a sample part, or a description of what you need.
          </p>

          <div className="grid sm:grid-cols-3 gap-x-8 gap-y-8">
            {PROCESS.map((step, i) => (
              <div
                key={step.heading}
                className="reveal"
                style={{ '--stagger-index': i + 3 } as React.CSSProperties}
              >
                <p className="text-[0.75rem] font-medium text-brand mb-2">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="text-[1rem] font-medium text-ink mb-2">{step.heading}</h3>
                <p className="text-[1rem] leading-[1.7] text-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo break */}
      <div className="max-h-[380px] overflow-hidden bg-surface">
        <Photo
          src="/images/capabilities.webp"
          alt="Electronics assembly bench with wiring harnesses and component boards"
          width={1600}
          height={480}
          className="w-full max-h-[380px] object-cover"
        />
      </div>

      {/* ── What we make ───────────────────────────────────────── */}
      <Section eyebrow="Our work" heading="Examples of what we manufacture" alt>
        <p className="text-[1rem] leading-[1.7] text-body max-w-[60ch] mb-10">
          A sample of the components we've built and supplied. If you need something not
          listed here, ask us.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" ref={offeringsRef}>
          {offerings.map(({ name, icon: Icon }, i) => (
            <div
              key={name}
              className="reveal bg-white rounded-[10px] p-5 md:p-6"
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <Icon className="size-6 text-brand mb-4" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-[1.0625rem] font-medium text-ink">{name}</h3>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
