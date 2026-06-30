import {
  type ReactNode,
  type HTMLAttributes,
  useEffect,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib';
import { useClickOutside, useKeyPress } from '@/hooks';

/* ─── Types ─── */

interface DialogProps {
  /** Controls visibility. */
  open: boolean;
  /** Called when the dialog requests closing (ESC, backdrop click, etc.). */
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

interface DialogSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/* ─── Sub-components ─── */

function DialogHeader({ children, className, ...rest }: DialogSectionProps) {
  return (
    <div
      className={cn(
        'px-6 pt-6 pb-2',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
DialogHeader.displayName = 'Dialog.Header';

function DialogBody({ children, className, ...rest }: DialogSectionProps) {
  return (
    <div className={cn('px-6 py-2', className)} {...rest}>
      {children}
    </div>
  );
}
DialogBody.displayName = 'Dialog.Body';

function DialogFooter({ children, className, ...rest }: DialogSectionProps) {
  return (
    <div
      className={cn(
        'px-6 pt-2 pb-6',
        'flex items-center justify-end gap-3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
DialogFooter.displayName = 'Dialog.Footer';

/* ─── Root Component ─── */

function DialogRoot({ open, onClose, children, className }: DialogProps) {
  // Stable close handler for hooks
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on ESC
  useKeyPress('Escape', handleClose, open);

  // Close on click outside
  const panelRef = useClickOutside<HTMLDivElement>(handleClose, open);

  // Prevent body scroll when open
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        // Backdrop
        'bg-black/30 backdrop-blur-sm',
        'animate-fade-in',
      )}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative w-full max-w-[28rem] mx-4',
          'bg-[var(--color-bg)] rounded-[var(--radius-xl)]',
          'shadow-[var(--shadow-xl)]',
          'border border-[var(--color-border)]',
          'animate-scale-in',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
DialogRoot.displayName = 'Dialog';

/* ─── Compound Export ─── */

const Dialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
});

export { Dialog };
export type { DialogProps, DialogSectionProps };
