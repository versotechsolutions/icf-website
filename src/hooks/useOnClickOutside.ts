import { useEffect, type RefObject } from 'react';

export function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const listener = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handler();
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, handler, active]);
}
