import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  useState,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { cn } from '@/lib';
import { useClickOutside } from '@/hooks';

/* ─── Context ─── */

interface DropdownContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error('Dropdown compound components must be used within <Dropdown>.');
  }
  return ctx;
}

/* ─── Types ─── */

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu alignment relative to trigger. */
  align?: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Applies danger (red) styling. */
  danger?: boolean;
  children: ReactNode;
  className?: string;
}

/* ─── Sub-components ─── */

function DropdownTrigger({ children, className, ...rest }: DropdownTriggerProps) {
  const { toggle } = useDropdownContext();

  return (
    <button
      type="button"
      aria-haspopup="true"
      onClick={toggle}
      className={cn('inline-flex items-center', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
DropdownTrigger.displayName = 'Dropdown.Trigger';

function DropdownMenu({ align = 'left', children, className, ...rest }: DropdownMenuProps) {
  const { open } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        'absolute z-40 mt-1.5',
        'min-w-[12rem] py-1',
        'bg-[var(--color-bg)] border border-[var(--color-border)]',
        'rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
        'animate-fade-in-up',
        align === 'right' ? 'right-0' : 'left-0',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
DropdownMenu.displayName = 'Dropdown.Menu';

function DropdownItem({ danger = false, children, className, ...rest }: DropdownItemProps) {
  const { close } = useDropdownContext();

  return (
    <button
      role="menuitem"
      type="button"
      onClick={(e) => {
        rest.onClick?.(e);
        close();
      }}
      className={cn(
        'w-full text-left px-3 py-2 text-sm',
        'transition-colors duration-150 ease-out',
        'cursor-pointer',
        danger
          ? 'text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]'
          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
        'focus-visible:outline-none focus-visible:bg-[var(--color-surface-hover)]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
DropdownItem.displayName = 'Dropdown.Item';

/* ─── Root Component ─── */

function DropdownRoot({ children, className }: DropdownProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  const wrapperRef = useClickOutside<HTMLDivElement>(close, open);

  return (
    <DropdownContext.Provider value={{ open, toggle, close }}>
      <div ref={wrapperRef} className={cn('relative inline-block', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}
DropdownRoot.displayName = 'Dropdown';

/* ─── Compound Export ─── */

const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
});

export { Dropdown };
export type { DropdownProps, DropdownTriggerProps, DropdownMenuProps, DropdownItemProps };
