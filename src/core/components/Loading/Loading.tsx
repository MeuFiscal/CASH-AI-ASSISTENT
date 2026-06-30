import { cn } from '@/lib';

/* ─── Types ─── */

interface LoadingProps {
  /** Display mode. */
  variant?: 'inline' | 'fullscreen' | 'overlay';
  /** Spinner size. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/* ─── Size Map ─── */

const spinnerSizes: Record<NonNullable<LoadingProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/* ─── Spinner ─── */

function Spinner({ size = 'md' }: { size?: LoadingProps['size'] }) {
  return (
    <div
      className={cn(
        spinnerSizes[size],
        'rounded-full animate-spin',
        'border-[var(--color-primary)] border-t-transparent',
      )}
      aria-hidden="true"
    />
  );
}

/* ─── Component ─── */

function Loading({ variant = 'inline', size = 'md', className }: LoadingProps) {
  const label = 'Loading…';

  if (variant === 'fullscreen') {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn(
          'fixed inset-0 z-50',
          'flex items-center justify-center',
          'bg-[var(--color-bg)]/80',
          className,
        )}
      >
        <Spinner size={size} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn(
          'absolute inset-0 z-10',
          'flex items-center justify-center',
          'bg-[var(--color-bg)]/60 rounded-[inherit]',
          className,
        )}
      >
        <Spinner size={size} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  // Inline
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
    >
      <Spinner size={size} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

Loading.displayName = 'Loading';

export { Loading };
export type { LoadingProps };
