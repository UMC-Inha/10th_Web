import { useEffect, useRef, useState } from 'react';

function useThrottle<T>(value: T, interval: number = 1000): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const elapsed = Date.now() - lastExecuted.current;

    if (elapsed >= interval) {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setThrottledValue(value);
      lastExecuted.current = Date.now();
      timerRef.current = null;
    }, interval - elapsed);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;