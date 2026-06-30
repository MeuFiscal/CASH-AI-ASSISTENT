import { type ReactNode } from 'react';
import { cn } from '@/lib';

/* ─── Types ─── */

interface EmptyStateProps {
  /** Decorative icon displayed above the title. */
  icon?: ReactNode;
  /** Primary message. */
  title: string;
  /** Supporting description. */
  description?: string;
  /** Action slot — typically a Button CTA. */
  action?: ReactNode;
  className?: string;
}

/* ─── Component ─── */

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'text-center px-6 py-16',
        className,
      )}
    >
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            'mb-4 text-[var(--color-text-muted)]',
            '[&>svg]:h-12 [&>svg]:w-12',
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] max-w-sm">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { EmptyStateProps };
