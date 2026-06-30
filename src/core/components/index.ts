/**
 * Cash AI — Design System Components
 *
 * Central barrel export for all core UI components.
 * Usage: import { Button, Card, Dialog } from '@/core/components';
 */

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Card } from './Card';
export type { CardProps, CardSectionProps } from './Card';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Dialog } from './Dialog';
export type { DialogProps, DialogSectionProps } from './Dialog';

export { Dropdown } from './Dropdown';
export type {
  DropdownProps,
  DropdownTriggerProps,
  DropdownMenuProps,
  DropdownItemProps,
} from './Dropdown';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

export { Loading } from './Loading';
export type { LoadingProps } from './Loading';

export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
