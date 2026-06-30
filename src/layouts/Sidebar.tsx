import { cn } from '@/lib';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Cash AI — Sidebar Navigation
 *
 * For use in /app and /admin layouts (future sprints).
 * Collapsible, same visual identity as Navbar.
 */
export function Sidebar({ className, children }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col',
        'w-64 h-full',
        'bg-[var(--color-bg)]',
        'border-r border-[var(--color-border-light)]',
        'p-4',
        className,
      )}
    >
      {children}
    </aside>
  );
}
