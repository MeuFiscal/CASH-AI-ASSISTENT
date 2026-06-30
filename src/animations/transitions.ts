/**
 * Cash AI — Animation Definitions
 *
 * Reusable animation configurations.
 * Import these in components for consistent motion design.
 */

export const transitions = {
  fast: 'transition-all duration-150 ease-out',
  base: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
} as const;

export const animations = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  scaleIn: 'animate-scale-in',
  shimmer: 'animate-shimmer',
  spin: 'animate-spin',
} as const;

/**
 * Stagger delay calculator for sequential animations.
 * Returns inline style with animation-delay.
 */
export function staggerDelay(index: number, baseMs: number = 100): React.CSSProperties {
  return {
    animationDelay: `${index * baseMs}ms`,
    animationFillMode: 'forwards',
    opacity: 0,
  };
}
