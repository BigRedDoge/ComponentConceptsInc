import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { company } from '../data/company';
import { Section } from '../components/layout/Section';
import { ProductCard } from '../components/product/ProductCard';
import { Photo } from '../components/media/Photo';
import { useReveal } from '../hooks/use-reveal';
import { Button } from '../components/ui/button';

const CAPABILITIES = [
  {
    heading: 'Transit-grade durability',
    body: 'Components engineered to withstand the vibration, temperature swings, and duty cycles of revenue-service vehicles.',
  },
  {
    heading: 'Custom specification work',
    body: 'Form, fit, and function matched to your fleet. Drawings and wiring documentation included with every custom order.',
  },
  {
    heading: 'Fast replacement supply',
    body: 'Stocking programs available for fleets that need guaranteed lead times on safety-critical parts.',
  },
  {
    heading: 'OEM and retrofit fit',
    body: 'Parts supplied as original equipment and as drop-in replacements for aging fleet hardware.',
  },
];

export function Home() {
  const heroRef = useReveal<HTMLDivElement>();
  const teaserRef = useReveal<HTMLDivElement>();
  const capabilitiesRef = useReveal<HTMLDivElement>();

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
                {company.legalName} manufactures door chimes, fire alarm switches, and interior
                lighting for transit fleets.
              </p>
              <div
                className="reveal flex flex-wrap gap-3"
                style={{ '--stagger-index': 3 } as React.CSSProperties}
              >
                <Button asChild size="lg" className="bg-brand hover:bg-brand-hover text-white active:scale-[0.98] transition-transform duration-100">
                  <Link to="/products">
                    View all products
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-line text-ink hover:bg-surface active:scale-[0.98] transition-transform duration-100">
                  <a href="#contact">Get in touch</a>
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

      {/* ── Product teaser ─────────────────────────────────────── */}
      <Section eyebrow="Products" heading="What we make" alt>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          ref={teaserRef}
        >
          {products.slice(0, 3).map((product, i) => (
            <div
              key={product.code}
              className="reveal"
              style={{ '--stagger-index': i } as React.CSSProperties}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-brand-text hover:text-brand transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >
          View all {products.length} products
          <ArrowRight className="size-4" />
        </Link>
      </Section>

      {/* ── Capabilities ───────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20" ref={capabilitiesRef}>
        {/* Full-bleed photo band */}
        <div className="max-h-[380px] overflow-hidden bg-surface mb-14 md:mb-20">
          {/* TODO(sean): replace src with the capabilities photo once sourced */}
          <Photo
            src="/images/capabilities.webp"
            alt="Electronics assembly bench with wiring harnesses and component boards"
            width={1600}
            height={480}
            className="w-full max-h-[380px] object-cover"
          />
        </div>

        <div className="max-w-[72rem] mx-auto px-6 md:px-8">
          <p className="reveal text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-3">
            Capabilities
          </p>
          <h2 className="reveal text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink mb-10 md:mb-14"
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            Built for the demands of revenue service.
          </h2>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.heading}
                className="reveal"
                style={{ '--stagger-index': i + 2 } as React.CSSProperties}
              >
                <h3 className="text-[1rem] font-medium text-ink mb-2">{cap.heading}</h3>
                <p className="text-[1rem] leading-[1.7] text-body">{cap.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
