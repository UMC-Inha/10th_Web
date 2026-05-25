import { useEffect, useRef } from 'react';

type UseIntersectionObserverOptions = {
  enabled?: boolean;
  threshold?: number;
  onIntersect: () => void;
};

function useIntersectionObserver({
  enabled = true,
  threshold = 0.1,
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

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersectRef.current();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, threshold]);

  return targetRef;
}

export default useIntersectionObserver;
