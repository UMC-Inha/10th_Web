import { useEffect, useRef, useState } from 'react';

function useThrottle<T>(value: T, interval: number = 1000): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  const lastExecuted = useRef(0);
  const latestValue = useRef<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    latestValue.current = value;

    if (timerRef.current) return;

    const elapsed = Date.now() - lastExecuted.current;
    const remainingTime = interval - elapsed;

    if (remainingTime <= 0) {
      setThrottledValue(latestValue.current);
      lastExecuted.current = Date.now();
      return;
    }

    timerRef.current = setTimeout(() => {
      setThrottledValue(latestValue.current);
      lastExecuted.current = Date.now();
      timerRef.current = null;
    }, remainingTime);
  }, [value, interval]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return throttledValue;
}

export default useThrottle;
