import { useEffect, useRef, type RefObject } from 'react';

/**
 * Detects clicks outside a referenced element.
 * Used by Dialog, Dropdown, and other overlay components.
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled: boolean = true,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // Use mousedown for faster response than click
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [handler, enabled]);

  return ref;
}
