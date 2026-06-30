import { type ReactNode } from 'react';
import { cn } from '@/lib';

/* ─── Types ─── */

interface BadgeProps {
  /** Color variant. */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Size preset. */
  size?: 'sm' | 'md';
  children: ReactNode;
  className?: string;
}

/* ─── Variant Styles ─── */

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
  primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
};

/* ─── Size Styles ─── */

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-[11px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

/* ─── Component ─── */

function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        'rounded-[var(--radius-full)] whitespace-nowrap',
        'leading-tight select-none',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
