import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib';

/* ─── Types ─── */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label displayed above the input. */
  label?: string;
  /** Error message — also applies error styling. */
  error?: string;
  /** Subtle helper text below the input. */
  helperText?: string;
  /** Icon rendered inside the input on the left. */
  leftIcon?: ReactNode;
  /** Icon rendered inside the input on the right. */
  rightIcon?: ReactNode;
  className?: string;
}

/* ─── Component ─── */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;
    const describedBy = errorId ?? helperId ?? undefined;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-[var(--color-text-muted)] pointer-events-none',
                '[&>svg]:h-4 [&>svg]:w-4',
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              // Base
              'w-full rounded-[var(--radius-md)] bg-[var(--color-bg)]',
              'border text-[var(--color-text)] text-sm',
              'px-3 py-2',
              'placeholder:text-[var(--color-text-muted)]',
              'transition-all duration-200 ease-out',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Border states
              hasError
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/25'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/25',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface)]',
              // Icon padding
              Boolean(leftIcon) && 'pl-9',
              Boolean(rightIcon) && 'pr-9',
            )}
            {...rest}
          />

          {/* Right icon */}
          {rightIcon && (
            <span
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'text-[var(--color-text-muted)] pointer-events-none',
                '[&>svg]:h-4 [&>svg]:w-4',
              )}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={errorId} className="text-xs text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}

        {/* Helper text (hidden when error is shown) */}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
