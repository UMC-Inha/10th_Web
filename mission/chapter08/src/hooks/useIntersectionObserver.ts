import { useEffect, useRef } from 'react';
import { APP_SCROLL_ROOT_ID } from '../constants/layout';

type UseIntersectionObserverOptions = {
  enabled?: boolean;
  threshold?: number;
  root?: Element | null;
  onIntersect: () => void;
};

function useIntersectionObserver({
  enabled = true,
  threshold = 0.1,
  root,
  onIntersect,
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    const scrollRoot = root ?? document.getElementById(APP_SCROLL_ROOT_ID);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersectRef.current();
        }
      },
      { threshold, root: scrollRoot },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, threshold, root]);

  return targetRef;
}

export default useIntersectionObserver;
