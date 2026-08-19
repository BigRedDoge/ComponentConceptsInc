interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** When true, loads eagerly (above-the-fold hero). Default is lazy. */
  priority?: boolean;
  className?: string;
}

export function Photo({ src, alt, width, height, priority, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={className ?? 'w-full h-full object-cover rounded-[10px]'}
    />
  );
}
