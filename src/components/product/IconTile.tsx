import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  icon: LucideIcon;
  className?: string;
}

export function IconTile({ icon: Icon, className }: Props) {
  return (
    <div
      className={cn(
        'w-full bg-surface rounded-[10px] flex items-center justify-center',
        'aspect-[16/10]',
        className,
      )}
      aria-hidden="true"
    >
      <Icon className="text-ink/40" style={{ width: '40%', height: '40%' }} strokeWidth={1.5} />
    </div>
  );
}
