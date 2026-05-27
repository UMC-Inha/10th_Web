import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value : T, delay: number = 500): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(Date.now());
    const timerRef = useRef<number | null>(null);

    useEffect(()=> {
    const now = Date.now();
    const remaining = lastExecuted.current + delay - now;

    if (remaining <= 0) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            lastExecuted.current = Date.now();
            setThrottledValue(value);
            timerRef.current = null;
        }, remaining);
        }

    return () => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    }, [value, delay]);

    return throttledValue;
}

export default useThrottle;