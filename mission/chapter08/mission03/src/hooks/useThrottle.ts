import { useEffect, useRef, useState } from "react";

function useThrottle<T>(value : T, delay: number = 500): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(0); // 첫 입력 즉시 실행
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const valueRef = useRef<T>(value);

    useEffect(()=> {
        valueRef.current = value;
    }, [value]);

    useEffect(()=> {
    const now = Date.now();
    const remaining = lastExecuted.current + delay - now;

    const execute = () => {
        lastExecuted.current = Date.now();
        setThrottledValue(valueRef.current);
        timerRef.current = null;
    };

    if (remaining <= 0) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      execute();
    } else if (!timerRef.current) {
        timerRef.current = setTimeout(execute, remaining);
    }

    //useEffect 내부로 cleanup 함수 통합함
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