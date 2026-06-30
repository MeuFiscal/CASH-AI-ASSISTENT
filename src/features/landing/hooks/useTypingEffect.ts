/**
 * Cash AI — Landing: useTypingEffect
 *
 * Reveals an ordered list of messages one by one with a per-character
 * typing animation. Designed for the landing page intro sequence.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseTypingEffectOptions {
  /** Interval (ms) between revealing each character. */
  typingSpeed?: number;
  /** Whether to start typing automatically. If false, waits for start=true. */
  start?: boolean;
  /** If true, skips the typing animation and displays all messages instantly. */
  skip?: boolean;
}

interface UseTypingEffectReturn {
  /** Messages that have been fully typed and are now static. */
  displayedMessages: string[];
  /** The message currently being typed (partial string), or `null` when idle. */
  currentTyping: string | null;
  /** `true` once every message has been fully displayed. */
  isComplete: boolean;
}

export function useTypingEffect(
  messages: string[],
  options?: UseTypingEffectOptions,
): UseTypingEffectReturn {
  const { typingSpeed = 30, start = true, skip = false } = options ?? {};

  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Use refs for mutable counters so the effect callback stays stable.
  const messageIndex = useRef(0);
  const charIndex = useRef(0);
  const phase = useRef<'delay' | 'typing'>('delay');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const tick = useCallback(() => {
    if (!start) return;

    const idx = messageIndex.current;

    // All messages revealed.
    if (idx >= messages.length) {
      setCurrentTyping(null);
      setIsComplete(true);
      return;
    }

    const msg = messages[idx];

    if (phase.current === 'delay') {
      // Brief pause before the next message starts typing.
      phase.current = 'typing';
      charIndex.current = 0;
      setCurrentTyping('');
      
      // Randomize thinking time between 600ms and 1400ms for a human feel,
      // except for the very first message which starts quicker.
      const thinkingTime = idx === 0 ? 300 : Math.floor(Math.random() * (1400 - 600 + 1)) + 600;
      timerRef.current = setTimeout(tick, thinkingTime);
      return;
    }

    // Typing phase — reveal one more character.
    charIndex.current += 1;
    const partial = msg.slice(0, charIndex.current);
    setCurrentTyping(partial);

    if (charIndex.current >= msg.length) {
      // Message complete — promote to displayed.
      setDisplayedMessages((prev) => [...prev, msg]);
      setCurrentTyping(null);
      messageIndex.current += 1;
      phase.current = 'delay';
      // Short delay immediately after typing finishes before the next 'thinking' phase starts
      timerRef.current = setTimeout(tick, 200);
    } else {
      timerRef.current = setTimeout(tick, typingSpeed);
    }
  }, [messages, typingSpeed, start]);

  useEffect(() => {
    if (skip) {
      setDisplayedMessages(messages);
      setCurrentTyping(null);
      setIsComplete(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (start) {
      // Kick off the sequence.
      timerRef.current = setTimeout(tick, 200);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tick, start, skip, messages]);

  return { displayedMessages, currentTyping, isComplete };
}
