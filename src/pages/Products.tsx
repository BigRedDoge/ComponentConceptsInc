import { products } from '../data/products';
import { company } from '../data/company';
import { ProductBlock } from '../components/product/ProductBlock';
import { Photo } from '../components/media/Photo';
import { useReveal } from '../hooks/use-reveal';

export function Products() {
  const headingRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLDivElement>();

  return (
    <div className="pt-16">
      {/* ── Page heading + banner ──────────────────────────────── */}
      <section className="bg-white pt-14 md:pt-20 pb-0">
        <div className="max-w-[72rem] mx-auto px-6 md:px-8" ref={headingRef}>
          <p className="reveal text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-3">
            Products
          </p>
          <h1
            className="reveal text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium tracking-[-0.02em] text-ink mb-10 md:mb-14"
            style={{ '--stagger-index': 1 } as React.CSSProperties}
          >
            {company.legalName} product catalog.
          </h1>
        </div>

        {/* Banner photo — outside the padded container so it runs edge-to-edge */}
        <div className="max-w-[72rem] mx-auto px-6 md:px-8 mb-0">
          <div className="aspect-[16/5] overflow-hidden rounded-[10px] bg-surface">
            {/* TODO(sean): replace src with the products banner photo once sourced */}
            <Photo
              src="/images/products-banner.webp"
              alt="Close-up of a green circuit board with surface-mounted components"
              width={1440}
              height={450}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Product list ───────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-14">
        <div className="max-w-[72rem] mx-auto px-6 md:px-8" ref={listRef}>
          <div className="reveal">
            {products.map((product) => (
              <ProductBlock key={product.code} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
