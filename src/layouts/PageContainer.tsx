import { cn } from '@/lib';

interface PageContainerProps {
  className?: string;
  children: React.ReactNode;
  /** Maximum width variant */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

/**
 * Cash AI — Page Container
 *
 * Consistent wrapper with responsive padding and max-width.
 * Ensures all pages breathe with proper spacing.
 */
export function PageContainer({
  className,
  children,
  maxWidth = 'lg',
}: PageContainerProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full',
        'px-4 sm:px-6 lg:px-8',
        'py-8 sm:py-12',
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </main>
  );
}
