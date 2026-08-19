import { Link } from 'react-router';
import type { Product } from '../../types/product';
import { CATEGORY_META } from '../../data/category-meta';
import { cn } from '../../lib/utils';
import { IconTile } from './IconTile';

interface Props {
  product: Product;
}

function toAnchorId(code: string) {
  return code.toLowerCase().replace(/\s+/g, '-');
}

export function ProductCard({ product }: Props) {
  const meta = CATEGORY_META[product.category];

  return (
    <Link
      to={`/products#${toAnchorId(product.code)}`}
      className={cn(
        'group flex flex-col h-full rounded-[10px] border border-line bg-white overflow-hidden',
        'transition-[transform,border-color] duration-[180ms] ease-out',
        'hover:-translate-y-0.5 hover:border-brand/35',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
      )}
    >
      <IconTile icon={meta.icon} />

      <div className="flex flex-col gap-1.5 p-5 flex-1">
        {/* Category eyebrow */}
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-brand">
          {meta.label}
        </p>

        {/* Product name */}
        <h3 className="text-[1.125rem] font-medium text-ink leading-snug">
          {product.name}
        </h3>

        {/* Part number */}
        <p
          className="text-[0.875rem] font-medium text-brand-text"
          style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}
        >
          {product.code}
        </p>

        {/* Summary */}
        <p className="mt-1 text-[1rem] leading-[1.7] text-body max-w-[65ch]">
          {product.summary}
        </p>
      </div>
    </Link>
  );
}
