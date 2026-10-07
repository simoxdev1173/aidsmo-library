'use client';

import { useEffect, useRef, useState } from 'react';

export function useNearViewport<T extends HTMLElement>(rootMargin = '400px') {
  const ref = useRef<T>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    if (isNear) return;
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setIsNear(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNear(true);
        observer.disconnect();
      }
    }, { rootMargin });

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return { ref, isNear, activate: () => setIsNear(true) };
}
