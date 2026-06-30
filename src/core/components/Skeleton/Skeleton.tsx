import { cn } from '@/lib';

/* ─── Types ─── */

interface SkeletonProps {
  /** Shape variant. */
  variant?: 'text' | 'circle' | 'rect';
  /** Custom width (CSS value). */
  width?: string;
  /** Custom height (CSS value). */
  height?: string;
  className?: string;
}

/* ─── Component ─── */

function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  const variantClasses: Record<NonNullable<SkeletonProps['variant']>, string> = {
    text: 'w-full h-4 rounded-[var(--radius-sm)]',
    circle: 'rounded-full',
    rect: 'rounded-[var(--radius-lg)]',
  };

  // Circle defaults to equal dimensions
  const style: React.CSSProperties = {
    width: width ?? (variant === 'circle' ? '2.5rem' : undefined),
    height: height ?? (variant === 'circle' ? '2.5rem' : variant === 'rect' ? '6rem' : undefined),
  };

  return (
    <div
      role="status"
      aria-label="Loading…"
      className={cn(
        'animate-shimmer',
        variantClasses[variant],
        className,
      )}
      style={style}
    />
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export type { SkeletonProps };
