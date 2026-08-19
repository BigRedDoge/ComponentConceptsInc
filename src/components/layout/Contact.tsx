import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { company } from '../../data/company';

export function Contact() {
  return (
    <section id="contact" className="bg-surface py-14 md:py-20">
      <div className="max-w-[72rem] mx-auto px-6 md:px-8">
        <div className="max-w-[65ch]">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-3">
            Get in touch
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink mb-4">
            Let's talk about your project.
          </h2>
          <p className="text-[1rem] leading-[1.7] text-body mb-8">
            Whether you need a spec sheet, a quote, or a direct conversation about fit for your
            fleet — reach out and we'll get back to you promptly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-brand hover:bg-brand-hover text-white active:scale-[0.98] transition-transform duration-100 self-start"
          >
            <a href={`mailto:${company.email}`}>
              <Mail className="size-4" />
              {company.email}
            </a>
          </Button>

          {company.phone && company.phone !== 'TODO(sean)' && (
            <a
              href={`tel:${company.phone.replace(/\D/g, '')}`}
              className="inline-flex items-center gap-2 text-[0.9375rem] text-body hover:text-ink transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              <Phone className="size-4 shrink-0 text-brand" />
              {company.phone}
            </a>
          )}

          {company.addressPublic && company.address.city !== 'TODO(sean)' && (
            <span className="inline-flex items-center gap-2 text-[0.9375rem] text-body">
              <MapPin className="size-4 shrink-0 text-brand" />
              {company.address.city}, {company.address.state}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
