import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib';

/* ─── Types ─── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card appearance. */
  variant?: 'default' | 'interactive';
  children: ReactNode;
  className?: string;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/* ─── Sub-components ─── */

/**
 * CardHeader
 * Top section of the card, typically for titles and actions.
 */
function CardHeader({ children, className, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-5 py-4',
        'border-b border-[var(--color-border-light)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
CardHeader.displayName = 'Card.Header';

/**
 * CardBody
 * Main content area of the card with default padding.
 */
function CardBody({ children, className, ...rest }: CardSectionProps) {
  return (
    <div className={cn('px-5 py-4', className)} {...rest}>
      {children}
    </div>
  );
}
CardBody.displayName = 'Card.Body';

/**
 * CardFooter
 * Bottom section of the card, typically for secondary actions.
 */
function CardFooter({ children, className, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-5 py-4',
        'border-t border-[var(--color-border-light)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
CardFooter.displayName = 'Card.Footer';

/* ─── Root Component ─── */

/**
 * CardRoot
 * Base container for the Card component.
 */
function CardRoot({ variant = 'default', children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        // Base - Premium look
        'bg-[var(--color-surface)] border border-[var(--color-border)]',
        'rounded-[var(--radius-2xl)] overflow-hidden',
        'shadow-[var(--shadow-sm)]',
        'transition-all duration-200 ease-out',
        // Interactive
        variant === 'interactive' && 'cursor-pointer',
        variant === 'interactive' && 'hover:shadow-[var(--shadow-md)]',
        variant === 'interactive' && 'hover:border-[var(--color-border)]',
        variant === 'interactive' && 'hover:-translate-y-0.5',
        variant === 'interactive' && 'active:scale-[0.995] active:translate-y-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
CardRoot.displayName = 'Card';

/* ─── Compound Export ─── */

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export { Card };
export type { CardProps, CardSectionProps };
