import type { Product } from '../../types/product';
import { CATEGORY_META } from '../../data/category-meta';
import { IconTile } from './IconTile';
import { SpecTable } from './SpecTable';

interface Props {
  product: Product;
}

function toAnchorId(code: string) {
  return code.toLowerCase().replace(/\s+/g, '-');
}

export function ProductBlock({ product }: Props) {
  const meta = CATEGORY_META[product.category];

  return (
    <article
      id={toAnchorId(product.code)}
      className="scroll-mt-20 flex flex-col md:flex-row gap-8 md:gap-12 py-10 border-b border-line last:border-b-0"
    >
      {/* Icon tile — fixed width on desktop, full-width on mobile */}
      <div className="w-full md:w-[280px] shrink-0">
        <IconTile icon={meta.icon} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category eyebrow */}
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand mb-2">
          {meta.label}
        </p>

        {/* Product name */}
        <h2 className="text-[1.5rem] font-medium tracking-[-0.015em] text-ink leading-snug mb-1">
          {product.name}
        </h2>

        {/* Part number */}
        <p
          className="text-[0.875rem] font-medium text-brand-text mb-4"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}
        >
          {product.code}
        </p>

        {/* Description */}
        <p className="text-[1rem] leading-[1.7] text-body max-w-[65ch] mb-6">
          {product.description}
        </p>

        <SpecTable specs={product.specs} />
      </div>
    </article>
  );
}
