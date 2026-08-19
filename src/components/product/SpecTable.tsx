import type { Spec } from '../../types/product';

interface Props {
  specs: Spec[];
}

export function SpecTable({ specs }: Props) {
  return (
    <dl className="flex flex-col gap-1.5">
      {specs.map((spec, i) => (
        <div key={`${spec.label}-${i}`} className="flex items-end gap-1 text-[0.8125rem]">
          <dt className="shrink-0 text-body">
            {spec.label}
          </dt>
          <span
            className="flex-1 border-b border-dashed border-body/30 relative bottom-0.5"
            aria-hidden="true"
          />
          <dd
            className="shrink-0 font-medium text-ink"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

