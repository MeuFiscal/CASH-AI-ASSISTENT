import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib';

/* ─── Types ─── */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size preset. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  /** Disables the button. */
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/* ─── Variant Styles ─── */

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: [
    'bg-[var(--color-primary)] text-[var(--color-text-inverse)]',
    'hover:bg-[var(--color-primary-hover)]',
    'active:bg-[var(--color-primary-hover)]',
    'shadow-[var(--shadow-sm)]',
  ].join(' '),
  secondary: [
    'bg-transparent text-[var(--color-text)]',
    'border border-[var(--color-border)]',
    'hover:bg-[var(--color-surface)] hover:border-[var(--color-text-muted)]',
    'active:bg-[var(--color-surface-hover)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--color-text-secondary)]',
    'hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
    'active:bg-[var(--color-surface-hover)]',
  ].join(' '),
  danger: [
    'bg-[var(--color-danger)] text-[var(--color-text-inverse)]',
    'hover:bg-[#B91C1C]',
    'active:bg-[#991B1B]',
    'shadow-[var(--shadow-sm)]',
  ].join(' '),
};

/* ─── Size Styles ─── */

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-[var(--radius-md)]',
  md: 'text-sm px-4 py-2 rounded-[var(--radius-md)]',
  lg: 'text-base px-6 py-2.5 rounded-[var(--radius-lg)]',
};

/* ─── Spinner ─── */

function Spinner({ size }: { size: NonNullable<ButtonProps['size']> }) {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

  return (
    <span
      className={cn(
        sizeMap[size],
        'inline-block rounded-full',
        'border-2 border-current border-t-transparent',
        'animate-spin',
      )}
      aria-hidden="true"
    />
  );
}

/* ─── Component ─── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2',
          'font-medium whitespace-nowrap select-none',
          'transition-all duration-200 ease-out',
          'cursor-pointer',
          // Focus ring
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
          // Disabled
          isDisabled && 'opacity-50 pointer-events-none',
          // Variant + Size
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...rest}
      >
        {loading ? (
          <>
            <Spinner size={size} />
            <span className="sr-only">Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
