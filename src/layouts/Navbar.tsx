import { cn } from '@/lib';

interface NavbarProps {
  className?: string;
}

/**
 * Cash AI — Main Navigation Bar
 *
 * Minimal, premium top navigation.
 * White background, subtle bottom border, breathable spacing.
 */
export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        'sticky top-0 z-40',
        'flex items-center justify-between',
        'h-16 px-6',
        'bg-[var(--color-bg)]/95 backdrop-blur-sm',
        'border-b border-[var(--color-border-light)]',
        className,
      )}
    >
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-2 text-[var(--color-text)] no-underline"
      >
        <span className="text-lg">🧠</span>
        <span className="text-base font-semibold tracking-tight">
          Cash AI
        </span>
      </a>

      {/* Navigation links - populated per layout */}
      <div className="flex items-center gap-4">
        {/* Placeholder for future nav items */}
      </div>
    </nav>
  );
}
