import { useEffect } from 'react';

/**
 * Detects a specific key press.
 * Used by Dialog (ESC to close) and other keyboard interactions.
 */
export function useKeyPress(
  key: string,
  handler: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key) {
        handler();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, handler, enabled]);
}
