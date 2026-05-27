import { useState, useEffect, useRef } from 'react';

export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastExecuted.current);

    if (remaining <= 0) {
      lastExecuted.current = now;
      setThrottledValue(value);
      return;
    }

    const timer = setTimeout(() => {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    }, remaining);

    return () => clearTimeout(timer);
  }, [value, interval]);

  return throttledValue;
}
