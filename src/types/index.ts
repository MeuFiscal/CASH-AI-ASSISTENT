/**
 * Cash AI — Shared Types
 *
 * Types and interfaces used across multiple features.
 * Feature-specific types belong in their own feature directory.
 */

/** Generic message in a chat conversation */
export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  type?: 'text' | 'form' | 'action'; // extensible for later
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

import type { ElementType } from 'react';

/** Feature card displayed on the Landing page */
export interface FeatureItem {
  id: string;
  icon: ElementType;
  title: string;
}

/** Navigation item for Navbar/Sidebar */
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

/** Common component size variants */
export type Size = 'sm' | 'md' | 'lg';

/** Common component visual variants */
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

/** Badge-specific variants */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
